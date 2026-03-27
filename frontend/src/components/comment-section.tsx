"use client";

import { FormEvent, useEffect, useState } from "react";
import { MdSend, MdComment, MdPerson, MdAccessTime } from "react-icons/md";
import { fetchCategoryComments, type CommentRecord } from "@/lib/api";

type CommentSectionProps = {
  categorySlug: string;
};

export function CommentSection({ categorySlug }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentRecord[]>([]);
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategoryComments(categorySlug)
      .then((records) => setComments(records))
      .catch(() => setComments([]));
  }, [categorySlug]);

  function getStoredAccessToken(): string {
    if (typeof window === "undefined") {
      return "";
    }

    const tokenKeys = [
      "prostream_access_token",
      "prostream_admin_token",
      "accessToken",
      "token"
    ];

    for (const key of tokenKeys) {
      const sessionValue = window.sessionStorage.getItem(key);

      if (sessionValue?.trim()) {
        return sessionValue.trim();
      }

      const localValue = window.localStorage.getItem(key);

      if (localValue?.trim()) {
        return localValue.trim();
      }
    }

    return "";
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmedContent = content.trim();

    if (trimmedContent.length < 3) {
      setStatus("Comment should be at least 3 characters.");
      return;
    }

    setStatus("Submitting...");
    setIsSubmitting(true);

    try {
      const token = getStoredAccessToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api"}/categories/${categorySlug}/comments`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ content: trimmedContent })
        }
      );

      if (!response.ok) {
        setStatus("Login required. Only signed-in users can comment.");
        setIsSubmitting(false);
        return;
      }

      setStatus("Comment submitted for moderation.");
      setContent("");
      const updated = await fetchCategoryComments(categorySlug);
      setComments(updated);
    } catch {
      setStatus("Unable to submit right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="comments-enhanced" aria-label="Category comments">
      <div className="section-heading-compact">
        <div className="comment-header-icon">
          <MdComment size={28} />
        </div>
        <div>
          <h3>Comments</h3>
          <p>Only logged-in users can comment. All comments are moderated.</p>
        </div>
      </div>

      <form className="comment-form-enhanced" onSubmit={onSubmit}>
        <div className="comment-input-wrapper">
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Share your thoughts on this category..."
            minLength={3}
            required
            className="comment-textarea-enhanced"
          />
        </div>
        <button
          type="submit"
          className="comment-submit-btn"
          disabled={isSubmitting}
        >
          <MdSend size={18} />
          <span>{isSubmitting ? 'Posting...' : 'Post Comment'}</span>
        </button>
      </form>

      {status ? <p className="status-text-enhanced">{status}</p> : null}

      <div className="comment-list-enhanced">
        {comments.length === 0 ? (
          <div className="no-comments">
            <MdComment size={48} />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : null}
        {comments.map((comment) => (
          <article key={comment.id} className="comment-item-enhanced">
            <div className="comment-avatar">
              <MdPerson size={24} />
            </div>
            <div className="comment-content-wrapper">
              <header className="comment-header-enhanced">
                <strong className="comment-author">{comment.authorName}</strong>
                <time className="comment-time">
                  <MdAccessTime size={14} />
                  {new Date(comment.createdAt).toLocaleString()}
                </time>
              </header>
              <p className="comment-text">{comment.content}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

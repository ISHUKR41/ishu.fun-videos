"use client";

import { useEffect, useMemo, useState } from "react";
import { KeyRound, Lock, ShieldCheck, UploadCloud } from "lucide-react";
import { fetchCategories } from "@/lib/api";
import { Category, getCategoryCode } from "@/lib/categories";
import { siteConfig } from "@/lib/site";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";
const adminApiPath = siteConfig.adminHidePath;

export default function HiddenAdminPage() {
  const [adminToken, setAdminToken] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryDescription, setEditCategoryDescription] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [seoStatus, setSeoStatus] = useState("");
  const [categoryUpdateStatus, setCategoryUpdateStatus] = useState("");
  const [seoOutput, setSeoOutput] = useState<{
    titleSuggestions: string[];
    descriptionSuggestion: string;
    keywords: string[];
    slugSuggestion?: string;
    hashtagSuggestions?: string[];
    keywordClusters?: {
      primary: string[];
      secondary: string[];
    };
    seoScore?: number;
    scoringBreakdown?: {
      relevance: number;
      keywordCoverage: number;
      descriptionClarity: number;
    };
  } | null>(null);

  useEffect(() => {
    const savedToken = window.sessionStorage.getItem("prostream_admin_token") || "";
    setAdminToken(savedToken);

    fetchCategories()
      .then((records) => {
        setCategories(records);

        if (records.length > 0) {
          setSelectedCategoryId(records[0].id);
        }
      })
      .catch(() => {
        setCategories([]);
      });
  }, []);

  useEffect(() => {
    if (!adminToken) {
      window.sessionStorage.removeItem("prostream_admin_token");
      return;
    }

    window.sessionStorage.setItem("prostream_admin_token", adminToken);
  }, [adminToken]);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategoryId),
    [categories, selectedCategoryId]
  );

  useEffect(() => {
    if (!selectedCategory) {
      setEditCategoryName("");
      setEditCategoryDescription("");
      return;
    }

    setEditCategoryName(selectedCategory.name);
    setEditCategoryDescription(selectedCategory.description);
  }, [selectedCategory]);

  function resolveBearerToken(rawToken: string): string {
    return rawToken.trim().replace(/^Bearer\s+/i, "");
  }

  async function submitUpload(formData: FormData) {
    const token = resolveBearerToken(adminToken);

    if (!token) {
      setUploadStatus("Admin token required. Paste Bearer token first.");
      return;
    }

    if (!selectedCategoryId) {
      setUploadStatus("No category loaded. Ensure backend categories API is online.");
      return;
    }

    setUploadStatus("Submitting upload request...");

    const payload = {
      title: String(formData.get("title") || ""),
      description: String(formData.get("description") || ""),
      categoryId: selectedCategoryId,
      fileName: String(formData.get("fileName") || "")
    };

    const response = await fetch(`${apiBase}/${adminApiPath}/upload/initiate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      setUploadStatus("Upload init failed. Check token and payload.");
      return;
    }

    const data = (await response.json()) as { videoId: string; storageKey: string; uploadUrl: string };
    setUploadStatus(`Upload initialized: ${data.videoId} (${data.storageKey})`);
  }

  async function submitSeo(formData: FormData) {
    const token = resolveBearerToken(adminToken);

    if (!token) {
      setSeoStatus("Admin token required. Paste Bearer token first.");
      return;
    }

    setSeoStatus("Generating SEO suggestions...");
    setSeoOutput(null);

    const payload = {
      title: String(formData.get("seoTitle") || ""),
      description: String(formData.get("seoDescription") || ""),
      categoryName: selectedCategory?.name || String(formData.get("seoCategory") || "")
    };

    const response = await fetch(`${apiBase}/${adminApiPath}/seo/suggest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      setSeoStatus("Unable to generate SEO suggestions.");
      return;
    }

    const data = (await response.json()) as {
      titleSuggestions: string[];
      descriptionSuggestion: string;
      keywords: string[];
      slugSuggestion?: string;
      hashtagSuggestions?: string[];
      keywordClusters?: {
        primary: string[];
        secondary: string[];
      };
      seoScore?: number;
      scoringBreakdown?: {
        relevance: number;
        keywordCoverage: number;
        descriptionClarity: number;
      };
    };
    setSeoOutput(data);
    setSeoStatus("SEO suggestions ready.");
  }

  async function submitCategoryUpdate() {
    const token = resolveBearerToken(adminToken);

    if (!token) {
      setCategoryUpdateStatus("Admin token required.");
      return;
    }

    if (!selectedCategory) {
      setCategoryUpdateStatus("Select a category first.");
      return;
    }

    const nextName = editCategoryName.trim();
    const nextDescription = editCategoryDescription.trim();

    if (nextName.length < 2 || nextDescription.length < 5) {
      setCategoryUpdateStatus("Name and description must be valid.");
      return;
    }

    setCategoryUpdateStatus("Updating category and syncing folders...");

    const response = await fetch(`${apiBase}/categories/${selectedCategory.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: nextName,
        description: nextDescription,
        group: selectedCategory.group
      })
    });

    if (!response.ok) {
      setCategoryUpdateStatus("Category update failed. Check token/inputs.");
      return;
    }

    const result = (await response.json()) as {
      category?: {
        id: string;
        name: string;
        description: string;
        slug: string;
        group: string;
      };
      folderSync?: {
        ok: boolean;
        message: string;
      };
      propagation?: {
        strategy: string;
        result: string;
      };
    };

    if (result.category) {
      setCategories((prev) =>
        prev.map((item) =>
          item.id === selectedCategory.id
            ? {
                ...item,
                name: result.category!.name,
                description: result.category!.description,
                slug: result.category!.slug,
                group: result.category!.group as Category["group"]
              }
            : item
        )
      );

      setEditCategoryName(result.category.name);
      setEditCategoryDescription(result.category.description);
    }

    const folderSyncStatus = result.folderSync?.ok
      ? "Folder sync applied"
      : `Folder sync issue: ${result.folderSync?.message || "unknown"}`;
    setCategoryUpdateStatus(
      `Category updated. New slug: ${result.category?.slug || selectedCategory.slug}. ${folderSyncStatus}.`
    );
  }

  return (
    <main className="container admin-page">
      <section className="section-heading">
        <h1>Control Room</h1>
        <p>Hidden admin surface. Backend role checks are mandatory for every admin action.</p>
      </section>

      <section className="admin-auth-card">
        <div className="admin-auth-head">
          <KeyRound size={18} />
          <h2>Session Token</h2>
        </div>
        <p className="muted">Paste admin bearer token. It is stored only in this browser session.</p>
        <input
          type="password"
          value={adminToken}
          onChange={(event) => setAdminToken(event.target.value)}
          placeholder="eyJhbGciOi..."
        />
      </section>

      <div className="admin-grid">
        <article className="admin-card">
          <Lock size={20} />
          <h2>Access Policy</h2>
          <p>Only authorized admin roles can upload, edit, or moderate content.</p>
        </article>

        <article className="admin-card">
          <UploadCloud size={20} />
          <h2>Upload Pipeline</h2>
          <p>Presigned cloud uploads and publish-state controls are enabled.</p>
        </article>

        <article className="admin-card">
          <ShieldCheck size={20} />
          <h2>Moderation</h2>
          <p>Category comments are queued and managed through role-based controls.</p>
        </article>
      </div>

      <section className="admin-tools">
        <article className="admin-tool-card">
          <h2>Initiate Video Upload</h2>
          <p className="muted">Backend verifies role and returns signed upload details.</p>
          <form
            key={selectedCategoryId || "no-category"}
            className="admin-form"
            onSubmit={(event) => {
              event.preventDefault();
              submitUpload(new FormData(event.currentTarget));
            }}
          >
            <input name="title" placeholder="Video title" required />
            <textarea name="description" placeholder="Video description" required minLength={8} />
            <select
              name="categoryId"
              value={selectedCategoryId}
              onChange={(event) => setSelectedCategoryId(event.target.value)}
              required
            >
              {categories.length === 0 ? (
                <option value="" disabled>
                  Loading categories...
                </option>
              ) : null}
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {getCategoryCode(category)} - {category.name}
                </option>
              ))}
            </select>
            <input name="fileName" placeholder="video-file.mp4" required />
            <button type="submit">Initiate Upload</button>
          </form>
          {uploadStatus ? <p className="status-text">{uploadStatus}</p> : null}
        </article>

        <article className="admin-tool-card">
          <h2>AI-SEO Assistant</h2>
          <p className="muted">Generate optimized titles, description, and keyword set.</p>
          <form
            className="admin-form"
            onSubmit={(event) => {
              event.preventDefault();
              submitSeo(new FormData(event.currentTarget));
            }}
          >
            <input name="seoTitle" placeholder="Base title" required />
            <textarea name="seoDescription" placeholder="Base description" required minLength={12} />
            <input
              name="seoCategory"
              value={selectedCategory?.name || ""}
              readOnly
              aria-readonly
            />
            <button type="submit">Generate SEO</button>
          </form>
          {seoStatus ? <p className="status-text">{seoStatus}</p> : null}

          {seoOutput ? (
            <div className="seo-output">
              <h3>Title Suggestions</h3>
              <ul>
                {seoOutput.titleSuggestions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <h3>Description</h3>
              <p>{seoOutput.descriptionSuggestion}</p>
              <h3>Keywords</h3>
              <p>{seoOutput.keywords.join(", ")}</p>
              {seoOutput.keywordClusters ? (
                <>
                  <h3>Primary Cluster</h3>
                  <p>{seoOutput.keywordClusters.primary.join(", ")}</p>
                  <h3>Secondary Cluster</h3>
                  <p>{seoOutput.keywordClusters.secondary.join(", ")}</p>
                </>
              ) : null}
              {seoOutput.slugSuggestion ? (
                <>
                  <h3>Slug Suggestion</h3>
                  <p>{seoOutput.slugSuggestion}</p>
                </>
              ) : null}
              {seoOutput.hashtagSuggestions?.length ? (
                <>
                  <h3>Hashtags</h3>
                  <p>{seoOutput.hashtagSuggestions.join(" ")}</p>
                </>
              ) : null}
              {typeof seoOutput.seoScore === "number" ? (
                <>
                  <h3>SEO Score</h3>
                  <p>
                    {seoOutput.seoScore}/100
                    {seoOutput.scoringBreakdown
                      ? ` (Relevance ${seoOutput.scoringBreakdown.relevance}, Coverage ${seoOutput.scoringBreakdown.keywordCoverage}, Clarity ${seoOutput.scoringBreakdown.descriptionClarity})`
                      : ""}
                  </p>
                </>
              ) : null}
            </div>
          ) : null}
        </article>

        <article className="admin-tool-card">
          <h2>Category Rename + Sync</h2>
          <p className="muted">Update category details and propagate the changes across routes and folder metadata.</p>
          <form
            className="admin-form"
            onSubmit={(event) => {
              event.preventDefault();
              submitCategoryUpdate();
            }}
          >
            <input
              name="categoryName"
              value={editCategoryName}
              onChange={(event) => setEditCategoryName(event.target.value)}
              placeholder="Category name"
              required
            />
            <textarea
              name="categoryDescription"
              value={editCategoryDescription}
              onChange={(event) => setEditCategoryDescription(event.target.value)}
              placeholder="Category description"
              required
              minLength={5}
            />
            <button type="submit">Update Category</button>
          </form>
          {categoryUpdateStatus ? <p className="status-text">{categoryUpdateStatus}</p> : null}
        </article>
      </section>
    </main>
  );
}

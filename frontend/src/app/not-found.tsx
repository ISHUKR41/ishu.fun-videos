import Link from "next/link";
import { MdHome, MdVideoLibrary, MdSentimentDissatisfied } from "react-icons/md";

export default function NotFound() {
  return (
    <main className="container not-found-enhanced">
      <div className="not-found-orb one" aria-hidden />
      <div className="not-found-orb two" aria-hidden />
      <div className="not-found-content">
        <div className="not-found-icon">
          <MdSentimentDissatisfied size={64} />
        </div>
        <h1 className="not-found-title">
          <span>404</span>
          <br />
          Page Not Found
        </h1>
        <p className="not-found-description">
          The page you requested does not exist or was moved. Try navigating back home or exploring our categories.
        </p>
        <div className="not-found-actions">
          <Link href="/" className="btn primary">
            <MdHome size={18} /> Go Home
          </Link>
          <Link href="/categories" className="btn ghost">
            <MdVideoLibrary size={18} /> Browse Categories
          </Link>
        </div>
      </div>
    </main>
  );
}

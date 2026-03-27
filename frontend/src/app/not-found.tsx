import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container not-found">
      <h1>Page Not Found</h1>
      <p>The page you requested does not exist or was moved.</p>
      <Link href="/" className="btn primary">
        Go Home
      </Link>
    </main>
  );
}

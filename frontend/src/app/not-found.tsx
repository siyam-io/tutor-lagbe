import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <span className="text-8xl block mb-8">🔍</span>
        <h1 className="font-display text-6xl font-semibold text-ink mb-5">
          404
        </h1>
        <p className="text-xl text-ink-muted mb-10">Page not found</p>
        <Link href="/" className="btn-primary">
          Go Home
        </Link>
      </div>
    </div>
  );
}

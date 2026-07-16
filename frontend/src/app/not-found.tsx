import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="text-center">
        <span className="text-8xl block mb-6">🔍</span>
        <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white mb-4">404</h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 mb-8">Page not found</p>
        <Link href="/" className="btn-primary inline-block">
          Go Home
        </Link>
      </div>
    </div>
  );
}

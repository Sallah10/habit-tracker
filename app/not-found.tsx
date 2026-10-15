import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-6xl font-bold text-blue-300">404</p>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="max-w-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-full bg-white px-6 py-2 font-semibold text-[#26252F] transition-colors hover:bg-blue-300"
      >
        Back to Home
      </Link>
    </div>
  );
}

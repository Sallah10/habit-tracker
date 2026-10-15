import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Small "back to dashboard" affordance so the feature pages aren't dead-ends.
export function BackLink({
  href = "/dashboard",
  label = "Dashboard",
}: {
  href?: string;
  label?: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-white"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      {label}
    </Link>
  );
}

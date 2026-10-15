import { BackLink } from "./back-link";

// Shared header for the feature pages: a way back, a title, a one-liner.
export function PageHeader({
  title,
  subtitle,
  backHref = "/dashboard",
  backLabel = "Dashboard",
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <BackLink href={backHref} label={backLabel} />
      <div>
        <h1 className="text-3xl font-bold text-white md:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-1 text-gray-400">{subtitle}</p> : null}
      </div>
    </div>
  );
}

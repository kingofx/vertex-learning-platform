import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 text-neutral-900 ${className}`}
      aria-label="Vertex home"
    >
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
        <path
          d="M2 4h10l4 9 4-9h10L16 29z"
          className="fill-primary-500"
        />
        <path d="M12 4h8l-4 9z" className="fill-primary-600" />
      </svg>
      <span className="text-heading-3 font-semibold">Vertex</span>
    </Link>
  );
}

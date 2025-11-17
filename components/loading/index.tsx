"use client";

type LoadingProps = {
  label?: string;
  fullScreen?: boolean;
  className?: string;
};

export function LoadingCard({
  label = "Carregando",
  fullScreen = false,
  className,
}: LoadingProps) {
  const containerClassName = [
    "relative w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl shadow-emerald-900/10",
    "flex flex-col items-center justify-center gap-3 p-3 text-center sm:flex-row sm:gap-4 sm:p-4 sm:text-left",
    fullScreen ? "min-h-[220px]" : "h-auto",
    className,
  ].filter(Boolean);

  return (
    <section
      className={containerClassName.join(" ")}
      role="status"
      aria-live="polite"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 18% 22%, var(--color-gradient-1) 0, transparent 24%), radial-gradient(circle at 84% 16%, var(--color-gradient-2) 0, transparent 22%), radial-gradient(circle at 50% 82%, var(--color-gradient-3) 0, transparent 24%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-surface-muted)] shadow-inner shadow-emerald-900/10 sm:h-11 sm:w-11">
          <span className="sr-only">{label}</span>
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[color-mix(in_srgb,var(--color-primary)_75%,transparent)] border-t-transparent" />
          <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-[radial-gradient(circle_at_50%_50%,var(--color-accent)_0,transparent_55%)] opacity-40 blur-md" />
        </div>

        <p className="relative text-sm font-semibold text-[var(--color-primary-strong)] sm:text-base">
          {label}
        </p>
      </div>
    </section>
  );
}

type InlineLoadingProps = {
  label?: string;
  className?: string;
};

export function LoadingInline({
  label = "Carregando",
  className,
}: InlineLoadingProps) {
  const classes = [
    "inline-flex items-center gap-2 rounded-lg bg-[var(--color-surface-muted)] px-2.5 py-1.5 text-xs font-medium text-[var(--color-primary-strong)] shadow-inner shadow-emerald-900/10",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      <span className="relative flex h-3.5 w-3.5 items-center justify-center">
        <span className="h-full w-full animate-spin rounded-full border border-[color-mix(in_srgb,var(--color-primary)_70%,transparent)] border-t-transparent" />
      </span>
      <span aria-hidden>{label}</span>
    </span>
  );
}

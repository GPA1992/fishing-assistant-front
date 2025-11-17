"use client";

type LoadingProps = {
  title?: string;
  description?: string;
  helperText?: string;
  fullScreen?: boolean;
  className?: string;
};

export function LoadingCard({
  title = "Carregando dados",
  description = "Estamos preparando as informações para você continuar o planejamento.",
  helperText = "Isso pode levar alguns segundos enquanto buscamos mapas, clima e rotas.",
  fullScreen = false,
  className,
}: LoadingProps) {
  const containerClassName = [
    "relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl shadow-emerald-900/10",
    "flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5",
    fullScreen ? "min-h-[260px] sm:min-h-[320px]" : "min-h-[180px]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={containerClassName} role="status" aria-live="polite">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 16% 18%, var(--color-gradient-1) 0, transparent 22%), radial-gradient(circle at 82% 16%, var(--color-gradient-2) 0, transparent 22%), radial-gradient(circle at 50% 80%, var(--color-gradient-3) 0, transparent 24%)",
        }}
      />

      <div className="relative flex w-full flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-surface-muted)] shadow-inner shadow-emerald-900/10 sm:h-16 sm:w-16">
          <span className="sr-only">Carregando</span>
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[color-mix(in_srgb,var(--color-primary)_75%,transparent)] border-t-transparent" />
          <div className="pointer-events-none absolute -inset-3 rounded-3xl bg-[radial-gradient(circle_at_50%_50%,var(--color-accent)_0,transparent_55%)] opacity-40 blur-md" />
        </div>

        <div className="relative flex-1 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
            Aguarde
          </p>
          <h3 className="text-lg font-semibold text-[var(--color-primary-strong)] sm:text-xl">
            {title}
          </h3>
          <p className="text-sm text-[var(--color-muted)] sm:max-w-[520px]">
            {description}
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-1 sm:justify-start">
            {["Mapas", "Clima", "Rotas"].map((label) => (
              <span
                key={label}
                className="theme-pill inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] shadow-sm"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary-strong)]" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative flex w-full flex-col gap-3 sm:w-auto sm:min-w-[240px]">
        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-muted)] shadow-inner shadow-emerald-900/10">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-[var(--color-accent)]" />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-10 rounded-xl bg-[var(--color-highlight)] shadow-inner shadow-emerald-900/5"
            >
              <div className="h-full w-1/2 animate-pulse rounded-xl bg-[color-mix(in_srgb,var(--color-primary)_20%,transparent)]" />
            </div>
          ))}
        </div>

        <p className="text-xs text-[var(--color-muted)] sm:text-sm">
          {helperText}
        </p>
      </div>
    </section>
  );
}

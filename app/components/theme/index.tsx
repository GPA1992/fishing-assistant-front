"use client";

import { useTheme } from "@/context/theme";
import { type ThemeDefinition } from "@/lib/themes";

const SWATCH_KEYS: Array<{ key: keyof ThemeDefinition["colors"]; label: string }> = [
  { key: "primary", label: "Primária" },
  { key: "primaryStrong", label: "Primária forte" },
  { key: "accent", label: "Acento" },
  { key: "accentStrong", label: "Acento forte" },
  { key: "background", label: "Fundo" },
  { key: "surface", label: "Superfície" },
  { key: "surfaceMuted", label: "Superfície 2" },
  { key: "border", label: "Borda" },
  { key: "text", label: "Texto" },
  { key: "muted", label: "Texto secundário" },
];

function getTextColor(hex: string) {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.55 ? "#f8fafc" : "#0f172a";
}

export function ThemePanel() {
  const { theme, themes, setThemeId } = useTheme();

  return (
    <section className="theme-card relative rounded-3xl shadow-xl shadow-emerald-900/10">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
            Tema ativo
          </p>
          <h2 className="text-xl font-semibold text-[var(--color-text)]">
            {theme.name}
          </h2>
          <p className="text-sm text-[var(--color-muted)]">
            Use a lista para testar rapidamente novas combinações.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[240px]">
          <label htmlFor="theme-select" className="text-xs font-semibold text-[var(--color-muted)]">
            Paleta
          </label>
          <select
            id="theme-select"
            value={theme.id}
            onChange={(event) => setThemeId(event.target.value)}
            className="theme-input rounded-2xl px-4 py-3 text-sm font-medium shadow-sm"
          >
            {themes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-[var(--color-border)] p-4 sm:grid-cols-5 sm:p-5">
        {SWATCH_KEYS.map(({ key, label }) => {
          const color = theme.colors[key];
          const textColor = getTextColor(color);
          return (
            <div
              key={key}
              className="overflow-hidden rounded-2xl border border-[var(--color-border)] shadow-sm"
              style={{ backgroundColor: color, color: textColor }}
            >
              <div className="px-3 py-4 text-sm font-semibold">{label}</div>
              <div className="bg-black/5 px-3 py-2 text-xs uppercase tracking-wide">
                {color}
              </div>
            </div>
          );
        })}

        <div className="col-span-2 rounded-2xl border border-[var(--color-border)] shadow-sm sm:col-span-5">
          <div className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
            Gradiente do fundo
          </div>
          <div
            className="h-16 w-full rounded-b-2xl"
            style={{
              background: `radial-gradient(circle at 10% 20%, ${theme.colors.gradient[0]} 0, transparent 25%), radial-gradient(circle at 90% 10%, ${theme.colors.gradient[1]} 0, transparent 20%), radial-gradient(circle at 50% 80%, ${theme.colors.gradient[2]} 0, transparent 22%), ${theme.colors.background}`,
            }}
          />
        </div>
      </div>
    </section>
  );
}

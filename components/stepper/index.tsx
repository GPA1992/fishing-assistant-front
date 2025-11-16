"use client";
import { cn } from "@/lib/utils";
import {
  CalendarClock,
  ChartColumnDecreasing,
  LucideIcon,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type Step = {
  href: string;
  title: string;
  icon: LucideIcon;
};

const steps: Step[] = [
  {
    href: "/planejamento/localizacao",
    title: "Localização",
    icon: MapPin,
  },
  {
    href: "/planejamento/dia-horario",
    title: "Dia e horário",
    icon: CalendarClock,
  },
  {
    href: "/planejamento/resultado",
    title: "Resultado",
    icon: ChartColumnDecreasing,
  },
];
export default function Stepper() {
  const pathname = usePathname();
  const currentIndex = steps.findIndex(({ href }) => pathname.startsWith(href));
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <nav aria-label="Progresso do planejamento">
      <ol className="flex flex-wrap items-center gap-2.5 sm:gap-4">
        {steps.map(({ href, icon: Icon, title }, index) => {
          const active = activeIndex === index;
          const completed = activeIndex > index;
          const circleClasses = cn(
            "flex h-9 w-9 items-center justify-center rounded-full border text-[var(--color-primary)] transition sm:h-10 sm:w-10",
            active &&
              "border-transparent border-[var(--color-accent)] bg-[var(--color-surface)] text-[var(--color-primary-strong)] shadow-inner shadow-emerald-900/15",
            completed &&
              !active &&
              "border-[var(--color-border)] bg-[var(--color-accent)]/60 text-[var(--color-primary-strong)]",
            !completed &&
              !active &&
              "border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-muted)]"
          );
          const labelClasses = cn(
            "text-xs font-semibold transition-colors sm:text-sm",
            active && "text-[var(--color-primary-strong)]",
            completed && !active && "text-[var(--color-primary-strong)]",
            !completed && !active && "text-[var(--color-muted)]"
          );
          const lineClasses = cn(
            "h-px w-10 flex-1 rounded-full transition-colors sm:w-16",
            completed
              ? "bg-[var(--color-accent)] border border-[var(--color-accent)]"
              : "bg-[var(--color-surface-muted)] "
          );

          return (
            <li key={href} className="flex items-center gap-2.5 sm:gap-3">
              <Link
                href={href}
                aria-current={active ? "step" : undefined}
                className="group flex items-center gap-2 sm:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
              >
                <span className={circleClasses}>
                  <Icon
                    className={cn("h-5 w-5", active && "text-(--color-accent)")}
                    strokeWidth={2.4}
                  />
                </span>
                <span className="sr-only">{title}</span>
                <span className={cn("hidden sm:inline", labelClasses)}>
                  {title}
                </span>
              </Link>
              {index < steps.length - 1 && (
                <span aria-hidden className={lineClasses} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

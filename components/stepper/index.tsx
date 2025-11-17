"use client";
import { planningStore } from "@/core/request";
import { cn } from "@/lib/utils";
import {
  CalendarClock,
  ChartColumnDecreasing,
  CheckIcon,
  LucideIcon,
  MapPin,
  X,
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
  const isLocationIsFilled = planningStore((state) => state.isLocationIsFilled);
  const isTargetIsFilled = planningStore((state) => state.isTargetIsFilled);
  return (
    <nav aria-label="Progresso do planejamento" className="w-full">
      <ol className="flex w-full flex-wrap items-center gap-2.5 sm:gap-4">
        {steps.map(({ href, icon: Icon }, index) => {
          const active = activeIndex === index;
          const completed = activeIndex > index;
          const circleClasses = cn(
            "flex h-9 w-9 items-center justify-center rounded-full border text-[var(--color-primary)] transition sm:h-10 sm:w-10",
            active &&
              "border-transparent border-[var(--color-accent)] bg-[var(--color-surface)] text-[var(--color-primary-strong)] shadow-inner shadow-emerald-900/15",
            completed &&
              !active &&
              "border-green-200 bg-[var(--color-accent)]/60 text-[var(--color-primary-strong)]",
            !completed &&
              !active &&
              "border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-muted)]"
          );
          const lineClasses = cn(
            "h-px flex-1 rounded-full border border-transparent transition-colors",
            completed
              ? "bg-[var(--color-accent)] border-[var(--color-accent)]"
              : "bg-[var(--color-surface-muted)]"
          );

          const isStepperIsFilled = (steper: string) => {
            if (steper === "/planejamento/localizacao") {
              return isLocationIsFilled();
            }
            if (steper === "/planejamento/dia-horario") {
              return isTargetIsFilled();
            }
          };
          return (
            <li
              key={href}
              className="flex flex-1 items-center gap-2.5 sm:gap-3"
            >
              <Link
                href={href}
                aria-current={active ? "step" : undefined}
                className="group flex items-center gap-2 sm:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
              >
                <span className={cn(circleClasses, "relative")}>
                  <Icon
                    className={cn("h-5 w-5", active && "text-(--color-accent)")}
                    strokeWidth={2.4}
                  />

                  {isStepperIsFilled(href) && (
                    <span
                      className={cn(
                        "absolute -top-0.5 p-[2px] -right-2 h-[18px] w-[18px] text-white flex items-center justify-center rounded-full border border-[var(--color-border)] bg-green-500"
                      )}
                    >
                      <CheckIcon className=" h-5 w-5" strokeWidth={3} />
                    </span>
                  )}
                  {!isStepperIsFilled(href) && completed && (
                    <span
                      className={cn(
                        "absolute -top-1 -right-1 h-4 w-4 text-green-500 flex items-center justify-center rounded-full border bg-white"
                      )}
                    >
                      <CheckIcon className=" h-5 w-5" strokeWidth={3} />
                    </span>
                  )}
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

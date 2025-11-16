"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type Step = { href: string; label: string; icon: string };
export default function Stepper({ steps }: { steps: Step[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Stepper">
      <ol style={{ display: "flex", gap: 12, listStyle: "none", padding: 0 }}>
        {steps.map((s) => {
          const active = pathname === s.href;
          return (
            <li key={s.href}>
              <Link
                href={s.href}
                aria-current={active ? "step" : undefined}
                style={{
                  display: "inline-block",
                  width: 36,
                  height: 36,
                  lineHeight: "36px",
                  textAlign: "center",
                  borderRadius: "50%",
                  border: "1px solid #ccc",
                  textDecoration: "none",
                  fontWeight: active ? 700 : 400,
                  background: active ? "#eee" : "transparent",
                }}
              >
                {s.label}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

"use client";
import { CalendarClock, LucideIcon, MapPin } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type Step = { href: string; label: string; icon: LucideIcon };

const steps = [
  { href: "/planejamento/localizacao", label: "1", icon: MapPin },
  { href: "/planejamento/dia-horario", label: "2", icon: CalendarClock },
];
export default function Stepper() {
  const pathname = usePathname();
  return (
    <nav aria-label="Stepper">
      <ol style={{ display: "flex", gap: 12, listStyle: "none", padding: 0 }}>
        {steps.map(({ href, icon: Icone, label }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "step" : undefined}
                className={` inline-block  w-9  h-9  leading-[36px] 
                   text-center  rounded-full  border 
                    border-[#ccc]  no-underline  font-normal  bg-transparent
                      [ &.active ]:font-bold  [ &.active ]:bg-[#eee]`}
              >
                <Icone size={18} strokeWidth={2.4} />
              </Link>
              <label htmlFor="">{label}</label>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

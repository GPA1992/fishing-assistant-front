import Stepper from "@/components/stepper";
import type { ReactNode } from "react";

const steps = [
  { href: "/planejamento/localizacao", label: "1", icon: "string" },
  { href: "/planejamento/dia-horario", label: "2", icon: "string" },
  { href: "/form/passo-3", label: "3", icon: "string" },
];

export default function FormLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container">
      <Stepper steps={steps} />
      <div style={{ marginTop: 24 }}>{children}</div>
    </div>
  );
}

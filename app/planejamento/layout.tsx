import Stepper from "@/components/stepper";

import type { ReactNode } from "react";

export default function FormLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container">
      <Stepper />
      <div>{children}</div>
    </div>
  );
}

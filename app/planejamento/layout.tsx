import PlanningData from "@/components/planning-data";
import Stepper from "@/components/stepper";

import type { ReactNode } from "react";

export default function FormLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="h-[55vh]  ">{children}</div>
      <Stepper />
      <PlanningData />
    </>
  );
}

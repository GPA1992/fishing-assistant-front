"use client";

import { ThemeInitializer } from "./theme-initializer";

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      <ThemeInitializer />
      {children}
    </>
  );
}

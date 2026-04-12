"use client";

import { useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "@studio-freight/lenis";

interface Props {
  children: ReactNode;
}

export default function SmoothScrollProvider({ children }: Props) {
  const pathname = usePathname();
  const isDashboardRoute = pathname?.startsWith("/user/dashboard");

  useEffect(() => {
    if (isDashboardRoute) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [isDashboardRoute]);

  return <>{children}</>;
}

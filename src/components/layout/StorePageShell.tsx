"use client";

import { useEffect, useRef, useState } from "react";

import StoreFooter from "@/components/layout/StoreFooter";
import StoreHeader from "@/components/layout/StoreHeader";
import StoreTrustBadges from "@/components/layout/StoreTrustBadges";

interface StorePageShellProps {
  children: React.ReactNode;
  showTrustBadges?: boolean;
}

export default function StorePageShell({
  children,
  showTrustBadges = true,
}: StorePageShellProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const node = headerRef.current;
    if (!node) return;

    const updateHeight = () => setHeaderHeight(node.offsetHeight);

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(node);
    window.addEventListener("resize", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-white text-slate-900"
      style={{ "--store-header-height": `${headerHeight}px` } as React.CSSProperties}
    >
      <div ref={headerRef} className="fixed top-0 left-0 right-0 z-50 bg-white">
        <StoreHeader embedded />
      </div>
      <main className="bg-white" style={{ paddingTop: headerHeight || undefined }}>
        {children}
      </main>
      {showTrustBadges ? <StoreTrustBadges /> : null}
      <StoreFooter />
    </div>
  );
}

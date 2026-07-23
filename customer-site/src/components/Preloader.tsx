"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Shows on first load and on every route change, matching the Django site's
 * preloader behavior (instant feedback on navigation, not just first paint).
 * Next.js route transitions are client-side, so unlike the Django version we
 * don't need click/submit listeners — just watch the pathname.
 */
export default function Preloader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 350);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-navy transition-opacity duration-300 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="relative flex h-18 w-18 items-center justify-center">
        <span className="absolute inset-0 animate-spin rounded-full border-[3px] border-white/15 border-t-cta" />
        <Image src="/images/logo-icon.png" alt="" width={36} height={36} className="h-9 w-auto" />
      </div>
    </div>
  );
}

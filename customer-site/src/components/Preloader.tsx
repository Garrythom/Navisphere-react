"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Shows on first load and on every internal link click, matching the Django
 * site's preloader behavior. `pathname` only updates once the destination
 * route has already rendered, so waiting for it to show the loader would be
 * too late — instead a click listener shows it immediately (tap counts as a
 * click on every mobile browser too), and the pathname change hides it once
 * the new page is in.
 */
export default function Preloader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 350);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      // Capture phase, ahead of next/link's own onClick — Link calls
      // preventDefault() to do its client-side transition, so checking
      // event.defaultPrevented here (or listening on bubble) would always
      // see it already prevented and never fire.
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === pathname) return;

      setVisible(true);
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
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

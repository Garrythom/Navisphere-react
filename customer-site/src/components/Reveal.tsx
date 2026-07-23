"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fades/slides content up once it scrolls into view. Content is visible by
 * default and only gets hidden client-side after confirming IntersectionObserver
 * is available — so a JS failure never permanently hides real content.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pending, setPending] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!("IntersectionObserver" in window) || !ref.current) return;
    setPending(true);
    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-600 ease-out ${
        pending && !shown ? "translate-y-6 opacity-0" : "translate-y-0 opacity-100"
      } ${className}`}
    >
      {children}
    </div>
  );
}

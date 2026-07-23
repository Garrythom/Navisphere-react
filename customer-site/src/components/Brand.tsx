import Image from "next/image";

type BrandProps = {
  variant?: "light" | "dark";
  size?: number;
  textSize?: string;
  chipPadding?: string;
};

export default function Brand({
  variant = "light",
  size = 32,
  textSize = "text-lg",
  chipPadding = "p-1.5",
}: BrandProps) {
  const isDark = variant === "dark";

  return (
    <>
      {isDark ? (
        <span className={`inline-flex items-center justify-center rounded-lg bg-white ${chipPadding} shadow-sm`}>
          <Image src="/images/logo-icon.png" alt="" width={size} height={size} className="w-auto" style={{ height: size }} />
        </span>
      ) : (
        <Image src="/images/logo-icon.png" alt="" width={size} height={size} className="w-auto" style={{ height: size }} />
      )}
      <span
        className={`font-wordmark font-[700] ${textSize} ${isDark ? "text-white" : "text-navy"}`}
      >
        Navisphere{" "}
        <span className={`font-wordmark font-[700] ${isDark ? "text-slate-300" : "text-muted"}`}>
          Logistics
        </span>
      </span>
    </>
  );
}

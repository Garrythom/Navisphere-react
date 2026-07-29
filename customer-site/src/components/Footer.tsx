import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { WhatsappIcon } from "./SocialIcons";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/tracking", label: "Tracking" },
  { href: "/contact", label: "Contact Us" },
];

const SUPPORT_PHONE = "+1 (214) 384-2063";
const SUPPORT_ADDRESS = "4210 Harbor Gateway Blvd, Long Beach, CA 90802";
const WHATSAPP_LINK = `https://wa.me/${SUPPORT_PHONE.replace(/\D/g, "")}`;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <Image src="/images/logo-icon.png" alt="" width={40} height={40} className="h-10 w-auto brightness-0 invert" />
              <span className="font-wordmark text-xl font-[700] text-white">
                Navisphere <span className="font-wordmark font-[700] text-slate-300">Logistics</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-slate-400">
              Navisphere Logistics delivers world-class sea freight, air freight, and international
              cargo solutions — connecting businesses and individuals across the globe.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-white">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-white">
              Contact
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 hover:text-accent"
                >
                  <WhatsappIcon className="mt-0.5 h-4 w-4 shrink-0" />
                  {SUPPORT_PHONE} <span className="text-slate-500">(WhatsApp)</span>
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {SUPPORT_ADDRESS}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          © {year} Navisphere Logistics. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

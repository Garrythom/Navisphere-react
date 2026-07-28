import type { Metadata } from "next";
import Image from "next/image";
import { Mail, MapPin, Clock } from "lucide-react";
import { WhatsappIcon } from "@/components/SocialIcons";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us — Navisphere Logistics",
  description: "Get in touch with Navisphere Logistics — questions about an order, a quote, or general support.",
};

const SUPPORT_EMAIL = "support@navispherelogistics.com";
const SUPPORT_PHONE = "+1 (214) 384-2063";
const SUPPORT_ADDRESS = "4210 Harbor Gateway Blvd, Long Beach, CA 90802";
const WHATSAPP_LINK = `https://wa.me/${SUPPORT_PHONE.replace(/\D/g, "")}`;

export default function ContactPage() {
  return (
    <>
      <section className="relative flex min-h-[400px] items-center overflow-hidden sm:min-h-[450px] lg:min-h-[500px]">
        <div className="animate-ken-burns absolute inset-0">
          <Image src="/images/delivery-driver.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-navy/90 via-navy/85 to-navy" />
        <div className="relative mx-auto w-full max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-heading text-5xl font-bold text-white sm:text-6xl">Contact Us</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            Questions about an order or our services? We&rsquo;re happy to help.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-5xl gap-10 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
          <div className="lg:col-span-3">
            <ContactForm />
          </div>

          <div className="lg:col-span-2">
            <div className="card space-y-5">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm font-medium text-navy">Email</p>
                  <p className="text-sm text-muted">{SUPPORT_EMAIL}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <WhatsappIcon className="mt-0.5 h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm font-medium text-navy">WhatsApp</p>
                  <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-accent">
                    {SUPPORT_PHONE}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm font-medium text-navy">Address</p>
                  <p className="text-sm text-muted">{SUPPORT_ADDRESS}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm font-medium text-navy">Business Hours</p>
                  <p className="text-sm text-muted">Mon–Fri, 8:00 AM – 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

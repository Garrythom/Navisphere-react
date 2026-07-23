import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Plane, Ship, FileCheck2, Warehouse, Check, ShieldCheck, Award, Globe2, UserCheck } from "lucide-react";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Services — Navisphere Logistics",
  description:
    "Navisphere Logistics services: air freight, sea freight and ocean cargo, freight forwarding and customs coordination, and warehousing — with tracked status at every stage.",
};

const SERVICES = [
  {
    icon: Plane,
    title: "Air Freight Services",
    image: "/images/air-freight.jpg",
    alt: "Cargo aircraft on the airport tarmac",
    body: "When speed matters most, our air freight network moves your cargo across continents in days, not weeks. We coordinate with major carriers worldwide to secure space on the fastest available routes, handling everything from small parcels to time-critical commercial shipments.",
    points: [
      "Express and standard air cargo options worldwide",
      "Priority handling for time-sensitive shipments",
      "Real-time visibility from departure to arrival",
    ],
    imageFirst: true,
  },
  {
    icon: Ship,
    title: "Sea Freight & Ocean Cargo",
    image: "/images/cargo-ship.jpg",
    alt: "Ocean freight cargo ship carrying containers",
    body: "For larger volumes moving across oceans, sea freight is the cost-effective way to ship internationally. We offer full container load (FCL) and less-than-container load (LCL) options, backed by strategic carrier partnerships on major global trade routes.",
    points: [
      "Full container load (FCL) and less-than-container load (LCL)",
      "Coverage across major global shipping routes",
      "Competitive rates for large-volume international cargo",
    ],
    imageFirst: false,
  },
  {
    icon: FileCheck2,
    title: "Freight Forwarding & Customs Coordination",
    image: "/images/customs-docs.jpg",
    alt: "Freight forwarding coordinator reviewing customs documentation",
    body: "International shipping means navigating customs regulations, documentation, and compliance in every country you touch. Our freight forwarding team manages the paperwork and coordination — including import and export logistics — so your cargo clears customs without delays.",
    points: [
      "Customs documentation and compliance handled for you",
      "Import and export logistics management",
      "A single point of contact from origin to clearance",
    ],
    imageFirst: true,
  },
  {
    icon: Warehouse,
    title: "Warehousing & Distribution",
    image: "/images/warehouse-forklift.jpg",
    alt: "Warehouse storage and inventory handling",
    body: "Need somewhere to hold inventory between legs of the journey? Our secure facilities offer short- and long-term storage, with inventory received, logged, and released by our own team — not handed off to a third party you've never spoken to.",
    points: [
      "Short- and long-term storage options",
      "Inventory received, logged, and released by our own staff",
      "Easy coordination with your existing international shipments",
    ],
    imageFirst: false,
  },
];

const TRUST_STRIP = [
  { icon: ShieldCheck, title: "Licensed & Insured", body: "Every shipment is covered and compliant." },
  { icon: Award, title: "15+ Years Combined Experience", body: "A team that's moved freight through every scenario." },
  { icon: Globe2, title: "Global Shipping Network", body: "Strategic carrier partnerships across 40+ countries." },
  { icon: UserCheck, title: "Real People, Real Updates", body: "Every status update is entered by our own staff." },
];

export default function ServicesPage() {
  return (
    <>
      <section className="relative flex min-h-[400px] items-center overflow-hidden sm:min-h-[450px] lg:min-h-[500px]">
        <div className="animate-ken-burns absolute inset-0">
          <Image src="/images/air-freight.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-navy/90 via-navy/85 to-navy" />
        <div className="relative mx-auto w-full max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-heading text-5xl font-bold text-white sm:text-6xl">Our Services</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            Global freight and logistics solutions built around visibility, from origin to final mile.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-lg text-muted">
            From a single air shipment to a full container of ocean freight, every order that moves
            through Navisphere Logistics is coordinated by our own team and tracked through to delivery —
            no third-party black boxes, no guessing where things stand, anywhere in the world. Below is a
            closer look at how we can move your cargo.
          </p>
        </div>
      </section>

      <section className="space-y-20 pb-20">
        {SERVICES.map(({ icon: Icon, title, image, alt, body, points, imageFirst }) => (
          <Reveal key={title} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div
                className={`group overflow-hidden rounded-2xl shadow-md transition-shadow duration-300 hover:shadow-xl ${
                  imageFirst ? "" : "lg:order-2"
                }`}
              >
                <Image
                  src={image}
                  alt={alt}
                  width={800}
                  height={800}
                  className="aspect-square w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
              </div>
              <div className={imageFirst ? "" : "lg:order-1"}>
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 font-heading text-2xl font-bold text-navy">{title}</h2>
                <p className="mt-3 text-muted">{body}</p>
                <ul className="mt-4 space-y-2 text-sm text-navy">
                  {points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_STRIP.map(({ icon: Icon, title, body }) => (
              <div key={title}>
                <Icon className="mx-auto h-6 w-6 text-accent" />
                <p className="mt-3 font-heading font-semibold text-navy">{title}</p>
                <p className="mt-1 text-sm text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-navy">Not sure which service fits?</h2>
          <p className="mt-3 text-muted">Reach out and our team will help you find the right shipping solution.</p>
          <Link href="/contact" className="btn-accent mt-6 inline-flex">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}

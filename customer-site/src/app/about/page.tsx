import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Target,
  Compass,
  Plane,
  Ship,
  FileCheck2,
  ArrowLeftRight,
  Warehouse,
  Radar,
  Globe2,
  ShieldCheck,
  SlidersHorizontal,
  Eye,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us — Navisphere Logistics",
  description:
    "Navisphere Logistics delivers world-class sea freight, air freight, and international cargo solutions — connecting businesses and individuals across the globe.",
};

const WHAT_WE_DO = [
  { icon: Plane, label: "Air Freight Services", image: "/images/air-freight.jpg", alt: "Cargo aircraft on the airport tarmac" },
  { icon: Ship, label: "Sea Freight & Ocean Cargo", image: "/images/cargo-ship.jpg", alt: "Ocean freight cargo ship" },
  { icon: FileCheck2, label: "Freight Forwarding & Customs Coordination", image: "/images/customs-docs.jpg", alt: "Freight forwarding coordinator reviewing documentation" },
  { icon: ArrowLeftRight, label: "Import & Export Logistics Management", image: "/images/container-stacks.jpg", alt: "Stacked shipping containers at port" },
  { icon: Warehouse, label: "Warehousing & Distribution", image: "/images/warehouse-forklift.jpg", alt: "Warehouse storage and inventory handling" },
  { icon: Radar, label: "Shipment Tracking & Supply Chain Support", image: "/images/shipment-tracking.jpg", alt: "Warehouse worker tracking shipments with a tablet" },
];

const WHY_CHOOSE_US = [
  { icon: Globe2, title: "Global Network", body: "A worldwide shipping network built on strategic carrier partnerships." },
  { icon: ShieldCheck, title: "Safe & Timely", body: "Secure cargo handling with a track record of on-time delivery." },
  { icon: SlidersHorizontal, title: "Tailored Solutions", body: "Logistics plans customized to fit diverse industries and needs." },
  { icon: Eye, title: "Full Transparency", body: "Professional support and real shipment visibility at every stage." },
];

const TEAM = [
  { image: "/images/team-1.jpg", name: "Marcus Bennett", title: "Founder & CEO" },
  { image: "/images/team-2.jpg", name: "Elena Ruiz", title: "Director of Operations" },
  { image: "/images/team-3.jpg", name: "Gregory Owusu", title: "Head of Fleet & Freight" },
  { image: "/images/team-4.jpg", name: "Amara Johnson", title: "Customer Experience Lead" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[400px] items-center overflow-hidden sm:min-h-[450px] lg:min-h-[500px]">
        <div className="animate-ken-burns absolute inset-0">
          <Image src="/images/cargo-ship.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-navy/90 via-navy/85 to-navy" />
        <div className="relative mx-auto w-full max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-heading text-5xl font-bold text-white sm:text-6xl">About Navisphere Logistics</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">Connecting the world, delivering excellence.</p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="group aspect-square overflow-hidden rounded-2xl shadow-md transition-shadow duration-300 hover:shadow-xl">
            <Image
              src="/images/warehouse-team.jpg"
              alt="Navisphere Logistics warehouse team moving a shipment"
              width={800}
              height={800}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold text-navy">Our Story</h2>
            <p className="mt-4 text-muted">
              Navisphere Logistics delivers world-class logistics solutions that connect businesses and
              individuals across the globe. As a trusted provider of international shipping and freight
              services, we specialize in sea freight, air freight, international cargo transportation,
              freight forwarding, and end-to-end supply chain solutions — handling shipments of every
              size, from small consignments to large-scale commercial cargo.
            </p>
            <p className="mt-4 text-muted">
              We were founded on the principles of reliability, transparency, and operational excellence,
              with one goal in mind: simplifying global trade through seamless, efficient transportation.
              By combining industry expertise with modern logistics technology, our team ensures every
              shipment reaches its destination safely and on time — because to us, logistics isn&rsquo;t
              just about moving cargo, it&rsquo;s about creating connections and helping businesses expand
              beyond borders.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="card">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Target className="h-5 w-5" />
              </div>
              <h2 className="mt-4 font-heading text-xl font-bold text-navy">Our Mission</h2>
              <p className="mt-3 text-muted">
                To provide innovative, reliable, and cost-effective logistics solutions that empower
                businesses and individuals to move goods efficiently across international markets.
              </p>
            </div>
            <div className="card">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Compass className="h-5 w-5" />
              </div>
              <h2 className="mt-4 font-heading text-xl font-bold text-navy">Our Vision</h2>
              <p className="mt-3 text-muted">
                To become a globally recognized logistics partner, setting the standard for excellence in
                freight forwarding, cargo management, and international supply chain solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-navy">What We Do</h2>
            <p className="mt-2 text-muted">A full spectrum of freight and logistics capabilities, under one roof.</p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHAT_WE_DO.map(({ icon: Icon, label, image, alt }) => (
              <div key={label} className="group relative h-56 overflow-hidden rounded-xl shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md sm:h-64 lg:h-72">
                <Image src={image} alt={alt} fill className="object-cover transition-transform duration-[400ms] ease-out group-hover:scale-105" />
                <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center gap-2.5 bg-gradient-to-t from-navy/90 via-navy/70 to-transparent p-4 transition-transform duration-[400ms] ease-out group-hover:translate-y-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-white">{label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/services" className="text-sm font-semibold text-accent hover:underline">
              View All Services →
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-navy">Why Choose Us?</h2>
            <p className="mt-2 text-muted">What sets Navisphere Logistics apart.</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE_US.map(({ icon: Icon, title, body }) => (
              <div key={title} className="card text-center">
                <Icon className="mx-auto h-6 w-6 text-accent" />
                <h3 className="mt-3 font-heading font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-navy">Meet Our Team</h2>
            <p className="mt-2 text-muted">The people behind every status update.</p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map(({ image, name, title }) => (
              <div key={name} className="card text-center">
                <div className="group mx-auto aspect-square w-36 overflow-hidden rounded-full shadow-sm transition-shadow duration-300 hover:shadow-lg sm:w-40 lg:w-44">
                  <Image
                    src={image}
                    alt={name}
                    width={176}
                    height={176}
                    className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                </div>
                <h3 className="mt-4 font-heading font-semibold text-navy">{name}</h3>
                <p className="mt-1 text-sm text-accent">{title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-navy py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-white">
            We move more than cargo — we move opportunities.
          </h2>
          <p className="mt-3 text-slate-300">
            We connect markets and help businesses thrive in an increasingly interconnected world.
            Your cargo is our responsibility, and your success is our destination.
          </p>
          <Link href="/contact" className="btn-accent mt-6 inline-flex">
            Get In Touch
          </Link>
        </div>
      </section>
    </>
  );
}

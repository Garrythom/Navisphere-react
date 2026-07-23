import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Radar,
  ShieldCheck,
  Headset,
  Globe,
  PackageSearch,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[500px] items-center overflow-hidden sm:min-h-[600px] lg:min-h-[700px]">
        <div className="animate-ken-burns absolute inset-0">
          <Image src="/images/hero-port.jpg" alt="" fill priority className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-navy/95 via-navy/85 to-navy" />

        <div className="relative mx-auto w-full max-w-7xl px-4 py-32 sm:px-6 lg:px-8 lg:py-44">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-heading text-5xl font-bold text-white sm:text-6xl">
              Track your shipment with total confidence
            </h1>
            <p className="mt-4 text-xl text-slate-300">
              Every order moving through Navisphere Logistics is tracked and updated by our team —
              clear, honest status, from pickup to delivery.
            </p>

            <form action="/tracking" className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
              <label htmlFor="hero-tracking-number" className="sr-only">
                Tracking number
              </label>
              <input
                id="hero-tracking-number"
                type="text"
                name="tracking_number"
                placeholder="Enter your tracking number (e.g. NAV-7K2P9QX1)"
                autoCapitalize="characters"
                className="w-full flex-1 rounded-xl border border-border bg-white px-4 py-2.5 text-navy placeholder:text-muted focus:border-accent focus:outline focus:outline-2 focus:outline-accent/40"
                required
              />
              <button type="submit" className="btn-accent justify-center whitespace-nowrap">
                <Search className="h-4 w-4" />
                Track Order
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <Reveal className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold text-navy">How It Works</h2>
          <p className="mt-2 text-muted">Three simple steps, from order to doorstep.</p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div className="card text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F59E0B]/10 text-[#F59E0B]">
              <Package className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-heading text-lg font-semibold">1. Order Placed</h3>
            <p className="mt-2 text-sm text-muted">We receive your order details and generate a unique tracking number.</p>
          </div>
          <div className="card text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#3B82F6]/10 text-[#3B82F6]">
              <Truck className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-heading text-lg font-semibold">2. We Update Your Status</h3>
            <p className="mt-2 text-sm text-muted">Our team logs every milestone as your shipment moves toward its destination.</p>
          </div>
          <div className="card text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#10B981]/10 text-[#10B981]">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-heading text-lg font-semibold">3. You Track Anytime</h3>
            <p className="mt-2 text-sm text-muted">Enter your tracking number anytime for a clear, up-to-date status.</p>
          </div>
        </div>
      </Reveal>

      {/* Why Choose Navisphere */}
      <Reveal className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="group relative order-2 min-h-[360px] overflow-hidden rounded-2xl shadow-md transition-shadow duration-300 hover:shadow-xl sm:min-h-[440px] lg:order-1 lg:min-h-[560px]">
              <Image
                src="/images/truck-highway.jpg"
                alt="Navisphere freight truck on the highway"
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="font-heading text-3xl font-bold text-navy">Why Choose Navisphere</h2>
              <p className="mt-3 text-muted">Built for businesses that need freight to arrive — and to know exactly where it is.</p>

              <div className="mt-8 space-y-6">
                {[
                  { icon: Radar, title: "Clear Status Updates", body: "Real, human-verified updates at every stage — no guesswork." },
                  { icon: ShieldCheck, title: "Secure Order Handling", body: "Every order is handled with care and verified by our operations team." },
                  { icon: Headset, title: "Dedicated Support", body: "A real team ready to help if a shipment needs attention." },
                  { icon: Globe, title: "Global Network", body: "Air, sea, and ground freight coverage spanning international markets." },
                ].map(({ icon: Icon, title, body }) => (
                  <div key={title} className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-navy">{title}</h3>
                      <p className="mt-1 text-sm text-muted">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Stats strip */}
      <section className="relative overflow-hidden py-20">
        <div className="bg-layer absolute inset-0">
          <Image src="/images/cargo-ship.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="bg-layer absolute inset-0">
          <Image src="/images/logistics-center.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="bg-layer absolute inset-0">
          <Image src="/images/rail-yard.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-navy/90" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 text-center sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { target: 120, suffix: "K+", label: "Orders Delivered" },
            { target: 40, suffix: "+", label: "Countries Served" },
            { target: 98, suffix: "%", label: "On-Time Delivery" },
            { target: 4.9, decimals: 1, suffix: "/5", label: "Customer Satisfaction" },
          ].map((stat, i) => (
            <Reveal key={stat.label} delay={i * 120}>
              <p className="font-heading text-3xl font-bold text-white sm:text-4xl">
                <Counter target={stat.target} decimals={stat.decimals} suffix={stat.suffix} />
              </p>
              <p className="mt-1 text-sm text-slate-300">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-navy">Ready to check on a shipment?</h2>
          <p className="mt-3 text-muted">Track an order in seconds, or reach out if you need help.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/tracking" className="btn-accent justify-center">
              <PackageSearch className="h-4 w-4" />
              Track an Order
            </Link>
            <Link href="/contact" className="btn-ghost justify-center">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

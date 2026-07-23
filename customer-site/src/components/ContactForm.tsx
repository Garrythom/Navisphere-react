"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Send } from "lucide-react";
import { submitContactMessage, type ContactFormState } from "@/app/contact/actions";

const initialState: ContactFormState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-accent mt-6 w-full justify-center sm:w-auto disabled:opacity-60">
      <Send className="h-4 w-4" />
      {pending ? "Sending…" : "Send Message"}
    </button>
  );
}

export default function ContactForm() {
  const [state, formAction] = useActionState(submitContactMessage, initialState);

  if (state.status === "sent") {
    return (
      <div className="card text-center">
        <h2 className="font-heading text-lg font-semibold text-navy">Message sent</h2>
        <p className="mt-2 text-sm text-muted">
          Thanks for reaching out — our team will get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <form action={formAction} noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="form-label mb-1.5 block text-sm font-medium text-navy">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your full name"
              required
              className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-navy placeholder:text-muted focus:border-accent focus:outline focus:outline-2 focus:outline-accent/40"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-navy">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-navy placeholder:text-muted focus:border-accent focus:outline focus:outline-2 focus:outline-accent/40"
            />
          </div>
        </div>
        <div className="mt-5">
          <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-navy">
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            placeholder="How can we help?"
            required
            className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-navy placeholder:text-muted focus:border-accent focus:outline focus:outline-2 focus:outline-accent/40"
          />
        </div>
        <div className="mt-5">
          <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-navy">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            placeholder="Tell us more..."
            required
            className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-navy placeholder:text-muted focus:border-accent focus:outline focus:outline-2 focus:outline-accent/40"
          />
        </div>
        {state.status === "error" && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {state.error}
          </p>
        )}
        <SubmitButton />
      </form>
    </div>
  );
}

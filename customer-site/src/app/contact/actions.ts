"use server";

import { Resend } from "resend";
import { supabase } from "@/lib/supabase";

export type ContactFormState = {
  status: "idle" | "error" | "sent";
  error?: string;
};

// TODO: switch back to support@navispherelogistics.com once Saifmail's DNS
// has propagated and that mailbox is confirmed receiving mail.
const NOTIFICATION_TO = "support.navispherelogistics@gmail.com";
const NOTIFICATION_FROM = "Navisphere Website <notifications@navispherelogistics.com>";

export async function submitContactMessage(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !subject || !message) {
    return { status: "error", error: "Please fill in every field." };
  }

  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    subject,
    message,
  });

  if (error) {
    return { status: "error", error: "Something went wrong sending your message. Please try again." };
  }

  // The message is already saved above, so it's always visible in the admin
  // dashboard regardless of this. Don't fail the customer's submission just
  // because the notification email had trouble sending.
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: NOTIFICATION_FROM,
        to: NOTIFICATION_TO,
        replyTo: email,
        subject: `New contact message: ${subject}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      });
    } catch {
      // Swallow — the message is already in the database either way.
    }
  }

  return { status: "sent" };
}

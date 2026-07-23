"use server";

import { supabase } from "@/lib/supabase";

export type ContactFormState = {
  status: "idle" | "error" | "sent";
  error?: string;
};

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

  return { status: "sent" };
}

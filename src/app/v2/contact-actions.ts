"use server";

import { INBOX, sendEmail } from "@/lib/email";

// Contact form → email to the Crosps inbox via Resend (https://resend.com/docs/api-reference/emails/send-email).
// RESEND_API_KEY lives in .env.local / Vercel env vars. The sender domain (eatcrosps.com)
// must be verified in Resend, or Resend rejects the send.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LABELS: Record<string, string> = {
  name: "Name",
  email: "Email",
  business: "Business name",
  business_type: "Type of business",
  city: "Town or city",
  volume: "Expected order size",
  website: "Website or Instagram",
  message: "Message",
};

export type ContactResult = { ok: true } | { ok: false; error: string };

export async function sendContact(data: Record<string, string>): Promise<ContactResult> {
  // Honeypot: real visitors never see or fill this field.
  if (data.company_url) return { ok: true };

  const name = data.name?.trim();
  const email = data.email?.trim();
  if (!name || !email || !EMAIL_RE.test(email)) return { ok: false, error: "Please add your name and a valid email address." };

  const stock = data.topic === "stock";
  const subject = stock ? `Stockist enquiry: ${data.business || name}` : `Website message from ${name}`;
  const text = Object.entries(LABELS)
    .filter(([k]) => data[k]?.trim())
    .map(([k, label]) => (k === "message" ? `\n${label}:\n${data[k].trim()}` : `${label}: ${data[k].trim()}`))
    .join("\n");

  const sent = await sendEmail({ to: INBOX, replyTo: email, subject, text });
  return sent ? { ok: true } : { ok: false, error: "fallback" };
}

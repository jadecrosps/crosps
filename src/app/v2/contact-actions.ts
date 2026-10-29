"use server";

// Contact form → email to the Crosps inbox via Resend (https://resend.com/docs/api-reference/emails/send-email).
// RESEND_API_KEY lives in .env.local / Vercel env vars. The sender domain (eatcrosps.com)
// must be verified in Resend, or Resend rejects the send.

const TO = "jade@eatcrosps.com";
const FROM = process.env.CONTACT_FROM ?? "Crosps website <website@eatcrosps.com>";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LABELS: Record<string, string> = {
  name: "Name",
  email: "Email",
  business: "Business name",
  business_type: "Type of business",
  city: "Town or city",
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

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("[contact] RESEND_API_KEY is not set");
    return { ok: false, error: "fallback" };
  }

  const stock = data.topic === "stock";
  const subject = stock ? `Stockist enquiry: ${data.business || name}` : `Website message from ${name}`;
  const text = Object.entries(LABELS)
    .filter(([k]) => data[k]?.trim())
    .map(([k, label]) => (k === "message" ? `\n${label}:\n${data[k].trim()}` : `${label}: ${data[k].trim()}`))
    .join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [TO], reply_to: email, subject, text: text.slice(0, 10000) }),
    });
    if (!res.ok) {
      console.error("[contact] Resend", res.status, await res.text());
      return { ok: false, error: "fallback" };
    }
    return { ok: true };
  } catch (err) {
    console.error("[contact]", err);
    return { ok: false, error: "fallback" };
  }
}

// Sends email through Resend (https://resend.com/docs/api-reference/emails/send-email).
// RESEND_API_KEY lives in .env.local / Vercel; eatcrosps.com is verified in Resend.

export const FROM = process.env.CONTACT_FROM ?? "Crosps website <website@eatcrosps.com>";
export const INBOX = "jade@eatcrosps.com";

export async function sendEmail({ to, subject, text, replyTo, from = FROM }: { to: string; subject: string; text: string; replyTo?: string; from?: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("[email] RESEND_API_KEY is not set");
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject, text: text.slice(0, 10000), ...(replyTo ? { reply_to: replyTo } : {}) }),
    });
    if (!res.ok) console.error("[email] Resend", res.status, await res.text());
    return res.ok;
  } catch (err) {
    console.error("[email]", err);
    return false;
  }
}

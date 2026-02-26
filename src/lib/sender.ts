const SENDER_API_BASE = "https://api.sender.net/v2";

function getHeaders(): HeadersInit {
  const token = process.env.SENDER_API_TOKEN;
  if (!token) throw new Error("SENDER_API_TOKEN is not configured");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

/**
 * Add a subscriber to the Sender.net mailing list.
 * Duplicate emails are treated as success (not an error).
 */
export async function addSubscriber(email: string) {
  const groupId = process.env.SENDER_GROUP_ID;
  if (!groupId) throw new Error("SENDER_GROUP_ID is not configured");

  const response = await fetch(`${SENDER_API_BASE}/subscribers`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      email,
      groups: [groupId],
      trigger_automation: false,
    }),
  });

  // Treat duplicate subscriber as success
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message =
      (body as Record<string, string>).message ?? `Sender API error: ${response.status}`;

    // "already exists" responses are not errors from the user's perspective
    if (response.status === 409 || /already exists/i.test(message)) {
      return { success: true, duplicate: true };
    }

    throw new Error(message);
  }

  return response.json();
}

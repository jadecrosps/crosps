// Shopify Admin API for the website's own Dev Dashboard app ("Crosps website (admin)"):
// read customers (to check the "trade" tag) and create draft orders for pallet requests.
// Access tokens come from the client credentials grant and last ~24 hours, so one is
// cached per server instance and refreshed shortly before it expires.
// https://shopify.dev/docs/apps/build/authentication-authorization/client-credentials-grant

const API_VERSION = "2025-01";

let cached: { token: string; expiresAt: number } | null = null;

export function shopifyAdminConfigured() {
  return !!(process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_CLIENT_ID && process.env.SHOPIFY_CLIENT_SECRET);
}

async function adminToken() {
  if (cached && Date.now() < cached.expiresAt) return cached.token;
  const res = await fetch(`https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.SHOPIFY_CLIENT_ID ?? "",
      client_secret: process.env.SHOPIFY_CLIENT_SECRET ?? "",
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Shopify admin token request failed: ${res.status}`);
  const { access_token, expires_in } = (await res.json()) as { access_token: string; expires_in?: number };
  // Refresh five minutes early; assume 24h if Shopify doesn't say.
  cached = { token: access_token, expiresAt: Date.now() + ((expires_in ?? 86400) - 300) * 1000 };
  return access_token;
}

export async function shopifyAdmin<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(`https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": await adminToken() },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (res.status === 401) cached = null; // token revoked or rotated: fetch a new one next time
  const json = (await res.json()) as { data?: T; errors?: unknown };
  if (!res.ok || json.errors || !json.data) throw new Error(`Shopify admin request failed: ${res.status} ${JSON.stringify(json.errors ?? "")}`);
  return json.data;
}

// Is this email an approved stockist (a customer tagged "trade" in Shopify)?
export async function findTradeCustomer(email: string) {
  const { customers } = await shopifyAdmin<{ customers: { nodes: { id: string; email: string; displayName: string; tags: string[] }[] } }>(
    `query TradeCustomer($q: String!) { customers(first: 5, query: $q) { nodes { id email displayName tags } } }`,
    { q: `email:${JSON.stringify(email)}` },
  );
  return customers.nodes.find((c) => c.email?.toLowerCase() === email.toLowerCase() && c.tags.includes("trade")) ?? null;
}

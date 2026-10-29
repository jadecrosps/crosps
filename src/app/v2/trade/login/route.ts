import { findTradeCustomer } from "@/lib/shopify-admin";
import { startTradeSession, verifyLinkToken } from "@/lib/trade-auth";

// The link in the login email lands here: check it, start a 30-day session, go to the order form.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const link = verifyLinkToken(url.searchParams.get("token") ?? undefined);
  const customer = link ? await findTradeCustomer(link.email).catch(() => null) : null;
  if (!link || !customer) return Response.redirect(new URL("/v2/trade?login=expired#login", url), 303);
  await startTradeSession({ ...link, name: customer.displayName || link.name });
  return Response.redirect(new URL("/v2/trade#order", url), 303);
}

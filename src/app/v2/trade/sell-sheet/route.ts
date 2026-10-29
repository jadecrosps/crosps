import { readFile } from "node:fs/promises";
import path from "node:path";
import { getTradeSession } from "@/lib/trade-auth";

// The sell sheet lives outside /public so only logged-in stockists can download it.
export async function GET(request: Request) {
  if (!(await getTradeSession())) return Response.redirect(new URL("/v2/trade#login", request.url), 303);
  const pdf = await readFile(path.join(process.cwd(), "trade-assets", "Crosps-Trade-Sell-Sheet.pdf"));
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Crosps-Trade-Sell-Sheet.pdf"',
      "Cache-Control": "private, no-store",
    },
  });
}

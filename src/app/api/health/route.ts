import { checkHealth } from "@/lib/strapi";

export async function GET() {
  const result = await checkHealth();
  return Response.json(result, { status: result.ok ? 200 : 503 });
}

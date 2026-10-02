import { ContactRequest, contactConfig, sendContactEmail } from "@/lib/contact";

export async function POST(request: Request) {
  const config = contactConfig(process.env);
  if (!config) {
    return Response.json({ error: "this form isn't set up yet." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid request." }, { status: 400 });
  }

  const parsed = ContactRequest.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "that doesn't look like an email." }, { status: 400 });
  }

  // Answer bots as if it worked so they don't adapt.
  if (parsed.data.website) return Response.json({ ok: true });

  try {
    await sendContactEmail(parsed.data.email, config);
  } catch (error) {
    console.error("[connect] send failed", error);
    return Response.json({ error: "couldn't send. try again?" }, { status: 502 });
  }

  return Response.json({ ok: true });
}

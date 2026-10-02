import { z } from "zod";

const ContactEmail = z.email().max(254);

export const ContactRequest = z.object({
  email: z.string().trim().pipe(ContactEmail),
  // Honeypot: hidden from people, filled in by naive bots.
  website: z.string().max(500).optional(),
});

export function isContactEmail(value: string): boolean {
  return ContactEmail.safeParse(value.trim()).success;
}

export type ContactConfig = { apiKey: string; to: string; from: string };

/** Reads the Resend settings, or null when any is missing. */
export function contactConfig(env: Record<string, string | undefined>): ContactConfig | null {
  const apiKey = env.RESEND_API_KEY;
  const to = env.CONTACT_TO;
  const from = env.CONTACT_FROM;
  return apiKey && to && from ? { apiKey, to, from } : null;
}

export async function sendContactEmail(
  email: string,
  config: ContactConfig,
  fetchImpl: typeof fetch = fetch,
): Promise<void> {
  const res = await fetchImpl("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: config.from,
      to: [config.to],
      reply_to: email,
      subject: `connect: ${email}`,
      text: `${email} wants to connect, via darkocejkov.ca/connect.`,
    }),
  });
  if (!res.ok) {
    throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
  }
}

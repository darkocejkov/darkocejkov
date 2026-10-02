import { describe, expect, it, vi } from "vitest";
import { ContactRequest, contactConfig, isContactEmail, sendContactEmail } from "./contact";

describe("isContactEmail", () => {
  it("accepts a plain address, ignoring surrounding space", () => {
    expect(isContactEmail(" email@example.com ")).toBe(true);
  });

  it("rejects partial and oversized input", () => {
    expect(isContactEmail("email@")).toBe(false);
    expect(isContactEmail("")).toBe(false);
    expect(isContactEmail(`${"a".repeat(250)}@example.com`)).toBe(false);
  });
});

describe("ContactRequest", () => {
  it("trims the email", () => {
    expect(ContactRequest.parse({ email: " a@b.co " }).email).toBe("a@b.co");
  });

  it("rejects a missing email", () => {
    expect(ContactRequest.safeParse({ website: "" }).success).toBe(false);
  });
});

describe("contactConfig", () => {
  it("needs every variable", () => {
    expect(contactConfig({ RESEND_API_KEY: "k", CONTACT_TO: "me@x.co" })).toBeNull();
    expect(contactConfig({ RESEND_API_KEY: "k", CONTACT_TO: "me@x.co", CONTACT_FROM: "site@x.co" })).toEqual({
      apiKey: "k",
      to: "me@x.co",
      from: "site@x.co",
    });
  });
});

describe("sendContactEmail", () => {
  const config = { apiKey: "key", to: "me@x.co", from: "site@x.co" };

  it("posts to Resend with the visitor as reply-to", async () => {
    const fetchImpl = vi.fn(async () => new Response("{}", { status: 200 }));
    await sendContactEmail("a@b.co", config, fetchImpl);

    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    expect(new Headers(init.headers).get("Authorization")).toBe("Bearer key");
    expect(JSON.parse(init.body as string)).toMatchObject({ to: ["me@x.co"], from: "site@x.co", reply_to: "a@b.co" });
  });

  it("throws when Resend refuses", async () => {
    const fetchImpl = vi.fn(async () => new Response("nope", { status: 422 }));
    await expect(sendContactEmail("a@b.co", config, fetchImpl)).rejects.toThrow("422");
  });
});

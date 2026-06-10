import type { Classification, EmailMessage } from "./types";

function firstName(fromName: string): string {
  const trimmed = fromName.trim();
  if (!trimmed || trimmed.toLowerCase().includes("unknown")) {
    return "there";
  }
  return trimmed.split(/\s+/)[0];
}

type Template = (email: EmailMessage, name: string) => string;

const TEMPLATES: Record<Classification, Template> = {
  lead: (_email, name) =>
    `Hi ${name},\n\nThanks for reaching out — we'd love to show you what the platform can do. I can walk you through pricing and onboarding on a quick call. Are you free for 30 minutes this week? Just share a couple of time windows and I'll send an invite.\n\nLooking forward to it,\nThe Team`,
  client_request: (_email, name) =>
    `Hi ${name},\n\nThanks for the details — this is clear. I've noted the requested change and will confirm whether it fits the current scope and timeline shortly. If it does, we'll get started right away; if not, I'll outline the options. I'll follow up before your deadline.\n\nBest,\nThe Team`,
  support: (_email, name) =>
    `Hi ${name},\n\nSorry for the trouble — thanks for flagging this. To help us reproduce the issue, could you confirm your app version and share a screenshot or the steps right before it happens? In the meantime, please try restarting the app. We'll prioritize getting you unblocked.\n\nThanks,\nSupport Team`,
  billing: (_email, name) =>
    `Hi ${name},\n\nThanks for letting us know. I'm looking into this billing item now and will make sure any error is corrected. To resolve it quickly, please confirm the invoice number and the account email on file. We'll follow up with the outcome and any adjustment.\n\nBest,\nBilling Team`,
  spam: () =>
    `[No reply recommended] This message was flagged as spam. Marking for review keeps it out of active queues. No response will be sent unless manually approved.`,
  needs_review: (_email, name) =>
    `Hi ${name},\n\nThanks for getting in touch. I want to make sure this reaches the right person — could you share a little more detail about what you're looking for? I'll route it accordingly and get back to you.\n\nBest,\nThe Team`,
};

export function generateDraftReply(
  email: EmailMessage,
  classification: Classification,
): string {
  return TEMPLATES[classification](email, firstName(email.fromName));
}

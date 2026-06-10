import type { EmailMessage } from "./types";

const HOUR = 60 * 60 * 1000;
const base = Date.UTC(2026, 5, 10, 14, 0, 0);

function at(hoursAgo: number): string {
  return new Date(base - hoursAgo * HOUR).toISOString();
}

export const MOCK_EMAILS: EmailMessage[] = [
  {
    id: "eml_001",
    fromName: "Dana Whitfield",
    fromAddress: "dana@northstar-ventures.com",
    subject: "Interested in a demo for our 40-person team",
    body: "Hi there,\n\nWe came across your platform and I'd love to learn more. We're evaluating tools for our operations team (about 40 people) and want to understand pricing and onboarding. Could we book a call this week?\n\nThanks,\nDana",
    receivedAt: at(1),
  },
  {
    id: "eml_002",
    fromName: "Marcus Bell",
    fromAddress: "marcus.bell@acme-corp.com",
    subject: "Need the Q2 report layout changed before Friday",
    body: "Hello,\n\nAs discussed in our last call, can your team adjust the Q2 dashboard to group revenue by region? We need this finalized before our board meeting on Friday. Let me know if the current scope covers it.\n\nBest,\nMarcus",
    receivedAt: at(3),
  },
  {
    id: "eml_003",
    fromName: "Priya Nair",
    fromAddress: "priya@gmail.com",
    subject: "App keeps crashing when I export a PDF",
    body: "Hi support,\n\nEvery time I try to export my project to PDF the app freezes and then closes. I'm on the latest version, Windows 11. This is blocking my work. Can you help?\n\nThanks,\nPriya",
    receivedAt: at(5),
  },
  {
    id: "eml_004",
    fromName: "Billing Notifications",
    fromAddress: "invoices@stripe.com",
    subject: "Your invoice #INV-2291 payment failed",
    body: "Hello,\n\nWe were unable to process the payment for invoice INV-2291 ($249.00). Your card was declined. Please update your payment method to avoid service interruption. You can review the charge in your billing portal.\n\nStripe Billing",
    receivedAt: at(8),
  },
  {
    id: "eml_005",
    fromName: "Crypto Rewards",
    fromAddress: "winner@luckydraw-promo.biz",
    subject: "Congratulations!!! You won a $1000 gift card",
    body: "URGENT: You have been selected as our lucky winner! Click here now to claim your FREE $1000 gift card before it expires. Limited time offer, act fast!!! 100% guaranteed.",
    receivedAt: at(11),
  },
  {
    id: "eml_006",
    fromName: "Tomoko Sato",
    fromAddress: "t.sato@meridian-labs.io",
    subject: "Quote request and a billing question",
    body: "Hi,\n\nTwo things. First, we'd like a quote for the enterprise plan for 12 seats. Second, I noticed last month's invoice charged us for 15 seats but we only have 10 active users. Could someone look into both?\n\nRegards,\nTomoko",
    receivedAt: at(14),
  },
  {
    id: "eml_007",
    fromName: "Liam O'Connor",
    fromAddress: "liam@brightfold.studio",
    subject: "Following up on our proposal",
    body: "Hey,\n\nJust circling back on the proposal you sent. We're keen to move forward and would like to discuss next steps and a start date. What does your availability look like next week?\n\nCheers,\nLiam",
    receivedAt: at(20),
  },
  {
    id: "eml_008",
    fromName: "Unknown Sender",
    fromAddress: "no-reply@random-mailer.net",
    subject: "re: re: fwd: quick question",
    body: "Hi.\n\nSaw your site. Wanted to reach out. Let me know.\n\nThanks",
    receivedAt: at(26),
  },
];

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "refund" | "process" | "support" | "general";
}

export const faqData: FAQItem[] = [
  {
    id: "when-refund",
    question: "When will I receive my refund?",
    answer:
      "Refunds are being processed on a rolling basis. There is no fixed payment schedule or guaranteed completion date, but every approved request will be honored. You can check the status of your request anytime using your confirmation number on our Status page. Refunds are sent via Zelle (US) or Wise (international) to the contact information you provided.",
    category: "refund",
  },
  {
    id: "chargeback",
    question: "What if I already filed a chargeback?",
    answer:
      "If you've already filed a chargeback with your credit card company or bank, you are not eligible for a refund through our system, as the chargeback process handles your refund directly. If your chargeback is still pending or was denied, please contact us on Facebook to discuss your situation. We want to make sure everyone is taken care of.",
    category: "refund",
  },
  {
    id: "partial-refund",
    question: "Can I choose a partial refund?",
    answer:
      "Yes! During the refund request process, you can choose between a full refund (100% of your ticket purchase), a partial refund (any amount from $1 to your full purchase price), or waiving your refund entirely as a gesture of support. Whatever you choose, we're grateful for your understanding.",
    category: "refund",
  },
  {
    id: "check-status",
    question: "How do I check the status of my refund request?",
    answer:
      "After submitting your refund request, you'll receive a confirmation number (e.g., RR-0001). Go to our Status page and enter your confirmation number along with your email address to see the current status of your request. You can also bookmark the direct link that includes your confirmation number.",
    category: "process",
  },
  {
    id: "contact-us",
    question: "How can I contact you if I have questions?",
    answer:
      "The best way to reach us is through our Facebook page (Neo Kizomba Festival). We're monitoring messages regularly and will respond as quickly as possible. Please include your confirmation number (if you have one) and email address in your message to help us assist you faster.",
    category: "general",
  },
  {
    id: "zelle-wise",
    question: "How will I receive my refund?",
    answer:
      "Refunds are sent via Zelle for US-based pass holders and Wise for international pass holders. Zelle is available through most major US banks using your email or phone number. Wise transfers are sent to your email address. Both methods are secure and fee-free on your end. During the refund request process, you'll provide the contact information for your preferred method.",
    category: "refund",
  },
  {
    id: "donate-support",
    question: "How can I support the festival if I want to donate?",
    answer:
      "We deeply appreciate your generosity! If you're a pass holder, you can waive your refund during the request process. After waiving, you'll also have the option to make an additional donation if you'd like to go above and beyond. If you don't have a pass but want to support us, visit our Support page to make a donation. Every contribution helps us close this chapter responsibly.",
    category: "support",
  },
  {
    id: "email-not-found",
    question: "What if my email isn't found in the system?",
    answer:
      "If the email you entered isn't found, it might be registered under a different email address than the one you used to purchase your ticket. Try any other email addresses you may have used. If you're still having trouble, please contact us on Facebook with your name, the email you believe you used, and any purchase confirmation you may have.",
    category: "process",
  },
  {
    id: "waive-refund",
    question: "What happens if I waive my refund?",
    answer:
      "If you choose to waive your refund, the amount you paid for your pass will help us cover the costs of the closure process, including processing other refunds, final operational expenses, and any outstanding obligations. After waiving, you'll also have the option to make an additional donation if you'd like. Your generosity is deeply appreciated and helps us close this chapter responsibly. You'll still receive a confirmation and can track your submission.",
    category: "refund",
  },
  {
    id: "multiple-tickets",
    question: "I bought multiple tickets. How do I request refunds?",
    answer:
      "If you purchased multiple tickets under the same email address, our system should show your total purchase amount. If you purchased tickets under different email addresses or in separate transactions, you'll need to submit a separate refund request for each purchase. Contact us on Facebook if you need help consolidating your requests.",
    category: "process",
  },
  {
    id: "why-so-long",
    question: "Why did it take so long to hear from you?",
    answer:
      "The months between the cancellation and this letter were some of the hardest of my life. Between the anxiety, panic attacks, and the weight of everything that led to this point, I needed time to get to a place where I could show up and handle this the right way. Responding before I was ready would have put me in a place I wasn't sure I could come back from. I understand the frustration, and I'm sorry for the silence. The full story is shared on the Choosing Myself page.",
    category: "general",
  },
  {
    id: "full-letter",
    question: "Where can I read the full story?",
    answer:
      "The full letter, \"Choosing Myself,\" is available on our website. It covers the full 10-year journey of the festival, what led to the cancellation, how refunds are being handled, and what comes next. You can read it at the Choosing Myself page linked from the homepage.",
    category: "general",
  },
];

export const faqCategories = [
  { value: "all", label: "All Questions" },
  { value: "refund", label: "Refunds" },
  { value: "process", label: "Process" },
  { value: "support", label: "Support" },
  { value: "general", label: "General" },
];

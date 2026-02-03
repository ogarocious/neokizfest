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
      "We are processing refunds as quickly as possible. Most refunds are completed within 2-4 weeks of submission. You can check the status of your request anytime using your confirmation number on our Status page. We'll send refunds via Zelle to the contact information you provided.",
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
    id: "shirt-no-ticket",
    question: "Can I get a commemorative shirt if I didn't have a ticket?",
    answer:
      "Absolutely! Our commemorative t-shirts are available to everyone who wants to support us or keep a memory of Neo Kizomba Festival. Visit our Support page to purchase a shirt directly. The shirts are $45 each and come in sizes S through 2XL.",
    category: "support",
  },
  {
    id: "check-status",
    question: "How do I check the status of my refund request?",
    answer:
      "After submitting your refund request, you'll receive a confirmation number (e.g., NKF-REF-000123). Go to our Status page and enter your confirmation number along with your email address to see the current status of your request. You can also bookmark the direct link that includes your confirmation number.",
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
    id: "zelle-only",
    question: "Why do you only accept Zelle for refunds?",
    answer:
      "Zelle allows us to send refunds quickly, securely, and without fees. It's widely available through most major US banks. If you don't have Zelle set up, it's easy to register through your bank's app using your email or phone number. If you absolutely cannot use Zelle, please contact us on Facebook to discuss alternatives.",
    category: "refund",
  },
  {
    id: "shirt-deduction",
    question: "How does the shirt purchase work with my refund?",
    answer:
      "If you're receiving a refund and want to purchase a commemorative t-shirt ($45 each), the cost will be deducted from your refund amount. For example, if your refund is $150 and you order one shirt, you'll receive $105. If you're waiving your refund, you can still order shirts, but they'll need to be purchased separately.",
    category: "support",
  },
  {
    id: "us-shipping",
    question: "Do you ship internationally?",
    answer:
      "Unfortunately, we can only ship commemorative t-shirts to addresses within the United States at this time. International shipping logistics and costs make it impractical for us to offer during the closure process. We apologize for any inconvenience.",
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
      "If you choose to waive your refund, the amount you paid for your ticket will help us cover the costs of the closure process, including processing other refunds, final operational expenses, and any outstanding obligations. Your generosity is deeply appreciated and helps us close this chapter responsibly. You'll still receive a confirmation and can track your submission.",
    category: "refund",
  },
  {
    id: "multiple-tickets",
    question: "I bought multiple tickets. How do I request refunds?",
    answer:
      "If you purchased multiple tickets under the same email address, our system should show your total purchase amount. If you purchased tickets under different email addresses or in separate transactions, you'll need to submit a separate refund request for each purchase. Contact us on Facebook if you need help consolidating your requests.",
    category: "process",
  },
];

export const faqCategories = [
  { value: "all", label: "All Questions" },
  { value: "refund", label: "Refunds" },
  { value: "process", label: "Process" },
  { value: "support", label: "Support & Shirts" },
  { value: "general", label: "General" },
];

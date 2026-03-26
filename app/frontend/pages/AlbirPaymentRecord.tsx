import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import {
  Stack,
  Title,
  Text,
  Group,
  Box,
  Badge,
  Modal,
  Image,
  Divider,
  Table,
  SimpleGrid,
} from "@mantine/core";
import { IconCalendar, IconFileText, IconExternalLink } from "@tabler/icons-react";
import { Link } from "@inertiajs/react";
import FarewellLayout from "../components/farewell/FarewellLayout";
import { GlassCard, BackToHome, ArticleMeta } from "../components/shared";
import { colors, responsiveText } from "../styles/theme";

// ─── Constants ──────────────────────────────────────────────

const PAGE_URL = "https://neokizfest.com/albir-payment-record";

// ─── Timeline Data ───────────────────────────────────────────

type EventHighlight = "positive" | "neutral" | "negative" | "payment" | "warning";

interface EmailExhibit {
  from: string;
  to: string;
  date: string;
  subject: string;
  points: string[];
  closing: string;
  signature: string;
}

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  imageFile: string;
  imageCaption: string;
  highlight: EventHighlight;
  src?: string;
  emailExhibit?: EmailExhibit;
}

const TIMELINE: TimelineEvent[] = [
  {
    date: "July 2022",
    title: "NeoKiz 2022 Festival Takes Place",
    description:
      "Albir Rojas performs at NeoKiz 2022 in Austin, TX. A rate sheet was provided listing services and fees — but no payment information of any kind. Also present: Lucas Nuance, who managed Albir's on-site sound check and acted as a liaison for DJ Art throughout the weekend. Multiple incidents involving Lucas were documented by staff during the event. Charles formally summarized these in a letter to DJ Art's management the following year.",
    imageFile: "albir_rate_sheet.jpg",
    imageCaption: "Albir Rojas rate sheet — NeoKiz 2022",
    highlight: "neutral",
    src: "/images/case/albir_rate_sheet.jpg",
    emailExhibit: {
      from: "Charles Ogar",
      to: "Management DJ Art Music",
      date: "July 3, 2023, 10:48 PM",
      subject: "Summary of Neokiz 2022 Interactions and Future Engagement Considerations",
      points: [
        "Lucas requested a staff pass from volunteers at the registration table, and subsequently from Sarah when flagged by the volunteers. This was for access to backstage and food; however, our records indicate this wasn't part of the original contracted agreement. Lucas was notified of this discrepancy and was not provided a wristband.",
        "We noted a rather terse interaction between Lucas and our volunteers at the registration table, which resulted in Sarah's intervention. The discussion revolved around the sound check for JP & Stephy while Lucas was managing the sound check for Albir during the same class time slot. As per our records, the staff had not requested additional assistance with sound, as other artists were already assigned for sound management.",
        "In the DJ area, while Lucas was acting as a \"liaison\" during your set, we received feedback from attendees expressing concerns that someone might be interfering with the DJs.",
        "There were noticeable discrepancies in Lucas's communication regarding DJ slot changes on Sunday night. In his conversation with Yelena, Lucas was insistent, even to the point of belligerence, that your contract precluded you from doing the opening slot — however, after reviewing the contract with Charles, we found no such stipulation. On the other hand, his conversation with Charles was quite congenial and accommodating, citing short notice and family plans as the reason for the slot conflict.",
      ],
      closing:
        "These instances had collectively played a significant role in our decision not to hire you for Neokiz 2023. It is with sincere regret that we made this decision; however, we would be open to discussions about future engagements, provided we can reach a mutual understanding to ensure such instances are not repeated.",
      signature: "Charles Ogar & Sarah Throop",
    },
  },
  {
    date: "August 2, 2022",
    title: "Charles Proactively Reaches Out",
    description:
      "Charles messages Albir first — unprompted — to explain a hotel accounting delay and begin the payment process. This is the first settlement attempt, initiated entirely by Charles.",
    imageFile: "whatsapp_aug2_2022.jpg",
    imageCaption: "WhatsApp — Charles proactively contacts Albir, Aug 2, 2022",
    highlight: "positive",
    src: "/images/case/whatsapp_aug2_2022.jpg",
  },
  {
    date: "August 5, 2022",
    title: "Charles Promotes Albir Publicly — While Trying to Pay Him",
    description:
      "Three days after proactively reaching out about payment, Charles shares Albir's podcast episode to the NeoKiz Facebook audience: \"If you interested to hearing more about Albir, check out this podcast I did with him a few years ago!\" The podcast was originally recorded in August 2016 — a six-year relationship before the 2022 festival. Charles was publicly supporting Albir's brand at the same moment he was privately trying to settle his debt.",
    imageFile: "facebook_aug5_2022.jpg",
    imageCaption: "NeoKiz Facebook post promoting Albir Rojas podcast, August 5, 2022",
    highlight: "positive",
    src: "/images/case/facebook_aug5_2022.jpg",
  },
  {
    date: "August 8, 2022",
    title: "Albir: \"No Problem, I Can Wait\"",
    description:
      "Albir responds warmly. The relationship is positive and forward-looking. No urgency expressed, no payment details provided.",
    imageFile: "whatsapp_aug8_2022.jpg",
    imageCaption: "WhatsApp — Albir responds, Aug 8, 2022",
    highlight: "positive",
    src: "/images/case/whatsapp_aug8_2022.jpg",
  },
  {
    date: "August 17, 2022",
    title: "Charles Shows Albir the Accounting Paper Trail",
    description:
      "Charles shares internal email correspondence with Albir directly — forwarding a thread with Gayla and the NeoKiz team confirming that the hotel accounting department had still not provided a full financial breakdown. This was the documented reason the payment had not yet been sent. The delay was real, traceable, and shared transparently.",
    imageFile: "whatsapp_aug17_2022_accounting.jpg",
    imageCaption: "WhatsApp — Charles forwards internal accounting emails to Albir, Aug 17, 2022",
    highlight: "positive",
    src: "/images/case/whatsapp_aug17_2022_accounting.jpg",
  },
  {
    date: "November 11, 2022",
    title: "Charles Explains: His Father Passed Away",
    description:
      "Charles breaks a period of silence with a painful explanation — his father died the previous month. Albir responds with sympathy and understanding.",
    imageFile: "whatsapp_nov11_2022.jpg",
    imageCaption: "WhatsApp — Charles shares his father's passing, Nov 11, 2022",
    highlight: "neutral",
    src: "/images/case/whatsapp_nov11_2022.jpg",
  },
  {
    date: "November – December 2022",
    title: "Charles Follows Up Repeatedly. Only Auto-Reply Responds.",
    description:
      "Charles continues reaching out multiple times to settle payment. He receives only Albir's automated reply. No payment details are provided.",
    imageFile: "whatsapp_nov_dec_2022.jpg",
    imageCaption: "WhatsApp — follow-up attempts, Nov–Dec 2022",
    highlight: "negative",
    src: "/images/case/whatsapp_nov_dec_2022.jpg",
  },
  {
    date: "January – February 2023",
    title: "Charles Continues Reaching Out",
    description:
      "Into the new year, Charles keeps attempting to settle. No payment method, bank account, or PayPal details are ever received from Albir.",
    imageFile: "whatsapp_jan_feb_2023.jpg",
    imageCaption: "WhatsApp — continued outreach, Jan–Feb 2023",
    highlight: "negative",
    src: "/images/case/whatsapp_jan_feb_2023.jpg",
  },
  {
    date: "September 17, 2023",
    title: "Albir: \"You Haven't Said Anything About the Payment\"",
    description:
      "Over a year after the festival, Albir sends a long message saying he was \"upset\" that Charles asked about future bookings without addressing last year's payment. He writes: \"After one year you haven't say anything about the payment knowing that this is my full time job. I came to your festival and I did my job in a professional way.\" What the message does not address: Charles had been reaching out repeatedly since August 2022. Albir's auto-reply had been the only response.",
    imageFile: "whatsapp_sep17_2023.jpg",
    imageCaption: "WhatsApp — Albir's \"I was upset\" message, Sep 17, 2023",
    highlight: "warning",
    src: "/images/case/whatsapp_sep17_2023.jpg",
  },
  {
    date: "September 17, 2023",
    title: "Charles Replies: \"Getting in Communication With You Is Not the Easiest Task\"",
    description:
      "Charles responds to Albir's message by forwarding the November and December 2022 messages he had already sent — evidence that he had been trying to reach Albir for months. His reply: \"Getting in communication with you is not the easiest task hermano. From my perspective, I was trying to use the limited window of your attention to address both subjects.\"",
    imageFile: "whatsapp_sep17_2023_reply.jpg",
    imageCaption: "WhatsApp — Charles's reply forwarding prior outreach, Sep 17, 2023",
    highlight: "neutral",
    src: "/images/case/whatsapp_sep17_2023_reply.jpg",
  },
  {
    date: "September 17, 2023",
    title: "Albir: \"I'm Not That Good in Communication\"",
    description:
      "In the same exchange, Albir responds to Charles pointing out how difficult it has been to reach him — and agrees: \"Ok bro, understand. And accept that, I'm not that good in communication, im working hard on that. Getting better but little by little.\" In his own words, on the same day he accused Charles of disrespecting his work.",
    imageFile: "whatsapp_sep17_2023_albir_admits.jpg",
    imageCaption: "WhatsApp — Albir acknowledges his communication problems, Sep 17, 2023",
    highlight: "neutral",
    src: "/images/case/whatsapp_sep17_2023_albir_admits.jpg",
  },
  {
    date: "September 18, 2023",
    title: "\"Do You Have a Bank Account or PayPal?\"",
    description:
      "Over 14 months after the festival, Charles asks directly: \"Do you have a bank account or PayPal? We never received how to pay you.\"",
    imageFile: "whatsapp_sep18_2023.jpg",
    imageCaption: "WhatsApp — Charles asks directly for payment info, Sep 18, 2023",
    highlight: "neutral",
    src: "/images/case/whatsapp_sep18_2023.jpg",
  },
  {
    date: "September 19, 2023",
    title: "Albir: \"PayPal Es Bueno\" — Still No Details",
    description:
      "Albir replies that PayPal works. Still no email address or actual payment details provided.",
    imageFile: "whatsapp_sep19_2023.jpg",
    imageCaption: "WhatsApp — Albir acknowledges PayPal, Sep 19, 2023",
    highlight: "negative",
    src: "/images/case/whatsapp_sep19_2023.jpg",
  },
  {
    date: "March 17, 2024",
    title: "Albir Finally Provides His PayPal Email",
    description:
      "Nearly 20 months after the festival, Albir sends his PayPal address. His own words: \"Sorry not to give you my PayPal info before. Thank you for reminding.\"",
    imageFile: "whatsapp_mar17_2024.jpg",
    imageCaption: "WhatsApp — Albir provides PayPal info, Mar 17, 2024",
    highlight: "positive",
    src: "/images/case/whatsapp_mar17_2024.jpg",
  },
  {
    date: "June 8, 2024",
    title: "Payment 1 Sent: €440.30",
    description:
      "Charles sends €440.30 via PayPal to albirkizomba@gmail.com. Memo: \"Parte número 1 del pago\"",
    imageFile: "paypal_receipt_1.jpg",
    imageCaption: "PayPal receipt — €440.30, June 8, 2024",
    highlight: "payment",
    src: "/images/case/paypal_receipt_1.jpg",
  },
  {
    date: "June 25, 2024",
    title: "Payment 2 Sent: €1,000. Account Settled.",
    description:
      "Charles sends the remaining €1,000 via PayPal. Memo: \"Pago 2/2, final Neokiz 2022\". Total paid: €1,440.30. The account is settled in full.",
    imageFile: "paypal_receipt_2.jpg",
    imageCaption: "PayPal receipt — €1,000, June 25, 2024",
    highlight: "payment",
    src: "/images/case/paypal_receipt_2.jpg",
  },
  {
    date: "After June 2024",
    title: "Lucas Nuance Claims €1,500 Still Owed",
    description:
      "Lucas Nuance — described as Albir's North America booking manager — contacts Charles via Instagram DM claiming €1,500 is still outstanding. Full payment had already been made.",
    imageFile: "lucas_instagram_dm.jpg",
    imageCaption: "Instagram DM — Lucas Nuance claims outstanding balance",
    highlight: "warning",
    src: "/images/case/lucas_instagram_dm.jpg",
  },
  {
    date: "February 9, 2026",
    title: "\"The Dance-Stein Files: Volume 1\" Published",
    description:
      "Lucas Nuance publishes a public document falsely claiming Charles owes thousands — grouping his name alongside individuals accused of sexual assault and fraud. Published 19 months after full payment was made. This publication triggers Charles's private outreach to Albir.",
    imageFile: "dance_stein_files.jpg",
    imageCaption: "The Dance-Stein Files: Volume 1 — published Feb 9, 2026",
    highlight: "warning",
    src: "/images/case/dance_stein_files.jpg",
  },
  {
    date: "February 16, 2026",
    title: "Charles Contacts Albir Privately — Before Going Public",
    description:
      "Before making anything public, Charles contacts Albir directly with full documentation. He asks direct questions and gives Albir every opportunity to correct the record privately.",
    imageFile: "whatsapp_feb16_2025.jpg",
    imageCaption: "WhatsApp — Charles private outreach, Feb 16, 2026",
    highlight: "neutral",
    src: "/images/case/whatsapp_feb16_2025.jpg",
  },
  {
    date: "February 23 – March 11, 2026",
    title: "Albir Suggests a Call. Never Follows Through.",
    description:
      "After Albir suggests a video call, Charles follows up three times over three weeks: Feb 25 asking for available times, Mar 4 asking about the weekend, Mar 11 just staying in touch. Albir acknowledges the time zone difference (he's in Bali) but never proposes a time. No call ever happens. No clarification is ever offered.",
    imageFile: "whatsapp_mar2025.jpg",
    imageCaption: "WhatsApp — Charles's three unanswered scheduling attempts, Feb 25–Mar 11, 2026",
    highlight: "negative",
    src: "/images/case/whatsapp_mar2025.jpg",
  },
];

const QUESTIONS = [
  `You said in your own words, "Sorry not to give you my PayPal info before." So why is the story going around that I never paid you?`,
  `Was withholding your payment information intentional? Because the pattern is hard to ignore: you performed at NeoKiz 2022 and provided no way to pay you. For nearly two years, every attempt to get your payment details was met with silence or an auto-reply. Then — finally — you provided your PayPal. I paid you in full within three months. And then, less than a year later, Lucas published a document claiming I owe you money. And now, nearly two years after that payment was made, the accusations are surfacing again. Was any part of this coordinated? Did you and Lucas plan to withhold payment details, wait for a debt narrative to build, leverage it publicly — and then keep leveraging it, even after the debt was settled in full?`,
  "Your rate sheet listed every price in detail. Why was there no payment information on it?",
  "Lucas Nuance was managing your sound check on-site at NeoKiz 2022 — the same festival where you never provided payment details. He was also documented by our staff as causing multiple incidents that weekend. Then, over a year after I paid you in full, he contacted me claiming you were owed money. What is your relationship with Lucas, and was that contact coordinated?",
  "Did you authorize Lucas to contact me claiming outstanding debt after I had already paid you in full?",
  `Did you authorize Lucas to publish "The Dance-Stein Files" using your name and our situation?`,
  "You were my first kizomba private lesson. I looked up to you. Is this how you treat someone who brought you to their festival, paid you, and respected you?",
  "I tried to resolve this privately in February 2026. You suggested a call and then went silent again. Why?",
  "One post from you clarifying the facts would end this. So why hasn't that happened?",
  "What are you going to do about what is being said and done in your name?",
];

// ─── Helpers ─────────────────────────────────────────────────

function dotColor(highlight: EventHighlight): string {
  switch (highlight) {
    case "positive":
      return "rgba(34, 139, 34, 0.8)";
    case "payment":
      return colors.primary;
    case "warning":
      return "#CC4444";
    case "negative":
      return "rgba(180, 180, 180, 0.4)";
    default:
      return "rgba(255, 255, 255, 0.25)";
  }
}

// ─── Evidence Slot ───────────────────────────────────────────

interface EvidenceSlotProps {
  filename: string;
  caption: string;
  src?: string;
}

const EvidenceSlot: React.FC<EvidenceSlotProps> = ({ filename, caption, src }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box
        mt="sm"
        onClick={src ? () => setOpen(true) : undefined}
        style={{
          background: "rgba(255, 255, 255, 0.015)",
          border: "1px dashed rgba(255, 255, 255, 0.1)",
          borderRadius: 8,
          padding: 12,
          cursor: src ? "pointer" : "default",
        }}
      >
        <Group justify="space-between" mb={src ? 8 : 6} wrap="nowrap">
          <Badge
            size="xs"
            style={{
              background: "rgba(244, 93, 0, 0.12)",
              border: "1px solid rgba(244, 93, 0, 0.25)",
              color: colors.primary,
              flexShrink: 0,
            }}
          >
            Evidence
          </Badge>
          <Text
            style={{
              fontSize: responsiveText.xs,
              fontFamily: "monospace",
              color: colors.textDim,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {filename}
          </Text>
        </Group>
        {src ? (
          <Image src={src} alt={caption} radius="sm" />
        ) : (
          <Text
            ta="center"
            py="sm"
            style={{ fontSize: responsiveText.small, fontStyle: "italic", color: colors.textDim }}
          >
            {caption}
          </Text>
        )}
      </Box>

      {src && (
        <Modal
          opened={open}
          onClose={() => setOpen(false)}
          title={caption}
          size="xl"
          centered
          styles={{
            header: {
              background: "rgba(20, 20, 20, 0.98)",
              borderBottom: "1px solid rgba(244, 93, 0, 0.15)",
            },
            title: {
              color: colors.textPrimary,
              fontWeight: 600,
              fontSize: responsiveText.small,
            },
            body: { background: "rgba(20, 20, 20, 0.98)", padding: 16 },
            content: {
              background: "rgba(20, 20, 20, 0.98)",
              border: "1px solid rgba(244, 93, 0, 0.2)",
            },
            close: { color: colors.textMuted },
          }}
        >
          <Image src={src} alt={caption} radius="sm" fit="contain" />
        </Modal>
      )}
    </>
  );
};

// ─── Main Page ───────────────────────────────────────────────

const AlbirPaymentRecord: React.FC = () => {
  return (
    <>
      <Head title="NeoKiz 2022 Payment Record — Charles Ogar">
        <meta
          name="description"
          content="Albir Rojas was paid in full — €1,440.30 via PayPal in June 2024. This is the documented timeline, with receipts, of why it took 20 months — and who is responsible for that delay."
        />
        <meta property="og:title" content="NeoKiz 2022 Payment Record — Charles Ogar" />
        <meta
          property="og:description"
          content="Albir Rojas was paid in full — €1,440.30 via PayPal in June 2024. This is the documented timeline, with receipts, of why it took 20 months — and who is responsible for that delay."
        />
        <meta property="og:url" content={PAGE_URL} />
        <style>{`
          @media print {
            body, [data-mantine-color-scheme] {
              background: #ffffff !important;
              color: #111111 !important;
            }
            .no-print { display: none !important; }
            a { color: #111111 !important; text-decoration: underline; }
            img { max-width: 100% !important; page-break-inside: avoid; }
          }
        `}</style>
      </Head>

      <FarewellLayout>
        <Stack
          gap="xl"
          maw={860}
          mx="auto"
          px={{ base: "sm", sm: "md" }}
          style={{ maxWidth: "100%" }}
        >
          {/* ── Section 1: Header ───────────────────────────── */}
          <GlassCard variant="accent" p={{ base: "md", sm: "xl" }}>
            <Stack gap="xs">
                <Group gap="xs">
                  <Badge
                    size="sm"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: colors.textMuted,
                    }}
                  >
                    Public Record
                  </Badge>
                  <Badge
                    size="sm"
                    style={{
                      background: "rgba(244, 93, 0, 0.1)",
                      border: "1px solid rgba(244, 93, 0, 0.25)",
                      color: colors.primary,
                    }}
                  >
                    Case File
                  </Badge>
                  <Badge
                    size="sm"
                    style={{
                      background: "rgba(100, 160, 255, 0.08)",
                      border: "1px solid rgba(100, 160, 255, 0.2)",
                      color: "rgba(130, 180, 255, 0.8)",
                    }}
                  >
                    Part of a Series
                  </Badge>
                </Group>

                <Title
                  order={1}
                  c={colors.textPrimary}
                  style={{ fontSize: responsiveText.pageTitle, lineHeight: 1.2 }}
                >
                  Setting the Record Straight
                </Title>

                <Title
                  order={2}
                  fw={400}
                  c={colors.textMuted}
                  style={{ fontSize: responsiveText.sectionTitle }}
                >
                  NeoKiz 2022 Artist Payment — The Full Record
                </Title>

                <Group gap="xs" mt={4}>
                  <IconCalendar size={13} color={colors.textDim} />
                  <Text style={{ fontSize: responsiveText.xs, color: colors.textDim }}>
                    Published:{" "}
                    <span style={{ color: colors.textMuted }}>March 26, 2026</span>
                  </Text>
                </Group>

                <Text
                  mt="sm"
                  c={colors.textSecondary}
                  style={{ fontSize: responsiveText.small, lineHeight: 1.75 }}
                >
                  This page exists because a false narrative is circulating publicly about an
                  unpaid artist at NeoKiz 2022. The payment was made in full — €1,440.30 — to
                  Albir Rojas via PayPal in two installments in June 2024. The delay was not
                  avoidance. It was a direct result of the artist failing to provide payment
                  details for nearly 20 months. This is the documented record, in sequence, with
                  evidence.
                </Text>

                <Text
                  mt="xs"
                  c={colors.textSecondary}
                  style={{ fontSize: responsiveText.small, lineHeight: 1.75 }}
                >
                  This case is one in a series. Multiple artists have made public claims of
                  non-payment against NeoKiz — none with supporting documentation. In response,
                  every festival edition is being reviewed and every artist payment is being
                  documented with receipts. That full record lives at{" "}
                  <Link
                    href="/artist-payments"
                    style={{ color: colors.primary, textDecoration: "none" }}
                  >
                    neokizfest.com/artist-payments
                  </Link>
                  .
                </Text>

                <Text
                  mt="xs"
                  c={colors.textSecondary}
                  style={{ fontSize: responsiveText.small, lineHeight: 1.75 }}
                >
                  For context on who is making these claims: as of March 2026, NeoKizFest is
                  75% through a fully public, documented refund process — one that has returned
                  money to over 140 ticket holders with receipts, confirmations, and a live
                  progress dashboard. That system exists because accountability matters. These
                  records exist for the same reason.
                </Text>
            </Stack>
          </GlassCard>

          {/* ── Section 2: Key Facts ─────────────────────────── */}
          <GlassCard variant="subtle" p={{ base: "md", sm: "xl" }}>
            <Stack gap="md">
              <Group gap="xs">
                <IconFileText size={18} color={colors.primary} />
                <Title
                  order={2}
                  c={colors.textPrimary}
                  style={{ fontSize: responsiveText.sectionTitle }}
                >
                  Key Facts
                </Title>
              </Group>

              <Table>
                <Table.Tbody>
                  {(
                    [
                      ["Festival", "NeoKiz 2022"],
                      ["Artist", "Albir Rojas"],
                      ["Total Paid", "€1,440.30"],
                      [
                        "Payment 1",
                        '€440.30 — June 8, 2024 ("Parte número 1 del pago")',
                      ],
                      [
                        "Payment 2",
                        '€1,000 — June 25, 2024 ("Pago 2/2, final Neokiz 2022")',
                      ],
                      ["PayPal Used", "albirkizomba@gmail.com"],
                      ["PayPal Provided By", "Albir Rojas — March 17, 2024"],
                      ["Time to Receive Payment Info", "~20 months after the festival"],
                    ] as [string, string][]
                  ).map(([label, value]) => (
                    <Table.Tr key={label}>
                      <Table.Td
                        style={{
                          width: "38%",
                          color: colors.textMuted,
                          fontSize: responsiveText.small,
                          fontWeight: 500,
                          padding: "10px 12px",
                          borderBottom: "1px solid rgba(255,255,255,0.04)",
                          verticalAlign: "top",
                        }}
                      >
                        {label}
                      </Table.Td>
                      <Table.Td
                        style={{
                          color: colors.textPrimary,
                          fontSize: responsiveText.small,
                          padding: "10px 12px",
                          borderBottom: "1px solid rgba(255,255,255,0.04)",
                        }}
                      >
                        {value}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Stack>
          </GlassCard>

          {/* ── Section 3: Timeline ──────────────────────────── */}
          <Stack gap="md">
            <Stack gap={4}>
              <Title
                order={2}
                c={colors.textPrimary}
                style={{ fontSize: responsiveText.sectionTitle }}
              >
                Chronological Record
              </Title>
              <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>
                Every event, in order, from the festival to today.
              </Text>
            </Stack>

            <Box style={{ position: "relative" }}>
              {/* Vertical line */}
              <Box
                style={{
                  position: "absolute",
                  left: 17,
                  top: 18,
                  bottom: 18,
                  width: 2,
                  background:
                    "linear-gradient(180deg, rgba(244,93,0,0.5) 0%, rgba(244,93,0,0.05) 100%)",
                  zIndex: 0,
                }}
              />

              <Stack gap="lg" style={{ position: "relative" }}>
                {TIMELINE.map((event, i) => {
                  const dc = dotColor(event.highlight);
                  return (
                    <Group key={i} gap="md" align="flex-start" wrap="nowrap">
                      {/* Dot */}
                      <Box
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: "rgba(15, 15, 15, 0.95)",
                          border: `2px solid ${dc}`,
                          flexShrink: 0,
                          zIndex: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Box
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: dc,
                          }}
                        />
                      </Box>

                      {/* Content card */}
                      <Box
                        style={{
                          flex: 1,
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.05)",
                          borderRadius: 10,
                          padding: "14px 16px",
                          marginBottom: 4,
                        }}
                      >
                        <Text
                          fw={700}
                          style={{
                            fontSize: responsiveText.xs,
                            color: dc,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            marginBottom: 4,
                          }}
                        >
                          {event.date}
                        </Text>
                        <Title
                          order={4}
                          c={colors.textPrimary}
                          mb="xs"
                          style={{ fontSize: responsiveText.body, fontWeight: 600 }}
                        >
                          {event.title}
                        </Title>
                        <Text
                          c={colors.textSecondary}
                          style={{ fontSize: responsiveText.body, lineHeight: 1.65 }}
                        >
                          {event.description}
                        </Text>
                        <EvidenceSlot
                          filename={event.imageFile}
                          caption={event.imageCaption}
                          src={event.src}
                        />

                        {event.emailExhibit && (
                          <Box
                            mt="md"
                            style={{
                              background: "rgba(255,255,255,0.015)",
                              border: "1px solid rgba(255,255,255,0.09)",
                              borderRadius: 8,
                              overflow: "hidden",
                            }}
                          >
                            {/* Email header */}
                            <Box
                              style={{
                                background: "rgba(255,255,255,0.04)",
                                borderBottom: "1px solid rgba(255,255,255,0.07)",
                                padding: "10px 14px",
                              }}
                            >
                              <Badge
                                size="xs"
                                mb={8}
                                style={{
                                  background: "rgba(244,93,0,0.12)",
                                  border: "1px solid rgba(244,93,0,0.25)",
                                  color: colors.primary,
                                }}
                              >
                                Documented Email
                              </Badge>
                              {[
                                ["From", event.emailExhibit.from],
                                ["To", event.emailExhibit.to],
                                ["Date", event.emailExhibit.date],
                                ["Subject", event.emailExhibit.subject],
                              ].map(([label, value]) => (
                                <Group key={label} gap={6} wrap="nowrap" mb={2}>
                                  <Text
                                    style={{
                                      fontSize: responsiveText.xs,
                                      color: colors.textDim,
                                      minWidth: 48,
                                      flexShrink: 0,
                                    }}
                                  >
                                    {label}:
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize: responsiveText.xs,
                                      color: colors.textMuted,
                                    }}
                                  >
                                    {value}
                                  </Text>
                                </Group>
                              ))}
                            </Box>

                            {/* Email body */}
                            <Box style={{ padding: "14px 14px 10px" }}>
                              <Stack gap="sm">
                                {event.emailExhibit.points.map((point, pi) => (
                                  <Group key={pi} gap="sm" align="flex-start" wrap="nowrap">
                                    <Text
                                      fw={600}
                                      style={{
                                        fontSize: responsiveText.xs,
                                        color: colors.textDim,
                                        flexShrink: 0,
                                        marginTop: 2,
                                      }}
                                    >
                                      {pi + 1})
                                    </Text>
                                    <Text
                                      c={colors.textSecondary}
                                      style={{ fontSize: responsiveText.xs, lineHeight: 1.65 }}
                                    >
                                      {point}
                                    </Text>
                                  </Group>
                                ))}
                                <Divider color="rgba(255,255,255,0.05)" my={4} />
                                <Text
                                  c={colors.textMuted}
                                  style={{ fontSize: responsiveText.xs, lineHeight: 1.6 }}
                                >
                                  {event.emailExhibit.closing}
                                </Text>
                                <Text
                                  c={colors.textDim}
                                  style={{ fontSize: responsiveText.xs }}
                                >
                                  — {event.emailExhibit.signature}
                                </Text>
                              </Stack>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Group>
                  );
                })}
              </Stack>
            </Box>
          </Stack>

          {/* ── Section 4: Rate Sheet Exhibit ───────────────── */}
          <GlassCard variant="subtle" p={{ base: "md", sm: "xl" }}>
            <Stack gap="md">
              <Stack gap={4}>
                <Title
                  order={2}
                  c={colors.textPrimary}
                  style={{ fontSize: responsiveText.sectionTitle }}
                >
                  The Rate Sheet Exhibit
                </Title>
                <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>
                  Albir provided a detailed rate sheet before the festival. It listed every
                  price. It did not include any payment information.
                </Text>
              </Stack>

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                {/* Left: Original */}
                <Box
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 10,
                    padding: 16,
                  }}
                >
                  <Group justify="space-between" mb="md">
                    <Text
                      fw={600}
                      c={colors.textPrimary}
                      style={{ fontSize: responsiveText.small }}
                    >
                      Original Rate Sheet
                    </Text>
                    <Badge
                      size="xs"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: colors.textDim,
                      }}
                    >
                      As received
                    </Badge>
                  </Group>
                  <Image
                    src="/images/case/albir_rate_sheet.jpg"
                    alt="Albir Rojas rate sheet — NeoKiz 2022"
                    radius="sm"
                    fit="contain"
                  />
                </Box>

                {/* Right: What it should have included */}
                <Box
                  style={{
                    background: "rgba(244, 93, 0, 0.03)",
                    border: "1px solid rgba(244, 93, 0, 0.15)",
                    borderRadius: 10,
                    padding: 16,
                  }}
                >
                  <Group justify="space-between" mb="md">
                    <Text
                      fw={600}
                      c={colors.textPrimary}
                      style={{ fontSize: responsiveText.small }}
                    >
                      What It Should Have Included
                    </Text>
                    <Badge
                      size="xs"
                      style={{
                        background: "rgba(244, 93, 0, 0.12)",
                        border: "1px solid rgba(244, 93, 0, 0.25)",
                        color: colors.primary,
                      }}
                    >
                      Missing section
                    </Badge>
                  </Group>
                  <Image
                    src="/images/case/albir_rate_sheet_annotated.jpg"
                    alt="Albir Rojas rate sheet — what it should have included"
                    radius="sm"
                    fit="contain"
                  />
                </Box>
              </SimpleGrid>

              {/* Caption */}
              <Box
                style={{
                  borderLeft: `3px solid rgba(255,255,255,0.12)`,
                  paddingLeft: 14,
                  paddingTop: 4,
                  paddingBottom: 4,
                }}
              >
                <Text
                  c={colors.textMuted}
                  style={{ fontSize: responsiveText.small, fontStyle: "italic" }}
                >
                  "This one section would have prevented a two-year dispute."
                </Text>
              </Box>
            </Stack>
          </GlassCard>

          {/* ── Section 5: Direct Questions ─────────────────── */}
          <GlassCard
            p={{ base: "md", sm: "xl" }}
            style={{
              background: "rgba(18, 16, 13, 0.9)",
              border: "1px solid rgba(190, 160, 90, 0.16)",
            }}
          >
            <Stack gap="lg">
              <Stack gap="xs">
                <Title
                  order={2}
                  c={colors.textPrimary}
                  style={{ fontSize: responsiveText.sectionTitle }}
                >
                  Albir, I Have Questions.
                </Title>
                <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>
                  These are honest questions that deserve honest answers. I am not asking them
                  to attack. I am asking because they remain unanswered.
                </Text>
              </Stack>

              <Stack gap="md">
                {QUESTIONS.map((question, i) => (
                  <Group key={i} gap="md" align="flex-start" wrap="nowrap">
                    <Box
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "rgba(190, 160, 90, 0.07)",
                        border: "1px solid rgba(190, 160, 90, 0.18)",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 3,
                      }}
                    >
                      <Text
                        fw={600}
                        style={{
                          fontSize: responsiveText.xs,
                          color: "rgba(190, 160, 90, 0.65)",
                        }}
                      >
                        {i + 1}
                      </Text>
                    </Box>
                    <Text
                      c={colors.textSecondary}
                      style={{ fontSize: responsiveText.small, lineHeight: 1.75 }}
                    >
                      {question}
                    </Text>
                  </Group>
                ))}
              </Stack>
            </Stack>
          </GlassCard>

          {/* ── Section 6: Why This Is Public ────────────────── */}
          <GlassCard variant="subtle" p={{ base: "md", sm: "xl" }}>
            <Stack gap="lg">
              <Title
                order={2}
                c={colors.textPrimary}
                style={{ fontSize: responsiveText.sectionTitle }}
              >
                Why This Is Public
              </Title>

              <Stack gap="md">
                <Text
                  c={colors.textSecondary}
                  style={{ fontSize: responsiveText.small, lineHeight: 1.8 }}
                >
                  I am not trying to cancel Albir Rojas. I have no interest in ending his
                  career or damaging his reputation beyond what the facts already say. What I
                  want is simple: for him to set the record straight on his end. A single
                  post. A single acknowledgment that the payment was made. That's it.
                </Text>

                <Text
                  c={colors.textSecondary}
                  style={{ fontSize: responsiveText.small, lineHeight: 1.8 }}
                >
                  I went public because Lucas Nuance went public first — with a document that
                  named me alongside people accused of sexual assault and fraud. That
                  accusation was made in front of the entire kizomba community. I contacted
                  Albir privately in February 2026, before publishing anything, and gave him
                  every opportunity to address it without this page ever needing to exist. He
                  suggested a call. Then went silent for three weeks across three follow-up
                  messages. At some point, silence is its own answer.
                </Text>

                <Text
                  c={colors.textSecondary}
                  style={{ fontSize: responsiveText.small, lineHeight: 1.8 }}
                >
                  Honestly — I held my tongue too long. I absorbed the auto-replies, the
                  delayed PayPal info, the Lucas DM, the Dance-Stein document, and kept
                  trying to handle it privately. I stayed quiet while the narrative spread.
                  That was a mistake. The truth had a right to be documented from the moment
                  the first false claim was made. This page is the correction that should
                  have existed sooner.
                </Text>
              </Stack>
            </Stack>
          </GlassCard>

          {/* ── Section 7: Further Context ───────────────────── */}
          <GlassCard variant="subtle" p={{ base: "md", sm: "xl" }}>
            <Stack gap="lg">
              <Stack gap={4}>
                <Title
                  order={2}
                  c={colors.textPrimary}
                  style={{ fontSize: responsiveText.sectionTitle }}
                >
                  Further Context
                </Title>
                <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>
                  The following is drawn from{" "}
                  <Link
                    href="/choosing-myself"
                    style={{ color: colors.primary, textDecoration: "none" }}
                  >
                    Choosing Myself
                  </Link>
                  {" "}— a separate public document published on this site about the
                  end of NeoKizFest. It was written independently of this case file.
                </Text>
              </Stack>

              <Stack gap="md">
                {/* Quote 1 */}
                <Box
                  style={{
                    borderLeft: `3px solid ${colors.primary}`,
                    paddingLeft: 16,
                    paddingTop: 4,
                    paddingBottom: 4,
                  }}
                >
                  <Text
                    c={colors.textSecondary}
                    style={{ fontSize: responsiveText.small, lineHeight: 1.75, fontStyle: "italic" }}
                  >
                    "I paid 100% of my artists. Some payments were late because the festival
                    didn't generate enough to cover everything immediately, not because I was
                    pocketing money."
                  </Text>
                  <Text mt={6} style={{ fontSize: responsiveText.xs, color: colors.textDim }}>
                    — Charles Ogar,{" "}
                    <Link
                      href="/choosing-myself"
                      style={{ color: colors.textDim, textDecoration: "underline" }}
                    >
                      Choosing Myself
                    </Link>
                  </Text>
                </Box>

                {/* Quote 2 */}
                <Box
                  style={{
                    borderLeft: `3px solid rgba(180, 60, 60, 0.6)`,
                    paddingLeft: 16,
                    paddingTop: 4,
                    paddingBottom: 4,
                  }}
                >
                  <Text
                    c={colors.textSecondary}
                    style={{ fontSize: responsiveText.small, lineHeight: 1.75, fontStyle: "italic" }}
                  >
                    "I've dealt with international artists who used intimidation, blackmail, and
                    false claims to try to damage my reputation when things didn't go exactly
                    their way. Artists who benefited from being flown in, housed, fed, and paid,
                    and then turned around and threatened to trash the event privately and
                    publicly if their demands weren't met. That's not professionalism. It's
                    bullying."
                  </Text>
                  <Text mt={6} style={{ fontSize: responsiveText.xs, color: colors.textDim }}>
                    — Charles Ogar,{" "}
                    <Link
                      href="/choosing-myself"
                      style={{ color: colors.textDim, textDecoration: "underline" }}
                    >
                      Choosing Myself
                    </Link>
                  </Text>
                </Box>

                {/* Quote 3 */}
                <Box
                  style={{
                    borderLeft: `3px solid rgba(255, 255, 255, 0.15)`,
                    paddingLeft: 16,
                    paddingTop: 4,
                    paddingBottom: 4,
                  }}
                >
                  <Text
                    c={colors.textSecondary}
                    style={{ fontSize: responsiveText.small, lineHeight: 1.75, fontStyle: "italic" }}
                  >
                    "My father passed in 2022, which compounded the financial strain on
                    everything that followed."
                  </Text>
                  <Text mt={6} style={{ fontSize: responsiveText.xs, color: colors.textDim }}>
                    — Charles Ogar,{" "}
                    <Link
                      href="/choosing-myself"
                      style={{ color: colors.textDim, textDecoration: "underline" }}
                    >
                      Choosing Myself
                    </Link>
                    {" "}· See also: November 11, 2022 entry in the timeline above
                  </Text>
                </Box>
              </Stack>

              <Text
                c={colors.textDim}
                style={{ fontSize: responsiveText.xs, lineHeight: 1.65 }}
              >
                These statements were published separately and predate this case file. They are
                included here because they speak directly to the pattern being documented.
              </Text>
            </Stack>
          </GlassCard>

          {/* ── Section 7: The Solution ──────────────────────── */}
          <GlassCard variant="subtle" p={{ base: "md", sm: "xl" }}>
            <Stack gap="md">
              <Stack gap={4}>
                <Title
                  order={2}
                  c={colors.textPrimary}
                  style={{ fontSize: responsiveText.sectionTitle }}
                >
                  What This Situation Built
                </Title>
                <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>
                  Published March 2024 — before this case file existed.
                </Text>
              </Stack>

              {/* Pull quote */}
              <Box
                style={{
                  borderLeft: `3px solid ${colors.primary}`,
                  paddingLeft: 16,
                  paddingTop: 4,
                  paddingBottom: 4,
                }}
              >
                <Text
                  c={colors.textSecondary}
                  style={{ fontSize: responsiveText.small, lineHeight: 1.75, fontStyle: "italic" }}
                >
                  "I have chased artists down to pay them money sometimes — so it's really
                  crazy. Here at WhereCanWeDance.com we are introducing artist booking portals
                  to help streamline that information."
                </Text>
                <Text mt={6} style={{ fontSize: responsiveText.xs, color: colors.textDim }}>
                  — Charles Ogar, March 19, 2024
                </Text>
              </Box>

              <Text
                c={colors.textSecondary}
                style={{ fontSize: responsiveText.small, lineHeight: 1.75 }}
              >
                At{" "}
                <a
                  href="https://wherecanwedance.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: colors.primary, textDecoration: "none" }}
                >
                  wherecanwedance.com
                </a>
                , I built an artist booking portal that captures bios, promo materials, travel
                preferences, and — critically — payment information, all in one place before
                any booking is finalized. Artists fill it out once. Organizers have everything
                they need to pay, promote, and book without chasing anyone down. This situation
                — 20 months spent trying to obtain a single PayPal address — cannot happen on
                that platform.
              </Text>

              <Text
                c={colors.textSecondary}
                style={{ fontSize: responsiveText.small, lineHeight: 1.75 }}
              >
                I built this for myself. And I built it for every other organizer in the dance
                community who has ever had to track down a bank account number, a PayPal
                address, or a promo photo three days before a festival. The problem is
                industry-wide. The solution is free.
              </Text>

              <Text
                c={colors.textSecondary}
                style={{ fontSize: responsiveText.small, lineHeight: 1.75 }}
              >
                This is what I do when something is broken. I build the fix.
              </Text>

              {/* YouTube embed */}
              <Box
                style={{
                  position: "relative",
                  paddingBottom: "56.25%",
                  height: 0,
                  overflow: "hidden",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <iframe
                  src="https://www.youtube.com/embed/q__XGwGpTys"
                  title="Introducing Artist Booking Portals | WhereCanWeDance"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: 0,
                  }}
                />
              </Box>

              <Text
                c={colors.textDim}
                style={{ fontSize: responsiveText.xs }}
              >
                Artist booking portal demo —{" "}
                <a
                  href="https://wherecanwedance.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: colors.textDim }}
                >
                  wherecanwedance.com
                </a>
              </Text>
            </Stack>
          </GlassCard>

          {/* ── Section 8: Closing Statement ─────────────────── */}
          <GlassCard variant="subtle" p={{ base: "md", sm: "xl" }}>
            <Stack gap="md">
              <Title
                order={2}
                c={colors.textPrimary}
                style={{ fontSize: responsiveText.sectionTitle }}
              >
                Closing Statement
              </Title>

              <Text
                c={colors.textSecondary}
                style={{ fontSize: responsiveText.body, lineHeight: 1.8 }}
              >
                I ran NeoKiz for a decade. I built something real in this community. This page
                exists because the truth deserves a permanent address. My records are open. My
                door is still open. The documentation above speaks for itself.
              </Text>

              <Divider color="rgba(255,255,255,0.05)" />

              <Text
                fw={600}
                c={colors.textPrimary}
                style={{ fontSize: responsiveText.body }}
              >
                — Charles Ogar
              </Text>

              <Text c={colors.textDim} style={{ fontSize: responsiveText.xs }}>
                Last updated: March 26, 2026
              </Text>
            </Stack>
          </GlassCard>

          {/* ── Section 10: Share ────────────────────────────── */}
          <GlassCard variant="subtle" p={{ base: "md", sm: "lg" }} className="no-print">
            <Stack gap="md">
              <Text
                c={colors.textMuted}
                ta="center"
                style={{ fontSize: responsiveText.small }}
              >
                If you know people in the kizomba community who have seen false claims about
                this situation, share this page with them.
              </Text>
              <ArticleMeta
                author="Charles Ogar"
                date="March 26, 2026"
                page="/albir-payment-record"
                shareUrl={PAGE_URL}
                shareTitle="NeoKiz 2022 Payment Record — Charles Ogar"
              />
              <Text
                c={colors.textDim}
                ta="center"
                style={{ fontSize: responsiveText.xs }}
              >
                Full internal case documentation available on request.
              </Text>
            </Stack>
          </GlassCard>

          <BackToHome />
        </Stack>
      </FarewellLayout>
    </>
  );
};

export default AlbirPaymentRecord;

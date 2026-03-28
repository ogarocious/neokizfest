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

const underlineAccent: React.CSSProperties = {
  textDecoration: "underline",
  textDecorationColor: "#F45D00",
  textUnderlineOffset: "4px",
  textDecorationThickness: "2px",
};

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
  gapAfterMonths?: string[];
  isContext?: boolean;
}

const TIMELINE: TimelineEvent[] = [
  {
    date: "2014 – 2017",
    title: "Charles and Albir: Student and Teacher",
    description:
      "Before any festival, before any booking, Charles was Albir's student. One private lesson — among the first in what we now call urbankiz — and years of festival classes observed and attended when Albir came through. Albir came to the US about once a year. Every time Charles had the opportunity, Charles was there — watching, studying, trying to get better. Albir was not just a booking. Albir was someone Charles looked up to, and who introduced Charles to what we now call urbankiz. That context matters for everything that follows.",
    imageFile: "",
    imageCaption: "",
    highlight: "positive",
    isContext: true,
  },
  {
    date: "2018",
    title: "Albir Invited to NeoKiz 2018 — Never Made It",
    description:
      "Charles invited Albir to teach at NeoKiz 2018. Albir's name was on the NeoKiz 2018 lineup (documented at neokizfest.com/artist-payments). A representative acting on Albir's behalf intentionally withheld flight information until it was too late to book. Albir never made it to the festival. Charles moved on without holding it against Albir — and four years later, booked Albir directly for NeoKiz 2022 based on their personal relationship. That decision, in hindsight, deserves to be part of this record.",
    imageFile: "",
    imageCaption: "",
    highlight: "neutral",
    isContext: true,
  },
  {
    date: "May 16, 2022",
    title: "Charles's Father Suffers a Stroke",
    description:
      "Six weeks before NeoKiz 2022, Charles's father Fidelis Ogar suffers a stroke and is hospitalized in Houston. Houston is a two-and-a-half hour drive from Austin. Charles and Sarah do not cancel the festival. They do not ask artists to wait. They push through — Charles making repeated drives to Houston and back while the final preparations for a multi-day festival are still underway. The artists don't know this. The attendees don't know this. This is what it looked like from the inside.",
    imageFile: "fidelis_stroke_may2022.jpg",
    imageCaption: "Fidelis Ogar in the hospital, May 2022",
    highlight: "neutral",
    src: "/images/case/fidelis_stroke_may2022.jpg",
    isContext: true,
  },
  {
    date: "July 2022",
    title: "NeoKiz 2022 Festival Takes Place",
    description:
      "Albir Rojas performs at NeoKiz 2022 in Austin, TX. Charles booked Albir directly — their own personal relationship going back years. A rate sheet was provided listing services and fees, but no payment information of any kind. Also present that weekend: Lucas Nuance, who attended as a representative of DJ Art — not Albir. Lucas was not contracted or authorized by NeoKiz to perform any sound duties at the festival. He inserted himself into DJ Art's sound check process without being asked — an imposition that contributed to unnecessary confusion and tension with NeoKiz staff and other artists sharing the same time slots. Multiple incidents involving Lucas were documented by NeoKiz staff. Those incidents were a significant factor in the decision not to book DJ Art for NeoKiz 2023. Charles formally summarized everything in a letter to DJ Art's management in July 2023.",
    imageFile: "albir_rate_sheet.jpg",
    imageCaption: "Albir Rojas rate sheet — NeoKiz 2022",
    highlight: "neutral",
    src: "/images/case/albir_rate_sheet.jpg",
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
      "Three days after proactively reaching out about payment, Charles shares Albir's podcast episode to the NeoKiz Facebook audience: \"If you interested to hearing more about Albir, check out this podcast I did with him a few years ago!\" The podcast was originally recorded in August 2016 — part of a relationship going back to 2014, when Charles was Albir's student in San Antonio. Charles was publicly supporting Albir's brand at the same moment Charles was privately trying to settle the debt.",
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
    gapAfterMonths: ["Sep 2022"],
  },
  {
    date: "October 12, 2022",
    title: "Fidelis Ogar Passes Away",
    description:
      "Charles's father, Fidelis Ogar — born February 10, 1959 — passes away. He was 63. The months between the stroke and this day had included the festival itself, the immediate aftermath, and ongoing drives to Houston for his father's care. Charles goes quiet. The payment thread goes quiet. This is why.",
    imageFile: "fidelis_passing_oct2022.jpg",
    imageCaption: "In loving memory of Fidelis Ogar, February 10, 1959 – October 12, 2022",
    highlight: "neutral",
    src: "/images/case/fidelis_passing_oct2022.jpg",
  },
  {
    date: "November 11, 2022",
    title: "Charles Tells Albir What Happened",
    description:
      "Charles reaches back out to Albir — telling him about his father's passing. Albir responds with sympathy and understanding.",
    imageFile: "whatsapp_nov11_2022.jpg",
    imageCaption: "WhatsApp — Charles shares his father's passing, Nov 11, 2022",
    highlight: "neutral",
    src: "/images/case/whatsapp_nov11_2022.jpg",
  },
  {
    date: "November – December 2022",
    title: "Charles Follows Up Repeatedly. Only Auto-Reply Responds.",
    description:
      "Charles continues reaching out multiple times to settle payment. Charles receives only Albir's automated reply. No payment details are provided.",
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
    gapAfterMonths: ["Mar 2023", "Apr 2023", "May 2023", "Jun 2023"],
  },
  {
    date: "July 3, 2023",
    title: "Charles Documents Lucas's Behavior in Writing to DJ Art's Management",
    description:
      "Nearly a year after the festival, and while still unable to reach Albir about payment, Charles sends a formal email to DJ Art's management summarizing Lucas's conduct at NeoKiz 2022. Important context: Lucas was not contracted or authorized by NeoKiz for any sound or production role at the festival. The incidents documented below are rooted in Lucas inserting himself into situations he had no authorized role in — adding friction that was unnecessary. This letter is the documented reason DJ Art was not invited back for NeoKiz 2023 — and the bridge that later led to the 2024 direct booking without Lucas.",
    imageFile: "",
    imageCaption: "",
    highlight: "neutral",
    emailExhibit: {
      from: "Charles Ogar",
      to: "Management DJ Art Music",
      date: "July 3, 2023, 10:48 PM",
      subject: "Summary of Neokiz 2022 Interactions and Future Engagement Considerations",
      points: [
        "Lucas requested a staff pass from volunteers at the registration table, and subsequently from Sarah when flagged by the volunteers. This was for access to backstage and food; however, our records indicate this wasn't part of the original contracted agreement. Lucas was notified of this discrepancy and was not provided a wristband.",
        "We noted a rather terse interaction between Lucas and our volunteers at the registration table, which resulted in Sarah's intervention. The discussion revolved around the sound check for JP & Stephy while Lucas was managing the sound check for Albir during the same class time slot. As per our records, the NeoKiz staff had not requested additional assistance with sound, as other artists were already assigned for sound management.",
        "In the DJ area, while Lucas was acting as a \"liaison\" during DJ Art's set, we received feedback from attendees expressing concerns that someone might be interfering with the DJs.",
        "There were noticeable discrepancies in Lucas's communication regarding DJ slot changes on Sunday night. In his conversation with Yelena, Lucas was insistent, even to the point of belligerence, that DJ Art's contract precluded DJ Art from performing the opening slot — however, after reviewing the contract with Charles, we found no such stipulation. On the other hand, Lucas's conversation with Charles was quite congenial and accommodating, citing short notice and family plans as the reason for the slot conflict.",
      ],
      closing:
        "These instances had collectively played a significant role in our decision not to book DJ Art for Neokiz 2023. It is with sincere regret that we made this decision; however, we would be open to discussions about future engagements, provided we can reach a mutual understanding to ensure such instances are not repeated.",
      signature: "Charles Ogar & Sarah Throop",
    },
    gapAfterMonths: ["Aug 2023"],
  },
  {
    date: "September 17, 2023",
    title: "Albir: \"You Haven't Said Anything About the Payment\"",
    description:
      "Over a year after the festival, Albir sends a long message — upset that Charles had asked about future bookings without addressing the prior year's payment. Albir writes: \"After one year you haven't say anything about the payment knowing that this is my full time job. I came to your festival and I did my job in a professional way.\" What the message does not address: Charles had been reaching out repeatedly since August 2022. Albir's auto-reply had been the only response.",
    imageFile: "whatsapp_sep17_2023.jpg",
    imageCaption: "WhatsApp — Albir's \"I was upset\" message, Sep 17, 2023",
    highlight: "warning",
    src: "/images/case/whatsapp_sep17_2023.jpg",
  },
  {
    date: "September 17, 2023",
    title: "Charles Replies: \"Getting in Communication With You Is Not the Easiest Task\"",
    description:
      "Charles responds to Albir's message by forwarding the November and December 2022 messages Charles had already sent — evidence that Charles had been trying to reach Albir for months. Charles's reply: \"Getting in communication with you is not the easiest task hermano. From my perspective, I was trying to use the limited window of your attention to address both subjects.\"",
    imageFile: "whatsapp_sep17_2023_reply.jpg",
    imageCaption: "WhatsApp — Charles's reply forwarding prior outreach, Sep 17, 2023",
    highlight: "neutral",
    src: "/images/case/whatsapp_sep17_2023_reply.jpg",
  },
  {
    date: "September 17, 2023",
    title: "Albir: \"I'm Not That Good in Communication\"",
    description:
      "In the same exchange, Albir responds to Charles pointing out how difficult it has been to reach Albir — and agrees: \"Ok bro, understand. And accept that, I'm not that good in communication, im working hard on that. Getting better but little by little.\" In Albir's own words, on the same day Albir accused Charles of disrespecting Albir's work.",
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
    gapAfterMonths: ["Oct 2023", "Nov 2023", "Dec 2023", "Jan 2024", "Feb 2024"],
  },
  {
    date: "March 17, 2024",
    title: "Albir Finally Provides His PayPal Email",
    description:
      "Nearly 20 months after the festival, Albir sends a PayPal address with a two-sentence acknowledgment: \"Sorry not to give you my PayPal info before. Thank you for reminding.\" By this point, Charles had already begun hearing rumors in the kizomba community that he had not paid his artists. Receiving Albir's payment information — finally, casually, 20 months later — confirmed several things at once: that the pattern of inaccessibility was not accidental, that the unpaid balance had become the basis of a story being told without Charles's knowledge, and that the personal relationship Charles had believed existed was something different than what he had thought. This was not relief. This was the moment something solidified.",
    imageFile: "whatsapp_mar17_2024.jpg",
    imageCaption: "WhatsApp — Albir provides PayPal info, Mar 17, 2024",
    highlight: "positive",
    src: "/images/case/whatsapp_mar17_2024.jpg",
    gapAfterMonths: ["Apr 2024", "May 2024"],
  },
  {
    date: "June 2024",
    title: "Lucas Surfaces — Before Charles Has Paid a Single Dollar",
    description:
      "Before Charles has made any payment toward the outstanding balance, Lucas Nuance — described as Albir's North America booking manager — contacts Charles via Instagram DM. His message is short and deliberate: \"This doesn't have to be as public as it already has been.\" That one line confirms two things: the unpaid balance has been circulating publicly as a narrative, and Lucas believes he has some control over how far it spreads. Charles does not respond to Lucas. He does not engage with the implication. He simply does what he has been trying to do since August 2022 — he pays.",
    imageFile: "lucas_instagram_dm.jpg",
    imageCaption: "Instagram DM — Lucas Nuance, before payments were made",
    highlight: "warning",
    src: "/images/case/lucas_instagram_dm.jpg",
  },
  {
    date: "June 8, 2024",
    title: "Payment 1 Sent: €440.30",
    description:
      "Charles sends €440.30 via PayPal to albirkizomba@gmail.com. Memo: \"Parte número 1 del pago.\" The split payment reflects the financial reality of that month: Charles was simultaneously managing artist flight costs for NeoKiz 2024. The non-round amount reflects PayPal's conversion and fee handling. Charles did not respond to Lucas's DM. He did not negotiate. He paid.",
    imageFile: "paypal_receipt_1.jpg",
    imageCaption: "PayPal receipt — €440.30, June 8, 2024",
    highlight: "payment",
    src: "/images/case/paypal_receipt_1.jpg",
  },
  {
    date: "June 25, 2024",
    title: "Payment 2 Sent: €1,000. Account Settled.",
    description:
      "Charles sends the remaining €1,000 via PayPal. Memo: \"Pago 2/2, final Neokiz 2022\". Total paid: €1,440.30. The account is settled in full — two years after the festival, three months after Albir finally provided payment details, and weeks after Lucas implied the story was already public. The split was a matter of cash flow, not avoidance. The payment was always coming. The question was always whether Albir would provide a way to send it.",
    imageFile: "paypal_receipt_2.jpg",
    imageCaption: "PayPal receipt — €1,000, June 25, 2024",
    highlight: "payment",
    src: "/images/case/paypal_receipt_2.jpg",
  },
  {
    date: "Summer 2024",
    title: "DJ Art Booked Directly for NeoKiz 2024 — No Lucas",
    description:
      "Following the July 2023 letter to DJ Art's management, Charles booked DJ Art directly for NeoKiz 2024. No Lucas. The professional relationship with DJ Art was preserved — on different terms. Lucas had been the variable all along, not DJ Art.",
    imageFile: "",
    imageCaption: "",
    highlight: "positive",
    isContext: true,
    gapAfterMonths: [
      "Jul 2024", "Aug 2024", "Sep 2024", "Oct 2024", "Nov 2024", "Dec 2024",
      "Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025", "May 2025", "Jun 2025",
      "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025",
      "Jan 2026",
    ],
  },
  {
    date: "February 9, 2026",
    title: "\"The Dance-Stein Files: Volume 1\" Published",
    description:
      "Lucas Nuance publishes a public document falsely claiming Charles owes thousands — grouping Charles's name alongside individuals accused of sexual assault and fraud. Published 19 months after full payment was made. This publication triggers Charles's private outreach to Albir.",
    imageFile: "dance_stein_files.jpg",
    imageCaption: "The Dance-Stein Files: Volume 1 — published Feb 9, 2026",
    highlight: "warning",
    src: "/images/case/dance_stein_files.jpg",
  },
  {
    date: "February 16, 2026",
    title: "Charles Contacts Albir Privately — Before Going Public",
    description:
      "Before making anything public, Charles contacts Albir directly with full documentation. Charles asks direct questions and gives Albir every opportunity to correct the record privately.",
    imageFile: "whatsapp_feb16_2025.jpg",
    imageCaption: "WhatsApp — Charles private outreach, Feb 16, 2026",
    highlight: "neutral",
    src: "/images/case/whatsapp_feb16_2025.jpg",
  },
  {
    date: "February 23 – March 11, 2026",
    title: "Albir Suggests a Call. Never Follows Through.",
    description:
      "After Albir suggests a video call, Charles follows up three times over three weeks: Feb 25 asking for available times, Mar 4 asking about the weekend, Mar 11 just staying in touch. Albir acknowledges the time zone difference (Albir is in Bali) but never proposes a time. No call ever happens. No clarification is ever offered.",
    imageFile: "whatsapp_mar2025.jpg",
    imageCaption: "WhatsApp — Charles's three unanswered scheduling attempts, Feb 25–Mar 11, 2026",
    highlight: "negative",
    src: "/images/case/whatsapp_mar2025.jpg",
  },
  {
    date: "March 27, 2026",
    title: "Albir Responds — With a Dismissal, Not a Rebuttal",
    description:
      "After hearing that Charles had begun sharing early drafts of this public record, Albir breaks 16 days of silence. His message: \"Sad Charles, very sad what you have done. 'You gave me an opportunity'? Private conversations and information shared in public with no authorization. This was not personal with me. But is good, you showed how you really are. Take care, hope things will go good for you.\" He does not dispute the timeline. He does not dispute the payment receipts. He does not explain Lucas's role or the Dance-Stein Files. He does not acknowledge that the debt was settled in full. He objects to the record being public — and closes the door. That response is now part of the record.",
    imageFile: "whatsapp_mar27_2026.jpg",
    imageCaption: "WhatsApp — Albir's dismissal, March 27, 2026",
    highlight: "warning",
    src: "/images/case/whatsapp_mar27_2026.jpg",
  },
];

const QUESTIONS = [
  `You said in your own words, "Sorry not to give you my PayPal info before." So why is the story going around that I never paid you?`,
  `Was withholding your payment information intentional? Because the pattern is hard to ignore: you performed at NeoKiz 2022 and provided no way to pay you. For nearly two years, every attempt to get your payment details was met with silence or an auto-reply. Then — finally — you provided your PayPal. I paid you in full within three months. And then, over a year later, Lucas published a document claiming I owe you money. And now, nearly two years after that payment was made, the accusations are surfacing again. Was any part of this coordinated? Did you and Lucas plan to withhold payment details, wait for a debt narrative to build, leverage it publicly — and then keep leveraging it, even after the debt was settled in full?`,
  "Your rate sheet listed every price in detail. Why was there no payment information on it?",
  "Albir, I need to ask you something directly: what is your relationship with Lucas Nuance? He was present at NeoKiz 2022 as DJ Art's representative — not yours. He later contacted me claiming money was still owed, before I had made any payment toward the outstanding balance. And his name is associated with the Dance-Stein Files that put my name alongside people accused of sexual assault and fraud. Is he your manager? Your booking agent? Your business partner? Because what he does in connection with your name and your situation has consequences — for both of us.",
  `Did you authorize Lucas to publish "The Dance-Stein Files" using your name and our situation?`,
  "You came to the US about once a year. Every time you did, I showed up — to watch, to study, to learn. You were one of the first people to show me what we now call urbankiz. I looked up to you. I was your student before I was your organizer. And when I had a festival, I flew you in, housed you, fed you, and paid you. Is this really how you treat someone who came up studying you?",
  "I tried to resolve this privately in February 2026. You suggested a call and then went silent again. Why?",
  "One post from you clarifying the facts would end this. So why hasn't that happened?",
  "Lucas has used your name and your situation to make public claims — including the Dance-Stein Files, published 19 months after I had paid you in full. Whether any of that was done with your knowledge or without it, your name is now attached to it. I have asked you privately. I have followed up. I am asking you here, publicly: what is your response to what has been published in connection with your name and this situation?",
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

// ─── Time Gap ────────────────────────────────────────────────

const TimelineGap: React.FC<{ months: string[] }> = ({ months }) => {
  const ROW_H = 64;
  return (
    <Box style={{ position: "relative" }}>
      {/* Top border */}
      <Box style={{ height: 2, background: "rgba(244,93,0,0.25)" }} />

      {months.map((month, i) => (
        <Box
          key={i}
          style={{
            height: ROW_H,
            display: "flex",
            alignItems: "center",
            paddingLeft: 64,
            background:
              i % 2 === 0
                ? "rgba(255,255,255,0.022)"
                : "rgba(255,255,255,0.008)",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          {/* Tick from the timeline rail */}
          <Box
            style={{
              position: "absolute",
              left: 19,
              width: 28,
              height: 3,
              borderRadius: 2,
              background: "rgba(244,93,0,0.45)",
            }}
          />
          <Text
            style={{
              fontSize: 22,
              color: "rgba(255,255,255,0.5)",
              fontFamily: "monospace",
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              userSelect: "none",
            }}
          >
            {month}
          </Text>
        </Box>
      ))}

      {/* Bottom border */}
      <Box style={{ height: 2, background: "rgba(244,93,0,0.25)" }} />
    </Box>
  );
};

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
        <meta property="og:image" content="/images/case/og-albir-payment-record.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:image" content="/images/case/og-albir-payment-record.png" />
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
          style={{ maxWidth: "100%" }}
        >
          {/* ── Section 1: Header ───────────────────────────── */}
          <Box px={{ base: "sm", sm: "md" }}>
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
                    <span style={{ color: colors.textMuted }}>March 27, 2026</span>
                  </Text>
                </Group>

                <Text
                  mt="sm"
                  c={colors.textSecondary}
                  style={{ fontSize: responsiveText.small, lineHeight: 1.75 }}
                >
                  Albir Rojas was not just another booking. Charles was once Albir's student —
                  one private lesson and years of festival classes in San Antonio, Texas between
                  2014 and 2017. Albir introduced Charles to what we now call urbankiz. When
                  Charles became an organizer, he invited Albir to NeoKiz 2018 — a booking that
                  fell through because a representative intentionally withheld flight information.
                  Charles gave the benefit of the doubt and booked Albir directly for NeoKiz 2022
                  anyway, based on their personal relationship. This is the context the public
                  accusations leave out.
                </Text>

                <Text
                  mt="xs"
                  c={colors.textSecondary}
                  style={{ fontSize: responsiveText.small, lineHeight: 1.75 }}
                >
                  The payment for NeoKiz 2022 was made in full — €1,440.30 to Albir Rojas via
                  PayPal in June 2024. The delay was not avoidance. It was a direct result of
                  Albir failing to provide payment details for nearly 20 months. This is the
                  documented record, in sequence, with evidence.
                </Text>

                <Text
                  mt="xs"
                  c={colors.textSecondary}
                  style={{ fontSize: responsiveText.small, lineHeight: 1.75 }}
                >
                  This case is one in a series. Multiple artists have made public claims of
                  non-payment against NeoKiz — none with supporting documentation. In response,
                  every festival edition is being reviewed and every artist payment is being
                  documented with receipts. Two additional case files are currently in
                  preparation. That full record lives at{" "}
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
          </Box>

          {/* ── Artist Image ────────────────────────────────── */}
          <Box>
            <Image
              src="/images/artist-payments/artists/albir-rojas-2022.png"
              alt="Albir Rojas — NeoKiz 2022 artist booking"
              w="100%"
              style={{
                display: "block",
                maxHeight: "480px",
                objectFit: "cover",
                objectPosition: "top center",
              }}
            />
            <Text
              mt={6}
              style={{
                fontSize: responsiveText.xs,
                color: colors.textDim,
                textAlign: "center",
              }}
            >
              Albir Rojas — NeoKiz 2022 artist booking
            </Text>
          </Box>

          <Stack gap="xl" px={{ base: "sm", sm: "md" }}>
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
                      ["Known Since", "2014 — Charles was Albir's student, San Antonio, TX"],
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
                    <React.Fragment key={i}>
                    <Group gap="md" align="flex-start" wrap="nowrap">
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
                          style={{ fontSize: responsiveText.sectionTitle, fontWeight: 600 }}
                        >
                          {event.title}
                        </Title>
                        <Text
                          c={colors.textSecondary}
                          style={{ fontSize: responsiveText.small, lineHeight: 1.65 }}
                        >
                          {event.description}
                        </Text>
                        {event.isContext && (
                          <Box
                            mt="sm"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              background: "rgba(100,160,255,0.07)",
                              border: "1px solid rgba(100,160,255,0.18)",
                              borderRadius: 6,
                              padding: "3px 10px",
                            }}
                          >
                            <Text style={{ fontSize: responsiveText.xs, color: "rgba(130,180,255,0.7)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                              Context
                            </Text>
                          </Box>
                        )}
                        {event.imageFile && (
                          <EvidenceSlot
                            filename={event.imageFile}
                            caption={event.imageCaption}
                            src={event.src}
                          />
                        )}

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
                    {event.gapAfterMonths && <TimelineGap months={event.gapAfterMonths} />}
                    </React.Fragment>
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
                  These are honest questions that deserve honest answers. This is a direct,
                  man-to-man address to Albir Rojas. These questions were raised privately in
                  February 2026 before this page existed. No answers were given.
                  Charles will not engage with Lucas — these are directed at Albir alone.
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

              <Divider color="rgba(190,160,90,0.12)" />

              <Stack gap={6}>
                <Text
                  c={colors.textMuted}
                  style={{ fontSize: responsiveText.small, lineHeight: 1.75 }}
                >
                  These questions were sent to Albir privately in February 2026, before this
                  page was published. No answers were given. This record will remain public
                  until they are.
                </Text>
                <Text
                  c={colors.textDim}
                  style={{ fontSize: responsiveText.xs, lineHeight: 1.65 }}
                >
                  One post. One acknowledgment. That is all it would take.
                </Text>
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
                  I am not trying to cancel Albir Rojas. I have no interest in ending Albir's
                  career or damaging Albir's reputation beyond what the facts already say. What I
                  want is simple: for Albir to set the record straight. A single post. A single
                  acknowledgment that the payment was made. That's it.
                </Text>

                <Text
                  c={colors.textSecondary}
                  style={{ fontSize: responsiveText.small, lineHeight: 1.8 }}
                >
                  I went public because Lucas Nuance went public first — with a document that
                  named me alongside people accused of sexual assault and fraud. That
                  accusation was made in front of the entire kizomba community. I contacted
                  Albir privately in February 2026, before publishing anything, and gave him
                  every opportunity to address it without this page ever needing to exist. Albir
                  suggested a call. Then went silent for three weeks across three follow-up
                  messages. At some point, silence is its own answer.
                </Text>

                <Text
                  c={colors.textSecondary}
                  style={{ fontSize: responsiveText.small, lineHeight: 1.8 }}
                >
                  There is a word for what Albir's silence has been since June 2024 — since
                  the moment he was paid in full and the debt was closed. It is not absence.
                  It is not a communication problem.{" "}
                  <Text span fw={700} style={underlineAccent}>It is tacit authorization.</Text>{" "}
                  In practice, choosing not to stop something you are aware of is the same as
                  allowing it. Albir has not posted that I paid him. Albir has not publicly
                  distanced himself from the Dance-Stein Files or from what Lucas published in
                  his name. Every day that passes without a correction is another day the false
                  claim stands by default — with Albir's silence as its foundation. That is not
                  oversight.{" "}
                  <Text span fw={700} style={underlineAccent}>That is a choice.</Text>
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

                <Text
                  c={colors.textSecondary}
                  style={{ fontSize: responsiveText.small, lineHeight: 1.8 }}
                >
                  <Text span fs="italic">I want to be honest about something that is harder to say than any of
                  the facts above: I am embarrassed.</Text> Not about what I did — the receipts
                  speak for themselves. I am embarrassed that this is the reality of the
                  kizomba scene I have spent years trying to build and represent. I have
                  been an ambassador of this dance. I traveled, I organized, I invested,
                  and I believed the community was worth it. Situations like this are
                  exactly what drive people away — the ones already here, and the ones who
                  might have joined us. This kind of drama does not just damage one person.
                  It damages what we are all trying to build. I did not want to post this
                  publicly. I was reluctant, and part of me still is. But there comes a
                  point where silence is not humility — it is complicity. I had to draw a
                  line somewhere. This page is where I drew it.
                </Text>
              </Stack>
            </Stack>
          </GlassCard>

          {/* ── Section 7: A Note on Lucas Nuance ───────────── */}
          <GlassCard variant="subtle" p={{ base: "md", sm: "xl" }}>
            <Stack gap="lg">
              <Stack gap={4}>
                <Title
                  order={2}
                  c={colors.textPrimary}
                  style={{ fontSize: responsiveText.sectionTitle }}
                >
                  A Note on Lucas Nuance
                </Title>
                <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>
                  The following is drawn entirely from documented interactions in this
                  record. No claims are made beyond what is evidenced above.
                </Text>
              </Stack>

              <Stack gap="md">
                <Text
                  c={colors.textSecondary}
                  style={{ fontSize: responsiveText.small, lineHeight: 1.8 }}
                >
                  What is documented in this record has a name. Inserting himself into
                  situations without authorization. Being belligerent with staff who had
                  less perceived power, congenial with those who had more. Using implied
                  pressure — "this doesn't have to be as public as it already has been"
                  — as a tool to coerce payment. Publishing false claims to damage
                  someone's reputation. Continuing that campaign 19 months after the
                  underlying dispute was fully resolved. That is not a misunderstanding.
                  That is not a communication problem.{" "}
                  <Text span fw={700} style={underlineAccent}>That is bullying</Text> — a sustained
                  pattern of intimidation and reputational harm directed at someone
                  perceived as a target.
                </Text>

                <Text
                  c={colors.textSecondary}
                  style={{ fontSize: responsiveText.small, lineHeight: 1.8 }}
                >
                  <strong style={{ color: "rgba(255,255,255,0.85)" }}>
                    If you are an artist working with Lucas as your manager or booking agent:
                  </strong>{" "}
                  This record documents Lucas inserting himself into a payment dispute
                  between me and Albir — despite attending NeoKiz 2022 solely as
                  DJ Art's representative, with no documented role in Albir's booking.
                  He contacted an organizer claiming money was owed before any payment
                  had been made. When the Dance-Stein Files were published, the debt he
                  cited had already been settled in full for 19 months. What he says in
                  your name, and what he publishes under your name, becomes part of your
                  public record too. You should know what that is.
                </Text>

                <Text
                  c={colors.textSecondary}
                  style={{ fontSize: responsiveText.small, lineHeight: 1.8 }}
                >
                  <strong style={{ color: "rgba(255,255,255,0.85)" }}>
                    If you are an organizer who has booked or is considering booking an
                    artist through Lucas:
                  </strong>{" "}
                  The July 2023 letter documented in this record describes his conduct
                  at NeoKiz 2022 — requesting credentials not covered by the contract,
                  discrepant communications with different staff members about the same
                  situation, and feedback from attendees about interference with DJs.
                  After that festival, he contacted me with the line "this doesn't
                  have to be as public as it already has been." Document everything
                  directly with the artist. Do not rely on an intermediary's account of
                  what was agreed to.
                </Text>

                <Text
                  c={colors.textSecondary}
                  style={{ fontSize: responsiveText.small, lineHeight: 1.8 }}
                >
                  <strong style={{ color: "rgba(255,255,255,0.85)" }}>
                    If you are considering buying a pass to an event Lucas is affiliated
                    with:
                  </strong>{" "}
                  The Dance-Stein Files were published 19 months after I had paid
                  Albir in full — grouping my name alongside people accused of sexual
                  assault and large-scale fraud, based on a debt that no longer existed.
                  That is the standard of accuracy being applied to public claims made
                  in this community. Factor that into what you trust, and who you trust
                  it from.
                </Text>

                <Text
                  c={colors.textSecondary}
                  style={{ fontSize: responsiveText.small, lineHeight: 1.8 }}
                >
                  <strong style={{ color: "rgba(255,255,255,0.85)" }}>
                    On continued association:
                  </strong>{" "}
                  Before this record existed, someone working with Lucas could claim
                  they didn't know. That defense no longer applies. Anyone who now
                  chooses to publicly affiliate with Lucas — lending him their name,
                  their platform, their audience — is doing so with full knowledge of
                  what is documented here.{" "}
                  <Text span fw={700} style={underlineAccent}>A name is an endorsement. An endorsement
                  is a choice.</Text> And that choice, made knowingly, carries its own
                  accountability.
                </Text>

                <Text
                  c={colors.textSecondary}
                  style={{ fontSize: responsiveText.small, lineHeight: 1.8 }}
                >
                  <strong style={{ color: "rgba(255,255,255,0.85)" }}>
                    A question for the community:
                  </strong>{" "}
                  I cannot speak to what others may have experienced. But it
                  would not be surprising if this pattern has touched other people
                  in this scene — organizers or artists who ran into similar dynamics
                  and didn't have the receipts, the platform, or the energy to
                  document it publicly. The kizomba community is already a small,
                  fragile world. It does not need this kind of unnecessary friction
                  making it smaller. This record is part of an effort to grow the
                  scene honestly — and that starts with the community being able to
                  see clearly what is happening within it.
                </Text>

                <Text
                  c={colors.textSecondary}
                  style={{ fontSize: responsiveText.small, lineHeight: 1.8, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}
                >
                  <strong style={{ color: "rgba(255,255,255,0.85)" }}>
                    A broader note for artists and organizers in this scene:
                  </strong>{" "}
                  This situation is a reminder that disputes can surface years after the
                  fact — with or without Lucas involved. Keep your receipts. Keep your
                  messages. Keep a paper trail of every payment sent and received, every
                  agreement made, and every attempt to communicate. Not because you
                  expect bad faith — but because memory fades, narratives shift, and the
                  only thing that holds up years later is documentation. This record
                  exists because I kept mine. Yours should too.
                </Text>

                <Text
                  c={colors.textSecondary}
                  style={{ fontSize: responsiveText.small, lineHeight: 1.8, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}
                >
                  And there is a broader question this community deserves to sit with:{" "}
                  <Text span fw={700} style={underlineAccent}>why are we accepting this?</Text>{" "}
                  A pattern this clear — spanning multiple years, multiple incidents,
                  multiple people — does not go unnoticed.{" "}
                  <Text span fw={700}>Scenes are shaped by what they tolerate.</Text>{" "}
                  If we want a kizomba community that is worth growing, worth inviting
                  people into, worth defending — we have to be willing to name what is
                  happening inside it, and decide together that we are not okay with it.
                </Text>
              </Stack>
            </Stack>
          </GlassCard>

          {/* ── Section 8: Further Context ───────────────────── */}
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
                style={{ fontSize: responsiveText.small, lineHeight: 1.8 }}
              >
                I ran NeoKiz for a decade. I built something real in this community. This page
                exists because the truth deserves a permanent address. My records are open. My
                door is still open. The documentation above speaks for itself.
              </Text>

              <Divider color="rgba(255,255,255,0.05)" />

              <Text
                fw={600}
                c={colors.textPrimary}
                style={{ fontSize: responsiveText.small }}
              >
                — Charles Ogar
              </Text>

              <Text c={colors.textDim} style={{ fontSize: responsiveText.xs }}>
                Last updated: March 27, 2026
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
                date="March 27, 2026"
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
        </Stack>
      </FarewellLayout>
    </>
  );
};

export default AlbirPaymentRecord;

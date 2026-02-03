# Neo Kizomba Festival - Refund System PRD

---

## Instructions for Claude Code

Before implementing, please complete the following assessment:

### 1. Codebase Review
- Review the existing codebase structure
- Identify the tech stack currently in use (React version, styling approach, state management, routing)
- Note any existing patterns, conventions, or architecture decisions
- Identify existing components that can be reused

### 2. Gap Analysis
- Identify what components/pages already exist vs. what needs to be built
- Note any dependencies that need to be added (Mantine, etc.)
- Identify any existing API integrations or webhook handlers

### 3. Implementation Plan
- Create a phased implementation plan with clear milestones
- Estimate complexity for each page/feature (Low/Medium/High)
- Identify dependencies between features (what must be built first)
- Suggest order of implementation for fastest path to MVP

### 4. Technical Recommendations
- Recommend folder structure for new features
- Identify any refactoring needed to support new features
- Note any potential blockers or risks
- Suggest testing approach

### 5. Output
After assessment, provide:
1. Summary of current codebase state
2. Detailed implementation plan with phases
3. File/folder structure for new features
4. Recommended order of development
5. Any questions or clarifications needed before starting

---

## Overview

A React + Mantine site that serves as the single source of truth for the Neo Kizomba Festival closure. Social media posts will link to this site rather than containing the full content.

---

## Site Structure

```
neokizombafestival.com/farewell
│
├── /              Landing + The Farewell Letter
├── /faq           Common questions answered
├── /request       Ticket holder refund form
├── /support       Supporter flow (shirts, donations via Lemon Squeezy)
├── /status        Check your request status (Confirmation # + Email lookup)
└── /progress      Public accountability dashboard
```

---

## Pages to Build

| Page | Route | Purpose |
|------|-------|---------|
| Landing | `/` | The Farewell Letter + links to request form, support page, FAQ |
| FAQ | `/faq` | Common questions answered |
| Ticket Holder Form | `/request` | Email lookup → decision → shirts → submit |
| Confirmation | `/confirmation` | Shows summary + confirmation # after submission |
| Status Lookup | `/status` | Confirmation # + email → personal status |
| Supporter Checkout | `/support` | For non-ticket holders - buy shirt, donate, or both (Lemon Squeezy) |
| Public Dashboard | `/progress` | Anonymized progress tracker with receipts |

---

## Complete System Architecture

```
┌───────────────────────────────────────────────────────────────────────┐
│                     REACT SITE (Mantine UI)                           │
│                 neokizombafestival.com/farewell                       │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐   │
│  │  Landing    │  │  Ticket     │  │  Supporter  │  │  Public    │   │
│  │  Page       │  │  Holder     │  │  Flow       │  │  Status    │   │
│  │  + Letter   │  │  Form       │  │             │  │  Dashboard │   │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬─────┘   │
│         │                │                │                │         │
│         │         ┌──────┴──────┐         │                │         │
│         │         │  Status     │         │                │         │
│         │         │  Lookup     │         │                │         │
│         │         └──────┬──────┘         │                │         │
│         │                │                │                │         │
└─────────┼────────────────┼────────────────┼────────────────┼─────────┘
          │                │                │                │
          │                ▼                │                │
          │         ┌─────────────┐         │                │
          │         │   n8n       │◄────────┼────────────────┘
          │         │   Webhooks  │         │
          │         └──────┬──────┘         │
          │                │                │
          │                ▼                ▼
          │         ┌─────────────┐  ┌─────────────┐
          │         │   Notion    │  │   Lemon     │
          │         │   Databases │  │   Squeezy   │
          │         └──────┬──────┘  └──────┬──────┘
          │                │                │
          │                ▼                │
          │         ┌─────────────┐         │
          │         │   JSON      │◄────────┘
          │         │   (Public   │   (webhook on purchase)
          │         │   Status)   │
          │         └─────────────┘
          │
          ▼
    ┌─────────────┐
    │  Social     │
    │  Post       │
    │  (Facebook) │
    └─────────────┘
```

---

## User Flows

### Flow 1: Ticket Holder

```
1. Landing Page → "I had a ticket" button
2. Email lookup → validates against Master List in Notion
3. If chargeback → REJECTED, end ("You are not eligible")
4. If valid → Shows: "We found your pass: [Type], [Amount Paid]"
5. Decision: Full Refund / Partial Refund / Waive
6. T-shirt add-on: Yes/No → Quantity → Sizes
7. Live calculation: "Your refund: $150 - 1 shirt ($45) = $105"
8. Zelle contact (if refund coming)
9. Shipping address (if shirt)
10. Submit → Confirmation page with summary + confirmation #
```

### Flow 2: General Supporter (no ticket)

```
1. Landing Page → "I'm here to support" button
2. Options:
   - Buy T-shirt(s) - $45 each → Quantity → Sizes → Shipping
   - Donate → Amount
   - Both → Combine above
3. Lemon Squeezy checkout → Confirmation page
```

### Flow 3: Status Lookup

```
1. Status page → Enter Confirmation # + Email
2. Validates both match in Notion
3. If match → Show personalized status:
   - Status: Processing/Completed/etc.
   - Decision made
   - Refund amount (if any)
   - Shirt details (if any)
   - Timeline of events
4. If no match → "Not found, check your info"
```

---

## Page Details

### Landing Page (/)

The Farewell Letter lives here. Content includes:
1. Opening - Acknowledgment that this is the end
2. The Why - Not excuses, just truth. What happened.
3. What We Built - Festival innovations and legacy
4. The Reality - Economics, the weight carried
5. What Happens Now - Refund commitment
6. The Shirt - A way to close the chapter with something tangible
7. The Path Forward - Links to request form, FAQ, progress tracker

Navigation:
- Link to `/request` for ticket holders
- Link to `/support` for supporters
- Link to `/faq` for questions
- Link to `/progress` for public tracking

### FAQ Page (/faq)

Common questions:
- "When will I get my refund?"
- "What if I did a chargeback?"
- "Can I get a shirt if I didn't have a ticket?"
- "How do I check my status?"
- "Who can I contact?"

### Request Form (/request)

Multi-step form:
1. Email input + validation
2. Pass details display (from Notion lookup)
3. Decision selection
4. T-shirt options (if desired)
5. Contact/shipping info
6. Summary + submit

### Support Page (/support)

For non-ticket holders:
- Shirt product card ($45, sizes S-2XL)
- Donation option (custom amount)
- Links to Lemon Squeezy checkout

### Status Lookup (/status)

Simple form:
- Confirmation # input (pre-fillable via URL param)
- Email input
- Submit → displays personalized status

### Progress Dashboard (/progress)

Public accountability page showing:
```
Refund Requests
───────────────────────────────
✓ #0012 S.M. - completed
✓ #0008 J.T. - completed
✓ #0015 A.K. - completed
○ #0022 M.L. - processing
○ #0019 D.R. - processing

Community Support (Waived)
───────────────────────────────
♥ #0003 K.B.
♥ #0011 P.S.
♥ #0007 A.W.

───
21 of 34 refunds completed
8 passes waived with gratitude

Last updated: Jan 28, 2026
```

---

## n8n Workflows Needed

| Workflow | Trigger | Actions |
|----------|---------|---------|
| **Validate Email** | Webhook from form | Query Notion Master List, check chargeback, return pass details |
| **Submit Request** | Webhook from form | Create Refund Request in Notion, send confirmation email |
| **Check Status** | Webhook from lookup | Query by Confirmation # + Email, return record |
| **Lemon Squeezy Purchase** | Lemon Squeezy webhook | Log to Notion (supporter shirts/donations) |
| **Update Public JSON** | Button in Notion OR on any status change | Regenerate JSON, push to hosting |
| **Send Confirmation Email** | Button in Notion | Send email with confirmation # |
| **Send Refund Processed Email** | Button in Notion | Notify them refund was sent |
| **Send Shirt Shipped Email** | Button in Notion | Notify with tracking (if applicable) |

---

## Notion Databases

1. **Master Ticket Holders** - imported from Dance Place + Dance Convention CSVs
2. **Refund Requests** - form submissions + status tracking
3. **Chargebacks** - imported from Stripe
4. **Supporter Orders** - from Lemon Squeezy webhook
5. **Zelle Transfers** - outgoing refunds logged
6. **Loan Tracker** - $600/month payments
7. **Shirt Orders** - embedded in Refund Requests + Supporter Orders

---

## Lemon Squeezy Products

| Product | Price | Variants |
|---------|-------|----------|
| Neo Kizomba Farewell Shirt | $45 | S, M, L, XL, 2XL |
| Donation | Custom amount | — |

---

## Technical Stack

- **Frontend**: React + Mantine UI
- **Hosting**: Vercel
- **Backend/Automation**: n8n (webhooks, email, Notion API)
- **Database**: Notion
- **Payments**: Lemon Squeezy (for supporters only)
- **Refunds**: Zelle (manual from Ally account)
- **Public Data**: JSON file (pushed by n8n, served statically)

---

## Data Flow

### Ticket Holder Submission
```
React Form → n8n Webhook → Notion (Refund Requests) → Confirmation Email
```

### Status Updates
```
Notion Button Click → n8n Webhook → Update Status + Send Email + Regenerate JSON
```

### Public Dashboard
```
n8n → Generates JSON → Pushes to Vercel/GitHub → React reads static JSON
```

### Supporter Purchase
```
React → Lemon Squeezy Checkout → Lemon Squeezy Webhook → n8n → Notion (Supporter Orders)
```

---

## JSON Structure for Public Dashboard

```json
{
  "lastUpdated": "2026-01-28T14:30:00Z",
  "stats": {
    "totalRequests": 34,
    "completed": 21,
    "processing": 5,
    "waived": 8
  },
  "refunds": [
    { "id": "RR-0012", "initials": "S.M.", "status": "completed" },
    { "id": "RR-0008", "initials": "J.T.", "status": "completed" },
    { "id": "RR-0022", "initials": "M.L.", "status": "processing" }
  ],
  "waived": [
    { "id": "RR-0003", "initials": "K.B." },
    { "id": "RR-0011", "initials": "P.S." }
  ]
}
```

---

## Business Rules

1. **Chargeback = No participation** - If someone already did a chargeback, they cannot request a refund or buy a shirt
2. **US only** - No international shipping/Zelle
3. **Ship only** - No local pickup for shirts
4. **No passes under $40** - Shirt math always works (can deduct $45 from refund)
5. **Made-to-order** - Order blanks + designs after orders close
6. **Deadline** - Shirt orders close on a set date (TBD)

---

## Status Lookup Authentication

- **Method**: Confirmation # + Email combo
- **No accounts required**
- **Pre-fillable via URL**: `/status?ref=RR-0042` (email still required)
- **Shows full details** if authenticated (refund amount, shirt order, shipping status, timeline)

---

## Social Media Strategy

Instead of a long Facebook post, use a short post linking to the site:

> "Neo Kizomba Festival has come to an end. I've written a letter to everyone who's been part of this journey.
>
> If you had a ticket, there's a process for refunds.
>
> [link to neokizombafestival.com/farewell]"

Short. Dignified. Drives to the full content.

---

## Next Steps

1. ✅ Notion databases (via Notion AI prompt)
2. Set up Lemon Squeezy account + products
3. Set up Ally bank account
4. Build n8n workflows (start with email validation + submit)
5. Build React pages (start with form + confirmation)
6. Connect everything
7. Test the full flow
8. Finalize the farewell letter content
9. Launch

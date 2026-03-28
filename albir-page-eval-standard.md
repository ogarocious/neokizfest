# AlbirPaymentRecord — Eval Standard
**Created:** March 27, 2026
**Purpose:** Reusable quality checklist for the Albir Payment Record page and any future case-file pages of this type. Run this audit before any major publish or update.

---

## Eval Categories & Criteria

### CATEGORY 1: Content Accuracy

| ID | Eval | Pass Criteria |
|----|------|---------------|
| 1.1 | **Factual Accuracy** | Every dated claim matches a documented exhibit (image, email, receipt) on the page |
| 1.2 | **Timing Accuracy** | All time calculations (months/years between events) are mathematically verified against the timeline dates |
| 1.3 | **Completeness** | No event mentioned in descriptive text that doesn't have a corresponding timeline entry or exhibit |

**Common failure modes:**
- Saying "less than a year later" when the actual gap is 19 months
- Saying "nearly two years" when 16 months have elapsed
- Conflating two separate events (e.g., Lucas's June 2024 DM and the Feb 2026 Dance-Stein Files) into one timeline beat

---

### CATEGORY 2: Voice & Clarity

| ID | Eval | Pass Criteria |
|----|------|---------------|
| 2.1 | **Pronoun Clarity** | Every he/his/your/we/our has an unambiguous referent in the same sentence or the immediately preceding sentence |
| 2.2 | **Voice Consistency** | Timeline = Charles (3rd person) · Editorial sections = I/my (1st person) · Questions = you/your (2nd person addressing Albir) |
| 2.3 | **Absolutist Language** | No claim is broader in scope than what the evidence can support; prefer "contributed to" over "caused," "a factor in" over "the reason" |

**Common failure modes:**
- "He" following a sentence with two male subjects
- "Your" in the email exhibit referring to DJ Art while reader expects Albir
- "The direct reason" when multiple factors were in play
- "Every incident stems from" when only some do

---

### CATEGORY 3: Legal & Strategic

| ID | Eval | Pass Criteria |
|----|------|---------------|
| 3.1 | **Evidence Grounding** | Each claim is one of: DIRECTLY EVIDENCED (exhibit on page), INFERRED (pattern or absence), or STATED PREMISE (acknowledged context not independently receipted) |
| 3.2 | **Characterization Accuracy** | Strong labels (bullying, sabotage, coercion, tacit authorization) are tied to a documented pattern of at least 3 incidents — not a single event |
| 3.3 | **Authorization Scope** | When claiming someone acted "on behalf of" another, uncertainty is explicitly acknowledged where the authorization is not documented ("whether with your knowledge or without it") |
| 3.4 | **No Defamation Risk** | Claims about specific individuals are either: (a) directly quoted from their own words, (b) described from documented exhibits, or (c) framed as inference/question — never stated as certain fact beyond what evidence shows |

**Common failure modes:**
- Stating "he coordinated with Albir" when coordination is inferred not documented
- "Lucas published this to damage Charles" — intent is inferred, should be framed as pattern/inference
- Labeling behavior as "bullying" without tying it to the documented pattern first

---

### CATEGORY 4: Formatting

| ID | Eval | Pass Criteria |
|----|------|---------------|
| 4.1 | **Text Size Consistency** | All body paragraphs use `responsiveText.small`; captions and exhibit labels use `responsiveText.xs`; no hardcoded font sizes in body content |
| 4.2 | **Formatting Density** | ~25–30% of editorial section paragraphs have at least one formatting layer (bold `fw={700}`, italic `fs="italic"`, or orange underline via `underlineAccent`) |
| 4.3 | **GlassCard Separation** | No two GlassCard section containers are adjacent without intervening content; GlassCard callouts (accent variant) reserved for thesis statements only |
| 4.4 | **underlineAccent Defined** | The `underlineAccent` constant is defined at the top of the file if used anywhere in the component |

**Formatting layer targets for this page (shorter article ~25–30% density):**
| Layer | Target Count |
|-------|-------------|
| Bold inline (`fw={700}`) | 4–6 uses |
| Italic inline (`fs="italic"`) | 2–3 uses |
| Orange underline (`underlineAccent`) | 4–6 uses |
| Bold + underline combined | 2–3 uses (reserved for climactic lines) |

---

### CATEGORY 5: Structural

| ID | Eval | Pass Criteria |
|----|------|---------------|
| 5.1 | **Timeline Gap Coverage** | All multi-month silences (2+ months between events) have `gapAfterMonths` defined on the preceding timeline entry |
| 5.2 | **Question Integrity** | No question has a factually incorrect premise; no two questions make the same core point; each question targets a distinct accountability gap |
| 5.3 | **Intentional Redundancy** | Editorial restatements of timeline facts serve a rhetorical or argumentative purpose — they add interpretation, not just repetition |
| 5.4 | **Section Flow** | Each section leads logically to the next: Timeline → Evidence Exhibit → Questions → Why Public → Lucas Warning → Further Context → Closing |

**Question integrity checklist (run against each question):**
- [ ] Is the premise factually grounded in a dated exhibit on the page?
- [ ] Are all time references mathematically accurate?
- [ ] Does this question cover ground not already covered by another question?
- [ ] Is the question asking something Albir can actually answer (not a rhetorical trap)?
- [ ] Is the emotional register of the question consistent with the calm/direct tone standard?

---

## Audit Log

| Date | Auditor | Issues Found | Status |
|------|---------|-------------|--------|
| March 27, 2026 | Claude Code (full audit) | Q2 timing error ("less than a year" should be "over a year"); image filenames have 2025 in name when events were 2026; all other evals passed | Fixed |

---

## Known Accepted Issues (Won't Fix)

| Issue | Reason Accepted |
|-------|----------------|
| Image filenames `whatsapp_feb16_2025.jpg` and `whatsapp_mar2025.jpg` contain "2025" | File naming artifacts — images render correctly, captions show correct 2026 dates |
| Q6 student relationship (2014–2017) is stated premise not independently evidenced on page | Opening context establishes this; reasonable trust in personal testimony |
| Lucas's role as "North America booking manager" sourced from his own outreach, not external documentation | Noted in description as "described as" — appropriately hedged |

---

## Page Constants Reference

```tsx
// underlineAccent — orange underline for key phrases
const underlineAccent: React.CSSProperties = {
  textDecoration: "underline",
  textDecorationColor: "#F45D00",
  textUnderlineOffset: "4px",
  textDecorationThickness: "2px",
};

// Voice zones
// Timeline TIMELINE[] → 3rd person (Charles, Albir, Lucas)
// QUESTIONS[] → 2nd person (you = Albir)
// JSX editorial sections → 1st person (I = Charles)
```

---

## File Locations

- **Page:** `app/frontend/pages/AlbirPaymentRecord.tsx`
- **Images:** `public/images/case/`
- **Eval standard (this file):** `albir-page-eval-standard.md`
- **Formatting style guide:** `.claude/projects/.../memory/formatting-style.md`
- **Payment process log:** `.claude/projects/.../memory/payment-process.md`

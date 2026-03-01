# Pardon Report — Private Reference

Not for sharing. Run this when pulling numbers from Notion for a progress check.

---

## What to Pull

**1. Waived passes**
Notion: `Refund Requests DB` → `Status = Waived`
Cross-reference Ticket Holder relation → `Amount Paid` on Master Ticket Holders DB (plain number field).
Note: `Refund Amount Requested` is not reliably filled on waived records — use ticket holder `Amount Paid`.

**2. Partial refund surpluses**
Notion: `Refund Requests DB` → `Status = Completed`, where `Refund Amount Requested < Ticket Holder Amount Paid`
Pardoned portion = `Ticket Holder Amount Paid` − `Refund Amount Requested` per record. Sum the gaps.

**3. Donations**
Notion: `Supporter Orders DB` → sum all donation amounts + donor count.

**4. Ticket holder breakdown**
Master Ticket Holders DB → categorize each holder:
- Filed: ticket holder page ID appears in any Refund Request's "Ticket Holder" relation
- Chargeback: "Chargeback" property is checked/set (Stripe already clawed back — exclude from owed totals)
- Non-filer: everyone else (never filed, no chargeback)

**5. Paid out**
Zelle Transfers DB → sum "Amount" property across all records.

---

## Report Format (what to return in chat)

```
─── TICKET HOLDER BREAKDOWN ───────────────────────────
Total ticket holders:  X
Filed a request:       X
Never filed (pool):    X — $X,XXX.XX
Chargebacks:           X — $X,XXX.XX (already clawed back by Stripe)

─── COMMUNITY GOODWILL ────────────────────────────────
Waived: X passes — $X,XXX.XX
Partial refunds: X — $X,XXX.XX gap (pardoned portion)
Donations: X donors — $X,XXX.XX

Pardon total (waivers + partials): $X,XXX.XX
Pardon + donations: $X,XXX.XX

Waive rate — of all filers (X/X): XX.X%
Waive rate — of resolved only (X/X): XX.X%

─── PAYMENT ACCOUNTING ────────────────────────────────
Total collected (gross):         $XX,XXX.XX
Chargebacks (excluded):         -$X,XXX.XX
Waived (forgiven):              -$X,XXX.XX
Partial gaps (forgiven):        -$X,XXX.XX
Already paid out (Zelle):       -$X,XXX.XX
                                 ────────────────
Net still owed:                  $XX,XXX.XX
  └─ To open filers (pending):   $X,XXX.XX (X requests)
  └─ Non-filer pool:             $X,XXX.XX (X holders)

─── RATIOS ─────────────────────────────────────────────
Pardon vs. total collected: XX.X%
Pardon vs. total paid out:  XXX.X%
```

---

## Notes on Chargebacks

Chargeback amounts are excluded from "net still owed" because Stripe already reversed those charges — Charles doesn't owe refunds to chargeback holders; the money was already taken back. However, Stripe charges dispute fees per chargeback (~$15 each), which are a separate cost not tracked here.

---

## Stripe Balance Obligation

As of Feb 28, 2026, the Stripe account balance is **-$4,997.33**. This is a real cash obligation — must deposit this to bring the account back to $0. Plan to resolve within a few weeks.

This is separate from and in addition to the Zelle refund queue.

**Full dispute breakdown (13 disputes, $6,658.75 total):**

| Status | Customer | Amount | Disputed |
|---|---|---|---|
| Lost ❌ | nikitlamba@gmail.com | $1,153.84 | Jul 23, 2025 |
| Lost ❌ | bobbykadeer1962@outlook.com | $1,297.00 | Jul 7, 2025 |
| Lost ❌ | azhar.azharqureshi@gmail.com | $560.00 | Jul 10, 2025 |
| Lost ❌ | gabriellex14@gmail.com | $280.00 | Jul 10, 2025 |
| Lost ❌ | kmagni@cfuturell.com | $270.00 | Jul 5, 2025 |
| Lost ❌ | stephanie.jean25@gmail.com | $125.00 | Jul 5, 2025 |
| Deadline missed | danielwque@gmail.com | $1,172.30 | Sep 30, 2025 |
| Deadline missed | danielwque@gmail.com | $105.27 | Sep 27, 2025 |
| Deadline missed | scottromaine@hotmail.com | $150.00 | Sep 24, 2025 |
| Deadline missed | maika0731@gmail.com | $104.42 | Oct 2, 2025 |
| Deadline missed | hey_its_me_scalos@yahoo.com | $112.42 | Aug 25, 2025 |
| **Pending** ⏳ | **vamika_bajaj@hotmail.com** | **$1,224.08** | **Feb 4, 2026** |
| Inquiry closed ✓ | biba.ih@gmail.com | $104.42 | Jul 27, 2024 |

**Total confirmed lost** (Lost + Deadline missed): **$5,330.25**
**Still live**: $1,224.08 — vamika is withdrawing the dispute herself and will be refunded directly via Zelle. If withdrawn, Stripe balance improves to **-$3,773.25**.

**Total immediate cash obligations (as of Feb 28, 2026):**

| Obligation | Amount | Notes |
|---|---|---|
| Stripe balance to restore | $4,997.33 | Resolving in ~weeks |
| Pending Zelle refunds (31 requests) | $5,241.40 | Resumes ~Mar 22 |
| **Immediate total** | **$10,238.73** | |
| Non-filer pool (48 holders) | $6,517.48 | Contingent — only if they file |
| **Grand total worst case** | **$16,756.21** | |

---

## Historical Log

| Date | Day | Waived | Waived $ | Partials | Partial $ | Donors | Donations $ | Pardon Total | Pardon + Donations | Waive % (all) | Waive % (resolved) | Paid Out | Non-Filer Pool | Chargebacks | Net Still Owed |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Feb 22, 2026 | 9 | 51 | $5,798.90 | TBD | TBD | 34 | $2,815.00 | $5,798.90+ | $8,613.90+ | — | — | — | — | — | — |
| Feb 25, 2026 | 12 | 62 | $6,993.10 | 8 | $1,017.36 | 35 | $2,865.00 | **$8,010.46** | **$10,875.46** | 47.3% | 56.9% | — | — | — | — |
| Feb 26, 2026 | 13 | 63 | $7,105.52 | 8 | $1,017.36 | 35 | $2,865.00 | **$8,122.88** | **$10,987.88** | 47.4% | 57.3% | — | — | — | — |
| Feb 27, 2026 | 14 | 67 | $7,539.20 | 8 | $1,017.36 | 35 | $2,865.00 | **$8,556.56** | **$11,421.56** | 47.2% | 58.8% | $7,365.50 | $7,019.90 (51) | $5,310.94 (11) | **$11,868.88** ($4,848.98 filers + $7,019.90 pool) |
| Feb 28, 2026 | 15 | 67 | $7,539.20 | 10 | $1,234.20 | 37 | $2,890.00 | **$8,773.40** | **$11,663.40** | 46.2% | 58.8% | $7,365.50 (paused) | $6,517.48 (48) | $5,330.25 (11, per Stripe) | **$11,758.88** ($5,241.40 filers + $6,517.48 pool) + $4,997.33 Stripe |

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

## Historical Log

| Date | Day | Waived | Waived $ | Partials | Partial $ | Donors | Donations $ | Pardon Total | Pardon + Donations | Waive % (all) | Waive % (resolved) | Paid Out | Non-Filer Pool | Chargebacks | Net Still Owed |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Feb 22, 2026 | 9 | 51 | $5,798.90 | TBD | TBD | 34 | $2,815.00 | $5,798.90+ | $8,613.90+ | — | — | — | — | — | — |
| Feb 25, 2026 | 12 | 62 | $6,993.10 | 8 | $1,017.36 | 35 | $2,865.00 | **$8,010.46** | **$10,875.46** | 47.3% | 56.9% | — | — | — | — |
| Feb 26, 2026 | 13 | 63 | $7,105.52 | 8 | $1,017.36 | 35 | $2,865.00 | **$8,122.88** | **$10,987.88** | 47.4% | 57.3% | — | — | — | — |
| Feb 27, 2026 | 14 | 67 | $7,539.20 | 8 | $1,017.36 | 35 | $2,865.00 | **$8,556.56** | **$11,421.56** | 47.2% | 58.8% | $7,365.50 | $7,019.90 (51) | $5,310.94 (11) | **$11,868.88** ($4,848.98 filers + $7,019.90 pool) |
| Feb 28, 2026 | 15 | 67 | $7,539.20 | 8 | $1,017.36 | 36 | $2,890.00 | **$8,556.56** | **$11,446.56** | 46.9% | 58.8% | $7,365.50 (paused) | $6,749.90 (50) | $5,310.94 (11) | **$11,818.88** ($5,068.98 filers + $6,749.90 pool) |

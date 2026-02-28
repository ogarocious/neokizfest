# NeoKizFest — Liability Report
Private reference. Do not share.

> Last updated: Feb 27, 2026 · Day 14

---

## Full Financial Picture

| Category | Count | Amount | Nature |
|---|---|---|---|
| Chargebacks | 11 | $5,310.94 | Already reversed — money already gone |
| Open requests (queued) | 27 | $4,798.98 | Future obligation — owed, Zelle paused |
| Gap records (unlogged) | 3 | $683.40 | Verify — may already be paid |
| Non-filer pool | 55 | $7,461.58 | Potential future obligation (never filed) |
| **Net still owed (filers + pool)** | | **$12,260.56** | Pending payout + non-filer pool |
| **Total financial impact (absorbed)** | | **$5,310.94** | Chargebacks — already gone |

**Zelle status: PAUSED** — resumes March 22, 2026.
All Verified requests are staged and ready to send the moment it resets.

---

## Chargebacks — Already Reversed

These 11 holders filed bank disputes. Money was clawed back before refunds could be issued.
Past forced loss, not a future obligation. Total absorbed: **$5,310.94**.
Stripe dispute fees (~$15 each) add an estimated **~$165** in additional costs not tracked here.

| Name | Amount Paid | Notes |
|---|---|---|
| Shannon Qureshi | $1,297.00 | |
| Nikit Lamba | $1,153.84 | |
| Daniel Que (Hotel Package) | $1,153.84 | Same person as below — two tickets |
| Azhar Qureshi | $560.00 | |
| Gabrielle Witham | $280.00 | |
| Kristen Magni | $270.00 | |
| Scott Romaine | $150.00 | |
| Stephanie Jean | $125.00 | |
| S W | $112.42 | Initials only on record |
| Daniel Que (Believers Pass) | $104.42 | Same person as above — two tickets |
| Maika Ito | $104.42 | |

> Note: Amounts above use `Amount Paid` from the ticket holder record as proxy. Update if dispute outcomes differ.

---

## Open Requests — Future Obligation (Day 14)

27 total open requests — $4,798.98

### By Status
| Status | Count | Amount |
|---|---|---|
| Verified (approved, awaiting payment) | 14 | $2,366.78 |
| Processing (under review) | 2 | $208.84 |
| Submitted (awaiting review) | 11 | $2,223.36 |
| **Total active** | **27** | **$4,798.98** |

### Full Queue (sorted by status, then RR #)
| RR # | Name | Status | Amount | Notes |
|---|---|---|---|---|
| RR-0058 | Dori Ginsburg | Verified | $80.00 | |
| RR-0059 | Angela Gohokar | Verified | $104.42 | |
| RR-0079 | Darryel Moore | Verified | $112.42 | |
| RR-0098 | Crystal Dismuke | Verified | $80.00 | |
| RR-0101 | Jason Tang | Verified | $800.00 | Largest verified |
| RR-0105 | Kayla Jones-Espinet | Verified | $104.42 | |
| RR-0106 | Juan Loaiza | Verified | $112.42 | |
| RR-0110 | Elizabeth Claire | Verified | $101.00 | |
| RR-0114 | Mcarlain Morilus | Verified | $104.42 | |
| RR-0115 | Ramya Enganti | Verified | $104.42 | |
| RR-0122 | Cynthia Hauk | Verified | $104.42 | |
| RR-0124 | Cara Doyle | Verified | $104.42 | |
| RR-0126 | Sherry Chen | Verified | $350.00 | |
| RR-0128 | Aric Cuffie | Verified | $104.42 | |
| RR-0118 | James Locus | Processing | $104.42 | ⚠️ Possible duplicate — RR-0050 already paid $175. Verify second ticket before processing. |
| RR-0065 | Leslie Schulze | Processing | $104.42 | ⚠️ shaw.ca email — Canadian. Confirm Wise vs. Zelle before March 22 queue. |
| RR-0073 | Vamika Bajaj | Submitted | $1,153.84 | ⚠️ Largest submitted — oldest unreviewed |
| RR-0132 | Jordan Lekeufack Sopze | Submitted | $75.00 | |
| RR-0133 | Wesley Green | Submitted | $104.42 | |
| RR-0136 | Anitia Archuleta | Submitted | $104.42 | |
| RR-0137 | Janet Echeverria | Submitted | $104.42 | |
| RR-0138 | Mitch Oduor | Submitted | $52.00 | |
| RR-0141 | Ajap G | Submitted | $112.42 | New since Day 12 |
| RR-0143 | Jeremy Lightsmith | Submitted | $150.00 | New since Day 12 |
| RR-0144 | Jennifer Siler | Submitted | $112.42 | New since Day 12 |
| RR-0145 | Rajesh Talwar | Submitted | $150.00 | New since Day 12 |
| RR-0146 | Karen Olsen | Submitted | $104.42 | New since Day 12 |

---

## Gap Records — Completed with No Transfer Logged

Marked Completed in Notion but no linked Zelle/Wise transfer record exists.
Confirm whether payment went out, then log via rake task.

| RR # | Name | Amount | Notes |
|---|---|---|---|
| RR-0034 | Sarah Manouzi | $466.56 | Large amount — verify payment method and confirm receipt |
| RR-0104 | Colleen Zaller | $112.42 | $0 in Refund Amount Requested — confirm actual amount paid |
| RR-0127 | Kelly Ann Jones | $104.42 | $0 in Refund Amount Requested — confirm actual amount paid |

**Gap total: $683.40** — unchanged since Day 12.

---

## Non-Filer Pool — Potential Future Liability

55 ticket holders have not filed any request. Total pool value: **$7,461.58** (avg $135.67).

*(Down from 75 on Day 12 / ~96 on Day 9 — 41+ more people have filed since launch.)*

| Scenario | Waivers | Refunds | Additional Liability |
|---|---|---|---|
| Realistic (46.4% waive rate holds) | ~26 | ~29 | **~$3,934** |
| Conservative (30% waive) | ~17 | ~39 | **~$5,239** |
| Worst case (0% waive, all 55 file) | 0 | 55 | **$7,461.58** |

> Non-filer avg ticket ($135.67) is lower than the original pool average ($166–$184) — the higher-value pass holders largely filed already.

---

## March 22 Zelle Queue (Priority Order)

When Zelle resumes, send Verified requests oldest-first:

| Priority | RR # | Name | Amount | Contact |
|---|---|---|---|---|
| 1 | RR-0058 | Dori Ginsburg | $80.00 | Deginsb@gmail.com / 847-757-7030 |
| 2 | RR-0059 | Angela Gohokar | $104.42 | 5127454677 |
| 3 | RR-0079 | Darryel Moore | $112.42 | Darryel508@gmail.com |
| 4 | RR-0098 | Crystal Dismuke | $80.00 | 4143645079 |
| 5 | RR-0101 | Jason Tang | $800.00 | tang20@gmail.com / 2103805589 |
| 6 | RR-0105 | Kayla Jones-Espinet | $104.42 | Kaylajonesespinet@gmail.com |
| 7 | RR-0106 | Juan Loaiza | $112.42 | 3057264555 |
| 8 | RR-0110 | Elizabeth Claire | $101.00 | elizabethashleyclaire@gmail.com |
| 9 | RR-0114 | Mcarlain Morilus | $104.42 | 3479849219 |
| 10 | RR-0115 | Ramya Enganti | $104.42 | eramyarao@gmail.com |
| 11 | RR-0122 | Cynthia Hauk | $104.42 | Cynthia.hauk@gmail.com |
| 12 | RR-0124 | Cara Doyle | $104.42 | 9709994298 |
| 13 | RR-0126 | Sherry Chen | $350.00 | 7043382886 |
| 14 | RR-0128 | Aric Cuffie | $104.42 | 229-894-8533 |

**Verified queue total: $2,366.78**
*(RR-0065 Leslie Schulze held — confirm Zelle vs. Wise. RR-0118 James Locus held — verify duplicate.)*

---

## Flags

**⚠️ RR-0118 James Locus — possible duplicate**
RR-0050 (James Locus, $175.00) was already paid via Zelle on Feb 19. RR-0118 is a second submission for the same name, $104.42. Verify whether this is a second ticket before processing.

**⚠️ RR-0073 Vamika Bajaj — $1,153.84 — oldest unreviewed**
Largest submitted request. Still awaiting review.

**⚠️ RR-0101 Jason Tang — $800.00 — largest verified**
Ready to send when Zelle resumes. Second in dollar-value priority.

**⚠️ RR-0065 Leslie Schulze — shaw.ca email**
Canadian address suggests international. May need Wise instead of Zelle. Confirm before March 22.

**⚠️ Gap records — $683.40 unlogged**
RR-0034, RR-0104, RR-0127 marked Completed but no Zelle transfer linked. Confirm payments went out.

---

## Update Checklist (run when refreshing)

Run `bin/rails finance:report` for a live snapshot, then update this file manually for:
- [ ] Flag resolution (RR-0118 duplicate, RR-0065 method, gap records)
- [ ] March 22 queue additions (as new requests get Verified)
- [ ] Chargeback table updates (if dispute outcomes change)
- [ ] Cross-check with `payout-report.md` and `pardon-report.md`

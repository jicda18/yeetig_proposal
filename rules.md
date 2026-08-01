# Business Rules Specification: PartnerHub

This document defines the 40 core business rules, operational constraints, and domain invariants governing the **PartnerHub** platform.

---

## 1. Authentication & Security (Rules 1 – 4)

1. **Unified Authentication System**: Internal administrators and partners share the exact same underlying authentication mechanism.
2. **User Identity Scope**: A user can be an internal platform administrator (`partner_id = null`) or a partner user (`partner_id` populated).
3. **Failed Attempt Tracking**: Consecutive failed authentication attempts are systematically monitored and controlled by the system.
4. **Account Lockout Security**: A locked user account (`locked_at` populated) cannot authenticate until explicitly unlocked by an authorized administrator.

---

## 2. Commercial Partners & Clients (Rules 5 – 9)

5. **Commercial Entity Identity**: A Partner represents the commercial entity eligible to earn and receive commissions.
6. **Multi-User Accounts**: A Partner entity can have multiple associated user accounts.
7. **Multi-Client Referrals**: A Partner can refer and maintain relationships with multiple clients.
8. **Multi-Partner Clients**: A single client can have active referral relationships with multiple partners simultaneously.
9. **Commission Plan Assignment**: The partner-client relationship (`partner_client`) defines the applicable commission plan for that referral pair.

---

## 3. Commission Plans (Rules 10 – 11)

10. **Plan Immutability**: Existing commission plans are immutable. Updates are made by creating a new active plan for future calculations rather than editing active historical plans.
11. **Calculation Rules Definition**: A plan defines the mathematical formula (percentage or fixed amount) and parameters to calculate a commission.

---

## 4. Cash Incomes & Realized Revenue (Rules 12 – 18)

12. **Verified Cash Inflows**: An Income record represents confirmed cash/money received from a client. It does **not** represent an invoice, sale, or account receivable.
13. **Controlled Income Mutability**: Income records are not immutable; they can be modified under strictly governed business rules.
14. **Transactional Income Updates**: Any modification to an Income record must be executed inside a database transaction and trigger corresponding recalculations of related commissions.
15. **Paid Settlement Locking**: An Income cannot be modified if it has derived commissions included in a `paid` Statement.
16. **Elevated Reopening Permission**: A `paid` Statement can be reopened to allow Income modification only if the user possesses an explicit, elevated permission.
17. **Non-Automatic Financial Reversal**: Reopening a `paid` Statement does not automatically reverse external bank payments; it solely enables data recalculation and correction within PartnerHub.
18. **Client Ownership of Incomes**: An Income belongs exclusively to a Client and does not belong directly to a Partner.

---

## 5. Automated Commission Engine (Rules 19 – 24)

19. **Automated Generation Only**: Commissions are generated and updated automatically by the system engine. Users can never manually create or edit a commission entry directly.
20. **Commission Dependencies**: A commission belongs to an Income, a Partner, and a Commission Plan, and optionally to a Statement when included in a settlement.
21. **Pending Recalculation Constraints**: A pending commission can only be updated due to modifications in its source Income or an authorized recalculation—never by retroactively modifying a historical plan.
22. **Paid Commission Lock**: A commission belonging to a `paid` Statement cannot be directly edited.
23. **Correction Workflow for Paid Commissions**: If a paid commission's underlying Income requires correction, direct edits are blocked. The mandatory correction workflow is:
    - **Step 1**: Reopen the Statement
    - **Step 2**: Correct the Income
    - **Step 3**: Recalculate the Commission
    - **Step 4**: Re-approve the Statement
24. **Historical Plan Preservation**: A commission entry always retains the exact snapshot of the Commission Plan used at the precise time of its calculation.

---

## 6. Statements & Payout Settlements (Rules 25 – 29)

25. **Statement Scope**: A Statement groups commissions belonging to a single partner. It does **not** group Incomes directly.
26. **Strict Lifecycle States**: A Statement follows a strict lifecycle state machine (`draft` -> `reopened` -> `approved` -> `paid`).
27. **Pre-Payment Mutability Window**: While a Statement is not in `paid` status, its grouped commissions and source incomes can be recalculated or adjusted.
28. **Post-Payment Immutability**: When a Statement reaches `paid` status, all grouped commissions and source incomes are locked against modification.
29. **Reopening Obligation**: Modifying information linked to a `paid` Statement requires explicitly reopening the Statement first.

---

## 7. Auditability & System Integrity (Rules 30 – 34)

30. **Comprehensive Audit Trail**: All major domain changes and state transitions must be audited and recorded using Spatie Activity Log.
31. **Atomic Operations**: All commission generation, recalculation, and settlement operations must be fully atomic (executed inside database transactions).
32. **Calculated Operational States**: Derived operational states (subtotals, totals, status flags) can be stored in the database when they fulfill operational and performance needs.
33. **Polymorphic Document Attachments**: Associated files (receipts, invoices, vouchers) use polymorphic relationships (`attachable_type`, `attachable_id`).
34. **Single Responsibility Principle**: Each domain model maintains strict separation of concerns and clear functional boundaries.

---

## 8. Financial Invariants & Cash Guards (Rules 35 – 40)

35. **Cash-Gated Commissions**: Commissions are strictly generated from valid Incomes representing verified cash received.
36. **Zero Income Constraint**: The absence of an Income implies the total absence of any commission.
37. **Proportional Recalculation**: If an Income amount is updated, related commissions must be recalculated using the updated cash received value.
38. **Income-Derived Statements Only**: A Statement can only contain commissions derived from valid Income records.
39. **Payout Ceiling Limit**: Total payouts disbursed to a partner can never exceed the total commissions generated from verified cash received.
40. **Multi-Partner Distribution**: A single Income record can generate multiple Commission entries if the paying client has multiple active referral relationships with different partners.

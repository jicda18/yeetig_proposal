# Architectural Proposal & Technical Specification: PartnerHub

## 1. Project Vision & Executive Summary

The objective of **PartnerHub** is to build a modern, high-performance, SaaS-style **Partner Management System**. This platform enables referral partners to securely monitor their clients, real-time commission earnings, and settlement histories while equipping financial administrators with tools for cash-received ingestion, commission calculation, and payout settlements.

A fundamental domain invariant of PartnerHub is that **commissions are calculated strictly on actual cash received** (*realized revenue*), rather than billed amounts or invoices. Financial entries can be ingested manually by accounting staff or automatically via third-party integrations such as QuickBooks.

---

## 2. Strategic Strategy: Decoupled Architecture

While legacy approaches might suggest embedding custom software directly into telecommunication servers (such as VICIdial), **our strategy mandates a modern, independent, containerized web application that communicates with external systems strictly through APIs.**

### Key Reasons for Decoupling:
- **Fault Isolation & Operational Stability**: Third-party vendors frequently manage telecommunication servers (e.g. VICIdial). Hosting a custom portal in the same environment risks unexpected breakage during server updates. Operating PartnerHub on isolated infrastructure (DigitalOcean, AWS, or custom VPS) ensures total operational control and zero downtime from external server changes.
- **Modern User Experience (UX/UI)**: Achieving a sleek, responsive SaaS dashboard (Vue 3, Tailwind CSS, real-time data updates without page reloads) requires modern frontend technology that cannot be cleanly integrated into legacy systems.
- **Performance & Resource Protection**: Heavy financial queries, analytics, and partner traffic are completely isolated, ensuring zero consumption of telecommunication or call center server resources.

### Integration Strategy:
- **Unified Authentication (SSO)**: Users authenticate seamlessly; credentials can be validated against VICIdial database/API endpoints or internal single sign-on services.
- **Continuous Synchronization**: PartnerHub maintains its own ACID-compliant financial database (PostgreSQL 18) while asynchronously synchronizing referred lead statuses with VICIdial via background queue workers.

---

## 3. Core Business Workflows

### A. Lead Referral Workflow
1. **Submission**: A Partner submits a new referred client via the PartnerHub Vue 3 SPA interface.
2. **Asynchronous Sync**: PartnerHub saves the lead, links it to the Partner, and dispatches a Redis background job to push the lead to VICIdial via API.
3. **Status Tracking**: The Partner monitors real-time status updates (e.g., *Prospect*, *Contacted*, *In Progress*, *Active*, *Cancelled*) queried back from VICIdial.

### B. Revenue Ingestion & Automated Commission Engine
1. **Cash Received Registration**: Accounting staff enters weekly cash payments received from clients, or QuickBooks pushes realized income entries.
2. **Automated Binding & Calculation**: PartnerHub binds the income to the client's assigned commission plan (`partner_client`) and calculates the commission inside an atomic database transaction.
3. **Real-Time Notification**: The calculated commission enters `PENDING` status and immediately reflects on the Partner's dashboard.

### C. Settlement & Payout Workflow (Statements)
1. **Statement Drafting**: Administrators group pending partner commissions into a settlement Statement for a specific period.
2. **Approval & Payment**: Upon executing the bank transfer, the Administrator approves and marks the Statement as `PAID`, attaching transaction receipts.
3. **Settlement Lock**: All included commissions and underlying income entries become locked against direct edits. Reopening a paid statement requires elevated administrative privileges under audited conditions.

---

## 4. Platform Modules & Structure

### Admin Dashboard (PartnerHub Management)
- **Partner Management**: Create partner entities, assign user accounts, and bind customized commission plans.
- **Financial Module (Cash Entry)**: Interface for accounting teams to register client cash receipts and inspect income history.
- **Commission & Statement Management**: Draft, review, approve, and execute payout statements to partners.
- **Analytics & Reporting**: Performance charts per partner, realized revenue vs. commissions payable.
- **Immutable Audit Log**: Integrated with Spatie Activity Log to record every domain modification, income edit, and statement status transition.

### Partner Dashboard (Portal View)
- **Financial Overview**: Real-time KPI cards displaying *Earned Commissions*, *Pending Settlement Balance*, and *Lifetime Paid History*.
- **My Referred Clients**: Real-time list of referred clients and their operational pipeline status.
- **Commission Ledger**: Detailed breakdown of cash received from clients and the exact calculated commission earned per payment.
- **Payment History & Receipts**: Complete record of historical settlement statements and downloadable payout receipts.

---

## 5. Technical Architecture & Data Standards

PartnerHub is implemented under strict architectural and domain guidelines documented across the repository:

- **[architecture.md](file:///d:/Users/jicruz/Documents/Projects/YEETIG_PROPUESTA/architecture.md)**: Container topology (Traefik, Vue 3 + Tailwind CSS, Laravel 13 Octane with RoadRunner, Redis, PostgreSQL 18). Single-domain routing via `partnerhub_domain` and `partnerhub_domain/api`.
- **[database.md](file:///d:/Users/jicruz/Documents/Projects/YEETIG_PROPUESTA/database.md)**: Complete database schema definition using UUIDv7 primary keys, soft deletes, and polymorphic file attachments.
- **[rules.md](file:///d:/Users/jicruz/Documents/Projects/YEETIG_PROPUESTA/rules.md)**: The 40 strict business rules, financial invariants, statement lifecycles, and audit logging standards.

---

## 6. Next Steps & Implementation Roadmap

1. **Architecture & Schema Approval**: Review and sign off on `architecture.md`, `database.md`, and `rules.md`.
2. **Repository & Docker Setup**: Initialize containerized environment with Traefik, Laravel 13 Octane, Vue 3, Redis, and PostgreSQL 18.
3. **Core Development**: Implement migrations, domain models, commission calculation engine, and Traefik domain routing.
4. **UI Mockups & Frontend Assembly**: Build partner and admin dashboards with modern Vue 3 + Tailwind CSS components.

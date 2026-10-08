# 🖨️ Printli — Architecture & System Design Documentation

> Interactive, comprehensive 53-diagram technical specification for the **Printli Digital Print Shop Platform**.

🌐 **Live Documentation:** [https://saigurrala-dev.github.io/Printli/](https://saigurrala-dev.github.io/Printli/)

---

## 🌟 Overview

**Central Thesis:** The platform is an intelligent bridge connecting digital customer orders and physical print/document operations.
* **The Cloud:** Decides *WHAT* to print (Validation, Pricing, Queues, Dynamic ETA Calculation, Multi-Tenancy, Audit Logs, Payments).
* **The Shop Print Station:** Decides *HOW* to print locally (Silent printing to Windows OS Spooler, aggressive background file prefetching, heartbeat health reporting).

---

## 📐 Documentation Structure (53 Diagrams)

### 📌 Batch 1: Core Platform Workflows (1–12)
1. **Product Ecosystem** — Customer, Merchant, Golden Admin, Cloud Gateway & Local Spooler.
2. **Customer Journey** — Walk-in (QR scan) & Remote online order processing.
3. **Order Lifecycle State Machine** — Created → Paid → Approved → Queued → Printing → Verified → Collected.
4. **Payment Flow with Idempotent Webhooks** — Webhook retry handling & ledger consistency.
5. **Order Approval Flow** — Automatic rules vs. manual staff approval.
6. **Print Station Architecture** — Cloud queue message protocol vs. local caching.
7. **Print Station Pairing** — One-time pairing code & persistent device tokens.
8. **Printer State Machine** — Hardware health, policy overrides & recovery.
9. **Smart Routing Engine** — Capability filtering, queue depth & speed heuristics.
10. **Dynamic ETA Engine** — Real-time ETA range calculations and delay notifications.
11. **Priority Service** — Faster queue jumps & incremental upgrade fee splits.
12. **Physical Verification & Printer Failure Handling** — Mid-job error recovery and tray counts.

### 👥 Batches 2–4: Stakeholders, Tenancy, Security & Monetization (13–30)
13. **Stakeholder Map** — Customers, Owners, Staff, Golden Admin & Institutions.
14. **Merchant & Staff Workflow** — Daily shop operations and task attribution.
15. **High-Level Backend Architecture** — NestJS modular architecture, BullMQ, Redis, PostgreSQL.
16. **Frontend Applications** — Web & Mobile monorepo structure.
17. **Multi-Tenancy Hierarchy** — Platform → Merchants → Physical Shop Branches.
18. **Authentication & RBAC Matrix** — Scoped customer, staff, device, and admin permissions.
19. **Cloud-to-Station Print Queue Protocol** — Lightweight ACK messaging & failover.
20. **Print Station Heartbeat & WakeLock** — Keep-alive and screen sleep prevention.
21. **Printer Capability Model** — Hardware specifications & rule mapping.
22. **Job Separation & Eco Separator** — Separator sheets vs. manual staff acknowledgement.
23. **Real-Time Event Gateway** — WebSockets & Push fallback.
24. **Document Security & Lifecycle** — End-to-end encryption & auto-purge policies.
25. **Audit Logging & Secure OTP Pickup** — Verification handovers & exception paths.
26. **Subscription & Monetization Flow** — SaaS plans & Priority fee splits.
27. **Analytics Engine** — Shop sales, hardware utilization, and staff activity metrics.
28. **Golden Admin Operations** — Global platform health & dispute resolution.
29. **Multi-Service Orders (Future)** — Compound orders (Cover + Color + Binding).
30. **Marketplace & Delivery (Future)** — Multi-shop comparison and delivery routing.

### ⚙️ Batch 5: Operations Deep Dives & Observability (31–38)
31. **Automated Payment Reconciliation** — Scheduled cross-checks for ghost charges & dropouts.
32. **Routing Decision Logic Tree** — Explainable fallback routing hierarchy.
33. **Station to OS Print Spooler** — Browser silent printing & local file deletion.
34. **Partial Print Recovery** — Tray counting & resuming from page $N+1$.
35. **Customer Application Architecture** — Web QR first with Expo mobile app.
36. **Merchant Application Architecture** — Real-time operations and hardware management.
37. **Golden Admin Architecture** — Read replicas & analytical dashboards.
38. **Platform Observability** — Metric aggregation, trace collection & alerting.

### 🚀 Final Batch: System Context, End-to-End & File Delivery (39–53)
39. **System Context (C4)** — Boundary diagrams with external gateways.
40. **End-to-End Business Process** — Chronological lifecycle from upload to collection.
41. **Order Creation Sequence** — Idempotent creation & shop capability pre-validation.
42. **Document Upload & Storage** — Direct presigned object uploads with MIME checks.
43. **Pickup Lifecycle State Machine** — Holding windows, verification, and uncollected paper disposal.
44. **Customer Status Mapping** — Engineering states mapped to clear UX messages.
45. **WebSocket & Push Fallback Protocol** — Room subscriptions and reconnection logic.
46. **Shop PC Driver & Spooler Communication** — Windows spooler interfacing & native agent fallback.
47. **Resource Lifecycle & Maintenance** — Hardware onboarding, health overrides, and decommissioning.
48. **Document Access Control** — Short-lived signed URLs for active paired stations.
49. **Shop Staff Permission Hierarchy** — Owner, Manager, Operator, and Cashier boundaries.
50. **Priority Edge Case Handling** — Automatic refunds when fast routes disappear.
51. **Multi-Hardware Orchestration (Future)** — Generalized task queue for laminators & cutters.
52. **External Institutional APIs (Future)** — University ERP webhooks & B2B gateways.
53. **File Delivery, Prefetch & Zero-Wait Printing** — 100% duty cycle background caching.

---

## 💻 Tech Stack & Features

* **Visual Design:** Vanilla CSS with custom design tokens, dark/light theme switching, and responsive layout.
* **Diagramming:** Dynamic SVG rendering using Mermaid.js.
* **Interactive Inspection:** Pan/Zoom modal powered by `@panzoom/panzoom` for deep inspection of dense sequence & flowchart diagrams.
* **Live Search & Filter:** Instant search by diagram title, description, or Mermaid code.
* **Deployment:** GitHub Pages via GitHub Actions.

---

## 🚀 Deployment & GitHub Pages Setup

1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete 53-diagram architecture documentation portal"
   git push origin main
   ```
2. In your GitHub repository settings:
   - Go to **Settings** → **Pages**.
   - Under **Build and deployment** → **Source**, select **GitHub Actions** (or **Deploy from a branch** → `main` / `/ (root)`).
3. The site will be published at:
   `https://<username>.github.io/Printli/`

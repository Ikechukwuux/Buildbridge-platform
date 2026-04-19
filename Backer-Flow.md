# BuildBridge — Backer Flow & Payment Page Specification

## Overview

The backer flow is frictionless by design. No account creation is required to back a tradesperson. The backer discovers a need, reads the full story on the Need Detail Page, and proceeds to pay. BuildBridge does not charge the tradesperson a platform fee. Instead, backers are invited to leave an optional tip to BuildBridge. What the backer pledges is exactly what the tradesperson receives.

---

## Flow Summary

```
Need Card (Browse / Homepage)
        ↓
  Tap "Back Now"
        ↓
  Need Detail Page
     ↙        ↘
"Back Now"   "Share"
     ↓
 Payment Page
     ↓
Confirmation Screen
```

---

## Screen 1 — Need Detail Page

### 1. Hero Section
- Full-width primary photo of the tradesperson or their workspace (16:9 aspect ratio)
- Tradesperson name + trade category + location
  - e.g. **Ada · Baker · Surulere, Lagos**
- Verification badge (Level 0–4) displayed prominently beneath the name with a one-line explanation
  - e.g. *"✓ Identity & community verified"*

### 2. Funding Progress Block *(sticky on mobile scroll)*
- NGN amount raised so far — displayed large and bold
  - e.g. **₦28,500 raised**
- Goal amount
  - e.g. *of ₦35,000 goal*
- Animated funding progress bar
- Backer count — e.g. *14 backers*
- Deadline — e.g. *6 days left*
- **"Back Now"** — primary CTA, full-width on mobile, always visible

### 3. AI Impact Statement
Displayed as a styled pull quote directly below the progress block.

> *"A ₦35,000 sewing machine repair enables Ada to complete 6 custom wedding outfits this season."*

### 4. The Need Story
- Item name and exact cost in NGN
- Tradesperson's written story (up to 150 words)
- Why this specific item matters to their livelihood
- Guided sentence starters used during creation are invisible to the backer — only the final story is shown

### 5. About the Tradesperson
- Profile photo, full name, trade category, LGA + state
- Years of experience and apprentices trained (if provided)
- Community vouch count + vouch list with relationship types
  - e.g. *"Vouched by Mama Bisi (Market Elder) and 4 others"*
- Link: **"View full profile →"**

### 6. Trust Signals Block
- Verification badge breakdown — "What does this badge mean?" expandable
- Escrow disclosure:
  > *"Your pledge goes directly to Ada via Paystack. BuildBridge never holds your money."*
- Geotagged photo indicator confirming real business location

### 7. Recent Backers
- List of recent backers: display name (or "Anonymous") + pledge amount + personal message if left
- Serves as live social proof inline on the page

### 8. Share Block
- Heading: *"Help Ada reach her goal"*
- **WhatsApp** — primary share button; pre-written message with auto-generated 16:9 progress card
- **Instagram** — 9:16 story card share
- **Copy link** — plain URL copy

### 9. Updates Section *(appears post-funding)*
- Proof-of-use photo or video submitted by the tradesperson
- Caption written by the tradesperson
- Timestamp of submission
- Backers who pledged receive a WhatsApp/SMS notification when this is posted

---

## Screen 2 — Payment Page

### 2.1 Pledge Amount Entry
- Free-form NGN amount input field — backer types any amount
- Quick-select suggested amounts shown as tap targets beneath the input
  - e.g. **₦1,000 · ₦2,500 · ₦5,000 · ₦10,000**
- Remaining amount indicator updates in real time
  - e.g. *"₦6,500 still needed to fully back Ada"*

---

### 2.2 BuildBridge Tip

> BuildBridge does not charge the tradesperson any platform fee.  
> The backer is invited to add an optional tip to help keep the platform running.  
> **What the backer pledges is exactly what the tradesperson receives.**

#### Tip Selector UI

- Default tip on load: **10%**
- Slider: draggable, range **0% → 30%**, step increments of 1%
- Preset tap targets below the slider for quick selection: **0% · 5% · 10% · 15% · 20%**
- Custom tip field: text input for a backer who wants to type a specific percentage or NGN amount directly
- Tip amount updates in real time as the slider or field changes
  - e.g. *"Your tip to BuildBridge: ₦500"*

#### Zero Tip Behaviour

When the slider is set to **0%**, a contextual card appears beneath the slider:

---

> 💛 **Adding a BuildBridge tip means being a key part of improving the services for backers like you and the tradespeople you support.**
>
> **[Add custom tip →]**

---

- The card is informational, not obstructive — the backer can still proceed with 0%
- The "Add custom tip →" link focuses the custom tip input field
- The card disappears as soon as the slider moves above 0%

---

### 2.3 Payment Summary

Displayed before the backer confirms — clear, honest, no surprises.

| Line item | Amount |
|---|---|
| Your pledge to Ada | ₦5,000 |
| Your tip to BuildBridge | ₦500 (10%) |
| **Total charged to you** | **₦5,500** |
| Ada receives | ₦5,000 |

> *No processing fee is added. What you pledge is what Ada gets.*

---

### 2.4 Payment Method

- Paystack — card, bank transfer, USSD
- Payment method selector shown as clearly labelled options with logos
- For international backers: estimated NGN equivalent shown at live exchange rate before confirmation (Stripe path)

---

### 2.5 Backer Preferences

Three opt-in checkboxes, shown before the confirm button. All are **unchecked by default** except where noted.

| # | Checkbox Label | Notes |
|---|---|---|
| 1 | ☐ Don't display my name publicly on this need | When checked, backer appears as "Anonymous" in the recent backers list |
| 2 | ☐ Yes, sign me up to hear updates from BuildBridge about how to change people's lives. Unsubscribe anytime. | Email/WhatsApp marketing opt-in — unchecked by default |
| 3 | ☐ I would like to be contacted by this tradesperson about other ways I can help. | When checked, the tradesperson's WhatsApp contact is shared with the backer after payment confirmation |

---

### 2.6 Optional Message

- Label: *"Leave Ada a message (optional)"*
- Short text field, max 200 characters
- Placeholder: *"e.g. Keep going — your work matters to your community."*
- Message is displayed alongside the backer's name in the Recent Backers section

---

### 2.7 Confirm Button

- Primary CTA: **"Back Ada →"** — uses tradesperson's first name
- Subtext beneath button: *"You will be charged ₦5,500 total"*
- Tapping confirm triggers Paystack checkout

---

## Screen 3 — Confirmation Screen

- Celebratory animation (confetti)
- Headline: *"You're backing Ada! 🎉"*
- Summary: pledge amount, tip amount, total charged
- Tradesperson WhatsApp contact shown here **only if** preference checkbox 3 was ticked
- Share prompt: *"Tell your network about Ada"* — WhatsApp and copy link
- No account creation prompt — backer is done

---

## Design & Copy Principles Applied

| Principle | Implementation |
|---|---|
| Investment framing | "Back" not "Donate"; "Need" not "Campaign" throughout |
| Full transparency | Pledge = what tradesperson receives; tip is separate and optional |
| Zero shame at 0% | Zero-tip card is encouraging, not guilt-inducing |
| Trust before payment | Escrow disclosure and verification signals shown before the backer reaches the payment screen |
| WhatsApp-first | Share defaults to WhatsApp at every touchpoint |
| No forced account | Backer completes the full flow without creating an account |
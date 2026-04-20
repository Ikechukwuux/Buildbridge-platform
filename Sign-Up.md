# BuildBridge — Need Creation & Sign-Up Flow
*Version 3 — with layout specification and full screen copy*

---

## Page Layout — Applied to All Screens

Every screen in the need creation flow uses a consistent two-panel layout, as referenced from the GoFundMe onboarding pattern.

```
┌─────────────────────────────────────────────────────────────────┐
│  [BuildBridge Logo]                              [Sign in]       │  ← Top nav bar
├──────────────────────┬──────────────────────────────────────────┤
│                      │                                          │
│   LEFT PANEL         │   RIGHT PANEL                            │
│   ~35% width         │   ~65% width                             │
│   Fixed / sticky     │   Scrollable                             │
│                      │                                          │
│   Large heading      │   Form content                           │
│   Subtext            │   (inputs, pills, upload zones, etc.)    │
│                      │                                          │
│                      │                         [Continue →]     │  ← Bottom right
└──────────────────────┴──────────────────────────────────────────┘
```

**Left panel:** Fixed position. Does not scroll with the form. Light grey (off-white) background. Contains the screen heading and a single line of supporting copy. Content changes with each screen.

**Right panel:** Scrollable. White background. All interactive form elements sit here. Generous top and side padding.

**Top navigation bar:** BuildBridge logo top left. "Sign in" text link top right. No progress steps, no back button — the nav stays clean throughout the creation flow.

**Continue button:** Fixed to the bottom right of the right panel. Pill-shaped. Primary colour fill. Becomes active (full opacity) only when the required field on the current screen is complete. Inactive state: greyed out, not tappable.

**Mobile behaviour:** Left panel collapses. Heading and subtext appear at the top of the screen above the form. Continue button is full-width, pinned to the bottom of the screen.

---

## Pill Component — Specification

Used for Trade Category (Screen 1) and Who Are You Raising For (Screen 2).

| Property | Value |
|---|---|
| Background | Transparent |
| Border | 2px solid, primary brand colour |
| Border radius | 999px (fully rounded) |
| Text | Label only — no icons |
| Font weight | Regular |
| Padding | 10px 20px |
| Layout | Wrapping flex row |
| Default state | Transparent background, primary colour border and text |
| Selected state | Primary colour fill, white text, primary colour border |
| Hover (desktop) | 10% primary colour tint background |
| Selection rule | Single select only — new selection deselects the previous |

---

## Screen 1 — Location and Trade Category

### Left Panel

**Heading:**
> Let's begin your fundraising journey

**Subtext:**
> We're here to guide you every step of the way.

---

### Right Panel

**Section heading:**
> Where will the funds go?

**Supporting copy:**
> Choose the location where your tradesperson works and where funds will be withdrawn.

**State** *(searchable dropdown)*
Label: *State*
Placeholder: *Select state*
All 36 Nigerian states + FCT, listed alphabetically.

**Local Government Area** *(searchable dropdown)*
Label: *Local Government Area*
Placeholder: *Select LGA*
Auto-populates based on selected state.
Greyed out with copy *"Select your state first"* until a state is chosen.

---

**Section heading:**
> What best describes the trade?

**Supporting copy:**
> Choose the category that fits best. This helps backers find the right needs.

**Trade category pills — wrapping row:**

> Baker / Food Vendor · Tailor · Carpenter · Welder · Cobbler · Market Trader · Electrician · Plumber · Hairdresser · Photographer · Other

Pill spec: transparent background, 2px primary colour outline, text only, no icons.
Selected state: primary colour fill, white text.
Single selection only.

Selecting **"Other"** reveals a plain text input directly beneath the pill row:
Label: *Describe the trade*
Placeholder: *e.g. Vulcaniser, Sign painter, Soap maker*

---

**Continue button:** Active once state, LGA, and one trade category are all selected.

---

## Screen 2 — Who Are You Raising Funds For?

### Left Panel

**Heading:**
> Who are you fundraising for?

**Subtext:**
> You can create a need for yourself or on behalf of a tradesperson in your community.

---

### Right Panel

**Label above pills:**
> Choose one

**Two pills (same pill spec):**

**Myself** · **Someone else**

**Contextual copy — appears beneath the pills on selection:**

When *Myself* is selected:
> You are the tradesperson. Funds will be transferred directly to your bank account when your need is funded.

When *Someone else* is selected:
> You are raising on behalf of a tradesperson you know. They will receive the funds directly. Their name will appear as the beneficiary on the public need page.

---

**Note at the bottom of the panel:**
> *BuildBridge does not support fundraising for organisations or charities. Every need is tied to a specific individual tradesperson and a specific item or service.*

---

**Continue button:** Active once one option is selected.

---

## Screen 3 — Goal Amount

### Left Panel

**Heading:**
> Set your fundraising goal

**Subtext:**
> Enter the exact cost of the item or service. Specific amounts build more trust with backers.

---

### Right Panel

**Input label:**
> How much do you need to raise?

**Input field:**
₦ prefix pre-filled. Numeric keyboard on mobile.
Placeholder: *e.g. 35,000*

**Contextual badge guidance — updates live as the user types:**

| Amount Entered | Message |
|---|---|
| ₦0 – ₦20,000 | ✅ *Your current account level can list this need right away.* |
| ₦20,001 – ₦50,000 | ℹ️ *You will need 3 community vouches (Level 1) to list this amount.* |
| ₦50,001 – ₦150,000 | ℹ️ *You will need Level 2 verification — 5 vouches and a geotagged workspace photo.* |
| ₦150,001 – ₦500,000 | ℹ️ *You will need a community leader endorsement (Level 3) for this amount.* |
| Above ₦500,000 | ℹ️ *Needs above ₦500,000 require full Platform Verification by the BuildBridge team.* |

**Note card:**
> 💡 Unlike other platforms, BuildBridge does not deduct a platform fee from what the tradesperson receives. What backers pledge is exactly what they get — no need to inflate your goal. You keep every Naira pledged, even if you don't reach your full target.

---

**Continue button:** Active once an amount greater than ₦0 is entered.

---

## Screen 4 — Create Your Account

### Left Panel

**Heading:**
> Create your account

**Subtext:**
> Save your progress and get your need live for backers to find.

---

### Right Panel

**Option A — Google**

Button: **Continue with Google** *(Google logo + label, full-width outlined button)*

---

**Divider:** ——— or ———

---

**Option B — Phone Number** *(recommended)*

Input label: *Full Name*
Placeholder: *e.g. John Doe*
Input label: *Phone number*
Prefix: +234 pre-filled. Numeric keyboard.
Placeholder: *e.g. 0801 234 5678*

Button: **Continue with phone →**

---

**Trust signal:**
> 🔒 Your information is only used to verify your account and keep it secure.

**Returning user:**
> Already have an account? [Sign in →]

---

**Continue button:** Active once a sign-up method is completed.

---

## Screen 4a — OTP Verification *(Phone path only)*

### Left Panel

**Heading:**
> Check your messages

**Subtext:**
> We sent a confirmation code to your phone. Enter it below to continue.

---

### Right Panel

**Label:**
> Enter the 6-digit code sent to +234 XXX XXX XXXX

**Input:**
6 individual boxes, side by side. One digit per box.
Auto-advances to the next box on each entry.
Auto-submits on the 6th digit — no manual Continue tap required.

**Resend link:**
Greyed out with countdown for the first 60 seconds: *Resend in 00:45*
Becomes tappable at 60 seconds: *Resend code*

**Change number link:**
*Change number* — returns to Screen 4.

---

**Error — wrong code:**
All 6 boxes turn red.
Message: *That code didn't match. Please try again.*
After the 3rd failed attempt: *2 attempts remaining.*

**Error — expired code:**
Message: *This code has expired.*
Button: **Request a new code**

**Error — max attempts:**
Message: *Too many attempts. Please wait 1 hour before trying again.*
Countdown timer displayed.
Support link: *Need help? Chat with us on WhatsApp →*

---

## Screen 5 — How BuildBridge Works

### Left Panel

**Heading:**
> Here's how it works

**Subtext:**
> Three simple steps — and your community does the rest.

---

### Right Panel

3-slide carousel. Progress dots at the bottom.

---

**Slide 1 of 3**

**Heading:** Create the need

**Body:**
> Tell us what is needed and why. Add a photo and a short story. The whole thing takes less than 5 minutes.

---

**Slide 2 of 3**

**Heading:** Your community steps in

**Body:**
> Neighbours, market friends, and family abroad — anyone can back a need directly from their phone. No account needed to give.

---

**Slide 3 of 3**

**Heading:** The money goes straight to you

**Body:**
> Every Naira pledged goes directly to the tradesperson. No platform fees deducted. You keep everything — even if you don't reach your full target.

**Success story card at the bottom of slide 3:**
> 📸 *"See how Ada funded her oven repair in 3 days →"*

---

**Navigation:**
- Slides 1 and 2: button labelled **Next →**
- Slide 3: button label changes to **Got it — let's continue →**
- Skip link on all slides: *Skip intro* — small, secondary, beneath the carousel dots

---

## Screen 6 — Cover Photo

### Left Panel

**Heading:**
> Add a cover photo

**Subtext:**
> A great photo is the first thing backers notice. Make it count.

---

### Right Panel

**Upload zone:**
Large dashed-border rectangle.
Centre: camera icon + label *Tap to upload a photo*

**Two buttons beneath the zone:**
**Take a photo** · **Choose from gallery**

**Photo guidance:**
> ✅ Face clearly visible, looking at the camera
> ✅ Good natural or bright lighting
> ✅ Shows the trade — at the machine, at the workbench, at the stall
> ❌ Avoid blurry, dark, or group photos
> ❌ Avoid logos, screenshots, or stock images

**Technical note:**
> *Minimum 400 × 400px. JPG, PNG, or WEBP only.*

**Location note:**
> 📍 *This photo will be geotagged to confirm the listing location. Make sure location access is enabled on your device.*

**Skip link:**
*I'll add a photo later →*
Small, secondary, beneath the upload zone.

On skip: toast notification appears:
> *Needs with photos receive significantly more backing. You can add one from your dashboard at any time.*

---

**Continue button:** Active once a photo is uploaded, or immediately when the skip link is tapped.

---

## Screen 7 — The Story

### Left Panel

**Heading:**
> Tell people about this work

**Subtext:**
> This is the first thing backers will read. Be honest, be specific, and make it yours.

*(If "Someone else" on Screen 2:)*
> This is the first thing backers will read about the tradesperson you're helping.

---

### Right Panel

**Three equal tabs at the top:**

> **Write** · **Record** · **Generate with AI**

---

### Tab 1 — Write *(default)*

Text area. Max 300 words.
Word count: *0 / 300 words* displayed below, right-aligned.

**Placeholder sentence starters (disappear on first keystroke):**

*(Myself path):*
> *I have been doing this trade for...*
> *My work means a lot to my community because...*
> *The item I need is...*
> *Without it, I cannot...*

*(Someone else path):*
> *[Name] has been doing this trade for...*
> *Their work means a lot to the community because...*
> *The item they need is...*
> *Without it, they cannot...*

**Mic for recording speech to text**

A microphone button, bottom right of the text area.

**Label below text area:**
> Click the mic icon to speak naturally — tell us about the trade and what it means to the community.

Recording limit: 2 minutes.
Countdown timer displays once recording starts.

**After recording:**
Transcription runs automatically by deepseek.
Generated story draft appears in an editable text area.
Copy above draft:
> *Here's what we heard — edit anything that doesn't sound right.*

---

### Tab 2 — Generate with AI

**Label:**
> Answer three quick questions and we'll write the story for you.

**Three short inputs:**

*1. How long have they been doing this trade?*
Placeholder: *e.g. 8 years*

*2. What do they make or do?*
Placeholder: *e.g. Custom men's suits and school uniforms*

*3. Who do they serve in their community?*
Placeholder: *e.g. Families in Surulere who can't afford island tailors*

*4. What is the specific item you need to repair or replace?*
Placeholder: *e.g. Sewing machine*

Button: **Generate my story →**

**After generation (under 10 seconds):**
Story appears in an editable text area.
Copy above:
> *Here's your story — edit anything before you continue.*

**Three options beneath:**
- **Use this story**
- **Regenerate** *(counter: "2 regenerations remaining")*
- **Edit manually** — switches to Write tab with generated text pre-filled

---

**Continue button:** Active once the story field contains at least 30 words.

---

## Screen 8 — AI Impact Statement

### Left Panel

**Heading:**
> Your impact statement

**Subtext:**
> One sentence that tells backers exactly what their support will make possible.

---

### Right Panel

**Explainer copy:**
> BuildBridge generates a short impact statement from your story. It appears on your need card and in every share image.

**Loading state (auto-triggers on screen load):**
Shimmer animation in the statement area.
Copy: *Writing your impact statement...*
Resolves in under 10 seconds.

**Generated statement — displayed in a highlighted card:**
> *"A ₦35,000 sewing machine repair enables Ada to complete 6 custom wedding outfits this season."*

**Three options beneath:**
- **Use this statement**
- **Regenerate** *(counter: "2 regenerations remaining")*
- **Edit manually** — opens the statement as an inline editable field

---

**Continue button:** Active once a statement is accepted or saved.

---

## Screen 9 — Need Title

### Left Panel

**Heading:**
> Give your need a title

**Subtext:**
> The title is the first thing backers read on the browse feed. Make it specific and action-focused.

---

### Right Panel

**Input label:**
> Title *(up to 60 characters)*

**Placeholder:**
> e.g. Help Ada repair her oven and get back to baking

**Character counter:** *0 / 60* — turns amber at 50, red at 57+.

**Suggested title card:**
> 💡 *Suggested: "Back [Name]'s [item] — [trade] in [location]"*
> Example: *"Back Emeka's drill — Carpenter in Yaba, Lagos"*
> [Use this suggestion →]

**Title guidance:**

| ✅ Do | ❌ Avoid |
|---|---|
| Include the person's name | Generic phrases like "Please help me" |
| Name the specific item | Vague descriptions like "for my business" |
| State the outcome or trade | Emotional pressure language |

---

**Continue button:** Active once the title field has at least 10 characters.

---

## Screen 10 — Review and Launch

### Left Panel

**Heading:**
> Review your need

**Subtext:**
> Take one last look before we send it for review. You can edit anything after it goes live too.

---

### Right Panel

Full summary of all entered details. Each section has an **Edit →** link.

---

**Title**
*"Back Ada's sewing machine — Tailor in Surulere, Lagos"*
[Edit →]

**Goal amount**
*₦35,000*
[Edit →]

**Location**
*Surulere, Lagos State*
[Edit →]

**Trade category**
*Tailor*
[Edit →]

**Cover photo**
*Thumbnail preview*
[Edit →]

**Story**
*First 3 lines shown. "Read full story ▾" expand link.*
[Edit →]

**Impact statement**
*"A ₦35,000 sewing machine repair enables Ada to complete 6 custom wedding outfits this season."*
[Edit →]

---

**Note:**
> Once submitted, BuildBridge will review your need within 24 hours. You will be notified by WhatsApp or SMS when it is approved and visible to backers.

> You can update your story and goal amount at any time before your need is fully funded.

---

**Submit button** *(replaces Continue on this screen):*
Full-width, primary colour.
Label: **Submit for review →**

---

## Screen 11 — Share Your Need

### Left Panel

**Heading:**
> Your need is submitted!

**Subtext:**
> While we review it, start sharing. The more people who see it early, the faster it gets backed.

---

### Right Panel

**Status card:**
> 🕐 *Under review — we'll notify you by WhatsApp or SMS within 24 hours when your need goes live.*

---

**Section: Start close**

**Heading:** Send a personal message first

**Copy:**
> A direct message to someone who already knows your work converts far better than a public post. Use this ready-made message:

**Ready-made WhatsApp message:**
> *"Hi [Name], I just listed a need on BuildBridge — a platform that lets people back skilled tradespeople directly. I need ₦35,000 to repair my sewing machine so I can keep taking orders. Would you be able to back me, or share this with someone who might? Here's the link: [need URL]"*

Buttons: **Copy message** · **Open in WhatsApp**

---

**Section: Go wider**

**WhatsApp Status**
*Your 16:9 share card is ready — photo, progress bar, and impact statement included.*
Button: **Share to WhatsApp Status →**

**WhatsApp Groups**
*Share to your trade group, your market group, your community group.*
Button: **Share to WhatsApp →**

**Instagram Stories**
*Your 9:16 story card is ready to post.*
Button: **Share to Instagram →**

**Printable QR Code**
*Download and display at your stall or workshop. Customers scan to back you in person.*
Button: **Download QR code →**

---

**Section: Ask your network to forward it**

**Copy:**
> Every person who shares your need reaches people you can't reach yourself. Send them this message to forward:

**Ready-made forward message:**
> *"A skilled tradesperson I know is raising funds on BuildBridge to repair their sewing machine. All the money goes directly to them — no platform fees. Back them here: [need URL]"*

Button: **Copy forward message**

---

**Note at the bottom:**
> 🕐 *The first 48 hours matter most. Your need is featured in the BuildBridge browse feed for its first 48 hours after approval. If no pledge is received within 24 hours of going live, we'll automatically send you more ready-made messages to keep the momentum going.*

---

## Screen Reference Summary

| Screen | Title | Left Panel Heading | Key Action |
|---|---|---|---|
| 1 | Location and Trade Category | Let's begin your fundraising journey | Select state, LGA, and trade category pill |
| 2 | Who Are You Raising For? | Who are you fundraising for? | Select Myself or Someone else pill |
| 3 | Goal Amount | Set your fundraising goal | Enter exact NGN amount |
| 4 | Create Your Account | Create your account | Google, phone OTP, or email sign-up |
| 4a | OTP Verification | Check your messages | Enter 6-digit code (phone path only) |
| 5 | How BuildBridge Works | Here's how it works | 3-slide carousel |
| 6 | Cover Photo | Add a cover photo | Upload or skip |
| 7 | The Story | Tell people about this work | Write, record, or AI-generate |
| 8 | AI Impact Statement | Your impact statement | Accept, regenerate, or edit |
| 9 | Need Title | Give your need a title | Enter or use suggested title |
| 10 | Review and Launch | Review your need | Review all details and submit |
| 11 | Share Your Need | Your need is submitted! | WhatsApp, Instagram, QR code |
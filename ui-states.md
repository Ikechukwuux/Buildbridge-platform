# BuildBridge — UI States Specification

## Overview

This document defines every UI state across all surfaces of the BuildBridge platform. Each state specifies what the user sees, what they are told, and what action is available to them. No state leaves the user in unexplained limbo.

States are organised by surface, then by state type. The five primary state types used throughout are:

| State Type | Definition |
|---|---|
| **Empty** | The surface has no content to display yet |
| **Loading** | Content or an action is in progress |
| **Error** | Something went wrong — system, network, or user input |
| **Success** | An action completed as expected |
| **Moderation** | Content is under admin review and not yet visible |

A sixth type — **Edge Case** — covers specific scenarios that fall outside the standard five but must be handled gracefully.

---

## 1. Global / Cross-Surface States

These states appear across multiple surfaces and follow a consistent pattern throughout the app.

---

### 1.1 Network Failure (Global)

Applies to: any screen that requires a network request.

**What the user sees:**
- Inline banner at the top of the screen (not a full-page takeover)
- Icon: ⚠️
- Message: *"You appear to be offline. Check your connection and try again."*
- Button: **"Retry"**
- Support link: *"Need help? Chat with us on WhatsApp →"*

**Design notes:**
- Previously loaded content remains visible and readable — the banner overlays the top of the screen only
- Form inputs are preserved — the user does not lose what they typed
- Auto-retries silently every 30 seconds; banner dismisses automatically on reconnection

---

### 1.2 Session Expired

Applies to: any authenticated action attempted after a session has timed out.

**What the user sees:**
- Bottom sheet slides up
- Heading: *"You've been away for a while"*
- Body: *"Please confirm it's still you to continue."*
- Input: OTP field (phone) or password field (email) depending on account type
- Button: **"Confirm and continue"**

**Design notes:**
- The user's in-progress action (e.g. a pledge, a vouch submission) is preserved and retried automatically after re-authentication
- Google accounts re-authenticate silently via OAuth refresh token where possible

---

### 1.3 404 — Page Not Found

**What the user sees:**
- Illustration: a broken tool (on-brand, not a generic 404 graphic)
- Heading: *"This page doesn't exist"*
- Body: *"It may have been removed or the link might be wrong."*
- Button: **"Go to Homepage"**
- Secondary link: *"Browse open needs →"*

---

### 1.4 Maintenance Mode

**What the user sees:**
- Full-screen static page (no app shell)
- Heading: *"BuildBridge is taking a short break"*
- Body: *"We're making improvements. We'll be back shortly."*
- Estimated return time if known: *"Expected back by 2:00 PM WAT"*
- WhatsApp support link

---

### 1.5 Skeleton Loading (Global)

Applies to: all card feeds, detail pages, and dashboard panels while data loads.

**What the user sees:**
- Card-shaped grey placeholder blocks that shimmer with a left-to-right animation
- Matches the exact layout of the content that will appear — same number of lines, same image aspect ratio, same button position
- No spinner, no blank white screen

**Design notes:**
- Skeleton screens appear for a maximum of 3 seconds
- If data has not loaded after 3 seconds, transition to the network failure state (1.1)
- Skeleton shimmer direction: left to right, consistent with reading direction

---

## 2. Homepage

---

### 2.1 Empty — No Featured Needs

Condition: platform has zero published needs (pre-launch or post-clearance edge case).

**What the user sees:**
- Heading: *"BuildBridge is just getting started"*
- Body: *"Be among the first tradespeople to create a need and get backed by your community."*
- Button: **"Create a Need"**

---

### 2.2 Loading — Homepage Feed

**What the user sees:**
- 3 skeleton need cards shimmer in the featured section
- Impact counter placeholders shimmer (total funded, total raised, total trades)

---

### 2.3 Impact Counters — Live

**What the user sees:**
- Three counters animate up to their current values on first load
- Update in real time without a page refresh
- If counters are zero (pre-launch): counters are hidden entirely — not displayed as 0

---

## 3. Browse / Discovery Feed

---

### 3.1 Empty — No Results for Filter

Condition: backer applies a filter combination that returns zero needs.

**What the user sees:**
- Icon: 🔍
- Heading: *"No needs match your search"*
- Body: *"Try a different trade category, location, or remove some filters."*
- Button: **"Clear all filters"**

---

### 3.2 Empty — No Needs in a Region

Condition: backer filters by a state or LGA with no active needs.

**What the user sees:**
- Icon: 📍
- Heading: *"No needs in this area yet"*
- Body: *"Know a tradesperson here who needs backing? Help them get started."*
- Button: **"Create a Need"**

---

### 3.3 Loading — Browse Feed

**What the user sees:**
- 6 skeleton need cards in the grid, shimmering
- Filter bar visible and interactive during load — user can adjust filters before content arrives

---

### 3.4 Empty — Search Returns No Results

Condition: keyword search returns zero matches.

**What the user sees:**
- Icon: 🔍
- Heading: *"No results for '[search term]'"*
- Body: *"Check the spelling or try a different word."*
- Button: **"Clear search"**

---

### 3.5 End of Feed

Condition: user has scrolled to the last result in the browse feed.

**What the user sees:**
- Message at the bottom of the feed: *"You've seen all open needs."*
- Button: **"Back to top"**
- Secondary: *"Create a Need for a tradesperson you know →"*

---

## 4. Need Card (Browse Feed)

The need card is the smallest unit of content on the platform. It must communicate trust and urgency in a compact format.

---

### 4.1 Active Need — Standard State

**What the user sees:**
- Tradesperson photo (cropped to square)
- Name, trade category, location
- Item needed + exact NGN cost
- AI impact statement (truncated to 1 line with ellipsis)
- Animated funding progress bar
- NGN raised / goal · Backer count · Days left
- Verification badge (icon + level name)
- **"Back Now"** button — primary CTA

---

### 4.2 Nearly Funded (≥ 80% of goal reached)

**What the user sees:**
- Progress bar colour changes to green
- Urgency label above the bar: *"Almost there — just ₦X left"*
- **"Back Now"** button remains

---

### 4.3 Fully Funded

**What the user sees:**
- Progress bar: full green
- Label: *"Fully Funded ✓"*
- Button changes to: **"View Story"** — links to the need detail page and the proof-of-use update
- Card is moved to the "Funded Needs" section; removed from the active browse feed

---

### 4.4 Deadline Passed — Partially Funded

Condition: deadline reached, need not fully funded, but has received at least one pledge.

**What the user sees (on funded needs page):**
- Label: *"Closed — Partially Funded"*
- NGN raised is shown; goal shown
- No "Back Now" button — need is closed
- Proof-of-use update shown if submitted

---

### 4.5 Deadline Passed — Zero Pledges

Condition: deadline reached with zero pledges received.

**What the tradesperson sees (private — dashboard only):**
- Label: *"No pledges received"*
- Body: *"This need did not receive any backing before the deadline."*
- Options: **"Extend by 7 days"** · **"Edit and resubmit"** · **"Archive"**
- Pre-written WhatsApp share messages offered

**What the public sees:**
- Nothing. The need is never displayed publicly as "failed."

---

### 4.6 Under Review — Newly Submitted

Condition: need has been submitted and is in the admin review queue.

**What the tradesperson sees (dashboard only):**
- Label: *"Under review"*
- Body: *"We'll notify you within 24 hours."*
- No public visibility until approved

**What the public sees:**
- Nothing. The need is not visible until it clears review.

---

### 4.7 Rejected by Admin

**What the tradesperson sees (dashboard only):**
- Label: *"Not approved"*
- Body: *"Your need was not approved. [Reason given by admin]"*
- Options: **"Edit and resubmit"** · **"Contact support"**
- Support: WhatsApp link

---

## 5. Need Detail Page

---

### 5.1 Loading — Need Detail Page

**What the user sees:**
- Hero image placeholder (16:9 shimmer block)
- Progress block skeleton
- Story section skeleton (3 lines of shimmer text)
- "Back Now" button visible and active immediately — does not wait for full page load

---

### 5.2 Active Need — Standard State

Full content as specified in the Backer Flow document. All sections visible.

---

### 5.3 Fully Funded — Before Proof-of-Use

Condition: need reached 100% funding; tradesperson has not yet submitted proof-of-use update.

**What the user sees:**
- Progress bar: full green · Label: *"Fully Funded ✓"*
- "Back Now" button replaced with: **"Share this success →"**
- Updates section: *"Ada is getting her item — proof of use coming soon."*
- Backers see: *"You'll be notified when Ada shares what your backing made possible."*

---

### 5.4 Proof-of-Use Submitted

Condition: tradesperson has submitted proof-of-use photo or video.

**What the user sees:**
- Updates section shows: proof-of-use photo or video, tradesperson's caption, timestamp
- Label: *"✓ Proof submitted"*
- If opted into Impact Wall: *"This story is now on the Impact Wall →"*
- "Back Another Tradesperson" CTA appears prominently

---

### 5.5 Proof-of-Use Overdue

Condition: need funded; 14 days have passed; no proof submitted.

**What the public sees:**
- Updates section: *"Update coming soon"* — no indication of overdue status publicly
- "Back Now" button replaced with: **"Share this story →"**

**What backers see (Impact Feed):**
- *"Ada hasn't shared a proof update yet. We're following up with them."*

**What the tradesperson sees (dashboard):**
- Warning label: *"Proof-of-use overdue"*
- Body: *"Your backers are waiting to see what their support made possible. Submit your update now."*
- Button: **"Submit update now"**
- Note: *"Future needs will require manual approval if no update is submitted."*

---

### 5.6 Reported Need — Under Review

Condition: a user has flagged the need; it is under admin review.

**What the reporting user sees:**
- Confirmation: *"Thank you for flagging this. Our team will review it within 24 hours."*

**What the public sees:**
- The need remains visible during review to avoid false removal
- No public indication that a report has been filed

**What the tradesperson sees (dashboard):**
- Label: *"Under review — a report has been filed on this need"*
- Body: *"Our team is reviewing this. We'll contact you if action is needed."*

---

## 6. Sign-Up Flow

---

### 6.1 Loading — OTP Send

**What the user sees:**
- Button state changes: **"Continue →"** → spinner → button disabled
- Message beneath: *"Sending your code..."*
- Resolves in under 3 seconds for most networks; if longer, show: *"This is taking a moment — please wait."*

---

### 6.2 Error — OTP Send Failed

**What the user sees:**
- Inline error beneath phone field: *"We couldn't send a code to this number. Check the number and try again."*
- Button: **"Try again"**
- Support link: *"Need help? Chat with us on WhatsApp →"*

---

### 6.3 Error — OTP Incorrect

**What the user sees:**
- All 6 OTP boxes turn red
- Message: *"That code didn't match. Please try again."*
- Remaining attempts shown after the second failure: *"2 attempts remaining"*

---

### 6.4 Error — OTP Expired

**What the user sees:**
- Message: *"This code has expired."*
- Button: **"Request a new code"**

---

### 6.5 Error — OTP Max Attempts Reached

Condition: 5 incorrect OTP attempts within one hour.

**What the user sees:**
- Full-screen message: *"Too many attempts. Please wait 1 hour before trying again."*
- Countdown timer displayed
- Support link: *"Need help? Chat with us on WhatsApp →"*

---

### 6.6 Error — Phone Number Already Registered

**What the user sees:**
- Inline error beneath phone field: *"An account with this number already exists."*
- Link: **"Sign in instead →"**

---

### 6.7 Error — Email Already Registered

**What the user sees:**
- Inline error beneath email field: *"An account with this email already exists."*
- Link: **"Sign in instead →"**

---

### 6.8 Error — Google Sign-In Failed

**What the user sees:**
- Inline message: *"We couldn't connect to Google. Try phone or email instead."*
- Both options remain visible beneath the message

---

### 6.9 Loading — AI Story Generation

Applies to the Generate with AI tab on the Story screen.

**What the user sees:**
- The three input fields are replaced with a loading animation
- Message: *"Writing your story..."*
- Resolves in under 10 seconds

---

### 6.10 Error — AI Story Generation Failed

**What the user sees:**
- Message: *"We couldn't generate a story right now."*
- App switches automatically to the Write tab with the three prompt fields pre-filled as sentence starters
- Toast notification: *"Try writing or recording your story instead."*

---

### 6.11 Error — Photo Upload Failed

**What the user sees:**
- Upload zone border turns red
- Message: *"We couldn't upload this photo. Please try again."*
- If file is too small: *"Photo must be at least 400 × 400 pixels. Please use a clearer image."*
- If file type is unsupported: *"Please use a JPG, PNG, or WEBP image."*
- If file is too large: *"Photo is too large. Please use an image under 5MB."*

---

### 6.12 Success — Profile Created

**What the user sees:**
- Confetti animation (brief, 2 seconds)
- Heading: *"The profile is live! 🎉"*
- Level 0 badge displayed
- Verification journey table
- Primary CTA: **"Create your first need →"**

---

## 7. Need Creation Flow

---

### 7.1 Loading — Pre-filled Trade Item List

Condition: user selects a trade category and the pre-filled item list is fetching.

**What the user sees:**
- Skeleton shimmer in the item selector area
- Resolves in under 2 seconds

---

### 7.2 Empty — No Pre-filled Items for Trade

Condition: trade category has no pre-filled item suggestions (e.g. "Other").

**What the user sees:**
- Plain text field with placeholder: *"Describe the item you need"*
- Helper text: *"Be specific — e.g. 'Industrial sewing machine, Singer brand' rather than just 'machine'"*

---

### 7.3 Error — Geotagged Photo Required

Condition: user uploads a photo with geolocation disabled on their device.

**What the user sees:**
- Warning beneath photo upload: *"We couldn't confirm this photo's location. Turn on location access in your phone settings, then retake the photo."*
- Help link: *"How to turn on location access →"* (device-specific instructions)
- The photo is accepted but the listing is flagged for manual review

---

### 7.4 Loading — AI Impact Statement Generation

**What the user sees:**
- The impact statement field shows a shimmer animation
- Message beneath: *"Writing your impact statement..."*
- Resolves in under 10 seconds

---

### 7.5 Error — AI Impact Statement Failed

**What the user sees:**
- Message: *"We couldn't generate a statement right now."*
- The field switches to a manual text area with placeholder: *"Describe the impact of this need in 1–2 sentences."*
- Helper example: *"e.g. A repaired sewing machine lets Ada complete 6 wedding outfits this season."*

---

### 7.6 Success — Need Submitted for Review

**What the user sees:**
- Heading: *"Your need is submitted! 🎉"*
- Body: *"We'll review it within 24 hours. Once approved, it's live and backers can find it."*
- What happens next, listed plainly:
  - *"✓ You'll get a WhatsApp/SMS message when it goes live"*
  - *"✓ Share it with your community as soon as it's approved"*
  - *"✓ If no one backs it in 24 hours, we'll send you ready-made messages to share"*
- Button: **"Go to my dashboard"**

---

### 7.7 Error — Duplicate Active Need

Condition: tradesperson tries to create a second need while one is already active.

**What the user sees:**
- Bottom sheet slides up
- Heading: *"You already have an active need"*
- Body: *"You can only have one active need at a time. Your current need must be closed or funded before you create another."*
- Options: **"View my active need"** · **"Close my active need"**

---

### 7.8 Error — Funding Cap Exceeded for Badge Level

Condition: user enters an amount higher than their current badge level permits.

**What the user sees:**
- Inline warning beneath the amount field: *"Your current badge level (Level X) allows needs up to ₦X. To raise more, you need [next badge requirement]."*
- Link: **"How to level up →"** — opens badge explainer bottom sheet
- The user can still submit at a lower amount; the field is not blocked

---

## 8. Pledge / Payment Flow

---

### 8.1 Loading — Payment Processing

**What the user sees:**
- Full-screen overlay (semi-transparent) with a spinner
- Message: *"Processing your pledge..."*
- Do not allow the user to tap anything beneath the overlay — prevents double submission

---

### 8.2 Success — Pledge Confirmed

**What the user sees:**
- Confetti animation (2 seconds)
- Heading: *"You're backing [Name]! 🎉"*
- Payment summary: pledge amount, tip amount, total charged, amount tradesperson receives
- Tradesperson's WhatsApp contact shown only if preference checkbox 3 was ticked
- Share prompt: *"Tell your network about [Name]"* with WhatsApp and copy link buttons

---

### 8.3 Error — Payment Failed (Card Declined)

**What the user sees:**
- Heading: *"Payment didn't go through"*
- Body: *"Your card was declined. Please check your details or try a different payment method."*
- Options: **"Try again"** · **"Use a different method"**
- Support link: *"Need help? Chat with us on WhatsApp →"*

---

### 8.4 Error — Payment Failed (Network Timeout)

**What the user sees:**
- Heading: *"Something went wrong"*
- Body: *"Your payment may not have gone through. Do not try again yet — check your bank first."*
- Button: **"I've checked — it didn't go through, try again"**
- Support link: *"Something looks wrong? Chat with us →"*

**Design notes:**
- This copy is intentionally cautious to prevent double charges
- If Paystack's webhook confirms the payment succeeded despite the timeout, a success notification is sent to the backer via WhatsApp/SMS automatically

---

### 8.5 Error — International Payment (Stripe) Not Available

Condition: Stripe integration is temporarily down.

**What the user sees:**
- Message: *"International payment is temporarily unavailable. Please try again later or contact us on WhatsApp."*
- WhatsApp support link

---

### 8.6 Pledge Milestone Notifications (Backer — In-App)

Condition: a need the backer has backed reaches 50%, 80%, or 100% funding.

**What the user sees (Impact Feed notification card):**
- 50%: *"[Name]'s need is halfway there — share it to help push it over the line."* + Share button
- 80%: *"[Name] is almost fully backed — just ₦X to go!"* + Share button
- 100%: *"[Name]'s need is fully funded! 🎉 You made this possible."* + **"See the full story →"**

---

## 9. Verification Badge & Vouching

---

### 9.1 Empty — No Vouches Yet

**What the tradesperson sees (profile / dashboard):**
- Vouch count: *"0 vouches"*
- Nudge: *"Ask 3 people who know your work to vouch for you. Share your vouch link on WhatsApp."*
- Button: **"Get my vouch link"**

---

### 9.2 Loading — Vouch Submission

**What the voucher sees:**
- Button state: **"Submit vouch"** → spinner → disabled
- Message: *"Submitting your vouch..."*

---

### 9.3 Success — Vouch Submitted

**What the voucher sees:**
- Heading: *"Your vouch is in ✓"*
- Body: *"[Name] will be notified. Thank you for supporting your community."*

**What the tradesperson sees (dashboard notification):**
- *"[Voucher name] has vouched for you."*
- If a new badge level is unlocked: *"🎉 You've reached Level [X]! You can now raise up to ₦[X]."*

---

### 9.4 Error — Already Vouched for This Person

**What the voucher sees:**
- Message: *"You've already vouched for [Name]. You can only vouch for someone once."*

---

### 9.5 Error — Vouching Cooling Period Active

Condition: account is less than 30 days old.

**What the user sees:**
- Message: *"You can start vouching for others once your account is 30 days old. This helps keep BuildBridge trustworthy."*
- Days remaining shown: *"You can vouch in [X] days."*

---

### 9.6 Error — Vouch Velocity Limit Reached

Condition: user has submitted 5 vouches in the current calendar month.

**What the user sees:**
- Message: *"You've reached your vouch limit for this month. You can vouch again from [date]."*

---

### 9.7 Vouch Disputed / Flagged

**What the voucher sees (dashboard notification):**
- *"A vouch you submitted is under review. We'll let you know the outcome."*

**What the tradesperson sees:**
- *"One of your vouches is under review. Your badge level may be temporarily adjusted."*

---

### 9.8 NIN/BVN Verification — Loading

**What the user sees:**
- Spinner with message: *"Confirming your identity — this takes a few seconds."*

---

### 9.9 NIN/BVN Verification — Success

**What the user sees:**
- *"✓ Identity confirmed"*
- Badge level updates if a new tier is reached

---

### 9.10 NIN/BVN Verification — Failed

**What the user sees:**
- Heading: *"We couldn't confirm your identity"*
- Body: *"The details provided didn't match our records. Please check your NIN or BVN and try again."*
- Options: **"Try again"** · **"Contact support"**
- Support: WhatsApp link

---

## 10. Tradesperson Dashboard

---

### 10.1 Empty — No Active Need

Condition: tradesperson has a profile but has not yet created a need.

**What the user sees:**
- Illustration: a tradesperson at work (on-brand)
- Heading: *"You're ready to receive backing"*
- Body: *"Create your first need and let your community support your work."*
- Button: **"Create a Need"**

---

### 10.2 Empty — No Funded Needs History

**What the user sees:**
- Section heading: *"Funded needs"*
- Body: *"Needs you've successfully funded will appear here, along with your proof-of-use updates."*

---

### 10.3 Active Need — Proof-of-Use Nudge

Condition: need is funded; no proof-of-use update submitted; Day 3 has passed.

**What the user sees:**
- Alert card on dashboard (amber, not red)
- Heading: *"Your backers want to see the impact"*
- Body: *"Share a photo or video of what you purchased. It takes less than 2 minutes."*
- Button: **"Submit proof now"**
- Subtext: *"You have [X] days before this is flagged for review."*

---

### 10.4 Proof-of-Use Flagged

Condition: 21 days have passed with no proof submission.

**What the user sees:**
- Alert card on dashboard (red)
- Heading: *"Action required"*
- Body: *"You haven't submitted a proof-of-use update. Your next need will require manual approval by our team."*
- Button: **"Submit proof now"** · **"Contact support"**

---

### 10.5 Loading — Dashboard Data

**What the user sees:**
- Progress bar skeleton (funding bar shimmer)
- Pledge count skeleton
- Vouch count skeleton
- No blank white panels

---

## 11. Backer Dashboard

---

### 11.1 Empty — No Backed Needs

Condition: backer has an account but has not yet backed any need.

**What the user sees:**
- Heading: *"You haven't backed anyone yet"*
- Body: *"Find a tradesperson whose work matters to you and back their next step."*
- Button: **"Browse open needs"**

---

### 11.2 Backed Need — Awaiting Proof

**What the user sees:**
- Need card with label: *"Funded — waiting for proof"*
- Body: *"[Name] will share what your backing made possible soon."*

---

### 11.3 Backed Need — Proof Received

**What the user sees:**
- Need card with label: *"✓ Proof submitted"*
- Thumbnail of proof-of-use photo or video
- Link: **"See the full update →"**
- CTA: **"Back another tradesperson →"**

---

## 12. Impact Feed (Logged-In Backers)

---

### 12.1 Empty — No Updates Yet

**What the user sees:**
- Heading: *"Your impact feed will fill up here"*
- Body: *"When tradespeople you've backed share proof-of-use updates, you'll see them here."*
- Button: **"Back your first tradesperson →"**

---

### 12.2 Loading — Impact Feed

**What the user sees:**
- 3 update card skeletons shimmer

---

### 12.3 New Update Available

**What the user sees:**
- Update card slides in at the top of the feed
- Card shows: proof-of-use photo/video, tradesperson's caption, item funded, amount raised
- Label: *"New update"* in green — disappears after the card has been viewed
- CTA at the bottom of every card: **"Back another tradesperson →"**

---

## 13. Impact Wall (Public)

---

### 13.1 Empty — No Stories Published Yet

Condition: Impact Wall has no approved stories (pre-launch edge case).

**What the user sees:**
- Heading: *"The first stories are on their way"*
- Body: *"BuildBridge is just getting started. Check back soon to see the tradespeople your community has backed."*
- Button: **"Create a Need"**

---

### 13.2 Loading — Impact Wall Gallery

**What the user sees:**
- Story card skeletons in the gallery grid shimmer
- Impact counters at the top load last — shown as "—" until live data arrives

---

### 13.3 Empty — Filter Returns No Stories

**What the user sees:**
- Icon: 📷
- Heading: *"No stories for this filter yet"*
- Body: *"Try a different trade category or region."*
- Button: **"Clear filters"**

---

### 13.4 Story Card — Video Unavailable

Condition: a story card has a video but it fails to load.

**What the user sees:**
- Video thumbnail with a play icon
- On tap: *"This video is temporarily unavailable."*
- Photo fallback is displayed in place of the video

---

## 14. Admin Moderation States (Tradesperson-Facing)

These are the states a tradesperson sees when their content is in or has passed through the admin review process. Admin-facing states are out of scope for this document.

---

### 14.1 Need — Pending Review

**Label:** *"Under review"*
**Body:** *"We'll notify you by WhatsApp/SMS within 24 hours."*
**Visibility:** Dashboard only — not public.

---

### 14.2 Need — Approved

**Notification (WhatsApp/SMS):** *"Your need is live! Share it with your community now."*
**In-app:** Need card becomes visible in the browse feed with an active status.

---

### 14.3 Need — Rejected

**Label:** *"Not approved"*
**Body:** Reason provided by admin in plain language.
**Options:** **"Edit and resubmit"** · **"Contact support"**

---

### 14.4 Impact Wall Submission — Pending Moderation

**Label:** *"Your story is being reviewed for the Impact Wall"*
**Body:** *"We'll notify you when it goes live. This usually takes less than 48 hours."*

---

### 14.5 Impact Wall Submission — Approved

**Notification (WhatsApp/SMS):** *"Your story is live on the Impact Wall! Share it and inspire others."*
**In-app:** Impact Wall opt-in confirmation appears on the funded need card in the dashboard.

---

### 14.6 Impact Wall Submission — Revision Requested

**Label:** *"Revision needed"*
**Body:** Specific reason given by admin (e.g. *"Photo is unclear — please upload a sharper image of the item."*)
**Options:** **"Resubmit"** · **"Contact support"**

---

## 15. Share Flow

---

### 15.1 Loading — Share Card Generation

Condition: user taps WhatsApp or Instagram share and the server-side share card is generating.

**What the user sees:**
- Spinner on the share button for up to 3 seconds
- If card takes longer than 3 seconds: share proceeds with a plain link only, no card

---

### 15.2 Error — Share Card Generation Failed

**What the user sees:**
- Toast notification: *"We couldn't create your share image. The link will still work."*
- Share proceeds with a plain URL — no card image

---

### 15.3 Success — Link Copied

**What the user sees:**
- Toast notification: *"Link copied ✓"* — appears for 2 seconds, then fades

---

## Appendix — Error Message Writing Rules

All error messages across the platform follow these three rules:

1. **Say what went wrong** — in plain language, at Primary 6 reading level. No technical terms (no "server error", no "500", no "null response").

2. **Say what to do next** — one specific action. Never leave the user without a path forward.

3. **Offer a human fallback** — every error state that cannot be self-resolved includes a WhatsApp support link as the last resort.

**Format pattern:**
> *[What went wrong.]*
> *[What to do next.]*
> **[Action button]**
> *[WhatsApp support link — where relevant]*
**BuildBridge**

**Technical Brief — Platform Fix and Build List**

**Prepared for:**   BuildBridge Technical Team

**Prepared by:**   BuildBridge Management

**Platform URL:**   buildbridge-nu.vercel.app

# **Table of Contents**

**01**  How to Read This Document

**02**  P0 — Critical Fixes (Do These Before Anything Else)

**03**  P1 — Must-Fix Before Launch

**04**  P2 — Must-Build Before Launch

**05**  Integrations Breakdown

**06**  Dashboard Specifications

**07**  Page Redesign Brief

**08**  Compliance and Security Requirements

**09**  Complete Task List at a Glance

**SECTION 01**

# **How to Read This Document**

Every task in this document has been assigned a priority level. Work through them in order. Do not move to P1 tasks until every P0 task is done. Do not open the platform to real users until every P0 and P1 task is complete.

| PRIORITY | WHAT IT MEANS | WHEN TO DO IT |
| :---- | :---- | :---- |
| **P0 — Critical** | Broken things that are live right now and will damage trust if anyone sees them. Fix today. | This week, before any social media or press activity |
| **P1 — Pre-Launch Fix** | Things that are missing or wrong that must be corrected before real users sign up. | Before the Coming Soon page goes live |
| **P2 — Pre-Launch Build** | New features that must exist before the platform opens to real users and real payments. | Before switching Paystack to live mode |
| **P3 — Post-Launch** | Improvements and additions that are valuable but not blocking. Build after the first users are on the platform. | After the first funded artisan |

| A Note on Scope This brief covers everything from the original list provided by management plus additional items identified by reviewing the live platform at buildbridge-nu.vercel.app. Items added beyond the original list are marked with an asterisk (\*) throughout the document. |
| :---- |

**SECTION 02**

# **P0 — Critical Fixes**

*Do these before any social media posts, any press outreach, and any external communication.*

| PRI | TASK | DETAIL AND ACCEPTANCE CRITERIA |
| :---: | :---- | :---- |
| **P0** | **Unverified badge** | All three active campaign cards (Amina, Chidi, Fatima) show an 'Unverified' badge while the homepage copy claims every artisan goes through multi-step verification. This is the most damaging visible contradiction on the platform. The badge must either reflect the real verification status of each artisan correctly, or be removed until the verification system is live and each artisan has been verified. Do not show 'Unverified' next to a name on a platform that promises trust. |
| **P0** | **Fee messaging** | The homepage currently says 'No management fees on direct pledges' and '100% of capital reaches the tradesperson'. This directly contradicts the planned 3% platform fee. Management will confirm the final fee decision. Once confirmed, update this copy to reflect the truth. Suggested replacement: 'A small 3% platform fee keeps BuildBridge running and improving. The remainder goes directly to the artisan.' |
| **P0** | **Social media links\*** | The footer links for Twitter, Facebook, and Instagram all point to generic twitter.com, facebook.com, and instagram.com — not to BuildBridge accounts. Until the real accounts exist, remove these links entirely. A broken or generic social link on a trust-first platform looks like a scam. |
| **P0** | **'Craftsman' copy\*** | The homepage footer CTA uses the word 'Craftsman' — Empower a Craftsman, Build a Future. Per the brand guide, the correct term is 'Artisan'. Update all instances across every page. |
| **P0** | **'Investment' language\*** | The meta description reads 'Direct investment in African skilled trades'. BuildBridge is a donation platform, not an investment platform. Using the word investment creates a legal and regulatory problem. Change to: 'Community support for Nigeria's skilled artisans. Back a real need. See the proof. Zero interest.' |
| **P0** | **Escrow language\*** | The How It Works section says 'All pledges stay in escrow until met' — this implies all-or-nothing funding. BuildBridge uses Keep-What-You-Raise. Update to: 'Your pledge is held securely. Funds are released in stages as the artisan hits milestones and uploads proof.' |

**SECTION 03**

# **P1 — Must-Fix Before Launch**

*These must be resolved before the Coming Soon page goes live and before real user data is collected.*

| PRI | TASK | DETAIL AND ACCEPTANCE CRITERIA |
| :---: | :---- | :---- |
| **P1** | **Custom domain** | Move the platform from buildbridge-nu.vercel.app to a custom domain. Suggested: buildbridge.ng or getbuildbridge.com. Management to purchase the domain. Technical to configure DNS, update all internal URLs, and set up proper redirects from the old Vercel URL. |
| **P1** | **Empty pages\*** | Several footer links lead to pages that are either empty or non-existent: About Us, Careers, Partners, Contact Us. Until these pages have real content, redirect them to a holding page that says 'Coming soon — we are building this page.' Do not let visitors hit a 404 or blank page. |
| **P1** | **Privacy Policy page\*** | The Privacy Policy is linked in the footer but the page may not have legally valid content. This is required before collecting any real user data. Management will provide the NDPA-compliant text. Technical must ensure the page renders it correctly and is linked from the signup and payment flows. |
| **P1** | **Terms and Conditions\*** | Same as Privacy Policy. The T\&C page must exist with real content before launch. Must include the Keep-What-You-Raise disclosure. Link it from the payment confirmation flow. |
| **P1** | **Cookie consent banner\*** | A cookie consent notice is required under the NDPA 2023 before any tracking or analytics cookies are set. Implement a simple consent banner that fires before any analytics loads. Store consent in localStorage. Do not load analytics scripts until consent is given. |
| **P1** | **Newsletter signup\*** | The footer has a newsletter signup field but it is not clear if it is connected to anything. Connect it to an email service — Mailchimp or Brevo are recommended. Every submission should trigger the waitlist welcome email from the marketing playbook. |
| **P1** | **'Join thousands' copy\*** | The footer CTA says 'Join thousands of backers'. The platform is pre-launch and has no thousands. This is misleading. Change to: 'Be one of the first to back a Nigerian artisan.' Update before any external-facing content goes live. |
| **P1** | **Flutterwave and Interswitch\*** | The 'Trusted Infrastructure' marquee lists Flutterwave and Interswitch alongside Paystack. If these are not actually integrated, remove them. Only list infrastructure that is genuinely in use. Listing payment processors that are not integrated misleads backers about how their money is handled. |

**SECTION 04**

# **P2 — Must-Build Before Launch**

*These features do not exist yet and must be built before real users and real money enter the platform.*

| PRI | TASK | DETAIL AND ACCEPTANCE CRITERIA |
| :---: | :---- | :---- |
| **P2** | **Coming Soon page** | The platform is entering a waitlist period before public launch. Build a Coming Soon landing page at the root URL. It should contain: the tagline 'Back the Hands That Build Nigeria', one artisan photo, a single email capture field, a short explanation of what BuildBridge does, and social media follow links once accounts are created. Existing pages remain accessible via direct URL for team use. |
| **P2** | **Waitlist capture** | The email capture on the Coming Soon page must store submissions in Supabase with timestamp, email, and user type (artisan or backer). Send a confirmation email via the connected email service. Management to provide the three-email welcome sequence copy. |
| **P2** | **Artisan onboarding flow** | The current signup does not guide artisans through a structured verification process. Build a multi-step onboarding wizard: Step 1 basic info and trade type, Step 2 ID upload and BVN/NIN entry, Step 3 portfolio photo upload minimum three images, Step 4 review and submission. Show a clear progress indicator. Store submission status in Supabase. |
| **P2** | **Milestone system** | Each active need must have a maximum of three milestones defined at creation. Each milestone has a funding threshold percentage, a description of what proof will be uploaded, and a status of locked, unlocked, or complete. When a milestone threshold is crossed, the artisan receives an in-app and email notification to upload proof. |
| **P2** | **Proof upload** | Artisans must be able to upload proof when a milestone is unlocked. The upload accepts photos and PDFs maximum 10MB. The proof is stored in Supabase Storage. The status of the milestone updates to 'proof submitted' and a notification is sent to the admin review queue. |
| **P2** | **3% platform fee** | Configure Paystack to deduct a 3% platform fee from each pledge transaction before settlement. This is done via Paystack's split payment feature. The 3% goes to the BuildBridge corporate account. The remainder is held until the milestone is approved. Update all website copy and terms to reflect this fee clearly. |
| **P2** | **Rate limiting** | Implement rate limiting on all API endpoints. Suggested limits: payment initiation maximum 5 requests per minute per IP, account creation maximum 3 per hour per IP, login attempts maximum 5 per 10 minutes before lockout with CAPTCHA. Use a middleware solution such as express-rate-limit or Supabase Edge Function rate limiting. |
| **P2** | **Trust badge system** | Implement four trust badge types: ID Verified awarded when BVN/NIN check passes, Trade Verified awarded when portfolio is reviewed and approved by admin, Campaign Active awarded when a need is approved and live, BuildBridge Verified awarded when an artisan completes their first funded need with proof. Badges display on campaign cards and artisan profiles. |
| **P2** | **Admin review dashboard** | Build an internal dashboard accessible only to the BuildBridge team. It must show: new artisan registrations pending verification, flagged campaigns in the AI triage queue, milestone proof submissions awaiting approval, and platform statistics. Approve or reject actions must be available for each item. Access controlled by admin role in Supabase. |
| **P2** | **Data deletion flow\*** | Required by NDPA 2023\. Any registered user must be able to request deletion of their account and personal data. Add a Delete My Account option in the user settings. Submissions go to a queue visible in the admin dashboard. Deletion must remove or anonymise all personal data from Supabase within 30 days. |
| **P2** | **Payment processing page\*** | Create a dedicated page explaining clearly how money flows on BuildBridge: how pledges are collected, that Paystack holds funds in escrow, when milestones trigger release, how the 3% fee works, and what happens if an artisan does not upload proof. Link this page from every payment confirmation screen and from the How It Works page. |
| **P2** | **Error pages\*** | Build proper 404 and 500 error pages that match the platform design and include a link back to the homepage. The current Vercel default error pages are not acceptable on a trust-first platform. |

**SECTION 05**

# **Integrations Breakdown**

Each integration listed below has specific setup requirements. Some are already partially integrated in test mode. This section details what needs to happen to bring each one to production-ready status.

## **1\. Paystack — Payment Processing**

| TASK | DETAIL | DEPENDENCY |
| :---- | :---- | :---- |
| **Switch to live mode** | Replace test API keys with live keys across all environments. Test keys must be removed from production code entirely. Store keys in environment variables only, never in code. | CAC certificate and corporate bank account from Management |
| **Webhook setup** | Configure Paystack webhooks for: charge.success, transfer.success, transfer.failed, and refund.processed. Each event must trigger the correct platform action — charge success updates funding progress, transfer success updates milestone status. | Live mode activation |
| **Split payment — 3% fee** | Configure Paystack split payment so 3% of each pledge goes to the BuildBridge subaccount and the remainder is held in the artisan's subaccount until milestone approval triggers disbursement. | Both subaccounts created in Paystack dashboard |
| **Disbursement trigger** | When admin approves a milestone proof in the review dashboard, the system initiates a Paystack transfer of the milestone amount to the artisan's bank account. Transfer must be logged in Supabase with status and timestamp. | Admin review dashboard built |
| **Payment failure handling** | If a payment fails, show a clear user-facing message and offer retry or alternative payment method. Log all failures in Supabase. Do not show raw Paystack error codes to users. | None |
| **Test full flow** | Before going live, run end-to-end tests: pledge, milestone threshold reached, proof uploaded, admin approves, funds transferred. Confirm the 3% split is correct. Confirm the artisan receives the right amount. | All above complete |

## **2\. DeepSeek — AI Triage**

| TASK | DETAIL |
| :---- | :---- |
| **Campaign review triage** | Integrate DeepSeek API to run automated checks on new campaign submissions. Input: artisan profile text, campaign description, uploaded portfolio images metadata. Output: a risk score from 0 to 100 and a flag reason if score is above 70\. |
| **Fraud pattern detection** | Use DeepSeek to detect: duplicate account patterns from similar names or device fingerprints, artificially inflated funding goals compared to market price benchmarks, and copy-pasted campaign descriptions matching other submissions. |
| **Admin dashboard integration** | The DeepSeek risk score and flag reason must be visible in the admin review dashboard alongside each pending campaign. Admin can override the AI decision with a note explaining why. |
| **Fallback** | If the DeepSeek API is unavailable, all new submissions go directly to the human review queue with a note that AI triage is offline. The platform must not block submissions because of an API outage. |

## **3\. Supabase — Database and Storage**

| TASK | DETAIL |
| :---- | :---- |
| **Row Level Security (RLS)\*** | Confirm that RLS is enabled on all tables. Artisans must only be able to read and write their own records. Backers must only see their own transaction history. Admin roles have full read access across all tables. This is a critical security requirement. |
| **Storage buckets** | Create three storage buckets: artisan-verification for ID documents and selfies, campaign-media for campaign photos and videos, and milestone-proof for proof of purchase uploads. Set bucket policies so only the authenticated artisan and admins can access verification and proof documents. |
| **Realtime subscriptions** | Enable Supabase Realtime on the campaign funding progress table so the progress bar on campaign cards updates live without a page refresh when new pledges arrive. |
| **Backup policy\*** | Confirm automated daily backups are enabled on the Supabase project. Verify the retention period. Document the restoration procedure for the team. |
| **Environment separation\*** | Confirm there are separate Supabase projects for development, staging, and production. Development and staging must never connect to the production database. |

## **4\. GitHub — Version Control and Deployment**

| TASK | DETAIL |
| :---- | :---- |
| **Repository structure** | Confirm the codebase is in a private GitHub repository. All team members should have appropriate access levels — contributors have write access to feature branches, not to main. |
| **Branch protection** | Protect the main branch. Require at least one pull request review before merging. No direct pushes to main. All deployments to production must come from main only. |
| **Environment variables** | Confirm that all secrets — Paystack keys, Supabase URL and keys, DeepSeek API key — are stored in GitHub Actions secrets or Vercel environment variables. Never commit secrets to the repository. |
| **CI/CD pipeline** | Set up a basic GitHub Actions workflow that runs on every pull request: lint check, build test, and a smoke test hitting the staging URL. If any check fails, the pull request cannot be merged. |
| **Deployment to custom domain** | Update the Vercel project settings to deploy to the new custom domain. Confirm that the GitHub main branch auto-deploys to production and that preview deployments work on feature branches. |

## **5\. Domain — Custom Domain Setup**

| TASK | DETAIL |
| :---- | :---- |
| **Purchase domain** | Management to purchase domain. Recommended: buildbridge.ng (Nigerian identity, preferred) or getbuildbridge.com as a fallback. |
| **DNS configuration** | Point the domain DNS to Vercel. Add A records and CNAME records per Vercel's domain setup documentation. Allow up to 48 hours for propagation. |
| **HTTPS enforcement** | Vercel provides automatic SSL certificates via Let's Encrypt. Confirm HTTPS is enforced and that HTTP requests redirect to HTTPS. Confirm the certificate auto-renews. |
| **Email subdomain\*** | Set up a mail subdomain — mail.buildbridge.ng — for sending transactional emails. This prevents the main domain from being blacklisted if email volumes increase. Configure SPF, DKIM, and DMARC records. |
| **Old URL redirect** | Set up a permanent 301 redirect from buildbridge-nu.vercel.app to the new custom domain so any existing links continue to work. |

**SECTION 06**

# **Dashboard Specifications**

## **Dashboard  — Artisan Dashboard**

Every artisan on the platform should see a dashboard personalised to their account. The content of this dashboard is unique to each artisan. No artisan should see another artisan's information.

* Welcome header with artisan's name and trust badge status — not a generic greeting.

* Active Need card: current funding progress bar, amount raised, amount remaining, days left, milestone tracker showing which milestones are locked, unlocked, or complete.

* Proof Upload button: only visible when a milestone threshold has been crossed and proof has not yet been submitted. Clearly labelled with the milestone number and what proof is required.

* Transaction history: a log of each pledge received, showing the backer's first name or anonymous label, the amount, and the date.

* Verification status: shows progress through the four trust badge stages. If a step is incomplete, shows what is needed to complete it.

* Past Needs: a history of previously funded needs with their final status and proof photos submitted.

* Delete Need button: ability to delete a draft need that has not yet gone live. Active needs with pledges must go through a cancellation process, not a simple delete, to protect backer funds.

* Notification panel: funding alerts, milestone unlock notifications, admin messages.

* Edit Profile: update bio, photos, contact details, and bank account for disbursement.

| On the Delete Button The delete button the team mentioned should only appear on draft needs and on artisan profiles that have not yet had any pledge activity. For active needs that have received pledges, deletion must trigger a refund flow through Paystack and require admin approval before execution. This protects backers and prevents fraud via campaign creation and deletion. |
| :---- |

**SECTION 07**

# **Page Redesign Brief**

Management has requested a page redesign. Below is the brief for each page that needs to be updated, with the specific changes required. The existing design system and brand colours remain — this is about content accuracy, user flow, and fixing the issues identified on each page.

| PAGE | PRIORITY | REDESIGN REQUIREMENTS |
| :---- | :---- | :---- |
| **Homepage (index)** | P0 \+ P1 | Fix all P0 copy issues listed in Section 02\. Update hero tagline to 'Back the Hands That Build Nigeria'. Remove the Unverified badge or fix its logic. Fix social media footer links. Update escrow language. Replace 'Join thousands' with accurate pre-launch copy. Add a visible link to the Payment Processing page. |
| **Campaign Card Component** | P0 | The trust badge on each card must dynamically reflect the artisan's real verification status from the database. Show the correct badge — ID Verified, Trade Verified, or BuildBridge Verified — not a hardcoded Unverified label. |
| **Browse Needs (/browse)** | P2 | Add filter options: trade type, city, percentage funded, days remaining. Add a search bar. Implement pagination or infinite scroll for when there are more than 10 active needs. Empty state: if no needs are live yet, show a coming soon message rather than a blank page. |
| **How It Works (/how-it-works)** | P1 | Fix the escrow language. Add a visual milestone timeline showing how the three-milestone disbursement works. Add a section explaining the 3% platform fee clearly. Link to the new Payment Processing page. |
| **Campaign Detail page** | P2 | Add the full milestone tracker. Show each milestone with its threshold, description, and current status. Show the proof uploads from completed milestones. Show a list of backers with first names or 'Anonymous'. Add a share button that generates a shareable link and image card. |
| **Artisan Profile page** | P2 | Show the artisan's trust badges, trade type, city, portfolio photos, years of experience, and all active and past needs. Make this page shareable — this is what a backer will share on WhatsApp when they want their network to back someone. |
| **Impact Wall (/impact)** | P2 | This page is currently linked but needs real content structure. Each impact story should show: artisan photo, name, trade, city, funded amount, number of backers, before and after photos or proof of purchase, and a quote. Filter by trade type and city. |
| **Coming Soon page (new)** | P2 | New page described in full in Section 04\. Build this as the root URL during the waitlist period. |
| **Payment Processing page (new)\*** | P2 | New page explaining the full money flow. Link from footer, How It Works, and all payment confirmation screens. |
| **About Us (/about)\*** | P1 | Placeholder page with 'We are building something for Nigeria's artisans. More soon.' Team photos and bios when ready. Company mission and story. |
| **Contact Us (/contact)\*** | P1 | Simple contact form connected to the team's email. Name, email, message, and subject dropdown. Acknowledge submission with a confirmation message. |
| **Trust and Safety (/trust)\*** | P2 | Dedicated page explaining the verification process, the AI triage system, the milestone disbursement model, and what happens if something goes wrong. This page is linked in the footer and must have real, specific content. |

**SECTION 08**

# **Compliance and Security Requirements**

## **Security Requirements**

| REQUIREMENT | WHAT TO DO | PRIORITY |
| :---- | :---- | :---- |
| **Environment variables** | All API keys, database URLs, and secrets must be in environment variables only. Run a codebase search for any hardcoded keys. Remove any found immediately and rotate the compromised keys. | P0 |
| **HTTPS everywhere** | Confirm HTTPS is enforced across all routes. HTTP requests must 301 redirect to HTTPS. Confirm the SSL certificate is valid and auto-renewing. | P1 |
| **Input validation** | Validate and sanitise all user inputs on both client and server side. Campaign descriptions, artisan names, and proof upload filenames must be checked for malicious content. | P1 |
| **Rate limiting** | Implement rate limiting as specified in Section 04\. Pay particular attention to the payment initiation endpoint and the account creation endpoint. | P2 |
| **Supabase RLS** | Audit all Row Level Security policies in Supabase. Every table must have RLS enabled. Test that an authenticated artisan cannot read another artisan's records. | P1 |
| **File upload validation** | Validate all uploaded files by type, size, and content. Accept only JPEG, PNG, and PDF. Maximum 10MB per file. Scan for malicious content using a file validation library. | P2 |
| **Session management** | Implement proper session expiry. Users should be logged out after 30 minutes of inactivity on sensitive pages. Use Supabase Auth for session handling. | P2 |

## **NDPC Compliance Requirements**

| REQUIREMENT | WHAT TO DO | PRIORITY |
| :---- | :---- | :---- |
| **Cookie consent** | Implement consent banner before any analytics or tracking scripts load. Store consent decision. Do not load Google Analytics, Hotjar, or similar until consent is given. | P1 |
| **Privacy Policy page** | Ensure the Privacy Policy page renders properly and is linked from signup form, payment flow, and footer. | P1 |
| **Data deletion flow** | Build the account deletion request queue as specified in the dashboard section. Personal data must be deletable on request. | P2 |
| **Data minimisation** | Only collect the personal data that is necessary. Do not ask for date of birth if it is not needed. Do not store raw BVN numbers in the database — store only the verification status result. | P2 |
| **Secure data storage** | All sensitive data — BVN verification status, NIN status, ID document references — must be stored encrypted at rest in Supabase. Do not store raw ID document images indefinitely — delete after verification is complete. | P2 |

**SECTION 09**

# **Complete Task List at a Glance**

*Print this page. Tick off each item as it is completed.*

| DONE | PRI | TASK | OWNER |
| :---: | :---: | :---- | :---- |
| **\[ \]** | **P0** | **Fix Unverified badge on campaign cards** | Technical |
| **\[ \]** | **P0** | **Fix fee messaging on homepage** | Technical \+ Management |
| **\[ \]** | **P0** | **Fix generic social media footer links** | Technical |
| **\[ \]** | **P0** | **Replace Craftsman with Artisan sitewide** | Technical |
| **\[ \]** | **P0** | **Fix investment language in meta description** | Technical |
| **\[ \]** | **P0** | **Fix escrow / all-or-nothing copy** | Technical |
| **\[ \]** | **P1** | **Custom domain purchase and setup** | Management \+ Technical |
| **\[ \]** | **P1** | **Fix or redirect empty footer pages** | Technical |
| **\[ \]** | **P1** | **Privacy Policy page with real content** | Management \+ Technical |
| **\[ \]** | **P1** | **Terms and Conditions page** | Management \+ Technical |
| **\[ \]** | **P1** | **Cookie consent banner** | Technical |
| **\[ \]** | **P1** | **Newsletter signup connected to email service** | Technical |
| **\[ \]** | **P1** | **Remove Join thousands copy** | Technical |
| **\[ \]** | **P1** | **Audit Trusted Infrastructure marquee** | Technical \+ Management |
| **\[ \]** | **P2** | **Coming Soon landing page** | Technical \+ Content |
| **\[ \]** | **P2** | **Waitlist email capture and confirmation** | Technical |
| **\[ \]** | **P2** | **Artisan onboarding wizard** | Technical |
| **\[ \]** | **P2** | **Milestone system** | Technical |
| **\[ \]** | **P2** | **Proof upload feature** | Technical |
| **\[ \]** | **P2** | **3% platform fee via Paystack split** | Technical |
| **\[ \]** | **P2** | **Rate limiting on all API endpoints** | Technical |
| **\[ \]** | **P2** | **Trust badge system** | Technical |
| **\[ \]** | **P2** | **Admin review dashboard** | Technical |
| **\[ \]** | **P2** | **Data deletion request flow** | Technical |
| **\[ \]** | **P2** | **Payment processing page** | Technical \+ Management |
| **\[ \]** | **P2** | **Custom 404 and 500 error pages** | Technical |
| **\[ \]** | **P2** | **Paystack live mode \+ webhooks** | Technical |
| **\[ \]** | **P2** | **DeepSeek AI triage integration** | Technical |
| **\[ \]** | **P2** | **Supabase RLS audit and storage buckets** | Technical |
| **\[ \]** | **P2** | **GitHub branch protection and CI/CD** | Technical |
| **\[ \]** | **P2** | **Artisan, Backer, and Admin dashboards** | Technical |
| **\[ \]** | **P2** | **Campaign card trust badge dynamic logic** | Technical |
| **\[ \]** | **P2** | **Browse page filters and search** | Technical |
| **\[ \]** | **P2** | **Campaign detail page with milestone tracker** | Technical |
| **\[ \]** | **P2** | **Impact Wall page with real structure** | Technical |
| **\[ \]** | **P2** | **Artisan profile shareable page** | Technical |
| **\[ \]** | **P2** | **Environment variable audit — no hardcoded keys** | Technical |
| **\[ \]** | **P2** | **HTTPS enforcement** | Technical |
| **\[ \]** | **P2** | **Input validation and file upload security** | Technical |

*Technical Brief   BuildBridge   May 2026   Confidential*
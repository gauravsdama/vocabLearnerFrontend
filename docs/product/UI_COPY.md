# VocabCat web app UI copy inventory

This file complements `LANDING_PAGE_COPY.pair.md`; it does not replace or duplicate the landing-page source. Landing copy stays there. The first table preserves earlier review notes and does not authorize wording changes. The verified source table inventories implemented application, authentication, settings, stats, legal, loading, empty, error, confirmation, accessibility, metadata, and tooltip language exactly.

| ID | Route / state | Current text | Purpose / user intent | Earlier review note—not implemented | Status | Implementation location | Notes |
|---|---|---|---|---|---|---|---|
| `web.route.loading` | Lazy route | Loading / Preparing your page. | Explain transition | Loading your page… | inventory | `src/components/RouteLoading.tsx` | Verify polite announcement and no focus theft. |
| `web.route.error` | App error boundary | Something went wrong / We hit a snag. / Refresh the page to try again. | Recover from crash | This page couldn’t load. Refresh to try again. | inventory | `src/components/ErrorBoundary.tsx` | One direct message is enough; preserve support detail if available. |
| `web.auth.verify.loading` | `/verify-email` | Verifying your email. / Please wait while we confirm your link. | Explain pending verification | Verifying your email… | inventory | `src/pages/VerifyEmail.tsx` | Prevent duplicate submit/navigation. |
| `web.auth.verify.error` | `/verify-email` | We could not verify this link. / Back to login | Recover from invalid/expired link | This verification link is invalid or expired. Request a new one from login. | inventory | `src/pages/VerifyEmail.tsx` | Only claim “expired” when backend can distinguish or phrase conditionally. |
| `web.demo.complete` | `/demo` | You reached the end of the sample feed. | End demo | You finished the sample. | inventory | `src/pages/DemoFeed.tsx` | Add restart and account CTA as separate actions. |
| `web.tutorial.targets` | `/tutorial` | Set your weekly targets. | Configure learning load | Choose a weekly pace. | inventory | `src/pages/Tutorial.tsx` | Explain how daily allocation is derived. |
| `web.settings.sms` | `/settings` | SMS reminders | Manage consent | SMS reminders | inventory | `src/pages/Settings.tsx`, `src/pages/SmsConsent.tsx` | STOP/help, frequency, carrier rates, and current number must stay explicit. |
| `web.settings.delete` | `/settings` | Delete account / Type DELETE to confirm | Confirm irreversible action | Delete account / Type DELETE to permanently delete your account and app data. | inventory | `src/pages/Settings.tsx` | Verify retention exceptions against policy and backend. |
| `web.stats.hero` | `/stats` | This screen gets the brighter mascot treatment. | Placeholder/design note | Track what’s sticking. | inventory | `src/pages/Stats.tsx` | Current internal design note must not ship. |
| `web.legal.privacy` | `/privacy` | Privacy-policy sections | Explain actual data practice | Legal/owner review required | needs-owner-answer | `src/pages/Privacy.tsx` | Must match providers, retention, deletion, international processing, and launch entity. |
| `web.a11y.statement` | `/accessibility` | Our commitment / Known limitations / Feedback | State accessibility posture | Owner review after manual audit | needs-owner-answer | `src/pages/Accessibility.tsx` | Do not promise checks that have not run. |

## Coverage status

The verified source table below covers current React source. Preserve stable landing keys in `LANDING_PAGE_COPY.pair.md`; `npm run copy:inventory:check` fails when implemented strings drift from this reviewed snapshot.

<!-- BEGIN VERIFIED SOURCE COPY -->

This table is a source-extracted snapshot of current wording. Review changes; do not rewrite it automatically.

| Stable ID | Source | Kind | Exact current text |
|---|---|---|---|
| `web.src.api.client.001` | `src/api/client.ts:84` | property-message | Too many requests. Try again in ${retryAfterSeconds}s. |
| `web.src.api.client.002` | `src/api/client.ts:85` | property-message | Unexpected error |
| `web.src.api.client.003` | `src/api/client.ts:275` | property-title | Rate limit reached |
| `web.src.api.client.004` | `src/api/client.ts:275` | property-title | Limit reached |
| `web.src.components.authpanel.001` | `src/components/AuthPanel.tsx:210` | text | . |
| `web.src.components.authpanel.002` | `src/components/AuthPanel.tsx:252` | text | Copy diagnostics |
| `web.src.components.errorboundary.001` | `src/components/ErrorBoundary.tsx:43` | text | Something went wrong |
| `web.src.components.errorboundary.002` | `src/components/ErrorBoundary.tsx:44` | text | We hit a snag. |
| `web.src.components.errorboundary.003` | `src/components/ErrorBoundary.tsx:45` | text | Refresh the page to try again. |
| `web.src.components.errorboundary.004` | `src/components/ErrorBoundary.tsx:48` | text | Reload |
| `web.src.components.legaldocument.001` | `src/components/LegalDocument.tsx:21` | text | Skip to content |
| `web.src.components.legaldocument.002` | `src/components/LegalDocument.tsx:24` | attr-aria-label | VocabCat home |
| `web.src.components.legaldocument.003` | `src/components/LegalDocument.tsx:28` | text | Back to VocabCat |
| `web.src.components.legaldocument.004` | `src/components/LegalDocument.tsx:34` | text | Effective: |
| `web.src.components.legaldocument.005` | `src/components/LegalDocument.tsx:38` | text | Privacy |
| `web.src.components.legaldocument.006` | `src/components/LegalDocument.tsx:39` | text | Terms |
| `web.src.components.legaldocument.007` | `src/components/LegalDocument.tsx:40` | text | Accessibility |
| `web.src.components.messagecenter.001` | `src/components/MessageCenter.tsx:189` | text | Alert |
| `web.src.components.messagecenter.002` | `src/components/MessageCenter.tsx:191` | text | Notice |
| `web.src.components.messagecenter.003` | `src/components/MessageCenter.tsx:193` | text | Success |
| `web.src.components.messagecenter.004` | `src/components/MessageCenter.tsx:194` | text | Update |
| `web.src.components.messagecenter.005` | `src/components/MessageCenter.tsx:202` | text | Dismiss |
| `web.src.components.modal.001` | `src/components/Modal.tsx:84` | attr-aria-label | Dialog |
| `web.src.components.progresspill.001` | `src/components/ProgressPill.tsx:15` | text | Status: |
| `web.src.components.progresspill.002` | `src/components/ProgressPill.tsx:16` | text | Seen: |
| `web.src.components.progresspill.003` | `src/components/ProgressPill.tsx:18` | text | Quiz: |
| `web.src.components.progresspill.004` | `src/components/ProgressPill.tsx:18` | text | / |
| `web.src.components.routeloading.001` | `src/components/RouteLoading.tsx:6` | text | Loading |
| `web.src.components.routeloading.002` | `src/components/RouteLoading.tsx:7` | text | Preparing your page. |
| `web.src.components.marketing.phonemockup.001` | `src/components/marketing/PhoneMockup.tsx:170` | attr-aria-label | ${copy("phone.previewAriaPrefix")} ${activeState.ariaLabel}. |
| `web.src.components.marketing.problemsection.001` | `src/components/marketing/ProblemSection.tsx:19` | text | 0 |
| `web.src.components.marketing.marketingcats.001` | `src/components/marketing/marketingCats.ts:7` | property-alt | A ginger cat reading an open book. |
| `web.src.components.marketing.marketingcats.002` | `src/components/marketing/marketingCats.ts:13` | property-alt | A ginger cat reading with focused attention. |
| `web.src.components.marketing.marketingcats.003` | `src/components/marketing/marketingCats.ts:17` | property-alt | A soft black cat with a sympathetic, slightly sad expression. |
| `web.src.components.marketing.marketingcats.004` | `src/components/marketing/marketingCats.ts:21` | property-alt | A bright calico cat bringing energy to progress tracking. |
| `web.src.feed.cardrenderer.001` | `src/feed/CardRenderer.tsx:93` | text | Skip |
| `web.src.feed.cardrenderer.002` | `src/feed/CardRenderer.tsx:141` | text | Example sentences |
| `web.src.feed.cardrenderer.003` | `src/feed/CardRenderer.tsx:157` | text | Quiz preview |
| `web.src.feed.cardrenderer.004` | `src/feed/CardRenderer.tsx:203` | text | Quiz unavailable |
| `web.src.feed.cardrenderer.005` | `src/feed/CardRenderer.tsx:204` | text | No quiz data was provided. |
| `web.src.feed.cardrenderer.006` | `src/feed/CardRenderer.tsx:246` | text | Choices |
| `web.src.feed.cardrenderer.007` | `src/feed/CardRenderer.tsx:270` | text | Checking... |
| `web.src.feed.cardrenderer.008` | `src/feed/CardRenderer.tsx:270` | text | Submit |
| `web.src.feed.cardrenderer.009` | `src/feed/CardRenderer.tsx:276` | text | Result |
| `web.src.feed.cardrenderer.010` | `src/feed/CardRenderer.tsx:280` | text | Correct |
| `web.src.feed.cardrenderer.011` | `src/feed/CardRenderer.tsx:280` | text | Incorrect |
| `web.src.feed.cardrenderer.012` | `src/feed/CardRenderer.tsx:287` | text | Submit your answer to see results. |
| `web.src.feed.cardrenderer.013` | `src/feed/CardRenderer.tsx:295` | attr-alt | An excited cat celebrating a correct answer. |
| `web.src.feed.cardrenderer.014` | `src/feed/CardRenderer.tsx:296` | attr-alt | A sad cat acknowledging an incorrect answer. |
| `web.src.feed.cardrenderer.015` | `src/feed/CardRenderer.tsx:297` | attr-alt | A friendly cat waiting for your answer. |
| `web.src.feed.cardrenderer.016` | `src/feed/CardRenderer.tsx:400` | text | Use " |
| `web.src.feed.cardrenderer.017` | `src/feed/CardRenderer.tsx:400` | text | " |
| `web.src.feed.cardrenderer.018` | `src/feed/CardRenderer.tsx:404` | text | Write your sentence |
| `web.src.feed.cardrenderer.019` | `src/feed/CardRenderer.tsx:409` | attr-placeholder | Type a sentence with "${card.word.word}" |
| `web.src.feed.cardrenderer.020` | `src/feed/CardRenderer.tsx:413` | text | Submitting... |
| `web.src.feed.cardrenderer.021` | `src/feed/CardRenderer.tsx:413` | text | Submit |
| `web.src.feed.cardrenderer.022` | `src/feed/CardRenderer.tsx:419` | text | Result |
| `web.src.feed.cardrenderer.023` | `src/feed/CardRenderer.tsx:423` | text | Looks good |
| `web.src.feed.cardrenderer.024` | `src/feed/CardRenderer.tsx:423` | text | Needs work |
| `web.src.feed.cardrenderer.025` | `src/feed/CardRenderer.tsx:426` | text | Score: |
| `web.src.feed.cardrenderer.026` | `src/feed/CardRenderer.tsx:431` | text | Submit your sentence to get feedback. |
| `web.src.feed.cardrenderer.027` | `src/feed/CardRenderer.tsx:439` | attr-alt | An excited cat celebrating a strong sentence. |
| `web.src.feed.cardrenderer.028` | `src/feed/CardRenderer.tsx:440` | attr-alt | A sad cat acknowledging that the sentence needs work. |
| `web.src.feed.cardrenderer.029` | `src/feed/CardRenderer.tsx:441` | attr-alt | A friendly cat waiting for your sentence. |
| `web.src.feed.feedscreen.001` | `src/feed/FeedScreen.tsx:435` | text | Loading |
| `web.src.feed.feedscreen.002` | `src/feed/FeedScreen.tsx:436` | text | Preparing your feed. |
| `web.src.feed.feedscreen.003` | `src/feed/FeedScreen.tsx:446` | text | No cards yet |
| `web.src.feed.feedscreen.004` | `src/feed/FeedScreen.tsx:447` | text | Your feed is empty. |
| `web.src.feed.feedscreen.005` | `src/feed/FeedScreen.tsx:449` | text | Start a new session to pull fresh cards. |
| `web.src.feed.feedscreen.006` | `src/feed/FeedScreen.tsx:453` | text | Start New Session |
| `web.src.feed.feedscreen.007` | `src/feed/FeedScreen.tsx:456` | text | Back to Home |
| `web.src.feed.feedscreen.008` | `src/feed/FeedScreen.tsx:466` | attr-title | Your feed |
| `web.src.feed.feedscreen.009` | `src/feed/FeedScreen.tsx:469` | text | Back |
| `web.src.feed.feedscreen.010` | `src/feed/FeedScreen.tsx:499` | text | Session complete |
| `web.src.feed.feedscreen.011` | `src/feed/FeedScreen.tsx:500` | text | That's everything for now. |
| `web.src.feed.feedscreen.012` | `src/feed/FeedScreen.tsx:502` | text | Start a new session or head back to your menu. |
| `web.src.feed.feedscreen.013` | `src/feed/FeedScreen.tsx:506` | text | Start New Session |
| `web.src.feed.feedscreen.014` | `src/feed/FeedScreen.tsx:509` | text | Back to Home |
| `web.src.pages.accessibility.001` | `src/pages/Accessibility.tsx:7` | attr-title | Accessibility Statement |
| `web.src.pages.accessibility.002` | `src/pages/Accessibility.tsx:8` | attr-effectiveDate | September 15, 2026 |
| `web.src.pages.accessibility.003` | `src/pages/Accessibility.tsx:11` | text | Our commitment |
| `web.src.pages.accessibility.004` | `src/pages/Accessibility.tsx:13` | text | VocabCat is working toward conformance with the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA. Accessibility is an ongoing practice, and this statement does not claim that every screen or assistive-technology combination is currently free of barriers. |
| `web.src.pages.accessibility.005` | `src/pages/Accessibility.tsx:21` | text | Measures we take |
| `web.src.pages.accessibility.006` | `src/pages/Accessibility.tsx:23` | text | semantic headings, landmarks, labels, and keyboard-operable controls; |
| `web.src.pages.accessibility.007` | `src/pages/Accessibility.tsx:24` | text | visible keyboard focus and a skip-to-content link; |
| `web.src.pages.accessibility.008` | `src/pages/Accessibility.tsx:25` | text | text alternatives for meaningful images; |
| `web.src.pages.accessibility.009` | `src/pages/Accessibility.tsx:26` | text | support for reduced-motion preferences and responsive text; |
| `web.src.pages.accessibility.010` | `src/pages/Accessibility.tsx:27` | text | clear form instructions, validation states, and status messages; and |
| `web.src.pages.accessibility.011` | `src/pages/Accessibility.tsx:28` | text | browser and automated checks during frontend changes. |
| `web.src.pages.accessibility.012` | `src/pages/Accessibility.tsx:33` | text | Known limitations |
| `web.src.pages.accessibility.013` | `src/pages/Accessibility.tsx:35` | text | Some complex feed interactions and third-party sign-in controls may behave differently across screen readers and browsers. We continue to test these areas and prioritize fixes that block access to core learning or account functions. |
| `web.src.pages.accessibility.014` | `src/pages/Accessibility.tsx:42` | text | Feedback |
| `web.src.pages.accessibility.015` | `src/pages/Accessibility.tsx:44` | text | If a disability-related barrier prevents you from using VocabCat, please report the affected screen, what you were trying to do, and your browser or assistive technology through Help &amp; Support in the VocabCat app or the public support contact listed where you obtained VocabCat. We will review the report and work toward a reasonable solution. |
| `web.src.pages.checkemail.001` | `src/pages/CheckEmail.tsx:41` | status | Email verification code sent to ${email}. |
| `web.src.pages.checkemail.002` | `src/pages/CheckEmail.tsx:42` | status | Your email is already verified. |
| `web.src.pages.checkemail.003` | `src/pages/CheckEmail.tsx:63` | status | Your account is still waiting for email verification. |
| `web.src.pages.checkemail.004` | `src/pages/CheckEmail.tsx:86` | attr-alt | A gentle cat reassuring you during email verification. |
| `web.src.pages.checkemail.005` | `src/pages/CheckEmail.tsx:91` | text | Email verification |
| `web.src.pages.checkemail.006` | `src/pages/CheckEmail.tsx:92` | text | Check your inbox. |
| `web.src.pages.checkemail.007` | `src/pages/CheckEmail.tsx:94` | text | Your account stays locked to the verification flow until this email is verified. |
| `web.src.pages.checkemail.008` | `src/pages/CheckEmail.tsx:97` | text | Send an email verification code to |
| `web.src.pages.checkemail.009` | `src/pages/CheckEmail.tsx:97` | text | , then enter it here. |
| `web.src.pages.checkemail.010` | `src/pages/CheckEmail.tsx:103` | text | Sending... |
| `web.src.pages.checkemail.011` | `src/pages/CheckEmail.tsx:103` | text | Resend email verification code |
| `web.src.pages.checkemail.012` | `src/pages/CheckEmail.tsx:103` | text | Send email verification code |
| `web.src.pages.checkemail.013` | `src/pages/CheckEmail.tsx:108` | text | Email verification code |
| `web.src.pages.checkemail.014` | `src/pages/CheckEmail.tsx:113` | attr-placeholder | 123456 |
| `web.src.pages.checkemail.015` | `src/pages/CheckEmail.tsx:126` | text | Verifying... |
| `web.src.pages.checkemail.016` | `src/pages/CheckEmail.tsx:126` | text | Verify code |
| `web.src.pages.checkemail.017` | `src/pages/CheckEmail.tsx:131` | text | I already verified |
| `web.src.pages.checkemail.018` | `src/pages/CheckEmail.tsx:134` | text | Log out |
| `web.src.pages.checkemail.019` | `src/pages/CheckEmail.tsx:138` | text | Need to reset your password instead? |
| `web.src.pages.checkemail.020` | `src/pages/CheckEmail.tsx:138` | text | Request a reset link |
| `web.src.pages.demofeed.001` | `src/pages/DemoFeed.tsx:90` | attr-title | Demo feed |
| `web.src.pages.demofeed.002` | `src/pages/DemoFeed.tsx:94` | text | Reset |
| `web.src.pages.demofeed.003` | `src/pages/DemoFeed.tsx:97` | text | Back |
| `web.src.pages.demofeed.004` | `src/pages/DemoFeed.tsx:128` | text | Demo complete |
| `web.src.pages.demofeed.005` | `src/pages/DemoFeed.tsx:129` | text | You reached the end of the sample feed. |
| `web.src.pages.demofeed.006` | `src/pages/DemoFeed.tsx:131` | text | Create an account to save progress, reminders, and review history. |
| `web.src.pages.demofeed.007` | `src/pages/DemoFeed.tsx:135` | text | Start Learning |
| `web.src.pages.demofeed.008` | `src/pages/DemoFeed.tsx:138` | text | Replay Demo |
| `web.src.pages.emailverified.001` | `src/pages/EmailVerified.tsx:16` | attr-alt | A celebratory cat marking that your account is verified. |
| `web.src.pages.emailverified.002` | `src/pages/EmailVerified.tsx:21` | text | Email verified |
| `web.src.pages.emailverified.003` | `src/pages/EmailVerified.tsx:22` | text | You can continue learning. |
| `web.src.pages.emailverified.004` | `src/pages/EmailVerified.tsx:24` | text | Your account is now verified and core study features are unlocked. |
| `web.src.pages.emailverified.005` | `src/pages/EmailVerified.tsx:30` | text | Continue to the app |
| `web.src.pages.emailverified.006` | `src/pages/EmailVerified.tsx:34` | text | Log in |
| `web.src.pages.forgotpassword.001` | `src/pages/ForgotPassword.tsx:36` | text | Password reset |
| `web.src.pages.forgotpassword.002` | `src/pages/ForgotPassword.tsx:37` | text | Request a reset link. |
| `web.src.pages.forgotpassword.003` | `src/pages/ForgotPassword.tsx:41` | text | Email |
| `web.src.pages.forgotpassword.004` | `src/pages/ForgotPassword.tsx:48` | attr-placeholder | you@example.com |
| `web.src.pages.forgotpassword.005` | `src/pages/ForgotPassword.tsx:53` | text | Sending... |
| `web.src.pages.forgotpassword.006` | `src/pages/ForgotPassword.tsx:53` | text | Send reset link |
| `web.src.pages.forgotpassword.007` | `src/pages/ForgotPassword.tsx:57` | text | Remembered it? |
| `web.src.pages.forgotpassword.008` | `src/pages/ForgotPassword.tsx:57` | text | Back to login |
| `web.src.pages.home.001` | `src/pages/Home.tsx:22` | attr-title | Choose your next move. |
| `web.src.pages.home.002` | `src/pages/Home.tsx:25` | text | Log out |
| `web.src.pages.home.003` | `src/pages/Home.tsx:50` | text | Start Scrolling |
| `web.src.pages.home.004` | `src/pages/Home.tsx:52` | text | Dive into words, quizzes, and prompts in a full-screen feed. |
| `web.src.pages.home.005` | `src/pages/Home.tsx:57` | attr-alt | A warm smiling cat welcoming you into the study feed. |
| `web.src.pages.home.006` | `src/pages/Home.tsx:80` | text | Preferences |
| `web.src.pages.home.007` | `src/pages/Home.tsx:82` | text | Set your goals, timezone, and SMS updates. |
| `web.src.pages.home.008` | `src/pages/Home.tsx:102` | text | Stats & Summary |
| `web.src.pages.home.009` | `src/pages/Home.tsx:103` | text | Track streaks, accuracy, and progress. |
| `web.src.pages.privacy.001` | `src/pages/Privacy.tsx:5` | attr-title | Privacy Policy |
| `web.src.pages.privacy.002` | `src/pages/Privacy.tsx:5` | attr-effectiveDate | September 15, 2026 |
| `web.src.pages.privacy.003` | `src/pages/Privacy.tsx:7` | text | Who this policy covers |
| `web.src.pages.privacy.004` | `src/pages/Privacy.tsx:9` | text | This policy explains how VocabCat handles personal information when you use our website, learning app, accounts, reminders, and support features. VocabCat is intended for people age 13 and older. We do not knowingly allow children under 13 to create accounts. |
| `web.src.pages.privacy.005` | `src/pages/Privacy.tsx:17` | text | Information we collect |
| `web.src.pages.privacy.006` | `src/pages/Privacy.tsx:20` | text | Account information, such as email address, display name, password hash, authentication provider identifiers, profile image, and account status. |
| `web.src.pages.privacy.007` | `src/pages/Privacy.tsx:24` | text | Learning information, such as words viewed, answers, quiz attempts, written practice sentences, scores, feedback, streaks, and progress. |
| `web.src.pages.privacy.008` | `src/pages/Privacy.tsx:28` | text | Preferences, such as timezone, learning goals, feed choices, reminder frequency, phone number, and SMS consent status. |
| `web.src.pages.privacy.009` | `src/pages/Privacy.tsx:32` | text | Support information, such as issue descriptions and basic device or app details you submit with a report. |
| `web.src.pages.privacy.010` | `src/pages/Privacy.tsx:36` | text | Technical information needed to operate and secure the service, such as IP address, user agent, request identifiers, security events, and limited site-usage analytics. |
| `web.src.pages.privacy.011` | `src/pages/Privacy.tsx:44` | text | How we use information |
| `web.src.pages.privacy.012` | `src/pages/Privacy.tsx:46` | text | We use information to create and secure accounts, deliver vocabulary lessons, personalize review, measure progress, provide practice feedback, send requested reminders, provide support, prevent abuse, diagnose failures, and improve the service. We do not sell personal information or use it for targeted advertising. |
| `web.src.pages.privacy.013` | `src/pages/Privacy.tsx:54` | text | Service providers |
| `web.src.pages.privacy.014` | `src/pages/Privacy.tsx:56` | text | We use service providers to run VocabCat. These may include Google for sign-in, Google Cloud for backend hosting, Vercel for web hosting and limited analytics, Twilio for opted-in text messages and Resend for account email. They process information for the services they provide to us and under their own contractual and legal obligations. |
| `web.src.pages.privacy.015` | `src/pages/Privacy.tsx:65` | text | Retention and deletion |
| `web.src.pages.privacy.016` | `src/pages/Privacy.tsx:67` | text | We keep account and learning information while your account is active and as needed to provide the service, protect it, resolve disputes, and meet legal obligations. Retention periods may differ for security records, provider logs, and backups. You can permanently delete your account and associated application data from Settings. Some limited records may remain when law, fraud prevention, security, or backup-integrity requirements require it. |
| `web.src.pages.privacy.017` | `src/pages/Privacy.tsx:77` | text | Your choices |
| `web.src.pages.privacy.018` | `src/pages/Privacy.tsx:79` | text | Update learning and reminder preferences in Settings. |
| `web.src.pages.privacy.019` | `src/pages/Privacy.tsx:80` | text | Opt out of SMS reminders in SMS settings or by replying STOP. |
| `web.src.pages.privacy.020` | `src/pages/Privacy.tsx:81` | text | Delete your account and application data in Settings. |
| `web.src.pages.privacy.021` | `src/pages/Privacy.tsx:82` | text | Use the in-app support feature for access, correction, or privacy requests. |
| `web.src.pages.privacy.022` | `src/pages/Privacy.tsx:87` | text | Security and international processing |
| `web.src.pages.privacy.023` | `src/pages/Privacy.tsx:89` | text | We use administrative, technical, and organizational safeguards designed to protect personal information. No system is completely secure. VocabCat and its providers may process information in the United States and other countries where they operate. |
| `web.src.pages.privacy.024` | `src/pages/Privacy.tsx:97` | text | Changes and contact |
| `web.src.pages.privacy.025` | `src/pages/Privacy.tsx:99` | text | We may update this policy as the service changes. We will update the effective date and provide additional notice when required. For privacy questions or requests, use Help &amp; Support in the VocabCat app. If you cannot access the app, use the public support contact listed in the store or website where you obtained VocabCat. |
| `web.src.pages.resetpassword.001` | `src/pages/ResetPassword.tsx:29` | status | This reset link is missing a token. |
| `web.src.pages.resetpassword.002` | `src/pages/ResetPassword.tsx:33` | status | Passwords do not match. |
| `web.src.pages.resetpassword.003` | `src/pages/ResetPassword.tsx:51` | text | Password reset |
| `web.src.pages.resetpassword.004` | `src/pages/ResetPassword.tsx:52` | text | Choose a new password. |
| `web.src.pages.resetpassword.005` | `src/pages/ResetPassword.tsx:56` | text | New password |
| `web.src.pages.resetpassword.006` | `src/pages/ResetPassword.tsx:68` | text | Confirm password |
| `web.src.pages.resetpassword.007` | `src/pages/ResetPassword.tsx:80` | text | Updating... |
| `web.src.pages.resetpassword.008` | `src/pages/ResetPassword.tsx:80` | text | Update password |
| `web.src.pages.resetpassword.009` | `src/pages/ResetPassword.tsx:84` | text | Back to |
| `web.src.pages.resetpassword.010` | `src/pages/ResetPassword.tsx:84` | text | login |
| `web.src.pages.settings.001` | `src/pages/Settings.tsx:165` | status | Settings saved. |
| `web.src.pages.settings.002` | `src/pages/Settings.tsx:201` | status | Your email is already verified. |
| `web.src.pages.settings.003` | `src/pages/Settings.tsx:203` | status | Verification email sent. |
| `web.src.pages.settings.004` | `src/pages/Settings.tsx:222` | status | Type "DELETE" to confirm account deletion. |
| `web.src.pages.settings.005` | `src/pages/Settings.tsx:277` | attr-title | Adjust your daily flow. |
| `web.src.pages.settings.006` | `src/pages/Settings.tsx:280` | text | Back home |
| `web.src.pages.settings.007` | `src/pages/Settings.tsx:287` | text | Email verification |
| `web.src.pages.settings.008` | `src/pages/Settings.tsx:290` | text | Signed in as ${email \|\| "this account"}. Check your inbox to verify this address. |
| `web.src.pages.settings.009` | `src/pages/Settings.tsx:292` | text | Signed in as ${email}. |
| `web.src.pages.settings.010` | `src/pages/Settings.tsx:293` | text | Signed-in email. |
| `web.src.pages.settings.011` | `src/pages/Settings.tsx:307` | text | Verified |
| `web.src.pages.settings.012` | `src/pages/Settings.tsx:309` | text | Not verified |
| `web.src.pages.settings.013` | `src/pages/Settings.tsx:310` | text | Unknown |
| `web.src.pages.settings.014` | `src/pages/Settings.tsx:318` | text | Sending... |
| `web.src.pages.settings.015` | `src/pages/Settings.tsx:318` | text | Resend verification email |
| `web.src.pages.settings.016` | `src/pages/Settings.tsx:327` | text | Timezone |
| `web.src.pages.settings.017` | `src/pages/Settings.tsx:343` | text | Words target (weekly + daily) |
| `web.src.pages.settings.018` | `src/pages/Settings.tsx:359` | text | / week |
| `web.src.pages.settings.019` | `src/pages/Settings.tsx:364` | text | / day |
| `web.src.pages.settings.020` | `src/pages/Settings.tsx:369` | text | Texts per week |
| `web.src.pages.settings.021` | `src/pages/Settings.tsx:386` | text | Saving... |
| `web.src.pages.settings.022` | `src/pages/Settings.tsx:386` | text | Save settings |
| `web.src.pages.settings.023` | `src/pages/Settings.tsx:395` | text | SMS reminders |
| `web.src.pages.settings.024` | `src/pages/Settings.tsx:403` | text | Manage SMS reminders |
| `web.src.pages.settings.025` | `src/pages/Settings.tsx:403` | text | Open Twilio consent |
| `web.src.pages.settings.026` | `src/pages/Settings.tsx:408` | text | Current phone |
| `web.src.pages.settings.027` | `src/pages/Settings.tsx:417` | text | SMS reminders |
| `web.src.pages.settings.028` | `src/pages/Settings.tsx:419` | text | SMS is disabled for this account. |
| `web.src.pages.settings.029` | `src/pages/Settings.tsx:427` | text | Delete account |
| `web.src.pages.settings.030` | `src/pages/Settings.tsx:429` | text | This permanently deletes your account, progress, messages, saved sessions, and settings. |
| `web.src.pages.settings.031` | `src/pages/Settings.tsx:433` | text | Type DELETE to confirm |
| `web.src.pages.settings.032` | `src/pages/Settings.tsx:450` | text | Deleting... |
| `web.src.pages.settings.033` | `src/pages/Settings.tsx:450` | text | Delete account |
| `web.src.pages.smsconsent.001` | `src/pages/SmsConsent.tsx:61` | status | Enter a phone number in E.164 format. |
| `web.src.pages.smsconsent.002` | `src/pages/SmsConsent.tsx:65` | status | You must agree to the Twilio SMS consent terms before opting in. |
| `web.src.pages.smsconsent.003` | `src/pages/SmsConsent.tsx:87` | status | SMS opt-in complete. |
| `web.src.pages.smsconsent.004` | `src/pages/SmsConsent.tsx:119` | status | SMS opt-out complete. |
| `web.src.pages.smsconsent.005` | `src/pages/SmsConsent.tsx:160` | attr-title | Twilio SMS consent. |
| `web.src.pages.smsconsent.006` | `src/pages/SmsConsent.tsx:161` | attr-subtitle | Manage study reminder texts and confirm consent for your phone number. |
| `web.src.pages.smsconsent.007` | `src/pages/SmsConsent.tsx:165` | text | Back to settings |
| `web.src.pages.smsconsent.008` | `src/pages/SmsConsent.tsx:172` | text | SMS reminders |
| `web.src.pages.smsconsent.009` | `src/pages/SmsConsent.tsx:179` | text | Phone (E.164) |
| `web.src.pages.smsconsent.010` | `src/pages/SmsConsent.tsx:184` | attr-placeholder | +14155552671 |
| `web.src.pages.smsconsent.011` | `src/pages/SmsConsent.tsx:192` | text | Twilio SMS consent |
| `web.src.pages.smsconsent.012` | `src/pages/SmsConsent.tsx:194` | text | By checking the box below, you agree to receive automated study reminder text messages from VocabCat at the phone number above using Twilio. Message frequency varies based on your settings. Message and data rates may apply. Consent is not a condition of purchase. Reply STOP to opt out and HELP for help. |
| `web.src.pages.smsconsent.013` | `src/pages/SmsConsent.tsx:209` | text | I confirm that I am the subscriber for this phone number, or I have permission to receive Twilio-powered VocabCat reminders at this number. |
| `web.src.pages.smsconsent.014` | `src/pages/SmsConsent.tsx:222` | text | Updating... |
| `web.src.pages.smsconsent.015` | `src/pages/SmsConsent.tsx:222` | text | Update phone |
| `web.src.pages.smsconsent.016` | `src/pages/SmsConsent.tsx:222` | text | Opt in |
| `web.src.pages.smsconsent.017` | `src/pages/SmsConsent.tsx:229` | text | Opt out |
| `web.src.pages.stats.001` | `src/pages/Stats.tsx:113` | property-label | Mastered |
| `web.src.pages.stats.002` | `src/pages/Stats.tsx:116` | property-label | Learning |
| `web.src.pages.stats.003` | `src/pages/Stats.tsx:119` | property-label | Reviewing |
| `web.src.pages.stats.004` | `src/pages/Stats.tsx:122` | property-label | New |
| `web.src.pages.stats.005` | `src/pages/Stats.tsx:125` | property-label | Due |
| `web.src.pages.stats.006` | `src/pages/Stats.tsx:127` | property-label | In progress |
| `web.src.pages.stats.007` | `src/pages/Stats.tsx:151` | property-label | Next due |
| `web.src.pages.stats.008` | `src/pages/Stats.tsx:154` | property-label | Last seen |
| `web.src.pages.stats.009` | `src/pages/Stats.tsx:527` | status | Downgrade this word to unlearned? It will reappear in your feed. |
| `web.src.pages.stats.010` | `src/pages/Stats.tsx:638` | attr-title | Your learning snapshot. |
| `web.src.pages.stats.011` | `src/pages/Stats.tsx:641` | text | Back home |
| `web.src.pages.stats.012` | `src/pages/Stats.tsx:647` | text | Momentum |
| `web.src.pages.stats.013` | `src/pages/Stats.tsx:648` | text | This screen gets the brighter mascot treatment. |
| `web.src.pages.stats.014` | `src/pages/Stats.tsx:650` | text | The feed reacts to each answer, while stats stays upbeat and progress-focused. |
| `web.src.pages.stats.015` | `src/pages/Stats.tsx:655` | attr-alt | A bright happy cat highlighting your study progress. |
| `web.src.pages.stats.016` | `src/pages/Stats.tsx:664` | text | Mastered |
| `web.src.pages.stats.017` | `src/pages/Stats.tsx:668` | text | Learning |
| `web.src.pages.stats.018` | `src/pages/Stats.tsx:672` | text | Due |
| `web.src.pages.stats.019` | `src/pages/Stats.tsx:676` | text | Accuracy |
| `web.src.pages.stats.020` | `src/pages/Stats.tsx:682` | text | Current streak |
| `web.src.pages.stats.021` | `src/pages/Stats.tsx:688` | text | Longest streak |
| `web.src.pages.stats.022` | `src/pages/Stats.tsx:698` | text | This Week |
| `web.src.pages.stats.023` | `src/pages/Stats.tsx:705` | text | All Time |
| `web.src.pages.stats.024` | `src/pages/Stats.tsx:713` | text | Search |
| `web.src.pages.stats.025` | `src/pages/Stats.tsx:718` | attr-placeholder | Search words... |
| `web.src.pages.stats.026` | `src/pages/Stats.tsx:722` | text | Status |
| `web.src.pages.stats.027` | `src/pages/Stats.tsx:730` | text | All |
| `web.src.pages.stats.028` | `src/pages/Stats.tsx:731` | text | New |
| `web.src.pages.stats.029` | `src/pages/Stats.tsx:732` | text | Learning |
| `web.src.pages.stats.030` | `src/pages/Stats.tsx:733` | text | Reviewing |
| `web.src.pages.stats.031` | `src/pages/Stats.tsx:734` | text | Mastered |
| `web.src.pages.stats.032` | `src/pages/Stats.tsx:738` | text | Sort |
| `web.src.pages.stats.033` | `src/pages/Stats.tsx:744` | text | Recent |
| `web.src.pages.stats.034` | `src/pages/Stats.tsx:745` | text | Highest mastery |
| `web.src.pages.stats.035` | `src/pages/Stats.tsx:746` | text | Lowest mastery |
| `web.src.pages.stats.036` | `src/pages/Stats.tsx:747` | text | Highest learned |
| `web.src.pages.stats.037` | `src/pages/Stats.tsx:748` | text | Lowest learned |
| `web.src.pages.stats.038` | `src/pages/Stats.tsx:749` | text | Most seen |
| `web.src.pages.stats.039` | `src/pages/Stats.tsx:750` | text | Least seen |
| `web.src.pages.stats.040` | `src/pages/Stats.tsx:751` | text | Highest accuracy |
| `web.src.pages.stats.041` | `src/pages/Stats.tsx:752` | text | Lowest accuracy |
| `web.src.pages.stats.042` | `src/pages/Stats.tsx:757` | text | Assigned |
| `web.src.pages.stats.043` | `src/pages/Stats.tsx:765` | text | Any |
| `web.src.pages.stats.044` | `src/pages/Stats.tsx:766` | text | Only assigned |
| `web.src.pages.stats.045` | `src/pages/Stats.tsx:767` | text | Exclude assigned |
| `web.src.pages.stats.046` | `src/pages/Stats.tsx:772` | text | Assigned |
| `web.src.pages.stats.047` | `src/pages/Stats.tsx:779` | text | More filters |
| `web.src.pages.stats.048` | `src/pages/Stats.tsx:782` | text | Assigned first |
| `web.src.pages.stats.049` | `src/pages/Stats.tsx:784` | text | On |
| `web.src.pages.stats.050` | `src/pages/Stats.tsx:784` | text | Off |
| `web.src.pages.stats.051` | `src/pages/Stats.tsx:793` | text | Seen count |
| `web.src.pages.stats.052` | `src/pages/Stats.tsx:798` | attr-placeholder | Min |
| `web.src.pages.stats.053` | `src/pages/Stats.tsx:805` | attr-placeholder | Max |
| `web.src.pages.stats.054` | `src/pages/Stats.tsx:812` | text | Learned rating |
| `web.src.pages.stats.055` | `src/pages/Stats.tsx:817` | attr-placeholder | Min |
| `web.src.pages.stats.056` | `src/pages/Stats.tsx:824` | attr-placeholder | Max |
| `web.src.pages.stats.057` | `src/pages/Stats.tsx:831` | text | Mastery rating |
| `web.src.pages.stats.058` | `src/pages/Stats.tsx:836` | attr-placeholder | Min |
| `web.src.pages.stats.059` | `src/pages/Stats.tsx:843` | attr-placeholder | Max |
| `web.src.pages.stats.060` | `src/pages/Stats.tsx:850` | text | Accuracy |
| `web.src.pages.stats.061` | `src/pages/Stats.tsx:855` | attr-placeholder | Min (0-1) |
| `web.src.pages.stats.062` | `src/pages/Stats.tsx:862` | attr-placeholder | Max (0-1) |
| `web.src.pages.stats.063` | `src/pages/Stats.tsx:876` | text | Loading words... |
| `web.src.pages.stats.064` | `src/pages/Stats.tsx:881` | text | No words to show yet. |
| `web.src.pages.stats.065` | `src/pages/Stats.tsx:903` | text | : |
| `web.src.pages.stats.066` | `src/pages/Stats.tsx:911` | text | Assigned |
| `web.src.pages.stats.067` | `src/pages/Stats.tsx:938` | text | ${Math.round(percent)}% mastery |
| `web.src.pages.stats.068` | `src/pages/Stats.tsx:938` | text | Mastery pending |
| `web.src.pages.stats.069` | `src/pages/Stats.tsx:939` | text | · ${formatAccuracy(accuracy)} accuracy |
| `web.src.pages.stats.070` | `src/pages/Stats.tsx:948` | text | Loading... |
| `web.src.pages.stats.071` | `src/pages/Stats.tsx:948` | text | Load more |
| `web.src.pages.stats.072` | `src/pages/Stats.tsx:956` | text | Recent activity |
| `web.src.pages.stats.073` | `src/pages/Stats.tsx:983` | text | Details |
| `web.src.pages.stats.074` | `src/pages/Stats.tsx:995` | text | Questions |
| `web.src.pages.stats.075` | `src/pages/Stats.tsx:1005` | text | Downgrade |
| `web.src.pages.stats.076` | `src/pages/Stats.tsx:1026` | text | Assigned |
| `web.src.pages.stats.077` | `src/pages/Stats.tsx:1031` | text | : |
| `web.src.pages.stats.078` | `src/pages/Stats.tsx:1048` | text | Mastery |
| `web.src.pages.stats.079` | `src/pages/Stats.tsx:1051` | text | ${Math.round(selectedMeta.percent)}% |
| `web.src.pages.stats.080` | `src/pages/Stats.tsx:1052` | text | - |
| `web.src.pages.stats.081` | `src/pages/Stats.tsx:1056` | text | Mastery rating |
| `web.src.pages.stats.082` | `src/pages/Stats.tsx:1062` | text | Learned rating |
| `web.src.pages.stats.083` | `src/pages/Stats.tsx:1068` | text | Accuracy |
| `web.src.pages.stats.084` | `src/pages/Stats.tsx:1072` | text | - |
| `web.src.pages.stats.085` | `src/pages/Stats.tsx:1076` | text | Seen count |
| `web.src.pages.stats.086` | `src/pages/Stats.tsx:1082` | text | Correct |
| `web.src.pages.stats.087` | `src/pages/Stats.tsx:1086` | text | Incorrect |
| `web.src.pages.stats.088` | `src/pages/Stats.tsx:1092` | text | Streak |
| `web.src.pages.stats.089` | `src/pages/Stats.tsx:1097` | text | Manual adjustments |
| `web.src.pages.stats.090` | `src/pages/Stats.tsx:1107` | text | Learned -1 |
| `web.src.pages.stats.091` | `src/pages/Stats.tsx:1117` | text | Learned +1 |
| `web.src.pages.stats.092` | `src/pages/Stats.tsx:1127` | text | Mastery -1 |
| `web.src.pages.stats.093` | `src/pages/Stats.tsx:1137` | text | Mastery +1 |
| `web.src.pages.stats.094` | `src/pages/Stats.tsx:1146` | text | Loading questions... |
| `web.src.pages.stats.095` | `src/pages/Stats.tsx:1151` | text | No questions answered yet. |
| `web.src.pages.stats.096` | `src/pages/Stats.tsx:1164` | text | Correct |
| `web.src.pages.stats.097` | `src/pages/Stats.tsx:1164` | text | Incorrect |
| `web.src.pages.stats.098` | `src/pages/Stats.tsx:1190` | text | Explanation: |
| `web.src.pages.stats.099` | `src/pages/Stats.tsx:1205` | text | Load more |
| `web.src.pages.stats.100` | `src/pages/Stats.tsx:1213` | text | History |
| `web.src.pages.terms.001` | `src/pages/Terms.tsx:5` | attr-title | Terms of Use |
| `web.src.pages.terms.002` | `src/pages/Terms.tsx:5` | attr-effectiveDate | September 15, 2026 |
| `web.src.pages.terms.003` | `src/pages/Terms.tsx:7` | text | Agreement and eligibility |
| `web.src.pages.terms.004` | `src/pages/Terms.tsx:9` | text | These Terms govern your use of VocabCat. By creating an account or using the service, you agree to these Terms and the Privacy Policy. You must be at least 13 years old. If local law requires you to be older to consent on your own, a parent or legal guardian must review and agree to these Terms for you. |
| `web.src.pages.terms.005` | `src/pages/Terms.tsx:17` | text | Your account |
| `web.src.pages.terms.006` | `src/pages/Terms.tsx:19` | text | Give us accurate information, keep your credentials secure, and tell us if you believe someone has accessed your account. You are responsible for activity performed through your account. You may delete your account through Settings. |
| `web.src.pages.terms.007` | `src/pages/Terms.tsx:26` | text | Acceptable use |
| `web.src.pages.terms.008` | `src/pages/Terms.tsx:27` | text | You may not: |
| `web.src.pages.terms.009` | `src/pages/Terms.tsx:29` | text | break the law or violate another person’s rights; |
| `web.src.pages.terms.010` | `src/pages/Terms.tsx:30` | text | interfere with, probe, scrape, or overload the service; |
| `web.src.pages.terms.011` | `src/pages/Terms.tsx:31` | text | bypass access, usage, security, or rate limits; |
| `web.src.pages.terms.012` | `src/pages/Terms.tsx:32` | text | submit malicious code or content you do not have the right to use; or |
| `web.src.pages.terms.013` | `src/pages/Terms.tsx:33` | text | use VocabCat to harm, harass, impersonate, or deceive anyone. |
| `web.src.pages.terms.014` | `src/pages/Terms.tsx:38` | text | Learning content |
| `web.src.pages.terms.015` | `src/pages/Terms.tsx:40` | text | VocabCat provides educational practice, not professional advice or a guaranteed learning outcome. Definitions, questions, scores, summaries, and feedback may contain errors. You should use judgment and check important material against a reliable source. |
| `web.src.pages.terms.016` | `src/pages/Terms.tsx:48` | text | Your content |
| `web.src.pages.terms.017` | `src/pages/Terms.tsx:50` | text | You keep ownership of content you submit. You give VocabCat a limited permission to host, process, reproduce, and transmit that content only as needed to operate, secure, support, and improve the service. Do not submit sensitive information in learning exercises or content that violates another person’s rights. |
| `web.src.pages.terms.018` | `src/pages/Terms.tsx:58` | text | Messages |
| `web.src.pages.terms.019` | `src/pages/Terms.tsx:60` | text | Email needed for account security or service operation may be sent as part of your account. SMS study reminders are optional. Message frequency varies, message and data rates may apply, and consent is not a condition of purchase. Reply STOP to opt out or HELP for help. |
| `web.src.pages.terms.020` | `src/pages/Terms.tsx:68` | text | Service changes and suspension |
| `web.src.pages.terms.021` | `src/pages/Terms.tsx:70` | text | We may change, pause, or discontinue features. We may limit or suspend access when reasonably necessary to protect users or the service, investigate abuse, comply with law, or enforce these Terms. We will provide notice when reasonably practical and legally permitted. |
| `web.src.pages.terms.022` | `src/pages/Terms.tsx:78` | text | Disclaimers and liability |
| `web.src.pages.terms.023` | `src/pages/Terms.tsx:80` | text | To the extent allowed by law, VocabCat is provided “as is” and “as available,” without warranties of uninterrupted operation, accuracy, or fitness for a particular purpose. To the extent allowed by law, VocabCat is not liable for indirect, incidental, special, consequential, or punitive damages. Nothing in these Terms removes rights or remedies that cannot legally be limited. |
| `web.src.pages.terms.024` | `src/pages/Terms.tsx:89` | text | Changes and contact |
| `web.src.pages.terms.025` | `src/pages/Terms.tsx:91` | text | We may update these Terms and will post the effective date. If a change materially affects your rights, we will provide additional notice when required. Questions about these Terms can be submitted through Help &amp; Support in the VocabCat app or the public support contact listed where you obtained VocabCat. |
| `web.src.pages.tutorial.001` | `src/pages/Tutorial.tsx:85` | attr-alt | A calm cat encouraging you to set a sustainable weekly pace. |
| `web.src.pages.tutorial.002` | `src/pages/Tutorial.tsx:90` | text | Tutorial |
| `web.src.pages.tutorial.003` | `src/pages/Tutorial.tsx:91` | text | Set your weekly targets. |
| `web.src.pages.tutorial.004` | `src/pages/Tutorial.tsx:93` | text | Choose a sustainable pace. You can change this later in settings. |
| `web.src.pages.tutorial.005` | `src/pages/Tutorial.tsx:99` | text | Words per week |
| `web.src.pages.tutorial.006` | `src/pages/Tutorial.tsx:109` | text | words |
| `web.src.pages.tutorial.007` | `src/pages/Tutorial.tsx:112` | text | Texts per week |
| `web.src.pages.tutorial.008` | `src/pages/Tutorial.tsx:122` | text | texts |
| `web.src.pages.tutorial.009` | `src/pages/Tutorial.tsx:126` | text | Saving... |
| `web.src.pages.tutorial.010` | `src/pages/Tutorial.tsx:126` | text | Save and continue |
| `web.src.pages.verifyemail.001` | `src/pages/VerifyEmail.tsx:29` | property-message | This verification link is missing a token. |
| `web.src.pages.verifyemail.002` | `src/pages/VerifyEmail.tsx:73` | text | Email verification |
| `web.src.pages.verifyemail.003` | `src/pages/VerifyEmail.tsx:74` | text | Verifying your email. |
| `web.src.pages.verifyemail.004` | `src/pages/VerifyEmail.tsx:75` | text | Please wait while we confirm your link. |
| `web.src.pages.verifyemail.005` | `src/pages/VerifyEmail.tsx:80` | text | Email verified |
| `web.src.pages.verifyemail.006` | `src/pages/VerifyEmail.tsx:81` | text | You were already verified. |
| `web.src.pages.verifyemail.007` | `src/pages/VerifyEmail.tsx:81` | text | Your email is verified. |
| `web.src.pages.verifyemail.008` | `src/pages/VerifyEmail.tsx:82` | text | Redirecting you now. |
| `web.src.pages.verifyemail.009` | `src/pages/VerifyEmail.tsx:87` | text | Verification failed |
| `web.src.pages.verifyemail.010` | `src/pages/VerifyEmail.tsx:88` | text | We could not verify this link. |
| `web.src.pages.verifyemail.011` | `src/pages/VerifyEmail.tsx:92` | text | Go to verification page |
| `web.src.pages.verifyemail.012` | `src/pages/VerifyEmail.tsx:94` | text | Back to login |

<!-- END VERIFIED SOURCE COPY -->

# VocabCat Landing Page Copy — Source of Truth

Status: human-owned working copy

This file is the canonical source for every marketing message shown on the public landing page, including the scroll demo and sign-up modal. The website reads these entries directly at build time. Do not rewrite, “improve,” summarize, or generate replacement copy unless the product owner supplies the exact wording.

Editing rules:

- Edit only the words inside a `text` code block.
- Keep every backticked key and every code fence intact.
- A text block may span multiple lines; the site will collapse line breaks into spaces.
- The **Placement** label says exactly where the text appears.
- Accessibility-only labels are included because they are part of the experience even when they are not visible.
- Product name, example vocabulary words, answer options, times, and sample counts are included so the whole page can be reviewed in one place.

## Navigation and hero

#### `nav.skipToContent`
**Placement:** Keyboard-only link that jumps past the landing navigation and hero.
```text
Skip to content
```

#### `nav.brand`
**Placement:** Top-left product wordmark.
```text
VocabCat
```

#### `nav.homeAriaLabel`
**Placement:** Screen-reader label for the top-left home link.
```text
VocabCat home
```

#### `nav.note`
**Placement:** Short descriptor in the top navigation, before the login button.
```text
Habit-building vocabulary review
```

#### `nav.login`
**Placement:** Top-right navigation button.
```text
Log In
```

#### `hero.headline`
**Placement:** Main page heading in the first screen.
```text
Learn vocabulary the way you already scroll.
```

#### `hero.subheadline`
**Placement:** Paragraph directly below the main heading.
```text
VocabCat turns vocabulary practice into a short daily habit with quick questions, personalized review, reminders, and clear progress summaries.
```

#### `hero.primaryCta`
**Placement:** Main hero button; opens sign-up.
```text
Start Learning
```

#### `hero.secondaryCta`
**Placement:** Secondary hero link; scrolls to the demo.
```text
See How It Works
```

#### `hero.highlightsAriaLabel`
**Placement:** Screen-reader label for the row of benefit chips.
```text
Key benefits
```

#### `hero.highlight.1`
**Placement:** First benefit chip below the hero buttons.
```text
Short daily sessions
```

#### `hero.highlight.2`
**Placement:** Second benefit chip below the hero buttons.
```text
Personalized review
```

#### `hero.highlight.3`
**Placement:** Third benefit chip below the hero buttons.
```text
Learning summaries
```

#### `hero.floatingTopLabel`
**Placement:** Small label on the upper floating card beside the phone preview.
```text
Daily rhythm
```

#### `hero.floatingTopBody`
**Placement:** Main text on the upper floating card beside the phone preview.
```text
Short daily sessions that are easy to keep doing.
```

#### `hero.floatingBottomLabel`
**Placement:** Small label on the lower floating card beside the phone preview.
```text
Today
```

#### `hero.floatingBottomBody`
**Placement:** Main text on the lower floating card beside the phone preview.
```text
3 words ready for review
```

## Scroll demo introduction and navigation

#### `demo.headline`
**Placement:** Heading above the sticky phone demo.
```text
Meet your daily study partner.
```

#### `demo.walkthroughAriaLabel`
**Placement:** Screen-reader label for the six-step demo walkthrough.
```text
Demo walkthrough
```

## Demo step 1 — word card

#### `demo.word.label`
**Placement:** Internal/demo state label used to identify the word-card screen.
```text
Word card
```

#### `demo.word.sideTitle`
**Placement:** Step 01 heading beside the phone.
```text
Start with one word.
```

#### `demo.word.sideBody`
**Placement:** Step 01 paragraph beside the phone.
```text
Each session begins with a focused word card that is quick to read and easy to understand.
```

#### `demo.word.ariaLabel`
**Placement:** Screen-reader description of the phone in step 01.
```text
a word card for Eloquent and its definition
```

#### `phone.word.term`
**Placement:** Example word shown inside the phone in step 01.
```text
Eloquent
```

#### `phone.word.definition`
**Placement:** Example definition shown inside the phone in step 01.
```text
Fluent, persuasive, and clear in speech or writing.
```

#### `phone.word.focusLabel`
**Placement:** Small insight label under the word card.
```text
Today's focus
```

#### `phone.word.focusBody`
**Placement:** Insight text under the word card.
```text
Read once. Recall once. Keep going.
```

## Demo step 2 — quick question

#### `demo.question.label`
**Placement:** Internal/demo state label used to identify the question screen.
```text
Quick question
```

#### `demo.question.sideTitle`
**Placement:** Step 02 heading beside the phone.
```text
Answer a quick question.
```

#### `demo.question.sideBody`
**Placement:** Step 02 paragraph beside the phone.
```text
Short questions reinforce meaning without turning practice into a long study session.
```

#### `demo.question.ariaLabel`
**Placement:** Screen-reader description of the phone in step 02.
```text
a multiple-choice question about the meaning of Eloquent
```

#### `phone.question.prompt`
**Placement:** Question shown inside the phone.
```text
What does “eloquent” most nearly mean?
```

#### `phone.question.option.1`
**Placement:** First answer option inside the phone.
```text
A. Confusing
```

#### `phone.question.option.2`
**Placement:** Second answer option inside the phone.
```text
B. Persuasive
```

#### `phone.question.option.3`
**Placement:** Third answer option inside the phone.
```text
C. Careless
```

#### `phone.question.option.4`
**Placement:** Fourth answer option inside the phone.
```text
D. Ordinary
```

## Demo step 3 — instant feedback

#### `demo.feedback.label`
**Placement:** Internal/demo state label used to identify the feedback screen.
```text
Instant feedback
```

#### `demo.feedback.sideTitle`
**Placement:** Step 03 heading beside the phone.
```text
Learn from feedback immediately.
```

#### `demo.feedback.sideBody`
**Placement:** Step 03 paragraph beside the phone.
```text
Students see what they got right, what they missed, and why the answer makes sense.
```

#### `demo.feedback.ariaLabel`
**Placement:** Screen-reader description of the phone in step 03.
```text
instant feedback explaining the correct answer for Eloquent
```

#### `phone.feedback.status`
**Placement:** Correct-answer banner inside the phone.
```text
Correct.
```

#### `phone.feedback.title`
**Placement:** Main feedback sentence inside the phone.
```text
“Eloquent” means persuasive and clear.
```

#### `phone.feedback.body`
**Placement:** Supporting explanation inside the phone.
```text
The correct answer focuses on clear and persuasive communication.
```

## Demo step 4 — review queue

#### `demo.review.label`
**Placement:** Internal/demo state label used to identify the review screen.
```text
Review queue
```

#### `demo.review.sideTitle`
**Placement:** Step 04 heading beside the phone.
```text
Review the words that need attention.
```

#### `demo.review.sideBody`
**Placement:** Step 04 paragraph beside the phone.
```text
VocabCat keeps weak words in rotation so practice becomes targeted instead of random.
```

#### `demo.review.ariaLabel`
**Placement:** Screen-reader description of the phone in step 04.
```text
a review queue showing words ready for review
```

#### `phone.review.title`
**Placement:** Review-queue heading inside the phone.
```text
3 words ready for review
```

#### `phone.review.subtitle`
**Placement:** Review-queue explanation inside the phone.
```text
Missed words return automatically
```

#### `phone.review.item.1.word`
**Placement:** First example word in the review queue.
```text
Eloquent
```

#### `phone.review.item.1.meta`
**Placement:** Status below the first review word.
```text
Needs one more correct answer
```

#### `phone.review.item.2.word`
**Placement:** Second example word in the review queue.
```text
Pragmatic
```

#### `phone.review.item.2.meta`
**Placement:** Status below the second review word.
```text
Missed yesterday
```

#### `phone.review.item.3.word`
**Placement:** Third example word in the review queue.
```text
Lucid
```

#### `phone.review.item.3.meta`
**Placement:** Status below the third review word.
```text
Ready for a fast check-in
```

#### `phone.review.action`
**Placement:** Action chip beside each review word.
```text
Review
```

## Demo step 5 — reminders

#### `demo.reminders.label`
**Placement:** Internal/demo state label used to identify the reminders screen.
```text
Reminders
```

#### `demo.reminders.sideTitle`
**Placement:** Step 05 heading beside the phone.
```text
Stay consistent with reminders.
```

#### `demo.reminders.sideBody`
**Placement:** Step 05 paragraph beside the phone.
```text
Email and text reminders help students keep the habit going, even on busy days.
```

#### `demo.reminders.ariaLabel`
**Placement:** Screen-reader description of the phone in step 05.
```text
email and text reminder notifications for a vocab review
```

#### `phone.reminder.email.app`
**Placement:** App name in the first phone notification.
```text
Mail
```

#### `phone.reminder.email.time`
**Placement:** Time in the first phone notification.
```text
now
```

#### `phone.reminder.email.subject`
**Placement:** Subject in the first phone notification.
```text
Your vocab review is ready.
```

#### `phone.reminder.email.body`
**Placement:** Body in the first phone notification.
```text
You have 5 words waiting for practice.
```

#### `phone.reminder.sms.app`
**Placement:** App name in the second phone notification.
```text
Messages
```

#### `phone.reminder.sms.time`
**Placement:** Time in the second phone notification.
```text
2m ago
```

#### `phone.reminder.sms.subject`
**Placement:** Subject in the second phone notification.
```text
5 words are waiting today.
```

#### `phone.reminder.sms.body`
**Placement:** Body in the second phone notification.
```text
Your daily vocab session is ready.
```

## Demo step 6 — progress summary

#### `demo.summary.label`
**Placement:** Internal/demo state label used to identify the summary screen.
```text
Progress summary
```

#### `demo.summary.sideTitle`
**Placement:** Step 06 heading beside the phone.
```text
See progress over time.
```

#### `demo.summary.sideBody`
**Placement:** Step 06 paragraph beside the phone.
```text
Simple summaries show what was practiced, what improved, and what still needs review.
```

#### `demo.summary.ariaLabel`
**Placement:** Screen-reader description of the phone in step 06.
```text
a weekly summary with reviewed words, improvements, and a streak
```

#### `phone.summary.stat.1.value`
**Placement:** First large number in the phone summary.
```text
18
```

#### `phone.summary.stat.1.label`
**Placement:** Label under the first summary number.
```text
words reviewed this week
```

#### `phone.summary.stat.2.value`
**Placement:** Second large number in the phone summary.
```text
7
```

#### `phone.summary.stat.2.label`
**Placement:** Label under the second summary number.
```text
words improved
```

#### `phone.summary.stat.3.value`
**Placement:** Third large number in the phone summary.
```text
6
```

#### `phone.summary.stat.3.label`
**Placement:** Label under the third summary number.
```text
day streak
```

#### `phone.summary.nextLabel`
**Placement:** Small label below the phone summary.
```text
Next review
```

#### `phone.summary.nextBody`
**Placement:** Text below the phone summary.
```text
3 words still need attention
```

#### `phone.previewAriaPrefix`
**Placement:** Screen-reader prefix before the active demo state's description.
```text
VocabCat app preview showing
```

## Problem section

#### `problem.headline`
**Placement:** Main heading of the problem section.
```text
Vocabulary practice is easy to delay.
```

#### `problem.body`
**Placement:** Introductory paragraph in the problem section.
```text
Flashcards, long lists, and test prep books require time and discipline. Most students know vocabulary matters, but consistency is hard to maintain.
```

#### `problem.card.1.title`
**Placement:** First problem-card heading.
```text
Practice feels too long
```

#### `problem.card.1.body`
**Placement:** First problem-card paragraph.
```text
Traditional study formats ask for more time and focus than most students can give every day.
```

#### `problem.card.2.title`
**Placement:** Second problem-card heading.
```text
Review is easy to forget
```

#### `problem.card.2.body`
**Placement:** Second problem-card paragraph.
```text
Without a simple return path, missed words slip away between school, homework, and everything else.
```

#### `problem.card.3.title`
**Placement:** Third problem-card heading.
```text
Progress is hard to see
```

#### `problem.card.3.body`
**Placement:** Third problem-card paragraph.
```text
If improvement stays hidden, the habit feels abstract instead of rewarding.
```

## Solution section

#### `solution.headline`
**Placement:** Main heading of the solution section.
```text
Built for short, consistent practice.
```

#### `solution.body`
**Placement:** Introductory paragraph in the solution section.
```text
VocabCat breaks vocabulary learning into small, repeatable sessions that fit into a normal day.
```

#### `solution.feature.1.title`
**Placement:** First solution-card heading.
```text
Scroll-based sessions
```

#### `solution.feature.1.body`
**Placement:** First solution-card paragraph.
```text
Move through words and questions quickly without feeling stuck in a long lesson.
```

#### `solution.feature.2.title`
**Placement:** Second solution-card heading.
```text
Personalized review
```

#### `solution.feature.2.body`
**Placement:** Second solution-card paragraph.
```text
Missed words come back automatically so students spend more time on what they need.
```

#### `solution.feature.3.title`
**Placement:** Third solution-card heading.
```text
Smart reminders
```

#### `solution.feature.3.body`
**Placement:** Third solution-card paragraph.
```text
Email and text reminders make practice easier to remember.
```

#### `solution.feature.4.title`
**Placement:** Fourth solution-card heading.
```text
Learning summaries
```

#### `solution.feature.4.body`
**Placement:** Fourth solution-card paragraph.
```text
Weekly summaries show reviewed words, improvement, streaks, and areas for review.
```

## Habit section

#### `habit.headline`
**Placement:** Main heading of the habit section.
```text
Designed around consistency.
```

#### `habit.body`
**Placement:** Introductory paragraph in the habit section.
```text
A strong vocabulary is built through repeated exposure. VocabCat makes that repetition easier by turning practice into a small daily action instead of a large study task.
```

#### `habit.pillar.1.title`
**Placement:** First habit-card heading.
```text
Start quickly
```

#### `habit.pillar.1.body`
**Placement:** First habit-card paragraph.
```text
Begin with one focused word card instead of preparing for a long study block.
```

#### `habit.pillar.2.title`
**Placement:** Second habit-card heading.
```text
Practice briefly
```

#### `habit.pillar.2.body`
**Placement:** Second habit-card paragraph.
```text
Short questions and targeted review keep each session manageable and clear.
```

#### `habit.pillar.3.title`
**Placement:** Third habit-card heading.
```text
Return daily
```

#### `habit.pillar.3.body`
**Placement:** Third habit-card paragraph.
```text
Reminders and summaries make it easier to keep practice active over time.
```

## Reminder and summary section

#### `reminder.headline`
**Placement:** Main heading of the reminder section.
```text
Reminders that keep learning active.
```

#### `reminder.body`
**Placement:** Introductory paragraph in the reminder section.
```text
VocabCat sends email and text reminders so practice does not get skipped. It also provides summaries showing what was learned and what needs review.
```

#### `reminder.card.1.app`
**Placement:** App name on the first sample notification.
```text
Mail
```

#### `reminder.card.1.channel`
**Placement:** Channel label on the first sample notification.
```text
Gmail
```

#### `reminder.card.1.time`
**Placement:** Time on the first sample notification.
```text
now
```

#### `reminder.card.1.subject`
**Placement:** Subject on the first sample notification.
```text
Today’s vocab review is ready
```

#### `reminder.card.1.body`
**Placement:** Body on the first sample notification.
```text
You have 5 words waiting for practice.
```

#### `reminder.card.2.app`
**Placement:** App name on the second sample notification.
```text
Messages
```

#### `reminder.card.2.channel`
**Placement:** Channel label on the second sample notification.
```text
Text Message
```

#### `reminder.card.2.time`
**Placement:** Time on the second sample notification.
```text
2m ago
```

#### `reminder.card.2.subject`
**Placement:** Subject on the second sample notification.
```text
5 words are waiting today
```

#### `reminder.card.2.body`
**Placement:** Body on the second sample notification.
```text
Your daily vocab session is ready. Keep your streak going.
```

#### `reminder.card.3.app`
**Placement:** App name on the third sample notification.
```text
Mail
```

#### `reminder.card.3.channel`
**Placement:** Channel label on the third sample notification.
```text
Weekly Summary
```

#### `reminder.card.3.time`
**Placement:** Time on the third sample notification.
```text
Mon
```

#### `reminder.card.3.subject`
**Placement:** Subject on the third sample notification.
```text
This week
```

#### `reminder.card.3.body`
**Placement:** Body on the third sample notification.
```text
18 words reviewed, 7 improved, 3 still need attention.
```

## Audience section

#### `audience.headline`
**Placement:** Main heading of the student/parent section.
```text
Useful for students. Clear for parents.
```

#### `audience.studentsTitle`
**Placement:** Heading of the student list.
```text
Students
```

#### `audience.student.1`
**Placement:** First item in the student list.
```text
Quick sessions that fit into busy schedules
```

#### `audience.student.2`
**Placement:** Second item in the student list.
```text
Less pressure than long study blocks
```

#### `audience.student.3`
**Placement:** Third item in the student list.
```text
Clear feedback after each question
```

#### `audience.student.4`
**Placement:** Fourth item in the student list.
```text
Progress that is easy to track
```

#### `audience.parentsTitle`
**Placement:** Heading of the parent list.
```text
Parents
```

#### `audience.parent.1`
**Placement:** First item in the parent list.
```text
Reminders help reduce missed practice
```

#### `audience.parent.2`
**Placement:** Second item in the parent list.
```text
Summaries show visible progress
```

#### `audience.parent.3`
**Placement:** Third item in the parent list.
```text
Review is structured and consistent
```

#### `audience.parent.4`
**Placement:** Fourth item in the parent list.
```text
Practice feels manageable at home
```

## Final call to action

#### `cta.eyebrow`
**Placement:** Small label above the final call-to-action heading.
```text
Get Started
```

#### `cta.headline`
**Placement:** Final call-to-action heading.
```text
Make vocabulary practice a daily habit.
```

#### `cta.subheadline`
**Placement:** Final call-to-action supporting line.
```text
Short sessions. Clear progress. Consistent review.
```

#### `cta.primary`
**Placement:** Final primary button; opens sign-up.
```text
Get Started
```

#### `cta.secondary`
**Placement:** Final secondary button; opens the demo.
```text
View Demo
```

## Sign-up and login modal

These strings are shared with the standalone login and registration pages. Editing them here changes both the landing-page modal and those pages.

#### `auth.modal.registerTitle`
**Placement:** Accessible modal title when sign-up opens from the landing page.
```text
Start with VocabCat
```

#### `auth.modal.loginTitle`
**Placement:** Accessible modal title when login opens from the landing page.
```text
Log in to VocabCat
```

#### `auth.modal.close`
**Placement:** Button that closes the sign-up/login modal.
```text
Close
```

#### `auth.tabsAriaLabel`
**Placement:** Screen-reader label for the login/sign-up tabs.
```text
Authentication options
```

#### `auth.loginTab`
**Placement:** Login tab label.
```text
Log in
```

#### `auth.signupTab`
**Placement:** Sign-up tab label.
```text
Sign up
```

#### `auth.loginEyebrow`
**Placement:** Small heading shown in login mode.
```text
Welcome back
```

#### `auth.signupEyebrow`
**Placement:** Small heading shown in sign-up mode.
```text
Get started
```

#### `auth.loginHeadline`
**Placement:** Main heading shown in login mode.
```text
Log in to keep learning.
```

#### `auth.signupHeadline`
**Placement:** Main heading shown in sign-up mode.
```text
Build a daily word habit.
```

#### `auth.loginBody`
**Placement:** Supporting paragraph shown in login mode.
```text
Sign in quickly with your Google account or use email and password.
```

#### `auth.signupBody`
**Placement:** Supporting paragraph shown in sign-up mode.
```text
Start with a short setup, then let the feed and quizzes build the habit.
```

#### `auth.displayNameLabel`
**Placement:** Display-name field label in sign-up mode.
```text
Display name
```

#### `auth.displayNamePlaceholder`
**Placement:** Placeholder in the display-name field.
```text
What should we call you?
```

#### `auth.emailLabel`
**Placement:** Email field label.
```text
Email
```

#### `auth.emailPlaceholder`
**Placement:** Placeholder in the email field.
```text
you@example.com
```

#### `auth.passwordLabel`
**Placement:** Password field label.
```text
Password
```

#### `auth.loginPasswordPlaceholder`
**Placement:** Placeholder in the login password field.
```text
********
```

#### `auth.signupPasswordPlaceholder`
**Placement:** Placeholder in the sign-up password field.
```text
Create a strong password
```

#### `auth.signingIn`
**Placement:** Submit-button state while a login request is running.
```text
Signing in...
```

#### `auth.creating`
**Placement:** Submit-button state while a registration request is running.
```text
Creating...
```

#### `auth.loginSubmit`
**Placement:** Login submit button.
```text
Log in
```

#### `auth.signupSubmit`
**Placement:** Registration submit button.
```text
Create account
```

#### `auth.forgotPassword`
**Placement:** Password-recovery link in login mode.
```text
Forgot your password?
```

#### `auth.switchToSignup`
**Placement:** Link-style button that switches login to sign-up.
```text
New here? Create an account
```

#### `auth.switchToLogin`
**Placement:** Link-style button that switches sign-up to login.
```text
Have an account? Log in
```

#### `auth.divider`
**Placement:** Word between email/password and Google authentication.
```text
or
```

#### `auth.ageConfirmation`
**Placement:** Required checkbox beside the registration form.
```text
I confirm that I am at least 13 years old.
```

#### `auth.termsPrefix`
**Placement:** Registration agreement immediately before the Terms and Privacy links.
```text
I agree to the
```

#### `auth.termsJoiner`
**Placement:** Word between the Terms and Privacy links.
```text
and
```

#### `auth.termsLabel`
**Placement:** Link to the Terms of Use in the registration agreement.
```text
Terms of Use
```

#### `auth.privacyLabel`
**Placement:** Link to the Privacy Policy in the registration agreement.
```text
Privacy Policy
```

## Footer

#### `footer.product`
**Placement:** Product name at the start of the landing-page footer.
```text
VocabCat
```

#### `footer.ageNotice`
**Placement:** Public age-eligibility notice in the landing-page footer.
```text
For users age 13 and older.
```

#### `footer.privacy`
**Placement:** Footer link to the Privacy Policy.
```text
Privacy
```

#### `footer.terms`
**Placement:** Footer link to the Terms of Use.
```text
Terms
```

#### `footer.accessibility`
**Placement:** Footer link to the Accessibility Statement.
```text
Accessibility
```

## Functional, example, and accessibility text

#### `footer.legalAriaLabel`
**Placement:** Screen-reader label for the footer link group.
```text
Legal
```

#### `demo.stepIndex.1`
**Placement:** Visible index on demo step 1.
```text
01
```

#### `demo.stepIndex.2`
**Placement:** Visible index on demo step 2.
```text
02
```

#### `demo.stepIndex.3`
**Placement:** Visible index on demo step 3.
```text
03
```

#### `demo.stepIndex.4`
**Placement:** Visible index on demo step 4.
```text
04
```

#### `demo.stepIndex.5`
**Placement:** Visible index on demo step 5.
```text
05
```

#### `demo.stepIndex.6`
**Placement:** Visible index on demo step 6.
```text
06
```

#### `phone.statusTime`
**Placement:** Example time in the phone status bar.
```text
9:41
```

#### `problem.card.1.imageAlt`
**Placement:** Screen-reader description of the illustration on problem card 1.
```text
A ginger cat reading with focused attention.
```

#### `problem.card.2.imageAlt`
**Placement:** Screen-reader description of the illustration on problem card 2.
```text
A soft black cat with a sympathetic, slightly sad expression.
```

#### `problem.card.3.imageAlt`
**Placement:** Screen-reader description of the illustration on problem card 3.
```text
A bright calico cat bringing energy to progress tracking.
```

#### `auth.eligibilityLegend`
**Placement:** Group label above the required registration checkboxes.
```text
Account eligibility and agreements
```

#### `auth.eligibilityError`
**Placement:** Error shown when sign-up is attempted without both required acknowledgements.
```text
Confirm your age and accept the Terms of Use and Privacy Policy first.
```

#### `auth.loginError`
**Placement:** Fallback error after an email/password login failure.
```text
Login failed
```

#### `auth.registrationError`
**Placement:** Fallback error after an email/password registration failure.
```text
Registration failed
```

#### `auth.googleLoginError`
**Placement:** Fallback error after Google login fails.
```text
Google login failed
```

#### `auth.googleSignupError`
**Placement:** Fallback error after Google sign-up fails.
```text
Google signup failed
```

#### `auth.googleNotConfigured`
**Placement:** Development/fallback message when Google authentication is unavailable.
```text
Google login is not configured.
```

#### `auth.googleTryAgain`
**Placement:** Error shown when the Google sign-in control reports a failure.
```text
Google login failed. Please try again.
```

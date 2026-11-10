# BasicX Ads Implementation Plan

## Current status
- No live ads are integrated.
- No AdMob app ID, ad-unit ID, payment details, or account credentials are stored in this repository.
- The app is built with Capacitor. A native Android Google Mobile Ads integration would require an Android-compatible Capacitor plugin/native SDK integration and a rebuild.

## Important publishing requirement
AdMob's app-readiness guidance says an app must be published and listed in a supported app store, linked in AdMob, and approved before it can fully serve ads. A GitHub repository or a locally installed APK alone does not satisfy that store-listing requirement. Check the latest official AdMob requirements before applying.

## Zero-paid-cost approach
1. Keep BasicX's core learning features free and offline-first.
2. Do not add paid APIs, paid hosting, paid mediation, or paid analytics.
3. Do not add a production ad SDK until the app has a legitimate supported-store listing and an eligible adult account owner has completed account, identity, tax/payment and policy requirements.
4. During development only, use official Google demo test ad units after the SDK integration is implemented. Never click production ads or use test ads to generate earnings.
5. Keep all ad placements out of mock tests, question-solving screens, and Study Mode.

## Suggested placements after approval
- Banner: a small, clearly separated area on the dashboard only.
- Native: optional, clearly labelled sponsored card in a non-study area.
- Interstitial / app-open: not recommended for this educational app because they interrupt learning.
- Rewarded: only if genuinely optional and never required to unlock essential learning content.

## Before implementation
- Confirm the target Android distribution store is supported by AdMob.
- Confirm the ad network's current SDK and Capacitor compatibility.
- Add the SDK/plugin, app ID and ad-unit IDs only after approval and with the account owner's authorization.
- Add consent/privacy disclosures and follow applicable Google and local requirements.
- Test with demo ads; replace test IDs only after approval and release checks.

Official references:
- AdMob app readiness: https://support.google.com/admob/answer/10564477
- Google Mobile Ads platform support: https://developers.google.com/ads
- Android test ads: https://developers.google.com/admob/android/test-ads

This file is a readiness plan, not an active ad integration.
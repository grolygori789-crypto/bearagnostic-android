# Bearagnostic Localization Quality Contract

**Revision:** 1.0  
**Date:** 11 September 2026

## Goal

Every supported language must feel written for native users, not translated at them.

Permanent standard:

> Native-first, immediately understandable, concise, natural, and semantically faithful.

Avoid literal translation when a native product phrase communicates the same meaning more clearly. Users should not need to interpret technical wording, English-influenced syntax, or machine-translation phrasing.

## Launch language strategy

Target launch set:

- English (`en`) — source/fallback language
- Thai (`th`)
- Japanese (`ja`)
- Spanish (`es`)
- Brazilian Portuguese (`pt-BR`)

A locale must not appear in the production language selector until every first-class screen, modal, destructive confirmation, error state, empty state, accessibility label, Pro/Billing surface, Legal surface, and major tool workflow has complete native-quality copy and layout QA.

B45 keeps the currently complete shipping set at EN / TH / JA. ES / PT-BR are registered launch targets but intentionally remain hidden until full app coverage is complete. Mixed-language UI is a release defect.

## Writing rules

1. Prefer short everyday product language over literal technical translation.
2. Preserve safety meaning exactly in destructive flows.
3. Do not translate brand names, product IDs, file extensions, or technical standards when translation would reduce clarity.
4. Keep `Quick Scan`, `Smart Scan`, `Deep Scan`, and `Custom Scan` recognisable when a localised equivalent would make support/debug communication harder; supporting explanation should be native.
5. Avoid fear language, fake urgency, or exaggerated performance claims in every locale.
6. Preserve the distinction between `Safe to clean`, `Review first`, and `Protected` semantically.
7. Never let localisation change entitlement, safety, scan, or deletion meaning.
8. Thai must read naturally as modern Thai app copy, not word-for-word English.
9. Japanese should use natural consumer-utility wording and avoid stiff literal calques.
10. Spanish should target neutral international Spanish unless market evidence justifies a regional variant.
11. Brazilian Portuguese must be written as Brazilian Portuguese, not European Portuguese.

## QA gates for a new locale

Before exposure:

- 100% key coverage for production surfaces;
- native-language copy review;
- no English fallback visible in ordinary use;
- long-text and narrow-device layout review;
- destructive and Billing wording review;
- empty/error/offline state review;
- accessibility-label review;
- screenshots from a real device or equivalent runtime evidence.

If these gates are not met, keep the locale hidden rather than ship a partial translation.

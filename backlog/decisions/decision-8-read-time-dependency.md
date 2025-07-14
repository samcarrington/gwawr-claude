---
id: decision-8
title: Choose dependency for dynamic blog read-time calculation
date: '2025-07-14'
status: proposed
---

## Context

We want to stop storing an editorial **`readTime`** field in Contentful and instead calculate it on the fly in the Nuxt frontend.  A lightweight, well-maintained library will provide a consistent algorithm and avoid reinventing the wheel.

Key requirements:
1. **Small bundle size** – should not noticeably inflate client bundle.
2. **Licence compatibility** – must be MIT or similarly permissive.
3. **TypeScript support** – typings or first-class TS.
4. **Maintenance** – actively maintained / widely used.

## Options Considered

| Option | Bundle (min+gz) | Stars | Licence | Notes |
|--------|-----------------|-------|---------|-------|
| `reading-time` | ~1.3 kB | 3.5k | MIT | De-facto standard, parses plain text or Markdown.
| `reading-time-estimator` | ~2.5 kB | 280 | MIT | Slightly larger, extra locale options.
| Custom simple WPM calc | ~0.3 kB | N/A | MIT (ours) | Minimal code, no external dep but requires upkeep / tests.

## Decision

Adopt **`reading-time`** (https://github.com/ngryman/reading-time) for read-time calculations.

### Rationale
* **Mature & popular** – widely adopted in static-site generators and CMSs.
* **Tiny** – ~1 kB compressed; negligible impact.
* **Zero dependencies** – easy to audit.
* **TS typings** – ships with `.d.ts`.
* **Locale-agnostic** – uses average 265 WPM; good enough for English-only site.

## Consequences

* Add `reading-time` to `dependencies`.
* Implement `useReadTime` composable that wraps `readingTime(text).text`.
* Unit tests rely on same library for expected value.
* If future localisation is required (e.g. slower WPM languages), revisit this decision.

## Follow-up

* Implement task **task-48**.
* Re-evaluate at next dependency audit cycle.

# Companion maintenance

## Current continuity

Recorded through `arcanum-2028-05-25-broadcast-complete`: 25 May 2028, approximately 21:49 local story time, Day 27, Uluru Level 14. User adopted this existing continuity on 18 November 2026. No story advancement occurs during builds.

The detailed owner is local `private/campaign/full-story-log.md`. This is the imported continuity record, not a verbatim chat archive. Future exact exchanges belong in local `private/campaign/transcript/`. The public file `reference/arcanum_story_tracker.md` is a short checkpoint summary.

The app reads only `public/campaign.json`. Its `recordedThrough` and snapshot fields identify the represented scene. The export script selects tables and curated summaries from the local owner; update the relevant owner and mapping together when facts change, then run `pnpm export:companion`. Do not run the exporter from a fresh public clone, which intentionally lacks the full log. CI validates the checked-in projection and builds without access to private files.

## Content and presentation

Use the supplied starter's APP-CONTENT-STANDARD.md and RECORDS-AND-PUBLICATION.md locally. The user also identified companion examples in Dragon-Ball-Stories, Cyberpunk-Stories and Fantasy-Stories. Apply their reusable principles: compact technique rows, accessible details, stable IDs, distinct inventory locations, player-facing facts, dated summaries, and no invented progression. Campaign-specific Dragon Ball names, numerical tiers and visual styling do not apply to Arcanum.

Keep the full log local. Story in the app is a brief, dated chronicle, not raw excerpts or hidden transcript data. No full logs in JavaScript, JSON, comments, source maps, fallback files or search indexes. Later 10:00/10:09 PM reaction reports are beyond the current checkpoint. Lumen remains airborne; Axiom is on Level 12. Business and Cluster balances are distinct from personal cash.

Use current acquired capability and meaningful limits. Historical training figures must be labelled as such; no new mastery ranks or training gains during import. Use the existing confirmed character art. Appearance references do not establish locations or events.

## Build and release

1. Update local state, curate the projection, and validate chronology, quantities, locations and stable IDs.
2. Run `pnpm build`. Validate only committed player data; build never imports the full log.
3. Preview at project subpath on phone portrait/landscape and desktop. Check navigation, search, details, Escape/focus return, saved disclosure state, deep links, portrait and map.
4. Run `node scripts/audit-dist.mjs`. The output allowlist is index.html, campaign.json, app.webmanifest, approved portrait, install icons and compiled JS/CSS. No source maps, reference documents or private records.
5. Push reviewed app/source changes to main. GitHub Pages source is GitHub Actions. The Pages workflow publishes only dist/.
6. Verify the deployed URL, release data and assets. Record deployment in the local publication log.

The app uses a standalone web manifest and Apple touch icon. Safari installation is Share → Add to Home Screen → Open as Web App (if offered) → Add. Internet is required. No offline caching or service worker; reload to load an update. Character and record state are read-only; UI disclosure and scroll state persist while navigating within the open session.

Detailed logs previously committed to GitHub remain in prior Git history. Keep new full-log and transcript changes local; do not claim historical erasure.

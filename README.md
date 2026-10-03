# Arcanum Sector Story

Campaign records, setting references, and the interactive Arcanum galaxy map.

## Start here

- [Story tracker](reference/arcanum_story_tracker.md) — current character, resources, projects, and recorded events.
- [Lore bible v7](reference/arcanum_lore_bible_v7.md) — setting and worldbuilding reference.
- [Sector map](reference/arcanum_sector_map.md) — geographic and political reference.
- [Sector catalog](reference/arcanum_sector_catalog.md) — wider stellar catalog.
- [Sol subsector catalog](reference/sol_subsector_catalog.md) — local stellar catalog.
- [Story Runner Handbook](reference/Story-Runner-Handbook.md) — supplied narration and maintenance preferences.
- [Interactive galaxy map source](src/arcanum_galaxy_map.jsx).

The supplied story tracker checkpoints at **25 May 2028, approximately 9:49 PM, Day 27**, at the Uluru Complex. This is an in-story date, not the repository update date. No story events were advanced during repository setup.

## Run the map

Install Node.js 22 or newer and pnpm 11, then:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

For a production build, run `pnpm build`; preview it with `pnpm preview`.
The build uses relative asset paths so it can be hosted beneath a repository path.

Scroll to zoom, drag to pan, double-click to reset, and click systems for details. Individual systems appear above 20× zoom; zoom toward Sol to explore the local neighbourhood.

## Repository layout

- `reference/`: the six supplied Markdown documents, preserved without content changes.
- `src/arcanum_galaxy_map.jsx`: the supplied React map, preserved without content changes.
- `src/main.jsx` and `index.html`: the map's application entry point.
- `.github/workflows/build.yml`: verifies the production build and saves it as a downloadable artifact.
- `source-manifest.json`: SHA-256 hashes and import date for the seven supplied files.

This repository is public and the references contain campaign spoilers. The records combine fictional worldbuilding with astronomical reference material; inclusion does not independently verify scientific claims.

The handbook is reference material. Its embedded startup prompt does not start a new campaign or override an explicit user request. The story tracker is a supplied continuity record, not a complete verbatim conversation archive.

## Maintenance

Update the relevant source record when continuity changes. Preserve distinctions between setting lore, current events, and provisional ideas; do not silently resolve contradictions between references. Update the source manifest when deliberately replacing imported files.

Do not commit credentials, private narrator records, or local handover archives. No licence has been added: this setup does not grant new rights over the supplied writing or embedded imagery.

Website hosting is separate from repository setup. The build workflow produces an artifact; it does not enable GitHub Pages or publish a website.


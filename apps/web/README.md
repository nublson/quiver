# @quiver/web

quiver.nublson.com: the landing page (`/`) and docs (`/docs`). The changelog (`/changelog`) renders `packages/cli/CHANGELOG.md`, which `changeset version` writes, at build time. The content is written in Notion and rendered with [notionic](https://notionic.dev); the look follows notionic.dev (shadcn/ui neutral theme, Geist, light and dark).

## Notion

Create an internal integration, and share these with it (⋯ › Connections):

| Variable | What it is |
| --- | --- |
| `NOTION_TOKEN` | The integration's secret |
| `NOTION_PAGE_ID` | The landing page: everything below the hero |
| `NOTION_DOCS_DATA_SOURCE_ID` | The docs database's data source (⋯ › Manage data sources › Copy data source ID) |
| `NOTION_REVALIDATION_SECRET` | Optional: lets you refresh the site by hand |
| `NOTION_WEBHOOK_SECRET` | Optional: verifies Notion webhook events |

Put them in `.env.local` locally and in the Vercel project.

The docs database has one page per doc, with these properties:

- **Name** (title): the doc's title
- **Slug** (text): its URL, `/docs/<slug>`
- **Section** (select): its sidebar group: Getting started, Guides or Reference
- **Order** (number): its position in the section
- **Description** (text): the subtitle and meta description
- **Published** (checkbox): only published docs appear

Without `NOTION_TOKEN`, the landing page renders without its Notion content, and `/docs` shows a notice.

### Refreshing

Pages are prerendered and refresh at most once an hour. To show a Notion edit right away, `POST /api/notion/revalidate`:

- **Notion webhook.** Add a webhook subscription on the integration to `https://quiver.nublson.com/api/notion/revalidate` for page events. Notion first sends a verification token: find it in the Vercel logs (`[notion] Webhook verification token: …`), paste it into the subscription's **Verify** dialog, and set it as `NOTION_WEBHOOK_SECRET`.
- **By hand.** `curl -X POST -H "Authorization: Bearer $NOTION_REVALIDATION_SECRET" https://quiver.nublson.com/api/notion/revalidate`

## Develop

```bash
pnpm dev        # http://localhost:3000
pnpm test
pnpm typecheck
pnpm lint
```

The Notion block components in `src/components/notion-*.tsx` and `src/components/ui` come from notionic's shadcn registry (`pnpm dlx shadcn add @notionic/<name>`).

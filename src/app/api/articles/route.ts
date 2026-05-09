export interface Env {
  nicholas_db: D1Database;
}

import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET() {
  const { env } = await getCloudflareContext();

  const { results } = await env.nicholas_db
    .prepare("SELECT * FROM articles")
    .run();

  return Response.json({
    articles: results,
  });
}
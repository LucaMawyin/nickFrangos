export interface Env {
  // If you set another name in the Wrangler config file for the value for 'binding',
  // replace "DB" with the variable name you defined.
  nicholas_db: D1Database;
}
/**
 * 
export default {
  async fetch(request, env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === "/api/articles") {
      // If you did not use `DB` as your binding name, change it here
      const { results } = await env.nicholas_db.prepare(
        "SELECT * FROM articles",
      )
        // .bind("Bs Beverages")
        .run();
      return Response.json(results);
    }

    return new Response(
      "Call /api/articles",
    );
  },
} satisfies ExportedHandler<Env>;
 */

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
import { auth } from "~/lib/auth";
import { db } from "~/lib/db";

/** Updates Playlist */
export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });
  if (!session) throw createError({ statusCode: 401 });

  const playlistId = Number(getRouterParam(event, "id"));
  const body = await readBody<{ name: string }>(event);

  if (!body.name?.trim()) {
    throw createError({ statusCode: 400, statusMessage: "Name is required" });
  }

  const result = db
    .prepare(`UPDATE playlist SET name = ? WHERE id = ? AND UserId = ?`)
    .run(body.name.trim(), playlistId, session.user.id);

  return { success: result.changes > 0 };
});

import { auth } from "~/lib/auth";
import { db } from "~/lib/db";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const body = await readBody<{ playlistId: number }>(event);

  if (!body.playlistId) {
    throw createError({
      statusCode: 400,
      statusMessage: "playlistId is required",
    });
  }

  // Delete playlists that belong to the user
  const result = db
    .prepare(`DELETE FROM playlist WHERE id = ? AND UserId = ?`)
    .run(body.playlistId, session.user.id);

  return {
    success: result.changes > 0,
    deletedId: body.playlistId,
  };
});

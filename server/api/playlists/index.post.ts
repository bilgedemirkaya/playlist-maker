import { auth } from "~/lib/auth";
import { db } from "~/lib/db";

/** Create a new Playlist */
export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const body = await readBody<{ playlistName: string }>(event);

  if (!body.playlistName || body.playlistName.trim() === "") {
    throw createError({
      statusCode: 400,
      statusMessage: "Playlist name is required",
    });
  }

  const { lastInsertRowid: playlistId } = db
    .prepare(
      `
    INSERT INTO playlist (name, UserId)
    VALUES (?, ?)
  `
    )
    .run(body.playlistName.trim(), session.user.id);

  return {
    success: true,
    playlistId,
  };
});

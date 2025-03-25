import { auth } from "~/lib/auth";
import { db } from "~/lib/db";

/** Adds a track to a playlist */
export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const body = await readBody<{ playlistId: number; trackId: number }>(event);

  if (!body.playlistId || !body.trackId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing playlistId or trackId",
    });
  }

  db.prepare(
    `
    INSERT INTO playlist_track (PlaylistId, TrackId)
    VALUES (?, ?)
  `
  ).run(body.playlistId, body.trackId);

  return { success: true };
});

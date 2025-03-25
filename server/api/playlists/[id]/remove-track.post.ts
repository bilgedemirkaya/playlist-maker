import { auth } from "~/lib/auth";
import { db } from "~/lib/db";

/** Removes a track from a playlist */
export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });
  if (!session) throw createError({ statusCode: 401 });

  const body = await readBody<{ playlistId: number; trackId: number }>(event);

  if (!body.playlistId || !body.trackId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing playlistId or trackId",
    });
  }

  db.prepare(
    `
    DELETE FROM playlist_track
    WHERE PlaylistId = ? AND TrackId = ?
  `
  ).run(body.playlistId, body.trackId);

  return { success: true };
});

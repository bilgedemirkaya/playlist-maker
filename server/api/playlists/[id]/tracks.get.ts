import { auth } from "~/lib/auth";
import { db } from "~/lib/db";
import type { Track } from "~/types/index.types";
import { getRouterParam } from "h3";

/** Get Tracks based on Playlist ID */
export default defineEventHandler(async (event): Promise<Track[]> => {
  const session = await auth.api.getSession({ headers: event.headers });

  if (!session) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const playlistId = getRouterParam(event, "id");
  if (!playlistId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing playlist ID",
    });
  }

  const tracks = db
    .prepare(
      `
      SELECT t.*
      FROM track t
      JOIN playlist_track pt ON pt.TrackId = t.TrackId
      WHERE pt.PlaylistId = ?
    `
    )
    .all([Number(playlistId)]) as Track[];

  return tracks;
});

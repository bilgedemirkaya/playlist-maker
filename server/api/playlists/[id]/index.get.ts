import { auth } from "~/lib/auth";
import { db } from "~/lib/db";
import { getRouterParam } from "h3";
import type { Playlist } from "~/types/index.types";

/** Get Playlist based on ID */
export default defineEventHandler(async (event): Promise<Playlist> => {
  const session = await auth.api.getSession({ headers: event.headers });
  if (!session) throw createError({ statusCode: 401 });

  const playlistId = getRouterParam(event, "id");
  if (!playlistId)
    throw createError({
      statusCode: 400,
      statusMessage: "Missing playlist ID",
    });

  const playlist = db
    .prepare(
      `
    SELECT * FROM playlist WHERE id = ? AND UserId = ?
  `
    )
    .get(Number(playlistId), session.user.id) as Playlist;

  if (!playlist)
    throw createError({ statusCode: 404, statusMessage: "Playlist not found" });

  return playlist;
});

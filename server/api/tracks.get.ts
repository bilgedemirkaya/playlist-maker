import { auth } from "~/lib/auth";
import { db } from "~/lib/db";
import type { Track } from "~/types/index.types";

/** Get Tracks based on Playlist ID */
export default defineEventHandler(async (event): Promise<Track[]> => {
  const session = await auth.api.getSession({ headers: event.headers });

  if (!session) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const tracks = db.prepare(`SELECT * FROM track`).all() as unknown[];
  return tracks.map((track) => track as Track);
});

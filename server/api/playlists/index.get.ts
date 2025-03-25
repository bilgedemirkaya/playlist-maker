import { auth } from "~/lib/auth";
import { db } from "~/lib/db";
import type { Playlist } from "~/types/index.types";

export default defineEventHandler(async (event): Promise<Playlist[]> => {
  const session = await auth.api.getSession({ headers: event.headers });

  if (!session) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const query = getQuery(event)
  const limit = parseInt((query.limit as string) || "10")
  const offset = parseInt((query.offset as string) || "0")

  const userId = session.user.id;

  const playlists = db
    .prepare(`SELECT * FROM playlist WHERE UserId = ? LIMIT ? OFFSET ?`)
    .all(userId, limit, offset) as Playlist[];

  return playlists;
});

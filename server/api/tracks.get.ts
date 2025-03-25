import { db } from "~/lib/db";
import type { Track } from "~/types/index.types";

/**
 * Public API: No authentication required to view all tracks
 * Get Tracks based on Playlist ID
 *
*/
export default defineEventHandler(async (event): Promise<Track[]> => {
  const query = getQuery(event)

  const limit = parseInt(query.limit as string) || 20
  const offset = parseInt(query.offset as string) || 0

  const tracks = db
    .prepare(`SELECT * FROM Track LIMIT ? OFFSET ?`)
    .all(limit, offset) as Track[]

  return tracks
})
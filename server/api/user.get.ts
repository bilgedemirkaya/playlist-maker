import { auth } from "~/lib/auth";
import { db } from "~/lib/db";
import type { User } from "~/types/index.types";

/** Get User based on user ID */
export default defineEventHandler(async (event): Promise<User> => {
  const session = await auth.api.getSession({ headers: event.headers });

  if (!session) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const user = db
    .prepare(
      `
      SELECT id, email, name, emailVerified, createdAt, updatedAt
      FROM user
      WHERE id = ?
    `
    )
    .get(session.user.id) as User;

  if (!user) {
    throw createError({ statusCode: 404, statusMessage: "User not found" });
  }

  return user;
});

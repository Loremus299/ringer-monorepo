import type { InferSelectModel } from "drizzle-orm";
import type { sessionTable, userTable } from "../../utils/db/schema";
import type { MiddlewareHandler } from "hono";

export type AuthEnv = {
	Variables: {
		user: InferSelectModel<typeof userTable>;
		session: InferSelectModel<typeof sessionTable>;
	};
};

const authMiddleware: MiddlewareHandler<AuthEnv> = async (c, next) => {};

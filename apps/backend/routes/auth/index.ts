import zodValidate, { createUserBody } from "@ringer/schemas";
import { Hono } from "hono/tiny";
import createUser from "./user.post";
import type { AppEnv } from "../../utils/strawberry";

export const authRouter = new Hono<AppEnv>().basePath("/auth");
authRouter.post("/user", async (c) => {
	const body = zodValidate(createUserBody, await c.req.json());
	const action = await createUser({ body }, c.var.logger);
	if (500 in action) return c.json(action[500], 500);
	if (409 in action) return c.json(action[409], 409);
	if (201 in action) return c.text(action[201], 201);
});

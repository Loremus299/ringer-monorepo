import zodValidate, {
	createSessionBody,
	createSessionHeader,
	createUserBody,
} from "@ringer/schemas";
import { Hono } from "hono/tiny";
import createUser from "./user.post";
import type { AppEnv } from "../../utils/strawberry";
import createSession from "./session.post";

export const authRouter = new Hono<AppEnv>().basePath("/auth");
authRouter.post("/user", async (c) => {
	const body = zodValidate(createUserBody, await c.req.json());
	const action = await createUser({ body }, c.var.logger);
	if (500 in action) return c.json(action[500], 500);
	if (409 in action) return c.json(action[409], 409);
	if (201 in action) return c.text(action[201], 201);
});
authRouter.post("/session", async (c) => {
	const body = zodValidate(createSessionBody, await c.req.json());
	const header = zodValidate(createSessionHeader, c.req.header());
	const action = await createSession({ body, header }, c.var.logger);
	if (500 in action) return c.json(action[500], 500);
	if (401 in action) return c.text(action[401], 401);
	if (404 in action) return c.text(action[404], 404);
	if (201 in action) return c.text(action[201], 201);
});

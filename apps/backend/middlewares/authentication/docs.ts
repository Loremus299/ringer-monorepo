import { authMiddlewareCookies, genericError } from "@ringer/schemas";
import docs from "../../utils/lychee";

const protectedRouteDocs = docs.middleware("", {
	cookie: authMiddlewareCookies,
	responses: {
		404: {
			type: "application/json",
			description: "Session not found",
			zod: genericError,
		},
		401: {
			type: "application/json",
			description: "Session expired",
			zod: genericError,
		},
		500: {
			type: "application/json",
			description: "Failed to find user session",
			zod: genericError,
		},
	},
});
export default protectedRouteDocs;

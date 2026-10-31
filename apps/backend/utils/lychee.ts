import { Aril } from "@loremus299/lychee";
import { zod400 } from "@nidhi/schemas";

export const aril = new Aril("3.0.0", {
	title: "Ringer",
	description:
		"Because failure alerts should be easier than it is made out to be",
	version: "1.0",
});
const docs = aril.middleware("", {
	responses: {
		400: {
			type: "application/json",
			description: "Failed to parse request",
			zod: zod400,
		},
	},
});
export default docs;

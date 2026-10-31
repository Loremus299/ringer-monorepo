import { z, type ZodType } from "zod";
import zxcvbn from "zxcvbn";

export class ZodValidationError extends Error {
	public constructor(
		public readonly error: { path: PropertyKey[]; message: string }[],
	) {
		super("Validation failed");
		this.name = "ZodValidationError";
	}
}
export const zod400 = z.array(
	z.object({
		path: z.array(z.any()),
		message: z.string(),
	}),
);

export default function zodValidate<Z extends ZodType>(
	schema: Z,
	input: unknown,
) {
	const data = schema.safeParse(input);
	if (!data.success) {
		throw new ZodValidationError(
			data.error.issues.map(({ path, message }) => ({
				path,
				message,
			})),
		);
	}
	return data.data;
}

export const genericError = z.object({
	error: z.string(),
	"request-id": z.uuidv4(),
});

export const genericOk = z.string();

export const badFaithError = z.string();

export const createUserBody = z.object({
	name: z.string().min(6).max(50),
	email: z.email(),
	password: z.string().refine((t) => zxcvbn(t).score >= 3, "Weak password"),
});

export const createSessionHeader = z.object({
	"user-agent": z.string(),
});

export const createSessionBody = z.object({
	email: z.email(),
	password: z.string().min(1),
});

export const createSessionOk = z.uuidv4();

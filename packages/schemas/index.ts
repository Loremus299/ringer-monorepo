import { z, type ZodType } from "zod";

export class ZodValidationError {
	public constructor(
		public readonly error: { path: PropertyKey[]; message: string }[],
	) {}
}

export const zod400 = z.object({
	path: z.array(z.any()),
	error: z.any(),
});

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

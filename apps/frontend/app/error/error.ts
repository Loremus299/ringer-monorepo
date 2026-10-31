"use client";
import { redirect } from "next/navigation";

export default function errorPage(params: {
	status: string;
	error: string;
	goto: string;
	id?: string;
	buttonName: string;
}): never {
	const qs = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined) qs.set(key, value);
	}
	redirect(`/error?${qs}`, "push");
}

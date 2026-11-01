"use client";

import FormController from "@/components/badcn/formController";
import LoadingButton from "@/components/badcn/loadingButton";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateSessionBody, createSessionBody } from "@ringer/schemas";
import { UserIcon } from "lucide-react";
import { useForm } from "react-hook-form";

export default function LoginForm() {
	const form = useForm({
		resolver: zodResolver(createSessionBody),
		defaultValues: { email: "", password: "" },
	});

	const onSubmit = async (values: CreateSessionBody) => {
		fetch("http://localhost:8080/auth/session", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		});
	};

	return (
		<form className="w-sm grid gap-3" onSubmit={form.handleSubmit(onSubmit)}>
			<FormController
				form={form}
				label="Email Address"
				name="email"
				render={({ field, fieldState }) => (
					<Input
						{...field}
						placeholder="charlotte@troy.greece"
						id={field.name}
						aria-invalid={fieldState.invalid}
						type="email"
						autoComplete="email"
					/>
				)}
			/>
			<FormController
				form={form}
				label="Password"
				name="password"
				render={({ field, fieldState }) => (
					<Input
						{...field}
						placeholder="Remember our little secret ?"
						id={field.name}
						aria-invalid={fieldState.invalid}
						type="password"
						autoComplete="current-password"
					/>
				)}
			/>
			<LoadingButton type="submit" className="text-background">
				<UserIcon />
				sudo su
			</LoadingButton>
		</form>
	);
}

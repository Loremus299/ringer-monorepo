"use client";

import FormController from "@/components/badcn/formController";
import LoadingButton from "@/components/badcn/loadingButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUserBody, createUserBody } from "@ringer/schemas";
import { Eye, EyeClosed, UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function RegisterForm() {
	const [showPassword, setShowPassword] = useState(false);
	const form = useForm({
		resolver: zodResolver(createUserBody),
		defaultValues: { name: "", email: "", password: "" },
	});

	const onSubmit = async (values: CreateUserBody) => {
		const createUser = await fetch("http://localhost:8080/auth/user", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		});
		if (createUser.status == 409) {
		}
	};

	return (
		<form className="w-sm grid gap-3" onSubmit={form.handleSubmit(onSubmit)}>
			<FormController
				form={form}
				label="Preferred Name"
				name="name"
				render={({ field, fieldState }) => (
					<Input
						{...field}
						id={field.name}
						autoComplete="name"
						aria-invalid={fieldState.invalid}
						placeholder="Charlotte of Troy"
					/>
				)}
			/>
			<FormController
				form={form}
				label="Email"
				name="email"
				render={({ field, fieldState }) => (
					<Input
						{...field}
						id={field.name}
						autoComplete="email"
						aria-invalid={fieldState.invalid}
						placeholder="charlotte@troy.greece"
					/>
				)}
			/>
			<FormController
				form={form}
				label="Password"
				name="password"
				render={({ field, fieldState }) => (
					<div className="flex gap-2">
						<Input
							{...field}
							id={field.name}
							autoComplete="new-password"
							type={showPassword ? "text" : "password"}
							aria-invalid={fieldState.invalid}
							placeholder="Our little secret ;3"
						/>
						<Button
							onClick={() => setShowPassword(!showPassword)}
							variant={"outline"}
						>
							{showPassword ? <EyeClosed /> : <Eye />}
						</Button>
					</div>
				)}
			/>
			<LoadingButton className={"mt-2 text-background"} type="submit">
				<UserPlus />
				sudo adduser
			</LoadingButton>
		</form>
	);
}

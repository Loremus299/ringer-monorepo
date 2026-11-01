"use client";

import errorPage from "@/app/error/error";
import FormController from "@/components/badcn/formController";
import LoadingButton from "@/components/badcn/loadingButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateSessionBody, createSessionBody } from "@ringer/schemas";
import { Eye, EyeClosed, UserIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function LoginForm() {
	const [showPassword, setShowPassword] = useState(false);
	const form = useForm({
		resolver: zodResolver(createSessionBody),
		defaultValues: { email: "", password: "" },
	});

	const onSubmit = async (values: CreateSessionBody) => {
		const createSession = await fetch("http://localhost:8080/auth/session", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		});

		if (createSession.status == 401)
			return toast.add({
				type: "error",
				title: "You forgot our little secret ? :c",
			});
		if (createSession.status == 404)
			return errorPage({
				status: "404",
				error: "First time ? wrong page. You need to register first.",
				goto: "/auth/register",
				buttonName: "Register",
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
					<div className="flex gap-2">
						<Input
							{...field}
							id={field.name}
							autoComplete="current-password"
							type={showPassword ? "text" : "password"}
							aria-invalid={fieldState.invalid}
							placeholder="Remember our little secret ?"
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
			<LoadingButton type="submit" className="text-background">
				<UserIcon />
				sudo su
			</LoadingButton>
			<Link href="/auth/register" className="text-sm text-muted-foreground">
				Don't have an account ? Register here
			</Link>
		</form>
	);
}

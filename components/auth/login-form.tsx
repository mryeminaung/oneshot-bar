"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/submit-button";
import { loginAction, type AuthFormState } from "@/lib/actions/auth";
import { LogIn } from "lucide-react";

const initialState: AuthFormState = {};

export function LoginForm() {
	const [state, formAction] = useActionState(loginAction, initialState);

	return (
		<form action={formAction} className="flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<label htmlFor="email" className="text-[14px] font-semibold text-primary">
					Email
				</label>
				<Input
					id="email"
					name="email"
					type="email"
					className="py-4.5 border-primary/50"
					placeholder="example@mail.com"
					autoComplete="email"
					required
				/>
			</div>
			<div className="flex flex-col gap-2">
				<label htmlFor="password" className="text-[14px] font-semibold text-primary">
					Password
				</label>
				<Input
					id="password"
					name="password"
					type="password"
					className="py-4.5 border-primary/50"
					placeholder="Enter your password"
					autoComplete="current-password"
					required
				/>
			</div>
			{state.error && <p className="text-sm text-destructive">{state.error}</p>}
			<SubmitButton pendingText="Signing in..." className="w-full py-4.5 rounded-xl cursor-pointer">
				<LogIn className="size-4" />
				Sign In
			</SubmitButton>
		</form>
	);
}

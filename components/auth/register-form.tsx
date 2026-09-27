"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/submit-button";
import { registerAction, type AuthFormState } from "@/lib/actions/auth";
import { UserPlus } from "lucide-react";

const initialState: AuthFormState = {};

export function RegisterForm() {
	const [state, formAction] = useActionState(registerAction, initialState);

	if (state.message) {
		return <p className="text-center text-sm text-primary">{state.message}</p>;
	}

	return (
		<form action={formAction} className="flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<label htmlFor="name" className="text-[14px] font-semibold text-primary">
					Full name
				</label>
				<Input
					id="name"
					name="name"
					type="text"
					className="py-4.5 border-primary/50"
					placeholder="Jane Doe"
					autoComplete="name"
					required
				/>
			</div>
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
					placeholder="At least 8 characters"
					autoComplete="new-password"
					required
					minLength={8}
				/>
			</div>
			{state.error && <p className="text-sm text-destructive">{state.error}</p>}
			<SubmitButton pendingText="Creating account..." className="w-full py-4.5 rounded-xl cursor-pointer">
				<UserPlus className="size-4" />
				Create Account
			</SubmitButton>
		</form>
	);
}

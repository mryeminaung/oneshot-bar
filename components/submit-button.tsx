"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export function SubmitButton({
	children,
	pendingText,
	className,
	...props
}: ComponentProps<typeof Button> & { pendingText?: string }) {
	const { pending } = useFormStatus();

	return (
		<Button type="submit" disabled={pending} className={cn(className)} {...props}>
			{pending ? pendingText ?? "Please wait..." : children}
		</Button>
	);
}

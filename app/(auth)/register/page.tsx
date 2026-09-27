import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RegisterForm } from "@/components/auth/register-form";
import { redirectIfAuthenticated } from "@/lib/auth/page-guards";
import Link from "next/link";

export default async function RegisterPage() {
	await redirectIfAuthenticated();

	return (
		<div className="relative z-10 w-full max-w-md rounded-xl p-[2px] before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-primary before:via-transparent before:to-primary before:content-['']">
			<Card className="relative w-full bg-white/80 shadow-xl backdrop-blur-md px-6">
				<CardHeader className="flex justify-center items-center gap-4 py-5">
					<div>
						<h1 className="text-lg font-semibold text-primary tracking-tight">
							Register Your Account
						</h1>
						<p className="mt-1 text-sm text-primary/80">Sign up to start reserving tables</p>
					</div>
				</CardHeader>

				<Separator className="bg-primary/50" />

				<CardContent className="pb-8 pt-4">
					<RegisterForm />
					<p className="mt-6 text-center text-sm text-muted-foreground">
						Already have an account?{" "}
						<Link href="/login" className="font-semibold text-primary hover:underline">
							Sign in
						</Link>
					</p>
				</CardContent>
			</Card>
		</div>
	);
}

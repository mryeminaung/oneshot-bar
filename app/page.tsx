import Image from "next/image";
import Link from "next/link";
import { CalendarClock, Armchair, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { redirectIfAuthenticated } from "@/lib/auth/page-guards";

const STEPS = [
	{
		icon: CalendarClock,
		title: "Pick your time",
		description: "Choose a date, time, and party size — no phone calls, no waiting on hold.",
	},
	{
		icon: Armchair,
		title: "See what's open",
		description: "Browse tables that actually fit your group, updated in real time.",
	},
	{
		icon: CheckCircle2,
		title: "Instant confirmation",
		description: "Reserve in one tap and manage or cancel it anytime from your account.",
	},
];

export default async function HomePage() {
	await redirectIfAuthenticated();

	return (
		<div className="flex min-h-screen flex-col bg-white">
			<header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-md">
				<div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5">
					<div className="flex items-center gap-2">
						<Image src="/bar-logo.png" alt="OneShotBar" width={40} height={40} className="rounded-md" priority />
						<span className="text-lg font-bold text-white">OneShotBar</span>
					</div>
					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							nativeButton={false}
							render={<Link href="/login" />}
							className="text-white hover:bg-white/10 hover:text-white"
						>
							Sign In
						</Button>
						<Button
							nativeButton={false}
							render={<Link href="/register" />}
							className="bg-white text-black hover:bg-white/90"
						>
							Get Started
						</Button>
					</div>
				</div>
			</header>

			<section className="relative flex flex-col items-center gap-6 overflow-hidden bg-black px-4 py-20 text-center">
				<Image src="/bar-logo.png" alt="OneShotBar" width={140} height={140} className="rounded-2xl" priority />
				<h1 className="max-w-2xl text-4xl font-bold text-white sm:text-5xl">Reserve your table in one shot.</h1>
				<p className="max-w-md text-white/70">
					Real-time table availability for OneShotBar. Pick a time, grab your table, and we&apos;ll have it
					ready.
				</p>
				<div className="flex gap-3">
					<Button
						size="lg"
						nativeButton={false}
						render={<Link href="/register" />}
						className="bg-white text-black hover:bg-white/90"
					>
						Reserve a Table
					</Button>
					<Button
						variant="outline"
						size="lg"
						nativeButton={false}
						render={<Link href="/login" />}
						className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
					>
						Sign In
					</Button>
				</div>
			</section>

			<section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-20">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-primary">How it works</h2>
					<p className="mt-2 text-muted-foreground">From craving a seat to sitting down, in three steps.</p>
				</div>
				<div className="grid gap-4 sm:grid-cols-3">
					{STEPS.map((step, i) => (
						<Card key={step.title}>
							<CardContent className="flex flex-col items-center gap-3 py-4 text-center">
								<div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
									<step.icon className="size-6" />
								</div>
								<span className="text-xs font-semibold text-muted-foreground">STEP {i + 1}</span>
								<h3 className="font-semibold text-primary">{step.title}</h3>
								<p className="text-sm text-muted-foreground">{step.description}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			<footer className="border-t border-border px-4 py-6 text-center text-sm text-muted-foreground">
				© {new Date().getFullYear()} OneShotBar. All rights reserved.
			</footer>
		</div>
	);
}

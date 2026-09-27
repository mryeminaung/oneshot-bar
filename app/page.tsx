import Image from "next/image";
import Link from "next/link";
import {
	CalendarClock,
	Armchair,
	CheckCircle2,
	Wine,
	Beer,
	Utensils,
	Users,
	Music,
	Clock,
	Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LandingNav } from "@/components/nav/landing-nav";
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

const SERVICES = [
	{
		icon: Wine,
		title: "Signature Cocktails",
		description: "Hand-crafted cocktails by our mixologists — from timeless classics to house originals.",
	},
	{
		icon: Beer,
		title: "Craft Beers & Spirits",
		description: "A curated selection of local craft beers, imported lagers, and premium spirits.",
	},
	{
		icon: Utensils,
		title: "Bar Bites",
		description: "Shareable plates and snacks designed to complement your drinks — perfect for any group.",
	},
	{
		icon: Users,
		title: "Private Group Bookings",
		description: "Reserve a section for your crew. We accommodate groups of all sizes with dedicated service.",
	},
	{
		icon: Music,
		title: "Live Events & DJ Nights",
		description: "Regular live music, DJ sets, and themed nights. Check our schedule when you book.",
	},
	{
		icon: Clock,
		title: "Happy Hour",
		description: "Daily happy hour specials on selected drinks. Ask our staff for today's deals.",
	},
];

const TESTIMONIALS = [
	{
		name: "Sarah K.",
		rating: 5,
		text: "Booking a table was so easy — the whole thing took less than a minute. The cocktails were even better in person. Will be back for sure.",
	},
	{
		name: "James T.",
		rating: 5,
		text: "We used the group booking for a birthday and the staff were incredible. The reservation system meant everything was ready when we arrived.",
	},
	{
		name: "Mia L.",
		rating: 4,
		text: "Love the vibe and the drinks menu. Being able to manage my reservation from my phone instead of calling is such a nice touch.",
	},
];

export default async function HomePage() {
	await redirectIfAuthenticated();

	return (
		<div className="flex min-h-screen flex-col bg-white">
			<LandingNav />

			{/* Hero */}
			<section className="flex flex-col items-center gap-6 bg-white px-4 pb-24 pt-28 text-center">
				<Image
					src="/bar-logo.png"
					alt="OneShotBar"
					width={96}
					height={96}
					className="rounded-2xl shadow-lg"
					priority
				/>
				<h1 className="max-w-2xl text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
					Reserve your table in{" "}
					<span className="underline decoration-zinc-300 underline-offset-4">one shot.</span>
				</h1>
				<p className="max-w-md text-lg text-zinc-500">
					Real-time table availability for OneShotBar. Pick a time, grab your table, and we&apos;ll have it
					ready.
				</p>
				<div className="flex flex-wrap justify-center gap-3">
					<Button
						size="lg"
						nativeButton={false}
						render={<Link href="/register" />}
						className="bg-zinc-900 text-white hover:bg-zinc-700"
					>
						Reserve a Table
					</Button>
					<Button
						variant="outline"
						size="lg"
						nativeButton={false}
						render={<Link href="/login" />}
						className="border-zinc-300 text-zinc-700 hover:bg-zinc-50"
					>
						Sign In
					</Button>
				</div>
			</section>

			{/* How it works */}
			<section className="border-t border-zinc-100 bg-zinc-50 px-4 py-20">
				<div className="mx-auto flex max-w-6xl flex-col gap-10">
					<div className="text-center">
						<h2 className="text-2xl font-bold text-zinc-900">How it works</h2>
						<p className="mt-2 text-zinc-500">From craving a seat to sitting down, in three steps.</p>
					</div>
					<div className="grid gap-4 sm:grid-cols-3">
						{STEPS.map((step, i) => (
							<Card key={step.title} className="border-zinc-200 bg-white">
								<CardContent className="flex flex-col items-center gap-3 py-8 text-center">
									<div className="flex size-12 items-center justify-center rounded-full bg-zinc-900 text-white">
										<step.icon className="size-5" />
									</div>
									<span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
										Step {i + 1}
									</span>
									<h3 className="font-semibold text-zinc-900">{step.title}</h3>
									<p className="text-sm text-zinc-500">{step.description}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Services */}
			<section className="border-t border-zinc-100 bg-white px-4 py-20">
				<div className="mx-auto flex max-w-6xl flex-col gap-10">
					<div className="text-center">
						<h2 className="text-2xl font-bold text-zinc-900">What we offer</h2>
						<p className="mt-2 text-zinc-500">Everything you need for a great night out, all under one roof.</p>
					</div>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{SERVICES.map((service) => (
							<Card key={service.title} className="border-zinc-200">
								<CardContent className="flex flex-col gap-3 py-6">
									<div className="flex size-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
										<service.icon className="size-5" />
									</div>
									<h3 className="font-semibold text-zinc-900">{service.title}</h3>
									<p className="text-sm text-zinc-500">{service.description}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Testimonials */}
			<section className="border-t border-zinc-100 bg-zinc-50 px-4 py-20">
				<div className="mx-auto flex max-w-6xl flex-col gap-10">
					<div className="text-center">
						<h2 className="text-2xl font-bold text-zinc-900">What customers say</h2>
						<p className="mt-2 text-zinc-500">Real reviews from regulars and first-timers alike.</p>
					</div>
					<div className="grid gap-4 sm:grid-cols-3">
						{TESTIMONIALS.map((review) => (
							<Card key={review.name} className="flex flex-col border-zinc-200 bg-white">
								<CardContent className="flex flex-1 flex-col gap-4 py-6">
									<div className="flex gap-0.5">
										{Array.from({ length: review.rating }).map((_, i) => (
											<Star key={i} className="size-4 fill-zinc-900 text-zinc-900" />
										))}
										{Array.from({ length: 5 - review.rating }).map((_, i) => (
											<Star key={i} className="size-4 text-zinc-300" />
										))}
									</div>
									<p className="flex-1 text-sm text-zinc-600">&ldquo;{review.text}&rdquo;</p>
									<p className="text-sm font-semibold text-zinc-900">— {review.name}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* CTA banner */}
			<section className="bg-zinc-900 px-4 py-20 text-center">
				<div className="mx-auto max-w-6xl">
					<h2 className="text-2xl font-bold text-white sm:text-3xl">Ready for your next night out?</h2>
					<p className="mt-3 text-zinc-400">Create a free account and book your table in under a minute.</p>
					<Button
						size="lg"
						nativeButton={false}
						render={<Link href="/register" />}
						className="mt-8 bg-white text-zinc-900 hover:bg-zinc-100"
					>
						Reserve a Table
					</Button>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-zinc-200 bg-white px-4 py-6">
				<div className="mx-auto flex max-w-6xl items-center justify-between text-sm text-zinc-500">
					<span>© {new Date().getFullYear()} OneShotBar. All rights reserved.</span>
					<div className="flex items-center gap-2">
						<Image src="/bar-logo.png" alt="OneShotBar" width={22} height={22} className="rounded" />
						<span className="font-semibold text-zinc-900">OneShotBar</span>
					</div>
				</div>
			</footer>
		</div>
	);
}

"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function LandingNav() {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<header className="fixed top-5 left-0 w-full z-50 ">
			<div
				className={` border-zinc-200 bg-white/80 flex rounded-xl mx-auto max-w-6xl items-center justify-between px-4 py-3 top-5 z-50 transition-all duration-300 ${
					scrolled ? "shadow-sm backdrop-blur-md" : "bg-transparent"
				}`}>
				<div className="flex items-center gap-2">
					<Image
						src="/bar-logo.png"
						alt="OneShotBar"
						width={36}
						height={36}
						className="rounded-md"
						priority
					/>
					<span className="text-lg font-bold text-zinc-900">OneShotBar</span>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						nativeButton={false}
						render={<Link href="/login" />}
						className="text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900">
						Sign In
					</Button>
					<Button
						nativeButton={false}
						render={<Link href="/register" />}
						className="bg-zinc-900 text-white hover:bg-zinc-700">
						Get Started
					</Button>
				</div>
			</div>
		</header>
	);
}

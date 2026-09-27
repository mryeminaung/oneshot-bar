import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth";
import { SubmitButton } from "@/components/submit-button";
import type { Role } from "@/lib/auth/types";

interface NavLink {
	href: string;
	label: string;
}

const LINKS: Record<Role, NavLink[]> = {
	customer: [
		{ href: "/customer/dashboard", label: "Dashboard" },
		{ href: "/customer/reservations", label: "My Reservations" },
		{ href: "/customer/reservations/new", label: "Reserve a Table" },
	],
	staff: [
		{ href: "/staff/dashboard", label: "Dashboard" },
		{ href: "/staff/reservations", label: "Today's Reservations" },
	],
	manager: [
		{ href: "/manager/dashboard", label: "Dashboard" },
		{ href: "/manager/tables", label: "Tables" },
		{ href: "/manager/reservations", label: "Reservations" },
		{ href: "/manager/staff", label: "Staff" },
	],
};

export function AppNav({ role, userName }: { role: Role; userName: string }) {
	const links = LINKS[role];

	return (
		<header className="border-b border-border bg-white">
			<div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
				<Link href={links[0].href} className="text-lg font-bold text-primary">
					OneShotBar
				</Link>
				<nav className="flex flex-wrap items-center gap-4">
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="text-sm font-medium text-muted-foreground hover:text-primary"
						>
							{link.label}
						</Link>
					))}
				</nav>
				<div className="flex items-center gap-3">
					<span className="text-sm text-muted-foreground">{userName}</span>
					<form action={logoutAction}>
						<SubmitButton variant="outline" size="sm" pendingText="Signing out...">
							Logout
						</SubmitButton>
					</form>
				</div>
			</div>
		</header>
	);
}

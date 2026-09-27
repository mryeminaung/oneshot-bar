"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	LayoutDashboard,
	CalendarDays,
	PlusCircle,
	ClipboardList,
	Table2,
	Users,
	LogOut,
} from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { logoutAction } from "@/lib/actions/auth";
import type { Role } from "@/lib/auth/types";

interface NavItem {
	href: string;
	label: string;
	icon: React.ElementType;
}

const NAV_ITEMS: Record<Role, NavItem[]> = {
	customer: [
		{ href: "/customer/dashboard",       label: "Dashboard",      icon: LayoutDashboard },
		{ href: "/customer/reservations",     label: "My Reservations", icon: CalendarDays },
		{ href: "/customer/reservations/new", label: "Reserve a Table", icon: PlusCircle },
	],
	staff: [
		{ href: "/staff/dashboard",     label: "Dashboard",           icon: LayoutDashboard },
		{ href: "/staff/reservations",  label: "Today's Reservations", icon: ClipboardList },
	],
	manager: [
		{ href: "/manager/dashboard",    label: "Dashboard",   icon: LayoutDashboard },
		{ href: "/manager/tables",       label: "Tables",      icon: Table2 },
		{ href: "/manager/reservations", label: "Reservations", icon: ClipboardList },
		{ href: "/manager/staff",        label: "Staff",       icon: Users },
	],
};

const ROLE_LABEL: Record<Role, string> = {
	customer: "Customer",
	staff: "Staff",
	manager: "Manager",
};

export function AppSidebar({ role, userName }: { role: Role; userName: string }) {
	const pathname = usePathname();
	const items = NAV_ITEMS[role];

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader className="px-3 py-4">
				<div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
					<Image src="/bar-logo.png" alt="OneShotBar" width={32} height={32} className="rounded-md shrink-0" />
					<span className="font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
						OneShotBar
					</span>
				</div>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>{ROLE_LABEL[role]}</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.href}>
									<SidebarMenuButton
										isActive={pathname === item.href}
										tooltip={item.label}
										render={<Link href={item.href} />}
									>
										<item.icon />
										<span>{item.label}</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className="px-3 py-3">
				<div className="flex flex-col gap-2 group-data-[collapsible=icon]:items-center">
					<div className="group-data-[collapsible=icon]:hidden">
						<p className="truncate text-xs font-medium text-sidebar-foreground">{userName}</p>
						<p className="text-xs text-sidebar-foreground/60">{ROLE_LABEL[role]}</p>
					</div>
					<form action={logoutAction} className="w-full">
						<button
							type="submit"
							className="flex w-full items-center gap-2 rounded-md p-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center"
						>
							<LogOut className="size-4 shrink-0" />
							<span className="group-data-[collapsible=icon]:hidden">Logout</span>
						</button>
					</form>
				</div>
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}

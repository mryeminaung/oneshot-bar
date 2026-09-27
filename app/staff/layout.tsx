import { requirePageRole } from "@/lib/auth/page-guards";
import { AppSidebar } from "@/components/nav/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
	const { profile } = await requirePageRole(["staff"]);

	return (
		<SidebarProvider>
			<AppSidebar role="staff" userName={profile.full_name} />
			<SidebarInset>
				<header className="flex h-12 items-center border-b border-border bg-white px-4">
					<SidebarTrigger />
				</header>
				<main className="flex-1 p-6">{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
}

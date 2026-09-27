import { requirePageRole } from "@/lib/auth/page-guards";
import { AppNav } from "@/components/nav/app-nav";

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
	const { profile } = await requirePageRole(["staff"]);

	return (
		<div className="min-h-screen bg-muted/30">
			<AppNav role="staff" userName={profile.full_name} />
			<main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
		</div>
	);
}

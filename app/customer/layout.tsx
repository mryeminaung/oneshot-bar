import { requirePageRole } from "@/lib/auth/page-guards";
import { AppNav } from "@/components/nav/app-nav";

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
	const { profile } = await requirePageRole(["customer"]);

	return (
		<div className="min-h-screen bg-muted/30">
			<AppNav role="customer" userName={profile.full_name} />
			<main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
		</div>
	);
}

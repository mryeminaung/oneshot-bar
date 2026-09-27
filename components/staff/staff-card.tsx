import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DeleteStaffForm } from "@/components/staff/delete-staff-form";
import type { Profile } from "@/lib/auth/types";

export function StaffCard({ member }: { member: Profile }) {
	return (
		<Card size="sm" className="w-full">
			<CardHeader>
				<h3 className="font-semibold text-primary">{member.full_name}</h3>
			</CardHeader>
			<CardContent className="flex flex-col gap-3">
				<p className="text-sm text-muted-foreground">{member.email}</p>
				<DeleteStaffForm id={member.id} />
			</CardContent>
		</Card>
	);
}

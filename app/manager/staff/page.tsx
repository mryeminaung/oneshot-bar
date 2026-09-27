import { CreateStaffDialog } from "@/components/staff/create-staff-dialog";
import { StaffView } from "@/components/staff/staff-view";
import { getStaffList } from "@/lib/data/staff";

export default async function ManagerStaffPage() {
	const staff = await getStaffList();

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-primary">Staff</h1>
				<CreateStaffDialog />
			</div>

			{staff.length === 0 ? (
				<p className="text-muted-foreground">No staff accounts yet.</p>
			) : (
				<StaffView staff={staff} />
			)}
		</div>
	);
}

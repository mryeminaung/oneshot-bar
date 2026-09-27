import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/auth/types";

export async function getStaffList(): Promise<Profile[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("profiles")
		.select("id, full_name, email, role, created_at, updated_at")
		.eq("role", "staff")
		.order("created_at", { ascending: false });

	if (error) throw new Error(error.message);
	return data as Profile[];
}

export const ROLES = ["manager", "staff", "customer"] as const;
export type Role = (typeof ROLES)[number];

export interface Profile {
	id: string;
	full_name: string;
	email: string;
	role: Role;
	created_at: string;
	updated_at: string;
}

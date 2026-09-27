/**
 * Creates the three test auth accounts via the Supabase Admin API.
 * Run once after applying schema.sql:
 *
 *   node scripts/seed-users.mjs
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local manually (no dotenv dependency needed)
const envPath = resolve(__dirname, "../.env.local");
const env = Object.fromEntries(
	readFileSync(envPath, "utf8")
		.split("\n")
		.filter((l) => l.trim() && !l.startsWith("#"))
		.map((l) => l.split("=").map((s) => s.trim()))
		.filter(([k]) => k)
		.map(([k, ...v]) => [k, v.join("=")]),
);

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
	console.error(
		"Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
	);
	process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
	auth: { autoRefreshToken: false, persistSession: false },
});

const TEST_USERS = [
	{
		email: "customer@gmail.com",
		password: "password123",
		full_name: "Test Customer",
		role: "customer",
	},
	{
		email: "staff@gmail.com",
		password: "password123",
		full_name: "Test Staff",
		role: "staff",
	},
	{
		email: "manager@gmail.com",
		password: "password123",
		full_name: "Test Manager",
		role: "manager",
	},
];

for (const user of TEST_USERS) {
	// Check if already exists
	const { data: existing } = await supabase
		.from("profiles")
		.select("email")
		.eq("email", user.email)
		.maybeSingle();

	if (existing) {
		console.log(`⏭  ${user.email} already exists, skipping`);
		continue;
	}

	const { error } = await supabase.auth.admin.createUser({
		email: user.email,
		password: user.password,
		email_confirm: true,
		user_metadata: { full_name: user.full_name, role: user.role },
	});

	if (error) {
		console.error(`✗  ${user.email}: ${error.message}`);
	} else {
		console.log(`✓  ${user.email} created (${user.role})`);
	}
}

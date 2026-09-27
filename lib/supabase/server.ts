import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Use inside Route Handlers and Server Components. Reads the user's session
// from the request cookies, so RLS policies (auth.uid()) work as expected.
export async function createClient() {
	const cookieStore = await cookies();

	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						for (const { name, value, options } of cookiesToSet) {
							cookieStore.set(name, value, options);
						}
					} catch {
						// Called from a Server Component with no request context
						// to write to; the middleware refreshes the session instead.
					}
				},
			},
		}
	);
}

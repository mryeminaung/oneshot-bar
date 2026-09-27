export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-black via-neutral-900 to-neutral-700 px-4">
			{children}
		</div>
	);
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Menu, Moon, Sun, ArrowUpRight, LogOut } from "lucide-react";
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetDescription,
	SheetTrigger,
	SheetClose,
} from "@/components/ui/sheet";

const routes = [
	["/dashboard", "Overview"],
	["/dashboard/posts", "Posts"],
	["/dashboard/comments", "Comments"],
];

export default function DashboardShell({
	children,
	username,
}: {
	children: React.ReactNode;
	username: string;
}) {
	const pathname = usePathname();
	const router = useRouter();
	const { resolvedTheme, setTheme } = useTheme();
	const [error, setError] = useState("");
	const [busy, setBusy] = useState(false);

	async function logout() {
		setBusy(true);
		setError("");

		try {
			const res = await fetch("/api/auth/logout", { method: "POST" });

			if (!res.ok) throw new Error();
			router.replace("/dashboard/login");
			router.refresh();
		} catch {
			setError("Could not sign out. Try again.");
		} finally {
			setBusy(false);
		}
	}

	const navLinks = (mobile = false) =>
		routes.map(([href, label]) => {
			const link = (
				<Link
					href={href}
					className="block rounded px-4 py-3 text-muted-foreground hover:bg-accent aria-[current=page]:bg-accent aria-[current=page]:font-medium aria-[current=page]:text-primary"
					aria-current={
						(
							href === "/dashboard"
								? pathname === href
								: pathname.startsWith(href)
						)
							? "page"
							: undefined
					}
				>
					{label}
				</Link>
			);

			return mobile ? (
				<SheetClose key={href} asChild>
					{link}
				</SheetClose>
			) : (
				<div key={href}>{link}</div>
			);
		});

	return (
		<div className="min-h-screen lg:grid lg:grid-cols-[220px_minmax(0,1fr)]">
			<aside className="hidden border-r border-border px-5 py-8 lg:flex lg:flex-col">
				<Link href="/dashboard" className="px-4 text-lg font-medium">
					Youmbi Leo
					<span className="mt-1 block text-xs font-normal uppercase tracking-widest text-muted-foreground">
						Writing workspace
					</span>
				</Link>
				<nav
					aria-label="Dashboard navigation"
					className="mt-12 space-y-2"
				>
					{navLinks()}
				</nav>
				<Link
					href="/"
					className="mt-10 inline-flex items-center gap-2 px-4 text-sm text-muted-foreground"
				>
					View portfolio <ArrowUpRight size={15} />
				</Link>
			</aside>
			<div className="min-w-0">
				<header className="flex min-h-20 flex-wrap items-center justify-between gap-3 border-b border-border px-5 sm:px-8">
					<div className="flex items-center gap-3">
						<Sheet>
							<SheetTrigger asChild>
								<button
									aria-label="Open dashboard navigation"
									className="grid size-11 place-items-center rounded hover:bg-accent lg:hidden"
								>
									<Menu size={20} />
								</button>
							</SheetTrigger>
							<SheetContent side="left">
								<SheetTitle>Writing workspace</SheetTitle>
								<SheetDescription className="sr-only">
									Dashboard navigation
								</SheetDescription>
								<nav
									aria-label="Mobile dashboard navigation"
									className="mt-8 space-y-2"
								>
									{navLinks(true)}
									<SheetClose asChild>
										<Link
											href="/"
											className="block px-4 py-3 text-sm text-muted-foreground"
										>
											View portfolio
										</Link>
									</SheetClose>
								</nav>
							</SheetContent>
						</Sheet>
						<span className="text-sm text-muted-foreground">
							{username}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<button
							aria-label="Toggle color theme"
							onClick={() =>
								setTheme(
									resolvedTheme === "dark" ? "light" : "dark",
								)
							}
							className="grid size-11 place-items-center rounded-full hover:bg-accent"
						>
							<Sun size={18} className="hidden dark:block" />
							<Moon size={18} className="dark:hidden" />
						</button>
						<button
							onClick={logout}
							disabled={busy}
							className="inline-flex min-h-11 items-center gap-2 rounded px-3 text-sm hover:bg-accent disabled:opacity-50"
						>
							<LogOut size={16} />
							Sign out
						</button>
					</div>
				</header>
				{error && (
					<p role="alert" className="px-6 py-3 text-destructive">
						{error}
					</p>
				)}
				<div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 sm:py-12">
					{children}
				</div>
			</div>
		</div>
	);
}

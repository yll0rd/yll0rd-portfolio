import { requireAdmin } from "@/lib/auth";
import DashboardShell from "@/components/dashboard/shell";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await requireAdmin();

	return <DashboardShell username={user.username}>{children}</DashboardShell>;
}

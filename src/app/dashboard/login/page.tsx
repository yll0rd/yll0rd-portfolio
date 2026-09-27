import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { databaseConfigured } from "@/lib/db";
import LoginForm from "@/components/dashboard/login-form";

export default async function LoginPage() {
  if (await getAdmin()) redirect("/dashboard");
  return (
    <div className="mx-auto flex min-h-screen max-w-[440px] flex-col justify-center px-6 py-16">
      <Link href="/" className="mb-14 text-sm text-muted-foreground">
        Back to portfolio
      </Link>
      <p className="eyebrow">Youmbi Leo / Dashboard</p>
      <h1 className="editorial-title">A place to write.</h1>
      <p className="leading-relaxed text-muted-foreground">
        Sign in to work on your next post.
      </p>
      <LoginForm configured={databaseConfigured()} />
    </div>
  );
}

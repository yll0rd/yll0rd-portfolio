import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import NewPostButton from "@/components/dashboard/new-post-button";

export default async function Overview() {
  const user = await requireAdmin();
  const [groups, recent] = await Promise.all([
    db.blog.groupBy({
      by: ["status"],
      where: { authorId: user.id },
      _count: true,
    }),
    db.blog.findMany({
      where: { authorId: user.id },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, title: true, status: true, updatedAt: true },
    }),
  ]);

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">Your workspace</p>
          <h1 className="editorial-title">Pick up a thought.</h1>
          <p className="text-muted-foreground">
            Start something new, or return to a draft.
          </p>
        </div>
        <NewPostButton />
      </div>
      <div className="my-12 grid grid-cols-3 gap-4 border-y border-border py-6">
        {["DRAFT", "PUBLISHED", "ARCHIVED"].map((status) => (
          <Link
            href={"/dashboard/posts?status=" + status}
            key={status}
            className="rounded p-2 hover:bg-accent"
          >
            <span className="block text-3xl text-primary">
              {groups.find((g) => g.status === status)?._count ?? 0}
            </span>
            <span className="mt-2 block text-xs capitalize text-muted-foreground sm:text-sm">
              {status.toLowerCase()}
            </span>
          </Link>
        ))}
      </div>
      <h2 className="mb-5 text-lg font-medium">Recently edited</h2>
      {recent.length ? (
        <ul className="divide-y divide-border">
          {recent.map((post) => (
            <li key={post.id}>
              <a
                className="flex flex-wrap items-center justify-between gap-2 py-5 hover:text-primary"
                href={"/dashboard/posts/" + post.id}
              >
                <span>{post.title || "Untitled post"}</span>
                <span className="text-xs text-muted-foreground">
                  {post.updatedAt.toLocaleDateString("en-GB", {
                    timeZone: "UTC",
                  })}{" "}
                  · {post.status.toLowerCase()}
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-8 text-muted-foreground">
          Your first draft starts with a new post.
        </p>
      )}
    </div>
  );
}

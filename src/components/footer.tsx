import Link from "next/link";
export function Footer() {
  return (
    <footer className="border-t border-border py-9">
      <div className="site-width flex flex-wrap items-center justify-between gap-6">
        <div>
          <Link href="/" className="font-medium">
            Youmbi Leo
          </Link>
          <p className="text-sm text-muted-foreground">
            Building, learning, and paying attention.
          </p>
        </div>
        <div className="flex flex-wrap gap-[22px] text-sm">
          <a
            className="py-3 hover:underline"
            href="mailto:leoyoumbi83@gmail.com"
          >
            Email
          </a>
          <a
            className="py-3 hover:underline"
            href="https://github.com/yll0rd"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            className="py-3 hover:underline"
            href="https://linkedin.com/in/yll0rd"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            className="py-3 hover:underline"
            href="https://x.com/yll0rd"
            target="_blank"
            rel="noopener noreferrer"
          >
            X
          </a>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

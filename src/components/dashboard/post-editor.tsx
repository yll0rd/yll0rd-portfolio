"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { draftSchema, type Draft } from "@/lib/blog-content";
import { slugify } from "@/lib/utils";
import { imageSources } from "@/lib/image-references";
import ImageUpload from "./image-upload";

const RichEditor = dynamic(() => import("./rich-editor/index"), {
  ssr: false,
  loading: () => (
    <p className="py-12 text-muted-foreground">Loading editor...</p>
  ),
});
type Status = "DRAFT" | "PUBLISHED" | "ARCHIVED";
type Recovery = { draft: Draft; coverUrl: string | null };
export default function PostEditor({
  id,
  initial,
  initialVersion,
  initialStatus,
  initialPublishedVersion,
  slugLocked,
  initialCoverUrl,
}: {
  id: string;
  initial: Draft;
  initialVersion: number;
  initialStatus: Status;
  initialPublishedVersion: number | null;
  slugLocked: boolean;
  initialCoverUrl: string | null;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState(initial);
  const [tagsText, setTagsText] = useState(initial.tags.join(", "));
  const [coverUrl, setCoverUrl] = useState(initialCoverUrl);
  const [status, setStatus] = useState(initialStatus);
  const [version, setVersion] = useState(initialVersion);
  const [publishedVersion, setPublishedVersion] = useState(
    initialPublishedVersion,
  );
  const [lockedSlug, setLockedSlug] = useState(slugLocked);
  const [saveState, setSaveState] = useState("Saved");
  const [error, setError] = useState("");
  const [conflict, setConflict] = useState(false);
  const [busy, setBusy] = useState(false);
  const [recovery, setRecovery] = useState<Recovery | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const latest = useRef(initial);
  const removedImages = useRef(new Set<string>());
  const revision = useRef(initialVersion);
  const saved = useRef(JSON.stringify(initial));
  const pending = useRef<Promise<void> | null>(null);
  const paused = useRef(false);
  const conflicted = useRef(false);
  const storageKey = "portfolio-draft:" + id;

  useEffect(() => {
    try {
      const value = localStorage.getItem(storageKey);
      if (value) {
        const backup = JSON.parse(value);
        const result = draftSchema.safeParse(backup.draft);
        if (result.success && JSON.stringify(result.data) !== saved.current)
          setRecovery({
            draft: result.data,
            coverUrl: backup.coverUrl || null,
          });
        else localStorage.removeItem(storageKey);
      }
    } catch {
      /* Recovery storage is optional; server saving remains available. */
    }
  }, [storageKey]);

  useEffect(() => {
    if (recovery || JSON.stringify(draft) === saved.current) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ draft, coverUrl }));
    } catch {}
  }, [draft, coverUrl, recovery, storageKey]);

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    const next = { ...latest.current, [key]: value };
    if (key === "content") {
      const remaining = imageSources(next.content);
      imageSources(latest.current.content).forEach((source) => {
        if (!remaining.has(source)) removedImages.current.add(source);
      });
      remaining.forEach((source) => removedImages.current.delete(source));
    }
    if (key === "title" && !lockedSlug) {
      next.slug = slugify(next.title) || "untitled-post";
    }
    latest.current = next;
    setDraft(next);
    setSaveState("Unsaved");
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ draft: next, coverUrl }),
      );
    } catch {
      /* Browser storage may be unavailable. */
    }
  }

  const save = useCallback(async (): Promise<void> => {
    if (conflicted.current)
      throw new Error("Reload the post before saving after a conflict.");
    if (pending.current) {
      await pending.current;
      if (JSON.stringify(latest.current) !== saved.current) return save();
      return;
    }
    const operation = async () => {
      while (JSON.stringify(latest.current) !== saved.current) {
        const snapshot = latest.current;
        const deletedImageUrls = Array.from(removedImages.current);
        const serialized = JSON.stringify(snapshot);
        setSaveState("Saving...");
        setError("");
        try {
          const response = await fetch("/api/posts/" + id, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...snapshot, version: revision.current, deletedImageUrls }),
          });
          const result = await response.json();
          if (!response.ok) {
            if (response.status === 409) {
              conflicted.current = true;
              setConflict(true);
            }
            throw new Error(result.error || "Could not save this draft.");
          }
          revision.current = result.version;
          setVersion(result.version);
          saved.current = serialized;
          if (result.cleanupWarning) setError(result.cleanupWarning);
          else deletedImageUrls.forEach((source) => removedImages.current.delete(source));
          if (JSON.stringify(latest.current) === serialized) {
            setSaveState("Saved");
            paused.current = false;
            try {
              localStorage.removeItem(storageKey);
            } catch {}
          }
        } catch (error) {
          paused.current = true;
          setSaveState("Not saved");
          setError(
            error instanceof Error
              ? error.message
              : "Connection lost. Your changes have not been saved.",
          );
          throw error;
        }
      }
    };
    pending.current = operation();
    try {
      await pending.current;
    } finally {
      pending.current = null;
    }
  }, [id, storageKey]);

  useEffect(() => {
    if (
      paused.current ||
      busy ||
      recovery ||
      JSON.stringify(draft) === saved.current
    )
      return;
    const timer = setTimeout(() => {
      void save().catch(() => {});
    }, 1000);
    return () => clearTimeout(timer);
  }, [draft, busy, recovery, save]);

  useEffect(() => {
    const dirty = () => JSON.stringify(latest.current) !== saved.current;
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (dirty()) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    const navigate = (event: MouseEvent) => {
      const anchor = (event.target as Element).closest?.("a");
      if (
        anchor &&
        anchor.getAttribute("href") &&
        !anchor.getAttribute("href")!.startsWith("#") &&
        dirty() &&
        !window.confirm("You have unsaved changes. Leave this page?")
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", beforeUnload);
    document.addEventListener("click", navigate, true);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      document.removeEventListener("click", navigate, true);
    };
  }, []);

  async function action(kind: "publish" | "unpublish" | "archive" | "preview") {
    if (
      (kind === "archive" || kind === "unpublish") &&
      !window.confirm(
        kind === "archive"
          ? "Archive this post and remove it from public view?"
          : "Remove this post from public view?",
      )
    )
      return;
    setBusy(true);
    setError("");
    try {
      await save();
      if (kind === "preview") {
        router.push("/dashboard/posts/" + id + "/preview");
        return;
      }
      const response = await fetch("/api/posts/" + id + "/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version: revision.current, action: kind }),
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 409) {
          conflicted.current = true;
          setConflict(true);
        }
        throw new Error(result.error);
      }
      revision.current = result.version;
      setVersion(result.version);
      setStatus(result.status);
      setPublishedVersion(result.publishedVersion);
      if (kind === "publish") setLockedSlug(true);
      setSaveState(kind === "publish" ? "Published" : "Saved");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "The action could not be completed.",
      );
    } finally {
      setBusy(false);
    }
  }
  
  function exportDraft() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(latest.current, null, 2)], {
        type: "application/json",
      }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = draft.slug + ".json";
    link.click();
    URL.revokeObjectURL(url);
  }

  const settings = (
    <fieldset disabled={busy} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="post-slug" className="text-sm font-medium">
          URL slug
        </label>
        <Input
          id="post-slug"
          value={draft.slug}
          maxLength={120}
          disabled={lockedSlug}
          onChange={(event) => update("slug", event.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          {lockedSlug
            ? "Locked to preserve published links."
            : "Lowercase words separated by hyphens."}
        </p>
      </div>
      <div className="space-y-2">
        <label htmlFor="post-excerpt" className="text-sm font-medium">
          Excerpt
        </label>
        <Textarea
          id="post-excerpt"
          rows={4}
          value={draft.excerpt}
          maxLength={500}
          onChange={(event) => update("excerpt", event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="post-tags" className="text-sm font-medium">
          Tags
        </label>
        <Input
          id="post-tags"
          value={tagsText}
          onChange={(event) => {
            setTagsText(event.target.value);
            update(
              "tags",
              event.target.value
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
            );
          }}
        />
        <p className="text-xs text-muted-foreground">
          Separate tags with commas. Up to 12.
        </p>
      </div>
      <div className="space-y-3">
        <p className="text-sm font-medium">Cover image</p>
        {coverUrl && (
          <img
            src={coverUrl}
            alt={`Cover image for ${draft.title}`}
            className="aspect-video w-full rounded object-cover"
          />
        )}
        <ImageUpload
          disabled={busy}
          label={coverUrl ? "Replace cover" : "Upload cover"}
          onUpload={(image) => {
            setCoverUrl(image.url);
            update("coverUrl", image.url);
          }}
        />
        {draft.coverUrl && (
          <Button
            size="sm"
            variant="ghost"
            type="button"
            onClick={() => {
              setCoverUrl(null);
              update("coverUrl", null);
            }}
          >
            Remove cover
          </Button>
        )}
      </div>
      <details className="border-t border-border pt-5">
        <summary className="cursor-pointer text-sm font-medium">
          Search appearance
        </summary>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="seo-title" className="mb-2 block text-sm">
              Search title (optional)
            </label>
            <Input
              id="seo-title"
              value={draft.seoTitle}
              maxLength={80}
              onChange={(event) => update("seoTitle", event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="seo-description" className="mb-2 block text-sm">
              Search description (optional)
            </label>
            <Textarea
              id="seo-description"
              value={draft.seoDescription}
              maxLength={200}
              onChange={(event) => update("seoDescription", event.target.value)}
            />
          </div>
        </div>
      </details>
      <div className="flex flex-wrap gap-2 border-t border-border pt-5">
        {status === "PUBLISHED" && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => action("unpublish")}
          >
            Unpublish
          </Button>
        )}
        {status !== "ARCHIVED" && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => action("archive")}
          >
            Archive
          </Button>
        )}
      </div>
    </fieldset>
  );

  return (
    <div>
      <div className="sticky top-0 z-20 -mx-2 mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border bg-background/95 px-2 py-4 backdrop-blur">
        <div>
          <Link
            href="/dashboard/posts"
            className="text-sm text-muted-foreground"
          >
            Posts / Edit
          </Link>
          <p
            role="status"
            aria-live="polite"
            className="mt-1 text-xs text-muted-foreground"
          >
            {saveState}
            {status === "PUBLISHED" && version !== publishedVersion
              ? " · Unpublished changes"
              : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={busy || conflict || Boolean(recovery)}
            onClick={() => {
              paused.current = false;
              void save().catch(() => {});
            }}
          >
            Save draft
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={busy || conflict || Boolean(recovery)}
            onClick={() => action("preview")}
          >
            Preview
          </Button>
          <Button
            size="sm"
            disabled={busy || conflict || Boolean(recovery)}
            onClick={() => action("publish")}
          >
            {busy
              ? "Working..."
              : status === "PUBLISHED"
                ? "Publish changes"
                : "Publish"}
          </Button>
        </div>
      </div>
      {recovery && (
        <div className="mb-6 rounded border border-secondary bg-muted p-4">
          <p className="mb-3 text-sm">
            This browser has unsaved changes for this post. Restore them to the
            editor or keep the server version.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              size="sm"
              onClick={() => {
                const recovered = {
                  ...recovery.draft,
                  ...(lockedSlug ? { slug: initial.slug } : {}),
                };
                latest.current = recovered;
                setDraft(recovered);
                setTagsText(recovered.tags.join(", "));
                setCoverUrl(recovery.coverUrl);
                setEditorKey((key) => key + 1);
                setRecovery(null);
                setSaveState("Unsaved");
              }}
            >
              Restore local draft
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                try {
                  localStorage.removeItem(storageKey);
                } catch {}
                setRecovery(null);
              }}
            >
              Keep server version
            </Button>
          </div>
        </div>
      )}
      {error && (
        <div
          role="alert"
          className="mb-6 rounded border border-destructive/50 p-4"
        >
          <p className="text-sm text-destructive">{error}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {conflict ? (
              <>
                <Button size="sm" variant="outline" onClick={exportDraft}>
                  Download my draft
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Reload server version
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  paused.current = false;
                  void save().catch(() => {});
                }}
              >
                Retry save
              </Button>
            )}
          </div>
        </div>
      )}
      <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
          <div className="mb-6 xl:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings2 size={16} className="mr-2" />
                  Post settings
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[min(380px,95vw)] overflow-y-auto">
                <SheetTitle>Post settings</SheetTitle>
                <SheetDescription className="mb-6">
                  Details for your article and its public page.
                </SheetDescription>
                {settings}
              </SheetContent>
            </Sheet>
          </div>
          <label htmlFor="post-title" className="sr-only">
            Article title
          </label>
          <Textarea
            id="post-title"
            placeholder="Untitled post"
            value={draft.title}
            disabled={busy || Boolean(recovery)}
            maxLength={180}
            onChange={(event) => update("title", event.target.value)}
            className="mb-6 min-h-[100px] resize-none border-0 bg-transparent px-0 font-[family-name:var(--font-serif)] text-4xl leading-tight shadow-none focus-visible:ring-0 sm:text-5xl"
          />
          <RichEditor
            key={editorKey}
            initialContent={draft.content}
            onChange={(content) => update("content", content)}
            disabled={busy || Boolean(recovery)}
          />
        </div>
        <aside className="hidden border-l border-border pl-7 xl:block">
          <h2 className="mb-6 font-medium">Post settings</h2>
          {settings}
        </aside>
      </div>
    </div>
  );
}

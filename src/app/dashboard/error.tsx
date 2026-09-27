"use client";
import { Button } from "@/components/ui/button";

export default function DashboardError({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-6 py-24">
      <h1 className="editorial-title">The workspace could not load.</h1>
      <p className="mb-6 text-muted-foreground">
        Please try again. If this continues, check the database connection.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}

"use client";
export default function WritingError({ reset }: { reset: () => void }) {
  return <div className="site-width py-20"><h1 className="editorial-title">Writing is temporarily unavailable.</h1><p className="mb-6 text-muted-foreground">Please try again in a moment.</p><button onClick={reset} className="text-link">Try again</button></div>;
}


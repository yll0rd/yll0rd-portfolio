import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

let lastTransition: ViewTransition | null = null;

export async function safeStartViewTransition(callback: () => void): Promise<ViewTransition> {
  if (lastTransition) {
    // Optionally, wait for previous transition to finish before starting the next
    await lastTransition.finished
    return safeStartViewTransition(callback);
  }
  lastTransition = document.startViewTransition(callback);
  lastTransition.finished.finally(() => {
    lastTransition = null;
  });
  return lastTransition;
}

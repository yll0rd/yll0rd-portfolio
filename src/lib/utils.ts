import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const NODE_HANDLES_SELECTED_STYLE_CLASSNAME =
	"node-handles-selected-style";

let lastTransition: ViewTransition | null = null;

export async function safeStartViewTransition(
	callback: () => void,
): Promise<ViewTransition> {
	if (lastTransition) {
		// Optionally, wait for previous transition to finish before starting the next
		await lastTransition.finished;

		return safeStartViewTransition(callback);
	}

	lastTransition = document.startViewTransition(callback);
	lastTransition.finished.finally(() => {
		lastTransition = null;
	});

	return lastTransition;
}

export function isValidUrl(value: string): boolean {
	try {
		new URL(value);

		return true;
	} catch {
		return false;
	}
}

// Utility function to create slug from text content
export function slugify(text: string): string {
	return text
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.slice(0, 120)
		.replace(/^-+|-+$/g, "");
}

// Helper utility to enforce validation mapping
const makeSchemaForType =
	<T>() =>
	<S extends z.ZodType<T>>(schema: S) =>
		schema;

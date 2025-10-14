import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function parseField(value) {
    if (!value || value === "null") return [];

    if (Array.isArray(value)) return value;

    if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed === "" || trimmed === "[]" || trimmed === "null") return [];

        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) return parsed;
        } catch {
            // Fallback for comma-separated string
            return trimmed.split(",").map(s => s.trim()).filter(Boolean);
        }
    }

    return [];
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get or create a persistent guest user ID
 * Used for cart isolation before user logs in
 */
export function getGuestId(): string {
  const GUEST_ID_KEY = "guest_user_id";

  let guestId = localStorage.getItem(GUEST_ID_KEY);

  if (!guestId) {
    // Generate UUID v4
    guestId = crypto.randomUUID();
    localStorage.setItem(GUEST_ID_KEY, guestId);
  }

  return guestId;
}

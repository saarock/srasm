import type { ClickEvent } from "@/types";

/**
 * Logs a click event to local storage.
 * Events are stored in an array with a maximum length of 1000.
 * If the array is full, the oldest event is removed before adding the new one.
 * @param {ClickEvent} event - The click event to log
 */
export const logClick = (event: ClickEvent) => {
  const key = "click_events";
  const existing = JSON.parse(localStorage.getItem(key) || "[]");
  // limit to 1000
  if (existing.length > 1000) {
    existing.shift();
  }
  existing.push(event);
  localStorage.setItem(key, JSON.stringify(existing));
};

export type ClickEvent = {
  itemId: string;
  categoryId: string;
  ts: number;
};

export const logClick = (event: ClickEvent) => {
  const key = "click_events";
  const existing = JSON.parse(localStorage.getItem(key) || "[]");
  existing.push(event);
  localStorage.setItem(key, JSON.stringify(existing));
};


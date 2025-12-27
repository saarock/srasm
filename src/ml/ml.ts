import type { ClickEvent } from "@/ml";

export function getMosteClikableIds(limit = 10): string[] {
  const events: ClickEvent[] = JSON.parse(
    localStorage.getItem("click_events") || "[]"
  );
  const now = Date.now();
  const scoreMap: Record<string, number> = {};
  for (const e of events) {
    const ageHour = (now - e.ts) / (1000 / 60 / 60 / 24);
    const weight = Math.max(0.2, 1 / (1 + ageHour)); // age weight
    scoreMap[e.categoryId] = (scoreMap[e.categoryId] || 0) + weight;
  }

  console.log(Object.entries(scoreMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([categoryId]) => categoryId));
  

  return Object.entries(scoreMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([categoryId]) => categoryId);
}

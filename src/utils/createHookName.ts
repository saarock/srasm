export function createProperHookName(hookNameGivenByDeveloper?: string): string {
  if (!hookNameGivenByDeveloper) return "";
  return `use${hookNameGivenByDeveloper[0].toUpperCase()}${hookNameGivenByDeveloper.slice(1)}`;
}

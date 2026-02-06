export function checkTheHookName(hookName?: string) {
  if (!hookName) {
    throw new Error("Hook name is required");
  }
  if (typeof hookName !== "string") {
    throw new Error("Hook name must be a string");
  }
  if (hookName === "") {
    throw new Error("Hook name cannot be empty");
  }
  if (hookName === null) {
    throw new Error("Hook name cannot be null");
  }
  if (hookName === undefined) {
    throw new Error("Hook name cannot be undefined");
  }
  if (hookName.length > 50) {
    throw new Error("Hook name cannot be longer than 50 characters");
  }
  if (hookName.length < 3) {
    throw new Error("Hook name cannot be shorter than 3 characters");
  }
  if (hookName.includes(" ")) {
    throw new Error("Hook name cannot contain spaces");
  }
  if (hookName.includes("-")) {
    throw new Error("Hook name cannot contain hyphens");
  }
  if (hookName.includes("_")) {
    throw new Error("Hook name cannot contain underscores");
  }
}

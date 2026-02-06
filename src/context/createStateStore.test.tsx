import { describe, expect, test } from "vitest";
import { createStateStore } from "./createStateStore";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";

describe("createStateStore high level API test and error test", () => {
  test("createStateStore should create the store and return the hooks", () => {
    const { SRASMProvider, useSRASM, useSRASMAsync } = createStateStore({
      theme: { mode: "dark" as "dark" | "light" },
      auth: {
        user: null as null | { id: number; name: string; role?: string },
        token: "",
      },
    });

    expect(SRASMProvider).toBeDefined();
    expect(useSRASM).toBeDefined();
    expect(useSRASMAsync).toBeDefined();
  });

  test("createStateStore should throw if no initial state is provided", () => {
    expect(() => createStateStore({})).toThrow();
  });

  test("createStateStore should throw if initial state is not an object", () => {
    expect(() => createStateStore(1 as any)).toThrow();
  });

  test("createStateStore should throw if initial state is an array", () => {
    expect(() => createStateStore([] as any)).toThrow();
  });

  test("createStateStore should throw if initial state is null", () => {
    expect(() => createStateStore(null as any)).toThrow();
  });

  test("createStateStore should throw if initial state is undefined", () => {
    expect(() => createStateStore(undefined as any)).toThrow();
  });
});

describe("createStateStore low level API test", () => {
  test("useSRASM should return the correct state and setState function", () => {
    const { useSRASM } = createStateStore({
      theme: { mode: "dark" as "dark" | "light" },
      auth: { user: null, token: "" },
    });

    let snapshot: any;

    function TestComponent() {
      snapshot = useSRASM("theme");
      return null;
    }

    const container = document.createElement("div");
    const root = createRoot(container);

    // ensures render completes before assertions
    flushSync(() => {
      root.render(<TestComponent />);
    });

    expect(snapshot.state).toEqual({ mode: "dark" });
    expect(typeof snapshot.setState).toBe("function");

    // cleanup
    root.unmount();
  });
});

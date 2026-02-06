export function tryRegisterSRASMDevtools(storeName: string, api: any) {
  if (typeof window === "undefined") return;

  const w = window as any;
  let tries = 0;

  const t = setInterval(() => {
    const dt = w.__SRASM_DEVTOOLS__;
    if (dt && typeof dt.registerStore === "function") {
      dt.registerStore(storeName, api);
      clearInterval(t);
    }
    tries++;
    if (tries > 50) clearInterval(t); // stop after ~5s
  }, 100);
}

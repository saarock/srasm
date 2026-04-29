"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { __srsmDebug, useSRASM, useSRASMAsync } from "./store";

type Todo = { userId: number; id: number; title: string; completed: boolean };
type Body = { title: string; completed: boolean; userId: number };

let GET_COUNT = 0;
let POST_COUNT = 0;

function useForceRerender() {
  const [, setTick] = useState(0);
  return useCallback(() => setTick((t) => t + 1), []);
}

/**
 * GET hook (cached) — data stored in slice "todos" (array)
 */
function useTodosQuery(opts: { skip?: boolean; onCount?: () => void } = {}) {
  const fetchTodos = useCallback(async () => {
    GET_COUNT++;
    console.log(" GET /todos count =", GET_COUNT);
    opts.onCount?.();

    const url = `https://jsonplaceholder.typicode.com/todos?_limit=5`;
    const res = await fetch(url, {
      method: "GET",
      headers: { "Cache-Control": "no-store", Pragma: "no-cache" },
    });

    if (!res.ok) throw new Error(`GET failed: ${res.status}`);
    return (await res.json()) as Todo[];
  }, [opts]);

  return useSRASMAsync("todos", fetchTodos, {
    method: "GET",
    key: "todos:list",
    providesTags: ["todos"],
    skip: opts.skip ?? false,
  } as const);
}

/**
 * POST mutation — data stored in slice "todoCreateResult" (object)
 * This prevents overwriting the "todos" list slice (array).
 */
function useCreateTodoMutation(opts: { onCount?: () => void } = {}) {
  const postTodo = useCallback(
    async (data?: Body) => {
      POST_COUNT++;
      console.log("🚀 POST /todos count =", POST_COUNT);
      opts.onCount?.();

      const res = await fetch("https://jsonplaceholder.typicode.com/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          data ?? { title: "New Todo", completed: false, userId: 1 },
        ),
      });

      if (!res.ok) throw new Error(`POST failed: ${res.status}`);
      return res.json();
    },
    [opts],
  );

  // IMPORTANT: slice changed to "todoCreateResult"
  return useSRASMAsync<any, Body, "createTodo">(
    "todoCreateResult" as any,
    postTodo,
    {
      method: "POST",
      hookName: "createTodo",
      invalidatesTags: ["todos"],
    } as const,
  );
}

/* ---------------- UI Helpers ---------------- */

function Badge({
  children,
  tone = "neutral",
}: {
  children: any;
  tone?: "neutral" | "violet" | "pink" | "green" | "amber";
}) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

function Button({
  children,
  onClick,
  disabled,
  variant = "primary",
  type = "button",
}: {
  children: any;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "ghost";
}) {
  return (
    <button
      type={type}
      className={`btn ${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

/* ---------------- Components ---------------- */

function StatsDisplay({ counter }: { counter: number }) {
  return (
    <div className="stats">
      <div className="card stat violet">
        <div className="stat-top">
          <div className="stat-icon">⚡</div>
          <div>
            <div className="stat-label">GET Requests</div>
            <div className="stat-value">{GET_COUNT}</div>
          </div>
        </div>
        <div className="stat-hint">Query calls hitting the API</div>
      </div>

      <div className="card stat pink">
        <div className="stat-top">
          <div className="stat-icon">📤</div>
          <div>
            <div className="stat-label">POST Requests</div>
            <div className="stat-value">{POST_COUNT}</div>
          </div>
        </div>
        <div className="stat-hint">Mutations that invalidate tags</div>
      </div>

      <div className="card stat amber">
        <div className="stat-top">
          <div className="stat-icon">🎯</div>
          <div>
            <div className="stat-label">Counter Slice</div>
            <div className="stat-value">{counter}</div>
          </div>
        </div>
        <div className="stat-hint">Local SRASM slice (no API)</div>
      </div>
    </div>
  );
}

function CounterDemo() {
  const { state, setState } = useSRASM("counter");

  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <h2>Counter (Local State)</h2>
          <p className="muted">This is SRASM local state only. No GET/POST.</p>
        </div>
        <Badge tone="amber">Slice: counter</Badge>
      </div>

      <div className="row">
        <div className="big">{state ?? 0}</div>
        <div className="row">
          <Button
            variant="ghost"
            onClick={() => setState((p: number) => p - 1)}
          >
            ➖
          </Button>
          <Button
            variant="primary"
            onClick={() => setState((p: number) => p + 1)}
          >
            ➕
          </Button>
          <Button variant="secondary" onClick={() => setState(0)}>
            🔄 Reset
          </Button>
        </div>
      </div>
    </section>
  );
}

function TodosGetDemo({ onCount }: { onCount: () => void }) {
  const { data, loading, error, refetch } = useTodosQuery({ onCount });

  // SAFE: ensure array
  const todos = Array.isArray(data) ? (data as Todo[]) : [];

  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <h2>GET Query (Caching)</h2>
          <p className="muted">
            First fetch hits API. Re-mount uses cache (same key). Check console.
          </p>
        </div>
        <Badge tone="violet">key: todos:list</Badge>
      </div>

      <div className="row">
        <Button
          variant="primary"
          onClick={() => refetch?.()}
          disabled={loading}
        >
          {loading ? "Loading..." : "📥 Fetch Todos"}
        </Button>
        <div className="hint">
          Open console → watch <b>🔥 GET</b> count.
        </div>
      </div>

      {error && (
        <div className="alert error">
          <b>Error:</b> {error instanceof Error ? error.message : String(error)}
        </div>
      )}

      <ul className="todo-list">
        {todos.map((t) => (
          <li key={t.id} className={`todo ${t.completed ? "done" : ""}`}>
            <div className="todo-title">
              <span className="dot">{t.completed ? "✅" : "⭕"}</span>
              <span>{t.title}</span>
            </div>
            <div className="todo-sub">User: {t.userId}</div>
          </li>
        ))}
      </ul>

      {!loading && todos.length === 0 && (
        <div className="empty">No todos yet. Click Fetch.</div>
      )}
    </section>
  );
}

function CreateTodoDemo({ onCount }: { onCount: () => void }) {
  const { createTodo, loading, error, data } = useCreateTodoMutation({
    onCount,
  });

  const [title, setTitle] = useState("");
  const [userId, setUserId] = useState(1);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setOkMsg(` Created todo (fake). Returned id: ${data.id ?? "—"}`);
      const t = setTimeout(() => setOkMsg(null), 2500);
      return () => clearTimeout(t);
    }
  }, [data]);

  const handleCreate = async () => {
    if (!title.trim()) return alert("Please enter a title");

    //  await so loading + success is correct
    await createTodo({ title, completed: false, userId });
    setTitle("");
  };

  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <h2>POST Mutation (Invalidation)</h2>
          <p className="muted">
            POST invalidates tag <b>todos</b>. If GET is mounted it refetches
            immediately; if not, it refetches on next mount.
          </p>
        </div>
        <Badge tone="pink">hookName: createTodo</Badge>
      </div>

      <div className="grid2">
        <div className="field">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Write todo..."
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
        </div>

        <div className="field">
          <label>User ID</label>
          <input
            type="number"
            min={1}
            value={userId}
            onChange={(e) => setUserId(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="row">
        <Button variant="secondary" onClick={handleCreate} disabled={loading}>
          {loading ? "Creating..." : "✨ Create"}
        </Button>
        <div className="hint">Console: look for 🚀 POST</div>
      </div>

      {error && (
        <div className="alert error">
          <b>Error:</b> {error instanceof Error ? error.message : String(error)}
        </div>
      )}
      {okMsg && <div className="alert ok">{okMsg}</div>}
    </section>
  );
}

function CombinedDemo({ onCount }: { onCount: () => void }) {
  const { data, refetch } = useTodosQuery({ onCount });
  const { createTodo, loading: mutationLoading } = useCreateTodoMutation({
    onCount,
  });

  const todos = Array.isArray(data) ? (data as Todo[]) : [];
  const [title, setTitle] = useState("");

  const handleCreateAndRefetch = async () => {
    if (!title.trim()) return alert("Please enter a title");

    await createTodo({ title, completed: false, userId: 1 });
    setTitle("");

    // show immediate flow
    // setTimeout(() => refetchTodos?.(), 350);
  };

  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <h2>Full Workflow (POST → GET)</h2>
          <p className="muted">
            This is the demo flow for presentation: create then refetch list.
          </p>
        </div>
        <div className="panel-badges">
          <Badge tone="pink">invalidates: todos</Badge>
          <Badge tone="violet">provides: todos</Badge>
        </div>
      </div>

      <div className="row">
        <input
          className="wide-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a todo title..."
          onKeyDown={(e) => e.key === "Enter" && handleCreateAndRefetch()}
        />
        <Button
          variant="primary"
          onClick={handleCreateAndRefetch}
          disabled={mutationLoading}
        >
          {mutationLoading ? "Processing..." : "🚀 Create & Refetch"}
        </Button>
      </div>

      <ul className="todo-list">
        {todos.map((t) => (
          <li key={t.id} className={`todo ${t.completed ? "done" : ""}`}>
            <div className="todo-title">
              <span className="dot">{t.completed ? "✅" : "⭕"}</span>
              <span>{t.title}</span>
            </div>
            <div className="todo-sub">User: {t.userId}</div>
          </li>
        ))}
      </ul>

      {todos.length === 0 && <div className="empty">No todos loaded yet.</div>}
    </section>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "counter" | "get" | "post" | "combined"
  >("overview");

  const forceRerender = useForceRerender();
  const { state: counter } = useSRASM("counter");

  const modeLabel = useMemo(() => {
    if (activeTab === "get") return "GET Cache Lab";
    if (activeTab === "post") return "Mutation Lab";
    if (activeTab === "combined") return "Workflow Lab";
    if (activeTab === "counter") return "Local State Lab";
    return "Overview";
  }, [activeTab]);

  useEffect(() => {
    console.log(__srsmDebug());
  }, [activeTab]);

  return (
    <main className="app">
      <style>{css}</style>

      <header className="top">
        <div className="top-inner">
          <div className="brand">
            <div className="logo" />
            <div>
              <div className="title">SRASM Demo</div>
              <div className="subtitle">
                Cache + tag invalidation (thesis UI)
              </div>
            </div>
          </div>

          <div className="top-right">
            <Badge tone="neutral">{modeLabel}</Badge>
            <Badge tone="amber">counter: {counter ?? 0}</Badge>
          </div>
        </div>
      </header>

      <div className="wrap">
        <StatsDisplay counter={counter ?? 0} />

        <div className="tabs">
          <button
            className={`tab ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`tab ${activeTab === "counter" ? "active" : ""}`}
            onClick={() => setActiveTab("counter")}
          >
            Counter
          </button>
          <button
            className={`tab ${activeTab === "get" ? "active" : ""}`}
            onClick={() => setActiveTab("get")}
          >
            GET Cache
          </button>
          <button
            className={`tab ${activeTab === "post" ? "active" : ""}`}
            onClick={() => setActiveTab("post")}
          >
            POST Mutation
          </button>
          <button
            className={`tab ${activeTab === "combined" ? "active" : ""}`}
            onClick={() => setActiveTab("combined")}
          >
            Full Workflow
          </button>

          <div className="tab-spacer" />
          <button
            className="mini"
            onClick={forceRerender}
            title="Refresh counters"
          >
            Refresh ↻
          </button>
        </div>

        {activeTab === "overview" && (
          <section className="panel">
            <div className="panel-head">
              <div>
                <h2>Overview</h2>
                <p className="muted">
                  Demo shows: GET caching, POST invalidation, and local SRASM
                  state.
                </p>
              </div>
              <div className="panel-badges">
                <Badge tone="violet">GET provides tags</Badge>
                <Badge tone="pink">POST invalidates tags</Badge>
              </div>
            </div>

            <div className="callout">
              <b>Presentation script:</b>
              <ol className="ol">
                <li>Go to GET Cache → click Fetch (GET_COUNT = 1)</li>
                <li>Go to POST Mutation → create todo (POST_COUNT + 1)</li>
                <li>Go back to GET Cache → refetch shows fresh flow</li>
              </ol>
            </div>
          </section>
        )}

        {activeTab === "counter" && <CounterDemo />}
        {activeTab === "get" && <TodosGetDemo onCount={forceRerender} />}
        {activeTab === "post" && <CreateTodoDemo onCount={forceRerender} />}
        {activeTab === "combined" && <CombinedDemo onCount={forceRerender} />}

        <footer className="foot">
          <span>SRASM Demo UI • Thesis presentation</span>
          <span className="muted">Open Console to see GET/POST logs</span>
        </footer>
      </div>
    </main>
  );
}

/* ---------------- CSS ---------------- */

const css = `
:root{
  --bg:#0b1020;
  --border:rgba(255,255,255,.12);
  --text:rgba(255,255,255,.92);
  --muted:rgba(255,255,255,.70);

  --violet1:#7C3AED; --violet2:#A78BFA;
  --pink1:#EC4899; --pink2:#F9A8D4;
  --amber1:#F59E0B; --amber2:#FCD34D;
}

*{box-sizing:border-box;}
html,body{height:100%;}
body{
  margin:0;
  background: radial-gradient(900px 500px at 20% 10%, rgba(124,58,237,.22), transparent 60%),
              radial-gradient(900px 500px at 80% 30%, rgba(236,72,153,.16), transparent 55%),
              radial-gradient(900px 500px at 50% 90%, rgba(245,158,11,.12), transparent 55%),
              var(--bg);
  color:var(--text);
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
}

.top{
  position:sticky; top:0; z-index:50;
  backdrop-filter: blur(10px);
  background: rgba(11,16,32,.78);
  border-bottom:1px solid rgba(255,255,255,.10);
}
.top-inner{
  max-width:1100px; margin:0 auto; padding:14px 18px;
  display:flex; align-items:center; justify-content:space-between; gap:12px;
}
.brand{display:flex; gap:12px; align-items:center;}
.logo{
  width:38px; height:38px; border-radius:14px;
  background: linear-gradient(135deg, rgba(124,58,237,.95), rgba(236,72,153,.75));
  border:1px solid rgba(255,255,255,.16);
}
.title{font-weight:900;}
.subtitle{font-size:12px; color:var(--muted); margin-top:2px;}
.top-right{display:flex; gap:10px; flex-wrap:wrap; align-items:center;}

.wrap{max-width:1100px; margin:0 auto; padding:18px;}

.stats{
  display:grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap:14px;
}
@media (max-width:900px){ .stats{grid-template-columns:1fr;} }

.card{
  background: linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,.05));
  border:1px solid var(--border);
  border-radius:18px;
  padding:16px;
}
.stat{position:relative; overflow:hidden;}
.stat::before{
  content:"";
  position:absolute; left:0; top:0; right:0; height:4px;
}
.stat.violet::before{ background: linear-gradient(90deg, var(--violet1), var(--violet2)); }
.stat.pink::before{ background: linear-gradient(90deg, var(--pink1), var(--pink2)); }
.stat.amber::before{ background: linear-gradient(90deg, var(--amber1), var(--amber2)); }

.stat-top{display:flex; gap:12px; align-items:center;}
.stat-icon{font-size:28px;}
.stat-label{font-size:12px; color:var(--muted); font-weight:900; letter-spacing:.12em; text-transform:uppercase;}
.stat-value{font-size:34px; font-weight:950; margin-top:4px;}
.stat-hint{margin-top:10px; font-size:12px; color:var(--muted);}

.tabs{
  position:sticky;
  top:70px;
  z-index:40;
  margin-top:16px;
  display:flex; gap:10px; align-items:center; flex-wrap:wrap;
  padding:10px;
  border-radius:16px;
  border:1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.05);
  backdrop-filter: blur(10px);
}
.tab{
  border:none; background:transparent;
  color: rgba(255,255,255,.75);
  font-weight:900;
  padding:10px 12px;
  border-radius:12px;
  cursor:pointer;
}
.tab:hover{ background: rgba(255,255,255,.06); color: rgba(255,255,255,.92); }
.tab.active{
  background: rgba(124,58,237,.18);
  border:1px solid rgba(124,58,237,.35);
  color: rgba(255,255,255,.95);
}
.tab-spacer{flex:1;}
.mini{
  border:1px solid rgba(255,255,255,.14);
  background: rgba(0,0,0,.18);
  color: rgba(255,255,255,.9);
  padding:10px 12px;
  border-radius:12px;
  font-weight:900;
  cursor:pointer;
}

.panel{
  margin-top:14px;
  background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.04));
  border:1px solid rgba(255,255,255,.10);
  border-radius:18px;
  padding:16px;
}
.panel-head{display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; align-items:flex-start;}
.panel-badges{display:flex; gap:8px; flex-wrap:wrap;}
h2{margin:0; font-size:18px; font-weight:950;}
.muted{color:var(--muted); font-size:13px; margin-top:6px; line-height:1.6;}

.row{display:flex; align-items:center; gap:12px; flex-wrap:wrap; margin-top:14px;}
.hint{font-size:12px; color:var(--muted);}

.btn{
  border:none;
  border-radius:14px;
  padding:11px 14px;
  font-weight:950;
  cursor:pointer;
  color: rgba(255,255,255,.95);
}
.btn:disabled{opacity:.6; cursor:not-allowed;}
.btn.primary{ background: linear-gradient(135deg, var(--violet1), var(--violet2)); }
.btn.secondary{ background: linear-gradient(135deg, var(--pink1), var(--pink2)); }
.btn.ghost{
  background: rgba(0,0,0,.18);
  border:1px solid rgba(255,255,255,.14);
}

.badge{
  display:inline-flex;
  padding:7px 10px;
  border-radius:999px;
  font-size:12px;
  font-weight:900;
  border:1px solid rgba(255,255,255,.12);
  background: rgba(255,255,255,.06);
}
.badge.neutral{ color: rgba(255,255,255,.92); }
.badge.violet{ border-color: rgba(124,58,237,.35); background: rgba(124,58,237,.14); }
.badge.pink{ border-color: rgba(236,72,153,.35); background: rgba(236,72,153,.14); }
.badge.amber{ border-color: rgba(245,158,11,.35); background: rgba(245,158,11,.14); }

.grid2{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap:12px;
  margin-top:14px;
}
@media (max-width:700px){ .grid2{grid-template-columns:1fr;} }
.field label{display:block; font-size:12px; color:var(--muted); font-weight:900; margin-bottom:6px;}
.field input{
  width:100%;
  padding:12px 12px;
  border-radius:14px;
  border:1px solid rgba(255,255,255,.14);
  background: rgba(0,0,0,.22);
  color: rgba(255,255,255,.92);
  outline:none;
}
.field input:focus{
  border-color: rgba(124,58,237,.55);
  box-shadow: 0 0 0 4px rgba(124,58,237,.18);
}
.wide-input{
  flex:1; min-width:240px;
  padding:12px 12px;
  border-radius:14px;
  border:1px solid rgba(255,255,255,.14);
  background: rgba(0,0,0,.22);
  color: rgba(255,255,255,.92);
  outline:none;
}
.wide-input:focus{
  border-color: rgba(124,58,237,.55);
  box-shadow: 0 0 0 4px rgba(124,58,237,.18);
}

.todo-list{ list-style:none; margin:14px 0 0; padding:0; display:grid; gap:10px; }
.todo{
  border-radius:16px;
  padding:12px 12px;
  border:1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.05);
}
.todo-title{ display:flex; gap:10px; align-items:flex-start; font-weight:900; }
.todo-sub{ margin-top:6px; font-size:12px; color: var(--muted); }
.dot{ width:22px; display:inline-flex; justify-content:center; }

.empty{
  margin-top:12px;
  padding:18px;
  border-radius:16px;
  border:1px dashed rgba(255,255,255,.18);
  color: rgba(255,255,255,.75);
  background: rgba(0,0,0,.18);
}

.alert{
  margin-top:12px;
  padding:12px 12px;
  border-radius:14px;
  border:1px solid rgba(255,255,255,.12);
  background: rgba(0,0,0,.24);
  font-size:13px;
}
.alert.error{ border-color: rgba(239,68,68,.35); background: rgba(239,68,68,.10); }
.alert.ok{ border-color: rgba(34,197,94,.35); background: rgba(34,197,94,.10); }

.callout{
  margin-top:14px;
  border-radius:18px;
  border:1px solid rgba(255,255,255,.10);
  background: rgba(0,0,0,.18);
  padding:14px;
}
.ol{ margin:10px 0 0; padding-left:18px; color: rgba(255,255,255,.84); }
.ol li{ margin-top:8px; line-height:1.6; }

.big{font-size:46px; font-weight:950;}
.foot{
  margin-top:16px;
  display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap;
  font-size:12px; opacity:.85;
}
` as const;

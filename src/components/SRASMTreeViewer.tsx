"use client";

import React, { useCallback, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Code,
  Zap,
} from "lucide-react";

const THEME = {
  bgPrimary: "#1E1E1E",
  bgSecondary: "#252526",
  textMain: "#D4D4D4",
  textMuted: "#808080",
  border: "#3C3C3C",
  primaryColor: "#569CD6",
  valueString: "#CE9178",
  valueNumber: "#B5CEA8",
  valueBool: "#569CD6",
  valueNullUndefined: "#569CD6",
  success: "#4CAF50",
};

type ExpandMode = "single" | "expandDeep" | "collapseDeep" | "devtools";

interface StateTreeViewerProps<T = any> {
  data: T;
  title?: string;
  description?: string;
}

interface NodeRendererProps {
  nodeKey: string;
  value: any;
  path: string;
  depth: number;
  expandedMap: Map<string, boolean>;
  onToggle: (path: string) => void;
  mode: ExpandMode;
  getDescendants: (path: string) => string[];
}

const isObjectLike = (v: any) => v !== null && typeof v === "object";

const pathJoin = (parent: string, key: string) =>
  parent ? `${parent}/${key}` : key;

const getValueDisplayProps = (value: any) => {
  if (value === null)
    return {
      display: "null",
      color: THEME.valueNullUndefined,
      fontStyle: "italic" as const,
    };
  if (value === undefined)
    return {
      display: "undefined",
      color: THEME.valueNullUndefined,
      fontStyle: "italic" as const,
    };
  if (typeof value === "boolean")
    return { display: value.toString(), color: THEME.valueBool };
  if (typeof value === "string")
    return { display: `"${value}"`, color: THEME.valueString };
  if (typeof value === "number")
    return { display: value.toString(), color: THEME.valueNumber };
  if (typeof value === "function")
    return {
      display: "[Function]",
      color: THEME.textMuted,
      fontStyle: "italic" as const,
    };
  return { display: String(value), color: THEME.textMain };
};

function collectAllPaths(obj: any, base = ""): string[] {
  if (!isObjectLike(obj)) return [];
  const entries = Array.isArray(obj)
    ? obj.map((v, i) => [String(i), v])
    : Object.entries(obj);
  return entries.flatMap(([key, val]) => [
    pathJoin(base, key),
    ...collectAllPaths(val, pathJoin(base, key)),
  ]);
}

function collectDescendantPaths(
  obj: any,
  targetPath: string,
  base = ""
): string[] {
  if (!isObjectLike(obj)) return [];
  const parts = targetPath ? targetPath.split("/") : [];
  let node: any = obj;
  for (const part of parts) {
    if (!isObjectLike(node)) return [];
    node = node[isNaN(Number(part)) ? part : Number(part)];
    if (node === undefined) return [];
  }
  return collectAllPaths(node, targetPath);
}

const NodeRenderer: React.FC<NodeRendererProps> = React.memo(
  ({
    nodeKey,
    value,
    path,
    depth,
    expandedMap,
    onToggle,
    mode,
    getDescendants,
  }) => {
    const isObject = isObjectLike(value);
    const isArray = Array.isArray(value);
    const isEmpty = isArray
      ? value.length === 0
      : Object.keys(value || {}).length === 0;
    const isExpandable = isObject && !isEmpty;
    const expanded = expandedMap.get(path) ?? false;

    const {
      display: displayValue,
      color: valueColor,
      fontStyle,
    } = useMemo(
      () =>
        !isObject || isEmpty
          ? getValueDisplayProps(value)
          : { display: "", color: "", fontStyle: undefined },
      [value, isObject, isEmpty]
    );

    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
      const txt = isObject
        ? JSON.stringify(value, null, 2)
        : String(displayValue).replace(/^"|"$/g, "");
      await navigator.clipboard.writeText(txt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    }, [value, displayValue, isObject]);

    return (
      <div
        style={{
          paddingLeft: depth + "rem",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
          color: THEME.textMain,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            minHeight: "1.85rem",
            borderLeft: `2px solid ${
              expanded ? THEME.primaryColor : "transparent"
            }`,
            paddingLeft: "0.6rem",
            gap: "0.5rem",
          }}
        >
          <div
            style={{ width: 20, cursor: isExpandable ? "pointer" : "default" }}
            onClick={() => isExpandable && onToggle(path)}
          >
            {isExpandable &&
              (expanded ? (
                <ChevronDown size={14} color={THEME.primaryColor} />
              ) : (
                <ChevronRight size={14} color={THEME.primaryColor} />
              ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ fontWeight: 700, color: THEME.primaryColor }}>
              {nodeKey}
            </div>
            <div style={{ color: THEME.textMuted }}>:</div>
            <div style={{ color: valueColor || THEME.textMain, fontStyle }}>
              {displayValue}
            </div>
            <button
              onClick={handleCopy}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: copied ? THEME.success : THEME.textMuted,
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        {isExpandable && expanded && (
          <div
            style={{
              borderLeft: `1px solid ${THEME.border}`,
              marginLeft: 12,
              paddingLeft: 8,
            }}
          >
            {(isArray ? value : Object.entries(value)).map(
              (v: any, i: number) =>
                isArray ? (
                  <NodeRenderer
                    key={i}
                    nodeKey={`[${i}]`}
                    value={v}
                    path={pathJoin(path, String(i))}
                    depth={depth + 1}
                    expandedMap={expandedMap}
                    onToggle={onToggle}
                    mode={mode}
                    getDescendants={getDescendants}
                  />
                ) : (
                  <NodeRenderer
                    key={v[0]}
                    nodeKey={v[0]}
                    value={v[1]}
                    path={pathJoin(path, v[0])}
                    depth={depth + 1}
                    expandedMap={expandedMap}
                    onToggle={onToggle}
                    mode={mode}
                    getDescendants={getDescendants}
                  />
                )
            )}
          </div>
        )}
      </div>
    );
  }
);

export default function StateTreeViewer<T = any>({
  data,
  title = "State Viewer",
  description,
}: StateTreeViewerProps<T>) {
  const [expandedMap, setExpandedMap] = useState<Map<string, boolean>>(
    new Map()
  );
  const [mode, setMode] = useState<ExpandMode>("single");

  const allPaths = useMemo(
    () => (isObjectLike(data) ? collectAllPaths(data) : []),
    [data]
  );

  const setPaths = useCallback((paths: string[], value: boolean) => {
    setExpandedMap((prev) => {
      const next = new Map(prev);
      paths.forEach((p) => next.set(p, value));
      return next;
    });
  }, []);

  const expandAll = useCallback(
    () => setPaths(allPaths, true),
    [allPaths, setPaths]
  );
  const collapseAll = useCallback(
    () => setPaths(allPaths, false),
    [allPaths, setPaths]
  );

  const onToggle = useCallback(
    (path: string) => {
      if (!allPaths.includes(path)) return;
      const descendants = collectDescendantPaths(data, path);

      setExpandedMap((prev) => {
        const next = new Map(prev);
        switch (mode) {
          case "single":
          case "devtools":
            next.set(path, !next.get(path));
            break;
          case "expandDeep":
            next.set(path, true);
            descendants.forEach((d) => next.set(d, true));
            break;
          case "collapseDeep":
            next.set(path, false);
            descendants.forEach((d) => next.set(d, false));
            break;
        }
        return next;
      });
    },
    [mode, allPaths, data]
  );

  const totalProps = useMemo(() => {
    const count = (o: any, seen = new WeakSet()): number => {
      if (!isObjectLike(o) || seen.has(o)) return 0;
      seen.add(o);
      return Object.entries(o).reduce(
        (acc, [, v]) => acc + 1 + count(v, seen),
        0
      );
    };
    return count(data);
  }, [data]);

  return (
    <div
      style={{
        background: THEME.bgSecondary,
        color: THEME.textMain,
        padding: 16,
        borderRadius: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 12,
          alignItems: "center",
          borderBottom: `1px solid ${THEME.border}`,
          paddingBottom: 10,
        }}
      >
        {" "}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {" "}
            <Code size={18} color={THEME.primaryColor} />
            <h2 style={{ margin: 0, fontSize: 18 }}>{title}</h2>{" "}
          </div>
          {description && (
            <div style={{ color: THEME.textMuted, fontSize: 12 }}>
              {description}
            </div>
          )}{" "}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={expandAll}
            style={{
              background: THEME.primaryColor,
              color: THEME.bgSecondary,
              border: "none",
              padding: "6px 10px",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
            }}
            title="Expand all nodes"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            style={{
              background: "transparent",
              border: `1px solid ${THEME.border}`,
              color: THEME.textMain,
              padding: "6px 10px",
              borderRadius: 8,
              cursor: "pointer",
            }}
            title="Collapse all nodes"
          >
            Collapse All
          </button>

          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as ExpandMode)}
            style={{
              background: THEME.bgPrimary,
              color: THEME.textMain,
              border: `1px solid ${THEME.border}`,
              padding: "6px",
              borderRadius: 8,
            }}
            title="Expansion mode"
          >
            <option value="single">A — Single Expand</option>
            <option value="expandDeep">B — Expand Deep</option>
            <option value="collapseDeep">C — Collapse Deep</option>
            <option value="devtools">D — DevTools Mode</option>
          </select>
        </div>
      </div>

      <div style={{ maxHeight: 560, overflow: "auto", paddingRight: 8 }}>
        {!isObjectLike(data) ? (
          <div style={{ color: THEME.textMuted, fontStyle: "italic" }}>
            Data is not an object/array.
          </div>
        ) : (
          Object.entries(data as Record<string, any>).map(([k, v]) => (
            <NodeRenderer
              key={k}
              nodeKey={k}
              value={v}
              path={k}
              depth={0}
              expandedMap={expandedMap}
              onToggle={onToggle}
              mode={mode}
              getDescendants={(p) => collectDescendantPaths(data, p)}
            />
          ))
        )}
      </div>

      <div
        style={{
          marginTop: 12,
          display: "flex",
          gap: 8,
          alignItems: "center",
          borderTop: `1px solid ${THEME.border}`,
          paddingTop: 10,
          color: THEME.textMuted,
        }}
      >
        <Zap size={14} />
        <div style={{ fontSize: 13 }}>Total properties:</div>
        <div style={{ fontWeight: 700, color: THEME.primaryColor }}>
          {totalProps}
        </div>
      </div>
    </div>
  );
}  
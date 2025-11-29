"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  FileJson,
  TreesIcon as TreeIcon,
  Search,
} from "lucide-react";
import TreeVisualization from "./TreeVisualization";

const THEME = {
  bgPrimary: "#0d1117",
  bgSecondary: "#161b22",
  bgHover: "#21262d",
  border: "#30363d",
  borderLight: "#444c56",
  textMain: "#c9d1d9",
  textMuted: "#8b949e",
  textDim: "#6e7681",
  keyColor: "#79c0ff",
  stringColor: "#a5d6ff",
  numberColor: "#79f0ca",
  boolColor: "#ff7b72",
  nullColor: "#d2a8ff",
  functionColor: "#ff9492",
  success: "#3fb950",
};

// Helpers
const getValueColor = (value: any) =>
  value === null
    ? THEME.nullColor
    : typeof value === "boolean"
    ? THEME.boolColor
    : typeof value === "string"
    ? THEME.stringColor
    : typeof value === "number"
    ? THEME.numberColor
    : typeof value === "function"
    ? THEME.functionColor
    : THEME.textMain;

const formatValue = (v: any) =>
  v === null
    ? "null"
    : v === undefined
    ? "undefined"
    : typeof v === "boolean"
    ? v.toString()
    : typeof v === "string"
    ? `"${v}"`
    : typeof v === "function"
    ? "[Function]"
    : v.toString();

interface TreeNodeProps {
  nodeKey: string;
  value: any;
  depth: number;
  searchTerm: string;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  nodeKey,
  value,
  depth,
  searchTerm,
}) => {
  const isObject = value && typeof value === "object";
  const isArray = Array.isArray(value);
  const isExpandable = isObject && Object.keys(value).length > 0;

  const matchesSearch =
    !searchTerm || nodeKey.toLowerCase().includes(searchTerm.toLowerCase());
  if (!matchesSearch) return null;

  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedValue, setCopiedValue] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(nodeKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 1000);
  };

  const handleCopyValue = () => {
    navigator.clipboard.writeText(
      isExpandable ? JSON.stringify(value, null, 2) : formatValue(value)
    );
    setCopiedValue(true);
    setTimeout(() => setCopiedValue(false), 1000);
  };

  return (
    <div style={{ paddingLeft: depth * 16 }} className="font-mono text-sm">
      {" "}
      <div className="flex items-center gap-1 p-1">
        <span style={{ color: THEME.keyColor }} className="font-semibold">
          {isArray ? `[${nodeKey}]` : nodeKey}{" "}
        </span>
        <button
          onClick={handleCopyKey}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: copiedKey ? THEME.success : THEME.textDim,
          }}
          title="Copy key"
        >
          {copiedKey ? (
            <Check className="w-3 h-3" />
          ) : (
            <Copy className="w-3 h-3" />
          )}{" "}
        </button>
        <span style={{ color: THEME.textDim }}>:</span>
        <span
          style={{
            color: isExpandable ? THEME.textMuted : getValueColor(value),
          }}
          className="ml-1"
        >
          {!isExpandable
            ? formatValue(value)
            : isArray
            ? `[…] ${value.length} items`
            : `{…} ${Object.keys(value).length} props`}{" "}
        </span>
        {!isExpandable && (
          <button
            onClick={handleCopyValue}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: copiedValue ? THEME.success : THEME.textDim,
              marginLeft: 4,
            }}
            title="Copy value"
          >
            {copiedValue ? (
              <Check className="w-3 h-3" />
            ) : (
              <Copy className="w-3 h-3" />
            )}{" "}
          </button>
        )}{" "}
      </div>
      {isExpandable && (
        <div style={{ borderLeft: `2px solid ${THEME.border}`, marginLeft: 8 }}>
          {isArray
            ? value.map((v: any, i: number) => (
                <TreeNode
                  key={i}
                  nodeKey={i.toString()}
                  value={v}
                  depth={depth + 1}
                  searchTerm={searchTerm}
                />
              ))
            : Object.entries(value).map(([k, v]) => (
                <TreeNode
                  key={k}
                  nodeKey={k}
                  value={v}
                  depth={depth + 1}
                  searchTerm={searchTerm}
                />
              ))}{" "}
        </div>
      )}{" "}
    </div>
  );
};

const JSONView: React.FC<{ data: any; searchTerm: string }> = ({
  data,
  searchTerm,
}) => {
  const [copied, setCopied] = useState(false);
  const jsonString = JSON.stringify(data, null, 2);
  const highlighted = searchTerm
    ? jsonString.replace(
        new RegExp(`(${searchTerm})`, "gi"),
        '<mark style="background-color: rgba(255,235,59,0.3); color: inherit;">$1</mark>'
      )
    : jsonString;

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex justify-end p-2 border-b"
        style={{ borderColor: THEME.border }}
      >
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 rounded text-sm"
          style={{
            backgroundColor: copied ? THEME.success : THEME.bgHover,
            color: "white",
          }}
        >
          {copied ? (
            <>
              {" "}
              <Check className="w-4 h-4" /> Copied!
            </>
          ) : (
            <>
              {" "}
              <Copy className="w-4 h-4" /> Copy JSON
            </>
          )}{" "}
        </button>{" "}
      </div>
      <pre
        className="flex-1 overflow-auto p-4 text-xs leading-relaxed"
        style={{ color: THEME.stringColor, backgroundColor: THEME.bgPrimary }}
      >
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />{" "}
      </pre>{" "}
    </div>
  );
};

export default function EnhancedStateViewer({
  data,
  title = "State Viewer",
  description,
}: {
  data: any;
  title?: string;
  description?: string;
}) {
  const [view, setView] = useState<"tree" | "json" | "graph">("tree");

  return (
    <div
      className="rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full"
      style={{
        backgroundColor: THEME.bgSecondary,
        color: THEME.textMain,
        border: `1px solid ${THEME.border}`,
      }}
    >
  

      {/* Tabs */}
      <div
        className="flex gap-0 border-b px-4"
        style={{ borderColor: THEME.border, backgroundColor: THEME.bgPrimary }}
      >
        {["tree", "graph", "json"].map((v) => (
          <button
            key={v}
            onClick={() => setView(v as any)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 ${
              view === v
                ? "border-blue-500"
                : "border-transparent hover:text-gray-300"
            }`}
            style={{ color: view === v ? THEME.keyColor : THEME.textMuted }}
          >
            {v === "json" ? (
              <FileJson className="w-4 h-4" />
            ) : (
              <TreeIcon className="w-4 h-4" />
            )}
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-2">
        {data && typeof data === "object" ? (
          view === "tree" ? (
            <TreeNode nodeKey="root" value={data} depth={0} searchTerm="" />
          ) : view === "graph" ? (
            <TreeVisualization data={data} expandAll={true} />
          ) : (
            <JSONView data={data} searchTerm="" />
          )
        ) : (
          <div className="text-center p-4" style={{ color: THEME.textMuted }}>
            Data is not an object
          </div>
        )}
      </div>
    </div>
  );
}

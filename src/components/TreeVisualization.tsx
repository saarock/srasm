import React, { useEffect, useMemo, useState } from "react";

import "rc-tree/assets/index.css";
import { Tree as D3Tree, type TreeNodeDatum } from "react-d3-tree";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Inspector } from "./Inspector";
import { Sidebar } from "./SideBar";
import { CustomNode } from "./CustomNode";
import type { RcTreeNode, TreeExplorerProps } from "../types";

// ---------- Helper Functions ----------
const isObjectLike = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === "object";

const typePreview = (v: unknown): string => {
  if (v === null) return "null";
  if (v === undefined) return "undefined";
  if (Array.isArray(v)) return `Array(${v.length})`;
  if (isObjectLike(v)) return `Object(${Object.keys(v).length})`;
  if (typeof v === "string")
    return `"${v.slice(0, 20)}${v.length > 20 ? "…" : ""}"`;
  return String(v);
};

const toRcTreeData = (obj: unknown, path: string = ""): RcTreeNode[] => {
  if (obj === null || obj === undefined) return [];
  if (Array.isArray(obj)) {
    return obj.map((v, i) => ({
      key: `${path}[${i}]`,
      title: `[${i}] ${typePreview(v)}`,
      data: v,
      children:
        isObjectLike(v) || Array.isArray(v)
          ? toRcTreeData(v, `${path}[${i}]`)
          : [],
    }));
  }
  if (isObjectLike(obj)) {
    return Object.entries(obj).map(([k, v]) => ({
      key: path ? `${path}.${k}` : k,
      title: `${k}: ${isObjectLike(v) || Array.isArray(v) ? typePreview(v) : JSON.stringify(v)
        }`,
      data: v,
      children:
        isObjectLike(v) || Array.isArray(v)
          ? toRcTreeData(v, path ? `${path}.${k}` : k)
          : [],
    }));
  }
  return [];
};

const toD3Tree = (obj: unknown, name = "root"): TreeNodeDatum => {
  const node = {
    name,
    attributes: {},
    children: [],
  } as unknown as TreeNodeDatum;
  if (!isObjectLike(obj)) {
    node.attributes = { value: obj as string | number | boolean };
    return node;
  }
  if (Array.isArray(obj)) {
    node.name = `${name} [Array:${obj.length}]`;
    node.children = obj.map((v, i) => toD3Tree(v, `[${i}]`));
    return node;
  }

  // @ts-ignore
  node.children = Object.entries(obj).map(([k, v]) =>
    isObjectLike(v) || Array.isArray(v)
      ? toD3Tree(v, k)
      : { name: `${k}: ${v}`, attributes: {}, children: [] }
  );
  return node;
};

// ---------- Main Component ----------
const TreeExplorer: React.FC<TreeExplorerProps> = ({ data, height = 700 }) => {
  const rcData = useMemo(() => toRcTreeData(data), [data]);
  const d3Data = useMemo(() => [toD3Tree(data)], [data]);


  const [selected, setSelected] = useState<RcTreeNode | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => setExpandedKeys(rcData.map((n) => n.key)), [rcData]);

  const onSelect = (_selectedKeys: React.Key[], info: any) => {
    if (info.node) setSelected(info.node as RcTreeNode);
  };

  const onExpand = (keys: React.Key[]) => setExpandedKeys(keys);

  const expandAll = () => {
    const collect = (nodes: RcTreeNode[]): React.Key[] =>
      nodes.flatMap((n) => [n.key, ...(n.children ? collect(n.children) : [])]);
    setExpandedKeys(collect(rcData));
  };
  const collapseAll = () => setExpandedKeys([]);

  const filtered = useMemo(() => {
    if (!search.trim()) return rcData;
    const q = search.toLowerCase();
    const walk = (nodes: RcTreeNode[]): RcTreeNode[] =>
      nodes
        .map((n) => ({ ...n, children: n.children ? walk(n.children) : [] }))
        .filter(
          (n) =>
            n.title.toLowerCase().includes(q) ||
            (n.children && n.children.length > 0)
        );
    return walk(rcData);
  }, [rcData, search]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6 md:p-10">
      <h1 className="text-3xl mb-6">
        🌳 <span className="text-[#00E6E6]">SRASM</span>: Data Structure
        Explorer
      </h1>

      <div className="flex gap-4">
        {/* Sidebar toggle */}
        <button
          className="mb-2 px-3 py-1 rounded-xl bg-[#00E6E6] text-[#001F1F] flex items-center justify-center"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <ChevronLeft size={50} /> : <ChevronRight size={50} />}
        </button>
        <div className="flex w-full gap-4">
          {/* Sidebar */}
          {sidebarOpen && (
            <div className="flex-[0_0_300px]">
              <Sidebar
                treeData={filtered}
                expandedKeys={expandedKeys}
                onExpand={onExpand}
                onSelect={onSelect}
                search={search}
                setSearch={setSearch}
                expandAll={expandAll}
                collapseAll={collapseAll}
              />
            </div>
          )}

          {/* D3 Graph Viewer */}
          <div
            className="flex-1 rounded-xl overflow-hidden  bg-[#1D1D1D] text-white border border-[#2A2A2A] focus:border-[#00E6E6] focus:ring-1 focus:ring-[#00E6E6] transition-all duration-300 shadow-xl shadow-[#00000050]"
            style={{ height }}
          >
            <D3Tree
              data={d3Data as unknown as TreeNodeDatum[]}
              collapsible
              renderCustomNodeElement={CustomNode}
              nodeSize={{ x: 200, y: 100 }}
              zoomable
              draggable={true}
              orientation="vertical"
            />
          </div>

          {/* Inspector */}
          {sidebarOpen && <Inspector selected={selected} />}
        </div>
      </div>
    </div>
  );
};

export default TreeExplorer;

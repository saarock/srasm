"use client";

import type React from "react";
import { useMemo, useState, useEffect, useCallback } from "react";

const THEME = {
  bgPrimary: "#0d1117",
  bgSecondary: "#161b22",
  border: "#30363d",
  textMain: "#c9d1d9",
  textMuted: "#8b949e",
  keyColor: "#79c0ff",
  stringColor: "#a5d6ff",
  numberColor: "#79f0ca",
  boolColor: "#ff7b72",
  nullColor: "#d2a8ff",
  nodeColor: "#79c0ff",
  nodeBg: "#1f6feb",
nodeActive: "#3B82F6", // vibrant blue for active node
  success: "#3fb950",
};

interface TreeNodeData {
  key: string;
  value: any;
  depth: number;
  position: { x: number; y: number };
  children: TreeNodeData[];
}

interface TreeVisualizationProps {
  data: any;
  expandAll: boolean;
}

const getValueColor = (value: any): string => {
  if (value === null || value === undefined) return THEME.nullColor;
  if (typeof value === "boolean") return THEME.boolColor;
  if (typeof value === "string") return THEME.stringColor;
  if (typeof value === "number") return THEME.numberColor;
  return THEME.textMain;
};

const formatNodeValue = (value: any, maxLength = 18): string => {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "string") return value.length > maxLength ? value.slice(0, maxLength) + "…" : value;
  if (typeof value === "number") return value.toString();
  if (Array.isArray(value)) return `[${value.length}]`;
  if (typeof value === "object") return `{${Object.keys(value).length}}`;
  return String(value);
};

// ✅ FIXED VERSION
const buildTreeData = (data: any, depth = 0, maxDepth = 3): TreeNodeData | null => {
  if (depth > maxDepth) return null;

  const isArray = Array.isArray(data);
  const entries = isArray ? data.map((v, i) => [i.toString(), v]) : Object.entries(data);

  const children: TreeNodeData[] = [];

  for (const [key, value] of entries) {
    let childNode: TreeNodeData;

    if (value !== null && typeof value === "object" && depth < maxDepth) {
      // Build full object child
      const childTree = buildTreeData(value, depth + 1, maxDepth);

      childNode = {
        key,
        value,
        depth: depth + 1,
        position: { x: 0, y: 0 },
        children: childTree ? childTree.children : [],
      };
    } else {
      // Primitive child
      childNode = {
        key,
        value,
        depth: depth + 1,
        position: { x: 0, y: 0 },
        children: [],
      };
    }

    children.push(childNode);
  }

  return {
    key: "[root]",
    value: data,
    depth,
    position: { x: 0, y: 0 },
    children,
  };
};


const calculatePositions = (
  node: TreeNodeData | null,
  x: number,
  y: number,
  horizontalSpacing = 240,
  verticalSpacing = 160,
): TreeNodeData | null => {
  if (!node) return null;

  node.position = { x, y };

  if (node.children.length === 0) return node;

  const totalWidth = node.children.length * horizontalSpacing;
  const startX = x - totalWidth / 2 + horizontalSpacing / 2;

  for (let i = 0; i < node.children.length; i++) {
    calculatePositions(
      node.children[i],
      startX + i * horizontalSpacing,
      y + verticalSpacing,
      horizontalSpacing,
      verticalSpacing
    );
  }

  return node;
};

const TreeVisualization: React.FC<TreeVisualizationProps> = ({ data, expandAll }) => {
  const [expandedNodes, setExpandedNodes] = useState<Map<string, boolean>>(new Map());

  useEffect(() => {
    const nodeMap = new Map<string, boolean>();

    const traverse = (node: TreeNodeData, path = ""): void => {
      const nodePath = path ? `${path}/${node.key}` : node.key;
      nodeMap.set(nodePath, expandAll);

      for (const child of node.children) {
        traverse(child, nodePath);
      }
    };

    const tree = buildTreeData(data);
    if (tree) {
      nodeMap.set("[root]", true);
      traverse(tree);
    }

    setExpandedNodes(nodeMap);
  }, [expandAll, data]);

  const treeData = useMemo(() => {
    const tree = buildTreeData(data);
    if (!tree) return null;
    return calculatePositions(tree, 550, 80);
  }, [data]);

  const toggleNode = useCallback((nodePath: string) => {
    setExpandedNodes((prev) => {
      const newMap = new Map(prev);
      newMap.set(nodePath, !newMap.get(nodePath));
      return newMap;
    });
  }, []);

  const bounds = useMemo(() => {
    if (!treeData) return { minX: 0, maxX: 1000, minY: 0, maxY: 800, width: 1000, height: 800 };

    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;

    const traverse = (node: TreeNodeData, path = ""): void => {
      const nodePath = path ? `${path}/${node.key}` : node.key;
      const isExpanded = expandedNodes.get(nodePath) ?? false;

      minX = Math.min(minX, node.position.x - 60);
      maxX = Math.max(maxX, node.position.x + 60);
      minY = Math.min(minY, node.position.y - 40);
      maxY = Math.max(maxY, node.position.y + 40);

      if (isExpanded && node.children.length > 0) {
        for (const child of node.children) traverse(child, nodePath);
      }
    };

    traverse(treeData);
    return { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY };
  }, [treeData, expandedNodes]);

  if (!treeData) {
    return (
      <div className="flex items-center justify-center h-96" style={{ color: THEME.textMuted }}>
        No tree data available
      </div>
    );
  }

  const padding = 100;
  const svgWidth = Math.max(bounds.width + padding * 2, 1000);
  const svgHeight = Math.max(bounds.height + padding * 2, 800);

  const renderConnections = (node: TreeNodeData, path = ""): React.ReactNode[] => {
    const lines: React.ReactNode[] = [];
    const nodePath = path ? `${path}/${node.key}` : node.key;
    const isExpanded = expandedNodes.get(nodePath) ?? false;

    if (!isExpanded || node.children.length === 0) return lines;

    for (const child of node.children) {
      const x1 = node.position.x - bounds.minX + padding;
      const y1 = node.position.y - bounds.minY + padding;
      const x2 = child.position.x - bounds.minX + padding;
      const y2 = child.position.y - bounds.minY + padding;

      const midY = (y1 + y2) / 2;
      const pathData = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;

      lines.push(
        <path
          key={`line-${nodePath}/${child.key}`}
          d={pathData}
          fill="none"
          stroke={THEME.border}
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.7"
        />
      );

      lines.push(...renderConnections(child, nodePath));
    }

    return lines;
  };

  const renderNodes = (node: TreeNodeData, path = ""): React.ReactNode[] => {
    const elements: React.ReactNode[] = [];
    const x = node.position.x - bounds.minX + padding;
    const y = node.position.y - bounds.minY + padding;
    const nodeRadius = 55;

    const displayText = formatNodeValue(node.value);
    const hasChildren = node.children.length > 0;

    const nodePath = path ? `${path}/${node.key}` : node.key;
    const isNodeExpanded = expandedNodes.get(nodePath) ?? false;

    elements.push(
      <g
        key={`node-group-${nodePath}`}
        // Of now this is off
        // onClick={() => hasChildren && toggleNode(nodePath)}
        // style={{ cursor: hasChildren ? "pointer" : "default" }}
      >
        <defs>
          <radialGradient id={`gradient-${nodePath}`} cx="30%" cy="30%">
            <stop offset="0%" style={{ stopColor: isNodeExpanded ? "#5a9cff" : "#3b82f6", stopOpacity: 0.5 }} />
            <stop
              offset="100%"
              style={{ stopColor: isNodeExpanded ? THEME.nodeActive : THEME.nodeBg, stopOpacity: 1 }}
            />
          </radialGradient>
        </defs>

        <circle
          cx={x}
          cy={y}
          r={nodeRadius}
          fill={`url(#gradient-${nodePath})`}
          stroke={isNodeExpanded ? "#5a9cff" : THEME.keyColor}
          strokeWidth="3"
          style={{
            filter: isNodeExpanded
              ? "drop-shadow(0 8px 20px rgba(90, 156, 255, 0.5))"
              : "drop-shadow(0 4px 12px rgba(121, 192, 255, 0.35))",
            transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />

        {hasChildren && (
          <circle
            cx={x + nodeRadius - 10}
            cy={y - nodeRadius + 10}
            r="7"
            fill={isNodeExpanded ? THEME.success : "#ff9492"}
            stroke="white"
            strokeWidth="1.5"
            style={{ transition: "all 0.3s ease" }}
          />
        )}

        {node.key !== "[root]" && (
          <text
            x={x}
            y={y - nodeRadius - 22}
            textAnchor="middle"
            fill={THEME.keyColor}
            fontSize="12"
            fontWeight="700"
            fontFamily="'Fira Code', monospace"
            style={{ pointerEvents: "none", userSelect: "none" }}
          >
            {node.key}
          </text>
        )}

        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={getValueColor(node.value)}
          fontSize="13"
          fontWeight="700"
          fontFamily="'Fira Code', monospace"
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          {displayText}
        </text>

        {isNodeExpanded && node.children.map((child) => renderNodes(child, nodePath))}
      </g>
    );

    return elements;
  };

  return (
    <div className="overflow-auto p-6 bg-center" style={{ backgroundColor: THEME.bgPrimary, height: "700px" }}>
      <svg
        width={svgWidth}
        height={svgHeight}
        style={{
          margin: "0 auto",
          display: "block",
          backgroundColor: THEME.bgSecondary,
          borderRadius: "16px",
          border: `2px solid ${THEME.border}`,
          cursor: "default",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
        }}
      >
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={THEME.border} strokeWidth="0.8" opacity="0.08" />
          </pattern>
        </defs>

        <rect width={svgWidth} height={svgHeight} fill="url(#grid)" />

        {renderConnections(treeData)}
        {renderNodes(treeData)}
      </svg>
    </div>
  );
};

export default TreeVisualization;

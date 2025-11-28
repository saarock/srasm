"use client"

import React, { useState, useMemo, useEffect } from "react"
import { ChevronDown, ChevronRight, Copy, Check, Code, Zap } from "lucide-react"

// --- THEME CONFIGURATION: DARK MODE (DevTools Inspired) ---
const THEME = {
  bgPrimary: "#1E1E1E", // Main background
  bgSecondary: "#252526", // Header/Footer background, subtle row hover
  textMain: "#D4D4D4", // Light gray for primary text
  textMuted: "#808080", // Darker gray for summaries/metadata
  border: "#3C3C3C", // Subtle borders
  // Primary (Indigo) for keys/buttons
  primaryColor: "#569CD6", // Light Blue (Like VS Code variable names)
  // Data Type Colors
  valueString: "#CE9178", // Orange-Brown (VS Code string)
  valueNumber: "#B5CEA8", // Light Green (VS Code number/boolean)
  valueBool: "#569CD6", // Same as primary for consistency
  valueNullUndefined: "#569CD6", // Light Blue for null/undefined
  success: "#4CAF50", // Green for copy success
}

interface TreeNodeProps {
  nodeKey: string
  value: any
  depth: number
  expandAll: boolean
}

interface StateTreeViewerProps<T> {
  data: T
  title?: string
  description?: string
}

// Helper to determine the type and color for simple values
const getValueDisplayProps = (value: any) => {
  if (value === null) return { display: "null", color: THEME.valueNullUndefined, fontStyle: "italic" }
  if (value === undefined) return { display: "undefined", color: THEME.valueNullUndefined, fontStyle: "italic" }
  if (typeof value === "boolean") return { display: value ? "true" : "false", color: THEME.valueBool }
  if (typeof value === "string") return { display: `"${value}"`, color: THEME.valueString }
  if (typeof value === "number") return { display: value.toString(), color: THEME.valueNumber }
  if (typeof value === "function") return { display: "[Function]", color: THEME.textMuted, fontStyle: "italic" }
  
  return { display: String(value), color: THEME.textMain }
}

const TreeNode: React.FC<TreeNodeProps> = ({ nodeKey, value, depth, expandAll }) => {
  const [isExpanded, setIsExpanded] = useState(expandAll || depth < 2)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setIsExpanded(expandAll)
  }, [expandAll])

  const isObject = value !== null && typeof value === "object"
  const isArray = Array.isArray(value)
  const isEmpty = isArray ? value.length === 0 : Object.keys(value || {}).length === 0
  const isExpandable = isObject && !isEmpty

  const { display: displayValue, color: valueColor, fontStyle: valueFontStyle } = useMemo(() => {
    if (!isObject || isEmpty) {
      return getValueDisplayProps(value)
    }
    return { display: "", color: "", fontStyle: "" }
  }, [value, isObject, isEmpty])

  const handleCopy = () => {
    // Copy the raw stringified value for objects/arrays, or the cleaned simple value.
    const copyText = isObject ? JSON.stringify(value, null, 2) : String(displayValue).replace(/"/g, '')
    navigator.clipboard.writeText(copyText)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const paddingLeft = depth * 1

  return (
    <div 
        className={`transition-colors duration-100 ease-in-out font-mono text-sm group ${copied ? 'bg-green-900/20' : ''}`} // Subtle green flash on copy
        style={{ paddingLeft: `${paddingLeft}rem` }}
    >
      <div 
        className="flex items-center min-h-[1.85rem] py-0.5 relative cursor-default" 
        style={{ borderLeft: `2px solid ${isExpandable && isExpanded ? THEME.primaryColor : 'transparent'}` }}
      >
        
        {/* Indentation Line */}
        {depth > 0 && (
            <div 
                className="absolute top-0 bottom-0 w-[1px] opacity-20" 
                style={{ left: '-0.5rem', backgroundColor: THEME.border }}
            />
        )}

        {/* Toggle Button */}
        <div className="flex items-center w-5 h-5 mr-1" onClick={() => isExpandable && setIsExpanded(!isExpanded)}>
          {isExpandable ? (
            <button
                className="p-0.5 transition-transform hover:opacity-100 opacity-70"
                style={{ color: THEME.primaryColor }}
                title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          ) : (
            <div className="w-4 h-4 ml-0.5" /> // Spacer
          )}
        </div>

        {/* Key Label */}
        <span 
            className="font-bold mr-1 py-0.5" 
            style={{ color: THEME.primaryColor }}
        >
            {nodeKey}
        </span>
        <span className="text-gray-500 mr-2">:</span>

        {/* Value Display and Copy Button (Always Visible) */}
        <div className="flex items-center gap-2">
            {!isObject || isEmpty ? (
                <span 
                    className="py-0.5" 
                    style={{ color: valueColor, fontStyle: valueFontStyle }}
                >
                    {displayValue}
                </span>
            ) : (
                /* Complex Object/Array Summary */
                <span className="text-sm font-normal italic" style={{ color: THEME.textMuted }}>
                    {isArray ? `[...] (${value.length})` : `{...} (${Object.keys(value).length})`}
                </span>
            )}
            
            <button 
                onClick={handleCopy} 
                title={isObject ? "Copy full JSON object" : "Copy value"} 
                className={`p-0.5 rounded transition-opacity duration-300 ${copied ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}
                style={{ color: copied ? THEME.success : THEME.textMuted }}
            >
              {copied ? (
                <Check className={`w-3 h-3`} />
              ) : (
                <Copy className={`w-3 h-3 hover:text-white`} />
              )}
            </button>
        </div>
      </div>

      {/* Children Nodes */}
      {isExpandable && isExpanded && (
        <div 
            className="border-l ml-[0.5rem] pl-[0.5rem]" 
            style={{ borderColor: THEME.border }}
        >
          {isArray
            ? value.map((item: any, index: number) => (
                <TreeNode 
                    key={index} 
                    nodeKey={`[${index}]`} 
                    value={item} 
                    depth={depth + 1} 
                    expandAll={expandAll} 
                />
              ))
            : Object.entries(value).map(([key, val]) => (
                <TreeNode 
                    key={key} 
                    nodeKey={key} 
                    value={val} 
                    depth={depth + 1} 
                    expandAll={expandAll} 
                />
              ))}
        </div>
      )}
    </div>
  )
}

// ... (StateTreeViewer Component remains the same as before, only TreeNode changed) ...

export default function StateTreeViewer<T>({ data, title = "State Viewer", description }: StateTreeViewerProps<T>) {
  const [expandAll, setExpandAll] = useState(false)

  const stats = useMemo(() => {
    const count = (obj: any, visited = new WeakSet()): number => {
      if (obj === null || typeof obj !== "object") return 0
      if (visited.has(obj)) return 0
      visited.add(obj)
      
      return Object.entries(obj).reduce((acc, [_, value]) => {
        return acc + 1 + (value !== null && typeof value === "object" ? count(value, visited) : 0)
      }, 0)
    }
    
    if (data === null || typeof data !== "object") return 0
    return Object.keys(data).reduce((acc, key) => {
        const value = (data as Record<string, any>)[key];
        return acc + 1 + (value !== null && typeof value === "object" ? count(value, new WeakSet()) : 0)
    }, 0);
  }, [data])

  return (
    <div 
      className="rounded-xl p-4 shadow-2xl overflow-hidden" 
      style={{ backgroundColor: THEME.bgSecondary, color: THEME.textMain }}
    >
      {/* Header and Controls */}
      <div 
        className="flex justify-between items-center px-2 pt-1 pb-3 mb-3 border-b" 
        style={{ borderColor: THEME.border }}
      >
        <div>
          <h2 className="font-extrabold text-xl mb-1 flex items-center gap-2" style={{ color: THEME.textMain }}>
              <Code className="w-6 h-6" style={{ color: THEME.primaryColor }} />
              {title}
          </h2>
          {description && (
            <p className="text-xs italic" style={{ color: THEME.textMuted }}>{description}</p>
          )}
        </div>
        <button
          onClick={() => setExpandAll(!expandAll)}
          className="px-4 py-1.5 rounded-full font-semibold text-xs transition-all duration-200 shadow-lg hover:brightness-125"
          style={{ 
            backgroundColor: THEME.primaryColor, 
            color: THEME.bgSecondary,
          }}
        >
          {expandAll ? "Collapse All" : "Expand All"}
        </button>
      </div>

      {/* Tree Content */}
      <div className="space-y-0.5 px-2">
        {data === null || typeof data !== "object" ? (
             <p className="text-sm italic p-2" style={{ color: THEME.textMuted }}>Data is not an object or array.</p>
        ) : (
            Object.entries(data as Record<string, any>).map(([key, value]) => (
                <TreeNode 
                    key={key} 
                    nodeKey={key} 
                    value={value} 
                    depth={0} 
                    expandAll={expandAll} 
                />
            ))
        )}
      </div>
      
      {/* Footer Stats */}
      <div 
        className="mt-4 pt-3 px-2 text-xs font-medium border-t flex items-center gap-1" 
        style={{ borderColor: THEME.border, color: THEME.textMuted }}
      >
        <Zap className="w-3 h-3" />
        <p>Total Properties:</p> 
        <span className="font-extrabold" style={{ color: THEME.primaryColor }}>{stats}</span>
      </div>
    </div>
  )
}
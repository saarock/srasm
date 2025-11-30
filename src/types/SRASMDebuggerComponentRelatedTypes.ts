// ---------- Sidebar Component ----------
export interface SidebarProps {
  treeData: RcTreeNode[];
  expandedKeys: React.Key[];
  onExpand: (keys: React.Key[]) => void;
  onSelect: (keys: React.Key[], info: any) => void;
  search: string;
  setSearch: (s: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
}

// ---------- Inspector Component ----------
export interface InspectorProps {
  selected: RcTreeNode | null;
}

// ---------- Types ----------
export interface RcTreeNode {
  key: string;
  title: string;
  data: unknown;
  children?: RcTreeNode[];
}

export interface TreeExplorerProps {
  data: unknown;
  height?: number;
}

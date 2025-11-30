import Tree from "rc-tree";
import type { SidebarProps } from "../types";
export const Sidebar: React.FC<SidebarProps> = ({
  treeData,
  expandedKeys,
  onExpand,
  onSelect,
  search,
  setSearch,
  expandAll,
  collapseAll,
}) => (
  <div className="flex flex-col gap-6 h-full">
    <input
      placeholder="Search keys/values..."
      className="w-full px-4 py-3 rounded-xl bg-[#1D1D1D] text-white border border-[#2A2A2A] focus:border-[#00E6E6] focus:ring-1 focus:ring-[#00E6E6] transition-all duration-300 shadow-xl shadow-[#00000050]"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <div className="flex gap-2">
      <button
        onClick={expandAll}
        className="flex-1 px-3 py-2 rounded-xl bg-[#00E6E6] text-[#001F1F] font-semibold hover:bg-[#00CCCC] transition-colors shadow-lg shadow-[#00E6E640]"
      >
        Expand All              
      </button>
      <button
        onClick={collapseAll}
        className="flex-1 px-3 py-2 rounded-xl border border-[#2A2A2A] text-[#E0E0E0] hover:bg-[#1A1A1A] transition-colors shadow-lg shadow-[#00000050]"
      >
        Collapse All
      </button>
    </div>
    <div className="flex-1 overflow-auto bg-[#181818] rounded-2xl p-4 border border-[#2A2A2A] shadow-2xl shadow-[#00000080]">
      <h3 className="text-lg font-bold text-[#E0E0E0] mb-3 border-b border-[#2A2A2A] pb-2">
        Hierarchy View
      </h3>
      <Tree
        treeData={treeData}
        selectable
        expandedKeys={expandedKeys}
        onExpand={onExpand}
        onSelect={onSelect}
        showIcon={false}
        virtual={false}
        showLine
        style={{ background: "transparent", color: "#F0F0F0" }}
      />
    </div>
  </div>
);

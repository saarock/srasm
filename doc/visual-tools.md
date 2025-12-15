# Visual Tools

SRASM includes powerful visual tools to help you understand and debug your application's state structure and flow.

## 1. State Tree Visualization

The Tree Visualization tool provides a graphical representation of your entire state store. It helps you see how different slices are related and inspect their current values.

### Installation

To enable the tree visualizer, simply add the `TreeWrapper` component to a route in your application (e.g., `/tree`).

```tsx
import TreeWrapper from './components/TreeVisualization/TreeWrapper';
import { Route, Routes } from 'react-router-dom';

<Routes>
  {/* ... other routes ... */}
  
  {/* Visual Debugger Route */}
  <Route path="/tree" element={<TreeWrapper />} />
</Routes>
```

### Features
- **Visual Hierarchy**: See your slices (e.g., `blog`, `auth`, `theme`) as nodes in a graph.
- **Zoom & Pan**: Easily navigate large state trees.
- **Node Inspection**: Click on any node to view its detailed properties and values.

---

## 2. Real-Time Slice Debugger

For immediate feedback during development, SRASM provides the `SRASMRealTimeSliceSplitDebugger`. This component sits in your app root and gives you a live view of your code and state slices.

### Usage

Render it inside your `SRASMProvider`, preferably at the root level (like `main.tsx`).

```tsx
import { SRASMRealTimeSliceSplitDebugger } from "./components";
import storeCode from "./srsm/index.ts?raw"; // Import code as raw string

<SRASMProvider>
  <App />
  
  <SRASMRealTimeSliceSplitDebugger
    files={[
      { filePath: "src/store.ts", codes: storeCode }
    ]}
  />
</SRASMProvider>
```

This tool is invaluable for:
- Watching state changes in real-time.
- verifying that your code logic aligns with the actual state updates.

import { initialState, type BlogState } from "../srsm";
import { useReadGlobalState } from "../hooks";
import { TreeExplorer } from "../components";

const SRASMTreePag = () => {
  const state = useReadGlobalState<BlogState>(initialState);
  return (
    <div>
      <TreeExplorer data={state} />
    </div>
  );
};

export default SRASMTreePag;

import { initialState, type MyState } from "../srsm";
import useReadGlobalState from "../hooks";
import { SRASMTreeDisplayComponent } from "../components";

const SRASMTreePag = () => {
  const state = useReadGlobalState<MyState>(initialState);
  return (
    <div>
      <SRASMTreeDisplayComponent state={state} />
    </div>
  );
};

export default SRASMTreePag;

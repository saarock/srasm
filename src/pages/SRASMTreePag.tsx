import { initialState, type MyState } from "../srsm/userState";
import useReadGlobalState from "../hooks/useReadGlobalState";
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

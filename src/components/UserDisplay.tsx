import React from "react";
import useReadGlobalState from "../hooks/useReadGlobalState";
import { initialState, type MyState } from "../srsm/userState";
import SRASMTreeViewer from "./SRASMTreeViewer";

const UserDisplay: React.FC = () => {
  const state = useReadGlobalState<MyState>(initialState);
  // console.log(state);
  return (
    <div>
      <SRASMTreeViewer data={state} />
    </div>
  );
};

export default UserDisplay;

import React from "react";
import SRASMTreeDisplayComponent from "../components/SRASMTreeDisplayComponent";
import { initialState, type MyState } from "../srsm/userState";
import useReadGlobalState from "../hooks/useReadGlobalState";


const SRASMTreePag = () => {
    const state = useReadGlobalState<MyState>(initialState);
  return <div>

    <SRASMTreeDisplayComponent state={state}/>
  </div>;
};

export default SRASMTreePag;

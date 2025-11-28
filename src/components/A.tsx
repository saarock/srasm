import React from "react";
import { useSRASM } from "../srsm/StateSore";
import SRASMTree from "./SRASMTree";

const A = () => {
  console.log("yes");
  
  // const { state: globalState, setState } = useSRASM("SRSM_GLOBAL");

  return (
    <div>
      {/* Pass the current state to the tree component */}
      {/* <SRASMTree  /> */}
    </div>
  );
};

export default React.memo(A);
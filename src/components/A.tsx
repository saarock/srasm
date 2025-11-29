import React, { useEffect } from "react";
import { useSRASM } from "../srsm/StateSore";
import SRASMTree from "./SRASMTree";

const A = () => {
  console.log("yes");

  const { state } = useSRASM("App");

  // useEffect(() => {
  //   alert("state change");
  // }, [state]);

  // const { state: globalState, setState } = useSRASM("SRSM_GLOBAL");

  return (
    <div>
      {/* Pass the current state to the tree component */}
      {/* <SRASMTree  /> */}
      <p>{JSON.stringify(state, null, 2)}</p>
    </div>
  );
};

export default React.memo(A);

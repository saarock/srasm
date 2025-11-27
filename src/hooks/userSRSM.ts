// Srasm.tsx

import { useContext } from "react";
import { StateContext } from "../srsm/StateSore";

const useSRSM = () => {
  const { setStates, state } = useContext(StateContext);

  return { setBySrasm: setStates, state: state };
};

export default useSRSM;

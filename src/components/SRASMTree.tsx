import React from "react";
import { useMultipleState } from "../hooks/userMultipleState";



interface SRASMTreeProps {
  data: any[]; // or more specific type
}


const SRASMTree: React.FC<SRASMTreeProps> = ({ data }) => {
    const state = useMultipleState<any>(data);
    return <div>{JSON.stringify(state)}: yes</div>;
};


export default SRASMTree
import React from "react";
import useSRSM from "../hooks/userSRSM";

const A = () => {
  const { state, setBySrasm } = useSRSM();

  console.log("Component A rendered", state); // ✅ This logs every render

  return (
    <div>
      <button
        onClick={() =>
          setBySrasm({
            isAuthenticated: true,
          })
        }
      >Make true</button>
    </div>
  );
};

export default React.memo(A);

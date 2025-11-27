// App.tsx (main app component)
import { useEffect } from "react";
import useSRSM from "./hooks/userSRSM";

const App = () => {
  const { state, setBySrasm } = useSRSM();

  


  useEffect(() => {
    console.log(state);
  }, [state]);

  useEffect(() => {
    console.log(state);
  }, [state]);

  return (
    <>
      <button
        onClick={() =>
          setBySrasm({
            App: {
              number: 10,
              j: 23,
            },
          })
        }
      >
        Click
      </button>

      <button
        onClick={() =>
          setBySrasm({
            count: 12,
          })
        }
      >
        Click again
      </button>

      {/* Optional: Display state */}
      <p>{JSON.stringify(state.App?.j)}</p>
    </>
  );
};

export default App;

import { useSRASM } from "../../srsm";

const UserUpdater = () => {
  const { state } = useSRASM("blog");

  if (!state) {
    return <div className="p-4 text-white">Loading Blog State...</div>;
  }

  return (
    <div className="p-4 bg-[#1a1a1a] text-white rounded-lg border border-[#333]">
      <h3 className="text-lg font-bold mb-2">Blog State Monitor</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-[#888]">Posts:</span> {state.posts?.length ?? 0}
        </div>
        <div>
          <span className="text-[#888]">Categories:</span> {state.categories?.length ?? 0}
        </div>
      </div>
      <pre className="mt-4 p-2 bg-black rounded text-xs text-gray-400 overflow-auto max-h-40">
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );
};

export default UserUpdater;
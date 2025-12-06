
import {
  type CustomNodeElementProps,
} from "react-d3-tree";
// ---------- Custom D3 Node ----------
export const CustomNode: React.FC<CustomNodeElementProps> = ({
  nodeDatum,
  toggleNode,
}) => {
  const isRoot = nodeDatum.name === "root";
  return (
    <g onClick={toggleNode}>
      <rect
        width="150"
        height="30"
        x="-75"
        y="-15"
        rx="8"
        ry="8"
        fill="#282828"
        stroke="#00FFFF"
        strokeWidth={2.5}
        style={{
          cursor: "pointer",
          filter: "drop-shadow(0 0 5px rgba(0, 240, 240, 0.4))",
        }}
      />{" "}
      <foreignObject x="-70" y="-12" width="140" height="30">
        <div
          style={{
            textAlign: "center",
            color: isRoot ? "#FFFFFF" : "#E0E0E0",
            fontSize: "12px",
            fontWeight: isRoot ? "bold" : "normal",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            padding: "2px",
          }}
          title={nodeDatum.name}
        >
          {nodeDatum.name}{" "}
        </div>{" "}
      </foreignObject>
      {nodeDatum.children && nodeDatum.children.length > 0 && (
        <circle
          r={6}
          fill="#00FFFF"
          stroke="#0A0A0A"
          strokeWidth={2}
          transform={`translate(0, 20)`}
        />
      )}{" "}
    </g>
  );
};

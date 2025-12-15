import React from "react";

interface SRASMMemoProps {
  children: React.ReactNode;
}

const SRASMMemo: React.FC<SRASMMemoProps> = ({ children }) => {
  return <>{children}</>;
};

export default React.memo(SRASMMemo);

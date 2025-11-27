export type StateContextType = {
  state: Record<string, any>;
  setStates: React.Dispatch<React.SetStateAction<Record<string, any>>>;
};

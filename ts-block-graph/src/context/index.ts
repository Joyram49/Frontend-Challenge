import { createContext } from "react";
import { DivInfo } from "../types";

const DivInfoContext = createContext<{
  divsInfo: DivInfo[];
  setDivsInfo: React.Dispatch<React.SetStateAction<DivInfo[]>>;
}>({
  divsInfo: [],
  setDivsInfo: () => {},
});

export { DivInfoContext };

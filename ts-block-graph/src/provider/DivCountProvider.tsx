import { ReactNode, useEffect, useState } from "react";
import { DivInfoContext } from "../context";
import { DivInfo } from "../types";

interface DivCountProviderProps {
  children: ReactNode;
}

function DivCountProvider({ children }: DivCountProviderProps) {
  const [divsInfo, setDivsInfo] = useState<DivInfo[]>([]);

  useEffect(() => {
    // Initialize only once when the page loads
    if (divsInfo.length === 0) {
      const randomX = Math.random() * window.innerWidth - 100;
      const randomY = Math.random() * window.innerHeight - 100;

      const initialDiv: DivInfo = {
        id: Date.now(),
        parentId: null,
        count: 1,
        positionX: Math.max(randomX, 0),
        positionY: Math.max(randomY, 0),
      };

      setDivsInfo([initialDiv]);
    }
  }, [divsInfo.length]);

  return (
    <DivInfoContext.Provider value={{ divsInfo, setDivsInfo }}>
      {children}
    </DivInfoContext.Provider>
  );
}

export default DivCountProvider;

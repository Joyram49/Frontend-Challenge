import { useEffect } from "react";
import { createPortal } from "react-dom";

const Portal = ({ children }) => {
  const mountElement = document.getElementById("portal-root");
  const elementDiv = document.createElement("div");

  useEffect(() => {
    mountElement.appendChild(elementDiv);
    return () => mountElement.removeChild(elementDiv);
  });
  return createPortal(children, elementDiv);
};

export default Portal;

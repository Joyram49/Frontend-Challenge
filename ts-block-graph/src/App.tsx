import React, { useCallback, useEffect, useRef } from "react";

import { useDivsInfo } from "./hooks/useDivsInfo";
import { DivInfo } from "./types";

function App() {
  const { divsInfo, setDivsInfo } = useDivsInfo();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const draggingDivRef = useRef<DivInfo | null>(null);
  const mainContainerRef = useRef<HTMLDivElement | null>(null);
  const initialMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const addBtnClick = (e: React.MouseEvent, div: DivInfo) => {
    e.stopPropagation();
    const container = mainContainerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();

    // Generate random positions within the main container
    const randomX = Math.random() * (containerRect.width - 96);
    const randomY = Math.random() * (containerRect.height - 96);

    const newDiv: DivInfo = {
      ...div,
      id: Date.now(),
      parentId: div.id,
      count: div.count + 1,
      positionX: Math.max(randomX, 0),
      positionY: Math.max(randomY, 0),
    };

    setDivsInfo((prev) => [...prev, newDiv]);
  };

  const isParent = (divId: number) =>
    divsInfo.some((div) => div.parentId === divId);

  const drawLine = useCallback(
    (parent: DivInfo, child: DivInfo) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // get the center coordinate of parent and child div
      const parentX = parent.positionX + 48;
      const parentY = parent.positionY + 48;
      const childX = child.positionX + 48;
      const childY = child.positionY + 48;

      // connect parent and child throw a dashed line (if the the x coordinates of parent match with child's x coordinates then connect directly otherwise make third points and also for y coordinates too)
      ctx.beginPath();
      if (parentX === childX || parentY === childY) {
        ctx.moveTo(parentX, parentY);
        ctx.lineTo(childX, childY);
      } else {
        const thirdPointX = parentX;
        const thirdPointY = childY;

        ctx.moveTo(parentX, parentY);
        ctx.lineTo(thirdPointX, thirdPointY);
        ctx.lineTo(childX, childY);
      }

      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
    },
    [canvasRef]
  );

  // Function to handle the dragging of a div
  const handleMouseDown = (e: React.MouseEvent, div: DivInfo) => {
    if (
      e.target instanceof HTMLButtonElement ||
      e.target instanceof HTMLParagraphElement
    )
      return;
    e.preventDefault();

    e.target.style.cursor = "grabbing";
    draggingDivRef.current = div;
    initialMousePosRef.current = { x: e.clientX, y: e.clientY };

    // mouse move function that update the coordinate of each draggable  div
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const draggingDiv = draggingDivRef.current;
      if (!draggingDiv || !mainContainerRef.current) return;

      const containerRect = mainContainerRef.current.getBoundingClientRect();
      const deltaX = moveEvent.clientX - initialMousePosRef.current.x;
      const deltaY = moveEvent.clientY - initialMousePosRef.current.y;

      setDivsInfo((prev) =>
        prev.map((d) => {
          if (d.id === draggingDivRef.current.id) {
            const newX = Math.max(
              0,
              Math.min(d.positionX + deltaX, containerRect.width - 96)
            );
            const newY = Math.max(
              0,
              Math.min(d.positionY + deltaY, containerRect.height - 96)
            );
            return { ...d, positionX: newX, positionY: newY };
          }
          return d;
        })
      );

      initialMousePosRef.current = {
        x: moveEvent.clientX,
        y: moveEvent.clientY,
      };
    };

    // clear event when mouse up from draggable div
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      draggingDivRef.current = null;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // filter the arrays of each child and parent div and then call function to create lines
    divsInfo.forEach((parent) => {
      divsInfo
        .filter((child) => child.parentId === parent.id)
        .forEach((child) => drawLine(parent, child));
    });
  }, [divsInfo, canvasRef, drawLine]);

  return (
    <main
      ref={mainContainerRef}
      className='relative w-full h-screen bg-gray-100 overflow-hidden'
    >
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className='absolute top-0 left-0 z-0'
      />
      {divsInfo.map((div) => (
        <div
          key={div.id}
          className={`absolute w-24 h-24 bg-rose-500 flex flex-col justify-center items-center gap-y-2 ${
            isParent(div.id) ? "border-4 border-blue-500" : ""
          }`}
          style={{ left: div.positionX, top: div.positionY, zIndex: 1 }}
          onMouseDown={(e) => handleMouseDown(e, div)}
        >
          <p className='text-white font-medium text-xl'>{div.count}</p>
          <button
            className='bg-rose-200 text-rose-500 px-6 py-1'
            onClick={(e) => addBtnClick(e, div)}
          >
            +
          </button>
        </div>
      ))}
    </main>
  );
}

export default App;

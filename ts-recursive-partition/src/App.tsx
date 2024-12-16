import React, { MouseEvent, useState } from "react";

//  function to generate random colors
const getRandomColor = (): string => {
  const letters: string = "0123456789ABCDEF";
  let color: string = "#";
  for (let i: number = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Partition type definition
interface Partition {
  id: number;
  direction: "row" | "column";
  size: number;
  color: string;
  children: Partition[];
}

const App: React.FC = () => {
  const [partitions, setPartitions] = useState<Partition[]>([
    {
      id: 1,
      direction: "row",
      size: 1,
      color: getRandomColor(),
      children: [],
    },
  ]);

  // Function to split a partition
  const splitPartition = (id: number, direction: "row" | "column"): void => {
    setPartitions((prev: Partition[]) => {
      const updatePartitions = (partitions: Partition[]): Partition[] =>
        partitions.map((partition) => {
          if (partition.id === id) {
            return {
              ...partition,
              direction,
              children: [
                {
                  id: Date.now(),
                  size: 0.5,
                  color: partition.color,
                  children: [],
                },
                {
                  id: Date.now() + 1,
                  size: 0.5,
                  color: getRandomColor(),
                  children: [],
                },
              ],
            };
          }
          return {
            ...partition,
            children: updatePartitions(partition.children),
          };
        });

      return updatePartitions(prev);
    });
  };

  // Function to remove a partition
  const removePartition = (id: number): void => {
    setPartitions((prev: Partition[]) => {
      const removeRecursively = (partitions: Partition[]): Partition[] =>
        partitions
          .filter((p) => p.id !== id)
          .map((p) => {
            if (p.children.length) {
              // const totalSize: number = p.children.reduce(
              //   (total, child) => total + child.size,
              //   0
              // );
              const adjustedChildren: Partition[] = p.children.filter(
                (child) => child.id !== id
              );
              const remainingSize: number =
                1 -
                adjustedChildren.reduce((acc, child) => acc + child.size, 0);

              adjustedChildren.forEach((child, index) => {
                if (index === adjustedChildren.length - 1) {
                  child.size += remainingSize;
                }
              });

              return {
                ...p,
                children: removeRecursively(adjustedChildren),
              };
            }
            return {
              ...p,
              children: removeRecursively(p.children),
            };
          });

      return removeRecursively(prev);
    });
  };

  // Function to handle partition resizing
  const handleResize = (
    e: MouseEvent<HTMLDivElement>,
    parentId: number,
    index: number
  ): void => {
    e.preventDefault();
    let startX: number = e.clientX;
    let startY: number = e.clientY;

    const onMouseMove = (event: MouseEvent): void => {
      const deltaX: number = event.clientX - startX;
      const deltaY: number = event.clientY - startY;

      setPartitions((prev: Partition[]) => {
        const updatePartitions = (partitions: Partition[]): Partition[] =>
          partitions.map((partition) => {
            if (partition.id === parentId) {
              const updatedChildren: Partition[] = [...partition.children];
              const totalSize: number =
                updatedChildren[index].size + updatedChildren[index + 1].size;

              if (partition.direction === "row") {
                const deltaRatio: number = deltaX / window.innerWidth;
                updatedChildren[index].size += deltaRatio;
                updatedChildren[index + 1].size -= deltaRatio;
              } else {
                const deltaRatio: number = deltaY / window.innerHeight;
                updatedChildren[index].size += deltaRatio;
                updatedChildren[index + 1].size -= deltaRatio;
              }

              // Had to clear that size remains inside their boundery
              updatedChildren[index].size = Math.max(
                updatedChildren[index].size,
                0.1
              );
              updatedChildren[index + 1].size =
                totalSize - updatedChildren[index].size;

              return { ...partition, children: updatedChildren };
            }

            return {
              ...partition,
              children: updatePartitions(partition.children),
            };
          });

        return updatePartitions(prev);
      });

      startX = event.clientX;
      startY = event.clientY;
    };

    const onMouseUp = (): void => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // Function to render the partition structure
  const renderPartitions = (
    partition: Partition,
    isRoot: boolean = false
  ): JSX.Element => {
    if (partition.children.length === 0) {
      return (
        <div
          key={partition.id}
          style={{
            flexGrow: partition.size,
            backgroundColor: partition.color,
            border: "1px solid black",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>
            <button
              onClick={() => splitPartition(partition.id, "row")}
              className='m-2 p-2 bg-white border'
            >
              v
            </button>
            <button
              onClick={() => splitPartition(partition.id, "column")}
              className='m-2 p-2 bg-white border'
            >
              h
            </button>
            {!isRoot && (
              <button
                onClick={() => removePartition(partition.id)}
                className='m-2 p-2 bg-red-500 text-white border'
              >
                -
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div
        key={partition.id}
        style={{
          display: "flex",
          flexDirection: partition.direction,
          flexGrow: partition.size,
          position: "relative",
        }}
      >
        {partition.children.map((child, index) => (
          <React.Fragment key={child.id}>
            {renderPartitions(child)}
            {index < partition.children.length - 1 && (
              <div
                style={{
                  cursor:
                    partition.direction === "row" ? "col-resize" : "row-resize",
                  backgroundColor: "gray",
                  width: partition.direction === "row" ? "5px" : "100%",
                  height: partition.direction === "column" ? "5px" : "100%",
                  zIndex: 1,
                }}
                onMouseDown={(e) => handleResize(e, partition.id, index)}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <main style={{ display: "flex", height: "100vh", width: "100vw" }}>
      {partitions.map((partition) => renderPartitions(partition, true))}
    </main>
  );
};

export default App;

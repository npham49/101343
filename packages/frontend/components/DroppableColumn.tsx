import { Paint } from "@/typings";
import React from "react";
import { Droppable } from "react-beautiful-dnd";
import DraggableCard from "./DraggableCard";

type DroppableColumnProps = {
  paints: Paint[];
  status: string;
};

const DroppableColumn = (props: DroppableColumnProps) => {
  return (
    <Droppable droppableId={props.status}>
      {(provided) => (
        <td
          id="docked"
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`border-r-2 border-gray-400 align-top ${
            props.status === "Running Low" && " bg-yellow-200"
          } ${props.status === "Out of Stock" && " bg-red-200"} ${
            props.status === "Available" && " bg-green-200"
          }`}
        >
          <div className="flex flex-col align-top">
            {props.paints
              .filter((paint: Paint) => paint.status === props.status)
              .map((paint: Paint, index: number) => (
                <DraggableCard key={paint.id} paint={paint} index={index} />
              ))}
            {provided.placeholder}
          </div>
        </td>
      )}
    </Droppable>
  );
};

export default DroppableColumn;

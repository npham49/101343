import React from "react";
import type { Paint } from "@/typings";
import { Draggable } from "react-beautiful-dnd";
import { useGlobalContext } from "@/context";
import { useUser } from "@clerk/nextjs";

interface IDraggableCardProps {
  paint: Paint;
  index: number;
}

// This card is used to display the paint item in the list
// Takes a paint item and an index as props
const DraggableCard = (props: IDraggableCardProps) => {
  const { setEditItem } = useGlobalContext();
  const { user } = useUser();
  return (
    <Draggable
      draggableId={String(props.paint.id)}
      index={props.index}
      key={props.paint.id}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            opacity: snapshot.isDragging ? 0.5 : 1,
            ...provided.draggableProps.style,
          }}
          className="flex flex-row space bg-white p-2 m-2 border-2 border-gray-400 rounded-lg shadow-lg justify-between items-center"
        >
          <div>
            <div className="text-lg font-semibold mb-1">{props.paint.name}</div>
            <p>
              <span
                className={`border-0 rounded-md p-[4px] text-white border-gray-400 align-top  ${
                  props.paint.status === "Running Low" && " bg-yellow-600"
                } ${props.paint.status === "Out of Stock" && " bg-red-600"} ${
                  props.paint.status === "Available" && " bg-green-600"
                }`}
              >
                {props.paint.status}
              </span>
            </p>
            <p className="mt-1">Stock: {props.paint.stock}</p>
          </div>
          {/* Display edit based on user's role */}
          {user?.publicMetadata?.role === "edit" && (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-14"
              onClick={() => {
                // setEdit(paint);
                setEditItem(props.paint);
                localStorage.setItem("edit.paint", JSON.stringify(props.paint));
                // This is necessary for DaisyUI to work
                // Ref: https://daisyui.com/components/modal/
                // @ts-ignore
                window.EditModal.showModal();
              }}
            >
              Edit
            </button>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default DraggableCard;

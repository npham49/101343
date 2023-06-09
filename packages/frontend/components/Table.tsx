import React from "react";
import DroppableColumn from "./DroppableColumn";
import { Paint } from "@/typings";

type TableProps = {
  paints: Paint[];
};

// Table component that holds the three droppable columns
// Renders out the whole board
const Table = (props: TableProps) => {
  return (
    <div className="overflow-x-auto h-full">
      <table className="table table-pin-rows table-fixed border-separate border-spacing-1 mx-auto bg-gray-300 h-auto min-h-[80vh] md:w-full w-[3vw]">
        <thead className="text-base font-bold text-black">
          <tr>
            <th className="border-r-2 border-gray-400 w-[350px] md:w-1/3 md:max-w-[350px] text-left">
              Available
            </th>
            <th className="border-r-2 border-gray-400 w-[350px] md:w-1/3 md:max-w-[350px] text-left">
              Running Low
            </th>
            <th className="border-r-2 border-gray-400 w-[350px] md:w-1/3 md:max-w-[350px] text-left">
              Out of Stock
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <DroppableColumn status="Available" paints={props.paints} />
            <DroppableColumn status="Running Low" paints={props.paints} />
            <DroppableColumn status="Out of Stock" paints={props.paints} />
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;

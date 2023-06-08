import { GlobalContext } from "@/context/state";
import { usePaintMutations } from "@/mutations/paint";
import { Paint } from "@/typings";
import React, { useState } from "react";

type StockFormProps = {
  destination: any;
};

const StockForm = (props: StockFormProps) => {
  const { newStock, setNewStock, paints } = React.useContext(GlobalContext);
  const { updatePaintMutation } = usePaintMutations();
  const updateData = async (result: any, paint: Paint, paints: Paint[]) => {
    if (result === undefined) {
      updatePaintMutation.mutate({
        id: paint.id,
        name: paint.name,
        status: paint.status,
        updatedAt: new Date(),
        stock: paint.stock,
      });
    } else {
      updatePaintMutation.mutate({
        id: result.draggableId,
        status: result.destination.droppableId,
        updatedAt: new Date(),
        stock: paint.stock,
      });
      const items = [...paints];

      const [reorderedItem] = items.splice(result.source.index, 1);

      items.splice(result.destination.index, 0, reorderedItem);

      const idsOrderArray = items.map((task) => task.id);
      localStorage.setItem("paintOrder", JSON.stringify(idsOrderArray));
    }
  };
  return (
    <dialog id="StockModal" className="modal">
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">Please enter the new Stock</h3>
        <input
          type="text"
          name="newStock"
          id="newStock"
          onChange={(e) => {
            if (isNaN(Number(e.target.value))) {
              return;
            }
            setNewStock(Number(e.target.value));
          }}
          className="input input-bordered"
          value={newStock}
          pattern="[0-9]*"
        />
        <div className="modal-action">
          <button
            onClick={() => {
              updateData(props.destination, { stock: newStock }, paints);
            }}
            className="btn"
          >
            Save
          </button>
          <button className="btn">Close</button>
        </div>
      </form>
    </dialog>
  );
};

export default StockForm;

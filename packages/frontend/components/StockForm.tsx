import { GlobalContext } from "@/context/state";
import { usePaintMutations } from "@/mutations/paint";
import { Paint } from "@/typings";
import React, { useState } from "react";

type StockFormProps = {
  destination: any;
};

const StockForm = (props: StockFormProps) => {
  const { newStock, setNewStock, paints } = React.useContext(GlobalContext);
  const { updatePaintMutation, updateData } = usePaintMutations();

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
              updateData(
                props.destination,
                { stock: newStock },
                paints,
                updatePaintMutation
              );
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

import { usePaintMutations } from "@/mutations/paint";
import React from "react";

const NewItem = () => {
  // This state is used to store the new paint item
  const [newPaint, setNewPaint] = React.useState({
    name: "",
    status: "",
    stock: 0,
  });
  const { createPaintMutation } = usePaintMutations();

  return (
    <dialog id="NewModal" className="modal">
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">New item</h3>
        <label className="label">
          <span className="font-bold label-text">Stock</span>
        </label>
        <input
          type="text"
          name="newStock"
          pattern="[0-9]*"
          id="newStock"
          onChange={(e) => {
            if (isNaN(Number(e.target.value))) {
              return;
            }
            setNewPaint({ ...newPaint, stock: Number(e.target.value) });
          }}
          className="input input-bordered"
          value={newPaint.stock}
        />
        <label className="label">
          <span className="font-bold label-text">Paint Name</span>
        </label>
        <input
          type="text"
          name="name"
          id="name"
          onChange={(e) => {
            setNewPaint({ ...newPaint, name: e.target.value });
          }}
          className="input input-bordered"
          value={newPaint.name}
        />
        <label className="label">
          <span className="font-bold label-text">Stock Status</span>
        </label>
        {/* Radio group */}
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Available</span>
            <input
              type="radio"
              name="radio-10"
              className="radio checked:bg-green-500"
              value="Available"
              onChange={(e) => {
                setNewPaint({ ...newPaint, status: e.target.value });
              }}
            />
          </label>
          <label className="label cursor-pointer">
            <span className="label-text">Running Low</span>
            <input
              type="radio"
              name="radio-10"
              className="radio checked:bg-yellow-500"
              value="Running Low"
              onChange={(e) => {
                setNewPaint({ ...newPaint, status: e.target.value });
              }}
            />
          </label>
          <label className="label cursor-pointer">
            <span className="label-text">Out of Stock</span>
            <input
              type="radio"
              name="radio-10"
              className="radio checked:bg-red-500"
              value="Out of Stock"
              onChange={(e) => {
                setNewPaint({ ...newPaint, status: e.target.value });
              }}
            />
          </label>
        </div>
        <div className="modal-action">
          <button
            onClick={() => {
              createPaintMutation.mutate({
                name: newPaint.name,
                stock: newPaint.stock,
                status: newPaint.status,
              });
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

export default NewItem;

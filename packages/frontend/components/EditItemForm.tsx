import { GlobalContext } from "@/context/state";
import { usePaintMutations } from "@/mutations/paint";
import { Paint } from "@/typings";
import React from "react";

const EditItemForm = () => {
  const { EditItem, setEditItem, paints } = React.useContext(GlobalContext);
  const { updatePaintMutation, deletePaintMutation } = usePaintMutations();
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
    <dialog id="EditModal" className="modal">
      <form method="dialog" className="modal-box">
        <h3 className=" font-extrabold text-lg">Edit item</h3>
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
            setEditItem({ ...EditItem, stock: Number(e.target.value) });
          }}
          className="input input-bordered"
          value={EditItem.stock}
        />
        <label className="label">
          <span className="font-bold label-text">Paint Name</span>
        </label>
        <input
          type="text"
          name="name"
          id="name"
          onChange={(e) => {
            setEditItem({ ...EditItem, name: e.target.value });
          }}
          className="input input-bordered"
          value={EditItem.name}
        />
        <label className="label">
          <span className="font-bold label-text">Stock Status</span>
        </label>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Available</span>
            <input
              type="radio"
              name="radio-10"
              className="radio checked:bg-green-500"
              value="Available"
              onChange={(e) => {
                setEditItem({ ...EditItem, status: e.target.value });
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
                setEditItem({ ...EditItem, status: e.target.value });
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
                setEditItem({ ...EditItem, status: e.target.value });
              }}
            />
          </label>
        </div>
        <dialog id="DeleteModal" className="modal">
          <form method="dialog" className="modal-box">
            <h3 className="font-bold text-lg">
              Are you sure you want to delete {EditItem.name}
            </h3>
            <div className="modal-action">
              <button
                onClick={() => {
                  deletePaintMutation.mutate(Number(EditItem.id));
                }}
                className="btn"
              >
                Yes
              </button>
              <button
                className="btn"
                onClick={() => {
                  // @ts-ignore
                  window.EditModal.showModal();
                }}
              >
                No
              </button>
            </div>
          </form>
        </dialog>
        <div className="modal-action">
          <button
            onClick={() => {
              // @ts-ignore
              window.DeleteModal.showModal();
            }}
            className="btn btn-error"
          >
            Delete Paint
          </button>
          <button
            onClick={() => {
              updateData(undefined, EditItem, paints);
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

export default EditItemForm;

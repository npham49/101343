"use client";

import React, { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import {
  getPaint,
  getAllPaints,
  createPaint,
  updatePaint,
  deletePaint,
} from "@/lib/paintApi";
import { GlobalContext } from "@/context/state";

import { Paint } from "@/typings";
import DroppableColumn from "@/components/DroppableColumn";

const inter = Inter({ subsets: ["latin"] });

const Board = () => {
  const queryClient = useQueryClient();

  const { isLoading, isError, error, data } = useQuery("paints", getAllPaints);

  const [paints, updatePaints] = useState(data ?? []);
  const [destination, setDestination] = useState({});
  const [newPaint, setNewPaint] = useState({
    name: "",
    status: "",
    stock: 0,
  });
  const { EditItem, setEditItem, newStock, setNewStock } =
    React.useContext(GlobalContext);

  useEffect(() => {
    updatePaints(data ?? []);
  }, [data]);

  const updatePaintMutation = useMutation(updatePaint, {
    onSuccess: () => {
      // Invalidates cache and refetch
      queryClient.invalidateQueries("paints");
    },
  });

  const createPaintMutation = useMutation(createPaint, {
    onSuccess: () => {
      // Invalidates cache and refetch
      queryClient.invalidateQueries("paints");
    },
  });

  const deletePaintMutation = useMutation(deletePaint, {
    onSuccess: () => {
      // Invalidates cache and refetch
      queryClient.invalidateQueries("paints");
    },
  });

  const onDragEnd = async (result: DropResult) => {
    console.log(result);
    if (!result?.destination) return;
    if (result.destination.droppableId === result.source.droppableId) return;

    if (result.destination.droppableId === "Out of Stock") {
      setNewStock(0);
      updateData(result, 0);
    } else {
      setNewStock(
        data.filter(
          (paint: Paint) => String(paint.id) === result.draggableId
        )[0].stock
      );
      setDestination(result);
      //@ts-ignore
      window.StockModal.showModal();
    }
  };

  const onDragStart = () => {
    // if device supports vibration, vibrate for 100ms to signal drag start
    if (window.navigator.vibrate) {
      window.navigator.vibrate(100);
    }
  };

  const updateData = async (result: any, stock: number) => {
    if (result.name !== undefined) {
      updatePaintMutation.mutate({
        id: result.draggableId,
        name: result.name,
        status: result.destination.droppableId,
        updatedAt: new Date(),
        stock: stock,
      });
    } else {
      updatePaintMutation.mutate({
        id: result.draggableId,
        status: result.destination.droppableId,
        updatedAt: new Date(),
        stock: stock,
      });
      const items = [...paints];

      const [reorderedItem] = items.splice(result.source.index, 1);

      items.splice(result.destination.index, 0, reorderedItem);

      const idsOrderArray = items.map((task) => task.id);
      localStorage.setItem("paintOrder", JSON.stringify(idsOrderArray));
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {String(error)}</div>;
  }
  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div
        className={`container mx-auto min-h-screen pt-10 ${inter.className}`}
      >
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-4xl font-bold text-center">Paint Stock Board</h1>
          <button
            className="btn btn-primary max-w-[150px]"
            onClick={() => {
              setEditItem({
                id: "",
                name: "",
                status: "",
                stock: 0,
              }); // @ts-ignore
              window.NewModal.showModal();
            }}
          >
            Add new paint
          </button>
        </div>
        <div className="overflow-x-auto h-full">
          <table className="table table-pin-rows table-fixed mx-auto bg-gray-300 h-auto min-h-[80vh] md:w-full w-[3vw]">
            <thead>
              <tr>
                <th className="border-r-2 border-gray-400 w-[350px]">
                  Available
                </th>
                <th className="border-r-2 border-gray-400 w-[350px]">
                  Running Low
                </th>
                <th className="border-r-2 border-gray-400 w-[350px]">
                  Out of Stock
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <DroppableColumn status="Available" paints={paints} />
                <DroppableColumn status="Running Low" paints={paints} />
                <DroppableColumn status="Out of Stock" paints={paints} />
              </tr>
            </tbody>
          </table>
          <dialog id="StockModal" className="modal">
            <form method="dialog" className="modal-box">
              <h3 className="font-bold text-lg">Please enter the new Stock</h3>
              <input
                type="number"
                name="newStock"
                id="newStock"
                onChange={(e) => {
                  setNewStock(Number(e.target.value));
                }}
                className="input input-bordered"
                value={newStock}
              />
              <div className="modal-action">
                <button
                  onClick={() => {
                    updateData(destination, newStock);
                  }}
                  className="btn"
                >
                  Save
                </button>
                <button className="btn">Close</button>
              </div>
            </form>
          </dialog>
          <dialog id="EditModal" className="modal">
            <form method="dialog" className="modal-box">
              <h3 className="font-bold text-lg">Edit item</h3>
              <label className="label">
                <span className="label-text">Stock</span>
              </label>
              <input
                type="number"
                name="newStock"
                id="newStock"
                onChange={(e) => {
                  setEditItem({ ...EditItem, stock: Number(e.target.value) });
                }}
                className="input input-bordered"
                value={EditItem.stock}
              />
              <label className="label">
                <span className="label-text">Paint Name</span>
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
                <span className="label-text">Stock Status</span>
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
              <div className="modal-action">
                <button
                  onClick={() => {
                    let alert = window.confirm(
                      "Are you sure you want to delete this paint?"
                    );
                    if (alert) {
                      deletePaintMutation.mutate(Number(EditItem.id));
                    } else {
                      return;
                    }
                  }}
                  className="btn btn-error"
                >
                  Delete Paint
                </button>
                <button
                  onClick={() => {
                    updateData(
                      {
                        name: EditItem.name,
                        draggableId: EditItem.id,
                        destination: { droppableId: EditItem.status },
                      },
                      EditItem.stock
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
          <dialog id="NewModal" className="modal">
            <form method="dialog" className="modal-box">
              <h3 className="font-bold text-lg">New item</h3>
              <label className="label">
                <span className="label-text">Stock</span>
              </label>
              <input
                type="number"
                name="newStock"
                id="newStock"
                onChange={(e) => {
                  setNewPaint({ ...newPaint, stock: Number(e.target.value) });
                }}
                className="input input-bordered"
                value={newPaint.stock}
              />
              <label className="label">
                <span className="label-text">Paint Name</span>
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
                <span className="label-text">Stock Status</span>
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
        </div>
      </div>
    </DragDropContext>
  );
};

export default Board;

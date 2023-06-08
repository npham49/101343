"use client";

import React, { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClientProvider,
} from "react-query";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  getPaint,
  getAllPaints,
  createPaint,
  updatePaint,
  deletePaint,
} from "@/lib/paintApi";

const inter = Inter({ subsets: ["latin"] });

const Board = () => {
  const queryClient = useQueryClient();

  const { isLoading, isError, error, data } = useQuery("paints", getAllPaints);

  const [paints, updatePaints] = useState(data ?? []);
  const [newStock, updateNewStock] = useState(0);
  const [destination, setDestination] = useState({});
  const [edit, setEdit] = useState({
    id: "",
    name: "",
    stock: 0,
    status: "",
  });

  useEffect(() => {
    updatePaints(data ?? []);
  }, [data]);

  const updatePaintMutation = useMutation(updatePaint, {
    onSuccess: () => {
      // Invalidates cache and refetch
      queryClient.invalidateQueries("paints");
    },
  });

  const onDragEnd = async (result: any) => {
    console.log(result);
    if (!result?.destination) return;
    if (result.destination.droppableId === result.source.droppableId) return;

    if (result.destination.droppableId === "Out of Stock") {
      updateNewStock(0);
      updateData(result, 0);
    } else {
      setDestination(result);
      //@ts-ignore
      window.StockModal.showModal();
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
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className={`container mx-auto min-h-screen pt-10 ${inter.className}`}
      >
        <div className="flex flex-col justify-between">
          <h1 className="text-4xl font-bold text-center">Paint Stock Board</h1>
        </div>
        <div className="overflow-x-auto">
          <table className="table table-pin-rows table-fixed bg-gray-300 min-h-screen">
            <thead>
              <tr>
                <th className="border-r-2 border-gray-400">Available</th>
                <th className="border-r-2 border-gray-400">Running Low</th>
                <th>Out of Stock</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Droppable droppableId="Available">
                  {(provided) => (
                    <td
                      id="docked"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="border-r-2 border-gray-400 align-top bg-green-200"
                    >
                      <div className="flex flex-col justify-item h-full">
                        {paints
                          .filter((paint: any) => paint.status === "Available")
                          .map((paint: any, index: number) => (
                            <Draggable
                              draggableId={String(paint.id)}
                              index={index}
                              key={paint.id}
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
                                  className="flex flex-col bg-white p-2 m-2 rounded-lg shadow-lg"
                                >
                                  <div className="text-lg font-semibold">
                                    {paint.name}
                                  </div>
                                  <div>
                                    <p>Status: {paint.status}</p>
                                    <p>Stock: {paint.stock}</p>
                                    <button
                                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                      onClick={() => {
                                        // @ts-ignore
                                        setEdit(paint);
                                        window.EditModal.showModal();
                                      }}
                                    >
                                      Edit
                                    </button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    </td>
                  )}
                </Droppable>
                <Droppable droppableId="Running Low">
                  {(provided) => (
                    <td
                      id="docked"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="border-r-2 border-gray-400 align-top bg-yellow-200"
                    >
                      <div className="flex flex-col align-top">
                        {paints
                          .filter(
                            (paint: any) => paint.status === "Running Low"
                          )
                          .map((paint: any, index: number) => (
                            <Draggable
                              draggableId={String(paint.id)}
                              index={index}
                              key={paint.id}
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
                                  className="flex flex-col bg-white p-2 m-2 rounded-lg shadow-lg"
                                >
                                  <div className="text-lg font-semibold">
                                    {paint.name}
                                  </div>
                                  <div>
                                    <p>Status: {paint.status}</p>
                                    <p>Stock: {paint.stock}</p>
                                    <button
                                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                      onClick={() => {
                                        // @ts-ignore
                                        setEdit(paint);
                                        window.EditModal.showModal();
                                      }}
                                    >
                                      Edit
                                    </button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    </td>
                  )}
                </Droppable>
                <Droppable droppableId="Out of Stock">
                  {(provided) => (
                    <td
                      id="docked"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="border-r-2 border-gray-400 align-top bg-red-200"
                    >
                      <div className="flex flex-col">
                        {paints
                          .filter(
                            (paint: any) => paint.status === "Out of Stock"
                          )
                          .map((paint: any, index: number) => (
                            <Draggable
                              draggableId={String(paint.id)}
                              index={index}
                              key={paint.id}
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
                                  className="flex flex-col bg-white p-2 m-2 rounded-lg shadow-lg"
                                >
                                  <div className="text-lg font-semibold">
                                    {paint.name}
                                  </div>
                                  <div>
                                    <p>Status: {paint.status}</p>
                                    <p>Stock: {paint.stock}</p>
                                    <button
                                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                      onClick={() => {
                                        // @ts-ignore
                                        setEdit(paint);
                                        window.EditModal.showModal();
                                      }}
                                    >
                                      Edit
                                    </button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    </td>
                  )}
                </Droppable>
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
                  updateNewStock(Number(e.target.value));
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
                  setEdit({ ...edit, stock: Number(e.target.value) });
                }}
                className="input input-bordered"
                value={edit.stock}
              />
              <label className="label">
                <span className="label-text">Paint Name</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                onChange={(e) => {
                  setEdit({ ...edit, name: e.target.value });
                }}
                className="input input-bordered"
                value={edit.name}
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
                      setEdit({ ...edit, status: e.target.value });
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
                      setEdit({ ...edit, status: e.target.value });
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
                      setEdit({ ...edit, status: e.target.value });
                    }}
                  />
                </label>
              </div>
              <div className="modal-action">
                <button
                  onClick={() => {
                    updateData(
                      {
                        name: edit.name,
                        draggableId: edit.id,
                        destination: { droppableId: edit.status },
                      },
                      edit.stock
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
        </div>
      </div>
    </DragDropContext>
  );
};

export default Board;

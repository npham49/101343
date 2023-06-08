"use client";

import React, { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import { useQuery } from "react-query";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { getAllPaints } from "@/lib/paintApi";
import { GlobalContext } from "@/context/state";

import { ToastContainer } from "react-toastify";

import { Paint } from "@/typings";
import { usePaintMutations } from "@/mutations/paint";

import "react-toastify/dist/ReactToastify.css";
import NewItem from "@/components/NewItem";
import Table from "@/components/Table";
import EditItemForm from "@/components/EditItemForm";
import StockForm from "@/components/StockForm";
const inter = Inter({ subsets: ["latin"] });

const Board = () => {
  // const [paints, setPaints] = useState<Paint[]>(data ?? []);
  const [destination, setDestination] = useState({});

  const { updatePaintMutation } = usePaintMutations();
  const { setEditItem, setNewStock, paints, setPaints } =
    React.useContext(GlobalContext);

  const { isLoading, isError, error, data } = useQuery(
    ["paints"],
    getAllPaints
  );
  useEffect(() => {
    setPaints(data ?? []);
  }, [data]);

  const onDragEnd = async (result: DropResult) => {
    // console.log(result);
    if (!result?.destination) return;
    if (result.destination.droppableId === result.source.droppableId) return;

    if (result.destination.droppableId === "Out of Stock") {
      setNewStock(0);
      updateData(result, { stock: 0, id: result.draggableId }, paints);
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

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {String(error)}</div>;
  }
  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div
        className={`container mx-auto min-h-[100vh-60px] pt-10 ${inter.className}`}
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-2">
          <h1 className="text-4xl font-bold text-center">Paint Stock Board</h1>
          <button
            className="btn btn-primary max-w-[150px] text-white"
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
        <Table paints={paints} />
        {/* Modal to input new stock on changin Status to Running Low or Available */}
        <StockForm destination={destination} />
        {/* Modal for editing paint information */}
        <EditItemForm />
        <NewItem />
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </DragDropContext>
  );
};

export default Board;

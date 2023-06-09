"use client";

import React, { use, useEffect, useState } from "react";
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
import { useAuth, useUser } from "@clerk/nextjs";
const inter = Inter({ subsets: ["latin"] });

const Board = () => {
  const [destination, setDestination] = useState({});
  const { user } = useUser();
  const { updatePaintMutation, updateData } = usePaintMutations();
  const { setEditItem, setNewStock, paints, setPaints, token, setToken } =
    React.useContext(GlobalContext);
  const { getToken } = useAuth();
  const { isLoading, isError, error, data } = useQuery(["paints"], async () =>
    getAllPaints((await getToken()) || "")
  );

  useEffect(() => {
    getToken().then((token) => {
      console.log(token);
      localStorage.setItem("token", token || "");
      if (setToken) setToken(token);
    });
    setPaints(data ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const onDragEnd = async (result: DropResult) => {
    // console.log(result);
    if (user?.publicMetadata.role !== "edit") return;
    if (!result?.destination) return;
    if (result.destination.droppableId === result.source.droppableId) return;

    if (result.destination.droppableId === "Out of Stock") {
      setNewStock(0);
      updateData(
        result,
        { stock: 0, id: result.draggableId },
        paints,
        updatePaintMutation
      );
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
          {user?.publicMetadata?.role === "edit" && (
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
          )}
        </div>

        <Table paints={paints} />
        {/* Modal to input new stock on changin Status to Running Low or Available */}
        <StockForm destination={destination} />
        {/* Modal for editing paint information */}
        <EditItemForm />
        {/* Modal for new items */}
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

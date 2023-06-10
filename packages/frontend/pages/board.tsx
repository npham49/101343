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
import Head from "next/head";
const inter = Inter({ subsets: ["latin"] });

const Board = () => {
  // This state if for drag and drop destination
  const [destination, setDestination] = useState({});
  const { user } = useUser();
  const { updatePaintMutation, updateData } = usePaintMutations();
  const { setEditItem, setNewStock, paints, setPaints, setToken } =
    React.useContext(GlobalContext);
  const { getToken } = useAuth();

  //Initial query to get all paints
  const { isLoading, isError, error, data } = useQuery(["paints"], async () =>
    getAllPaints((await getToken()) || "")
  );

  // Update token on all data changes
  useEffect(() => {
    getToken().then((token) => {
      console.log(token);
      localStorage.setItem("token", token || "");
      if (setToken) setToken(token);
    });
    setPaints(data ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Function runs on all drag ends
  const onDragEnd = async (result: DropResult) => {
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
      // This is necessary for DaisyUI to work
      // Ref: https://daisyui.com/components/modal/
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
      <Head>
        <title>Paint Stock Board</title>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>
      <div
        className={`container mx-auto min-h-[100vh-60px] pt-10 ${inter.className}`}
      >
        <div className="flex flex-row justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-center">Paint Stock Board</h1>
          {user?.publicMetadata?.role === "edit" && (
            <button
              className="btn btn-primary max-w-[150px] text-white"
              onClick={() => {
                setEditItem({
                  id: "",
                  name: "",
                  status: "",
                  stock: 0,
                });
                // This is necessary for DaisyUI to work
                // Ref: https://daisyui.com/components/modal/
                // @ts-ignore
                window.NewModal.showModal();
              }}
            >
              Add new paint
            </button>
          )}
        </div>
        <p>
          <span className="font-bold">Note:</span> Items with stock under 5 is
          automatically set to Running Low.
        </p>
        <div className="mb-2">
          <div className="join join-vertical w-full">
            <div className="collapse collapse-arrow border border-base-300 bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title text-xl font-medium">
                How to use this Board
              </div>
              <div className="collapse-content">
                <div className="flex flex-col m-4">
                  <span className="font-semibold">
                    This app is designed to work similar to a Kanban board:
                  </span>
                  <ul className="list-disc ml-4">
                    <li>Items can be dragged and dropped between columns</li>
                    <li>Items can be edited by clicking the Edit button</li>
                    <li>
                      Items can be added by clicking the Add new paint button
                    </li>
                  </ul>
                  <span className="font-semibold">Permissions:</span>
                  <ul className="list-disc ml-4">
                    <li>
                      As a user with edit access you can drag and drop items
                      between the columns.
                    </li>
                    <li>
                      As a user with view access you can only view the items.
                    </li>
                  </ul>
                  <span className="font-semibold">Functionalities:</span>
                  <ul className="list-disc ml-4">
                    <li>
                      If an item if dragged to the Out of Stock column, the
                      stock will be set to 0.
                    </li>
                    <li>
                      If an item is dragged to the Running Low or Available
                      column, a modal will pop up to allow you to input new
                      stock.
                    </li>
                    <li>
                      On mobile devices, on drag a vibration will be triggered
                      to signal the start of the drag.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
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

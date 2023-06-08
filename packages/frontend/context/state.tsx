import { Paint } from "@/typings";
import React, { JSXElementConstructor, ReactElement, useState } from "react";

interface IGlobalContextProps {
  EditItem: Paint;
  setEditItem: (item: Paint) => void;
  newStock: number;
  setNewStock: (stock: number) => void;
  paints: Paint[];
  setPaints: (paints: Paint[]) => void;
}

export const GlobalContext = React.createContext<IGlobalContextProps>({
  EditItem: {
    id: "",
    name: "",
    stock: 0,
    status: "",
  },
  setEditItem: () => {},
  newStock: 0,
  setNewStock: () => {},
  paints: [],
  setPaints: () => {},
});

export const GlobalContextProvider = (props: any) => {
  const [editItem, setEditItem] = useState({
    EditItem: {
      id: "",
      name: "",
      stock: 0,
      status: "",
    },
  });
  const [newStock, setNewStock] = useState(0);
  const [paints, setPaints] = useState<Paint[]>([]);

  return (
    <GlobalContext.Provider
      value={{
        EditItem: editItem.EditItem,
        setEditItem: (item: Paint) => {
          // @ts-ignore
          setEditItem({ EditItem: item });
        },
        newStock: newStock,
        setNewStock: (stock: number) => {
          setNewStock(stock);
        },
        paints: paints,
        setPaints: (paints: Paint[]) => {
          setPaints(paints);
        },
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};

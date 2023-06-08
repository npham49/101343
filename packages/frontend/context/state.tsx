import { Paint } from "@/typings";
import React, { JSXElementConstructor, ReactElement, useState } from "react";

interface IGlobalContextProps {
  EditItem: Paint;
  setEditItem: (item: Paint) => void;
  newStock: number;
  setNewStock: (stock: number) => void;
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

  return (
    <GlobalContext.Provider
      value={{
        EditItem: editItem.EditItem,
        setEditItem: (item: Paint) => {
          setEditItem({ EditItem: item });
        },
        newStock: newStock,
        setNewStock: (stock: number) => {
          setNewStock(stock);
        },
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};

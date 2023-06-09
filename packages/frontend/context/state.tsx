import { Paint } from "@/typings";
import React, { useState } from "react";

interface IGlobalContextProps {
  EditItem: Paint;
  setEditItem: (item: Paint) => void;
  newStock: number;
  setNewStock: (stock: number) => void;
  paints: Paint[];
  setPaints: (paints: Paint[]) => void;
  token?: string | null;
  setToken?: (token: string | null) => void;
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
  token: "",
  setToken: () => {},
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
  const [token, setToken] = useState<string | null>("");

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
        token: token,
        setToken: (token: string | null) => {
          setToken(token);
        },
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};

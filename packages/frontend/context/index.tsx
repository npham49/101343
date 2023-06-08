import { useContext } from "react";

import { GlobalContext } from "./state";

export const useGlobalContext = () => useContext(GlobalContext);

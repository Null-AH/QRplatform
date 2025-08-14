"use client";

import { createContext, useContext, useState } from "react";

const RelaodContext = createContext();

export const ReloadProvider = ({ children }) => {
  const [reload, setReload] = useState(false);
  const [addItem, setAddItem] = useState(false);
  return (
    <RelaodContext.Provider value={{ reload, setReload, addItem, setAddItem }}>
      {children}
    </RelaodContext.Provider>
  );
};

export const useReloadTemplate = () => useContext(RelaodContext);

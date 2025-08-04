"use client";

import { createContext, useContext, useState } from "react";

const EventContext = createContext();


export const EventProvider = ({ children }) => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [excelData, setExcelData] = useState(null);
  const [fontColor, setfontcolor] = useState(null);
  const [designImage, setDesignImage] = useState(null);
  const [boxes, setBoxes] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const clearAll = () => {
    setEventName("");
    setExcelData(null);
    setDesignImage(null);
    setBoxes([]);
    setSelectedTemplate(null);
  };

  return (
    <EventContext.Provider
      value={{
        eventName,
        setEventName,
        excelData,
        setExcelData,
        designImage,
        setDesignImage,
        boxes,
        setBoxes,
        selectedTemplate,
        setSelectedTemplate,
        clearAll,
        eventDate,
        setEventDate,
        fontColor,
        setfontcolor,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};


export const useEvent = () => useContext(EventContext);

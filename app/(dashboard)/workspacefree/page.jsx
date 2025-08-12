"use client";

import Component from "@/components/StepWorkeFree";
import { useEffect, useState } from "react";
import axios from "axios";
import { useEvent } from "../context/StepsInfo";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";

export default function WorkeSpaceFree() {
  const [sendData, setSenddata] = useState(false);
  const navigator=useRouter()

  const [isLoading, setIsLoading] = useState(false);

  const {
    eventName,
    eventDate,
    excelData,
  
  } = useEvent();

  useEffect(() => {
    if (!sendData) return;

    const sendForm = async () => {
   
      if (isLoading) return;
      setIsLoading(true);

      const currentUser = auth.currentUser;
      if (!currentUser) {
        alert("You must be logged in to create an event.");
        setSenddata(false);
        setIsLoading(false);
        return;
      }

 
      const formData = new FormData();
      const eventDetails = {
        name: eventName,
        eventDate: eventDate,
        Location: null,
      };

     

      formData.append("eventInfo", JSON.stringify(eventDetails));
   
      formData.append("attendeeFile", excelData);
  

      console.log("Sending data to the backend...");
      const baseApiUrl = "https://mk25szk5-7093.inc1.devtunnels.ms"; 
     

      try {
     
        const response = await axios.post(
          `${baseApiUrl}/api/event/create-free`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
        
          }
        );



        console.log(response.data);
        navigator.push("/templates")

      } catch (error) {
        console.error("API Error:", error);
        if (error.response) {
          alert(`Error: ${error.response.status} - ${error.response.statusText}`);
        } else {
          alert("An error occurred. Check the console for details.");
        }
      } finally {
  
        setIsLoading(false);
        setSenddata(false);
      }
    };

    sendForm();
  }, [sendData]); 

  return (
    <div className="flex flex-col min-w-full min-h-screen">
      <Component setSenddata={setSenddata} isLoading={isLoading} />
    </div>
  );
}
"use client";

import Component from "@/components/StepWorke";
import { useEffect, useState } from "react";
import axios from "axios";
import { useEvent } from "../context/StepsInfo";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";

export default function WorkeSpace() {
  const [sendData, setSenddata] = useState(false);
  const navigator=useRouter()

  const [isLoading, setIsLoading] = useState(false);

  const {
    eventName,
    excelData,
    designImage,
    boxes,
    eventDate,
    fontColor,
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

      const idToken = await currentUser.getIdToken();
      const formData = new FormData();
      const eventDetails = {
        name: eventName,
        eventDate: eventDate,
        Location: null,
      };

      const templateElementsWithColor = boxes.map((box) => {
        if (box.type === "Name") {
          return { ...box, fontColor: fontColor, fontTheme: "Arial" };
        }
        return box;
      });

      formData.append("eventInfo", JSON.stringify(eventDetails));
      formData.append("templateInfo", JSON.stringify(templateElementsWithColor));
      formData.append("attendeeFile", excelData);
      if (designImage instanceof File) {
        formData.append("backgroundImage", designImage);
      }

      console.log("Sending data to the backend...");
      const baseApiUrl = "https://mk25szk5-7093.inc1.devtunnels.ms"; 
     

      try {
     
        const response = await axios.post(
          `${baseApiUrl}/api/event/create`,
          formData
          ,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              // 'Authorization': `Bearer ${idToken}`
            },
        
          }
        );

    
        if (response.status === 202) {
          const newEvent = response.data;
          const eventId = newEvent.id;

          alert(`Event created successfully! Generating invitations in the background...`);

          const pollForZipFile = (id) => {
            const intervalId = setInterval(async () => {
              try {
                console.log(`Polling for event ${id}...`);
                const pollResponse = await axios.get(`${baseApiUrl}/api/event/${id}/download`);

  
                if (pollResponse.status === 200) {
                  clearInterval(intervalId); 
                  console.log("File is ready! Downloading...");

              
                  const downloadUrl = `${baseApiUrl}${pollResponse.data}`;
                  const link = document.createElement("a");
                  link.href = downloadUrl;
                  link.download = "invitations.zip";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  navigator.push("/templates")
                }
        
              } catch (error) {
                console.error("Polling error:", error);
                alert("An error occurred while checking for your file.");
                clearInterval(intervalId); 
              }
            }, 10000); 
          };

      
          pollForZipFile(eventId);
        }
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
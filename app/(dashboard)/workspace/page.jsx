"use client";
import Component from "@/components/StepWorke";
import { useEffect, useState } from "react";
import axios from "axios";
import { useEvent } from "../context/StepsInfo";

export default function WorkeSpace() {
  const [sendData, setSenddata] = useState(false);

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
      const formData = new FormData();
            // console.log(  "eventName :", eventName,"excelData:",  excelData, "designImage:",designImage, "boxes:",   boxes,   eventDate,   fontColor,)
        formData.append("eventName", eventName);
        formData.append("eventDate", eventDate);
        formData.append("fontColor", fontColor);
        formData.append("excelFile", excelData);
      if (designImage instanceof File) {
        formData.append("designImage", designImage);
      }
      formData.append("boxes", JSON.stringify(boxes));

    //   console.log("send data",formData);

      try {
        const response = await axios.post(
          "http://mas.com/api/createtemplate",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            responseType: "blob",
          }
        );

        const blob = new Blob([response.data], { type: "application/zip" });
        const downloadUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "invitations.zip";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
      } catch (error) {
        console.error("Download error:", error);
      } finally {
        setSenddata(false);
      }
    };

    sendForm();
  }, [sendData]);

  return (
    <div className="flex flex-col min-w-full min-h-screen">
      <Component setSenddata={setSenddata} />
    </div>
  );
}

"use client";

import Component from "@/components/StepWorke";
import { useEffect, useState } from "react";
import axios from "axios";
import { useEvent } from "../context/StepsInfo";
import { auth } from "@/app/firebase/config";

export default function WorkeSpace() {
  const [sendData, setSenddata] = useState(false);
  // حالة جديدة لتتبع ما إذا كان الطلب قيد التقدم لمنع النقرات المتعددة
  // A new state to track if a request is in progress to prevent multiple clicks
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
      // منع إرسال طلب جديد إذا كان هناك طلب قيد التنفيذ بالفعل
      // Prevent a new request if one is already in progress
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
          return { ...box, fontColor: fontColor, fontTheme: "Arial" }; // Example theme
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
      const baseApiUrl = "https://mk25szk5-7093.inc1.devtunnels.ms"; // استبدل هذا بعنوان النفق الخاص بك
                                                                  // Replace this with your tunnel address

      try {
        // الخطوة 1: إرسال الطلب لبدء عملية إنشاء الدعوات
        // Step 1: Send the request to start the invitation generation process
        const response = await axios.post(
          `${baseApiUrl}/api/event/create`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              'Authorization': `Bearer ${idToken}`
            },
            // تم حذف 'responseType: "blob"' لأننا نتوقع استجابة JSON الآن
            // Removed 'responseType: "blob"' because we now expect a JSON response
          }
        );

        // الخطوة 2: إذا نجح الطلب، نبدأ في التحقق من حالة الملف
        // Step 2: If the request is successful, start polling for the file status
        if (response.status === 202) {
          const newEvent = response.data;
          const eventId = newEvent.id;

          alert(`Event created successfully! Generating invitations in the background...`);

          // هذه الدالة ستقوم بالتحقق بشكل دوري من جهوزية الملف
          // This function will periodically check if the file is ready
          const pollForZipFile = (id) => {
            const intervalId = setInterval(async () => {
              try {
                console.log(`Polling for event ${id}...`);
                const pollResponse = await axios.get(`${baseApiUrl}/api/event/${id}/download`);

                // إذا كانت الاستجابة 200، فهذا يعني أن الملف جاهز
                // If the status is 200, it means the file is ready
                if (pollResponse.status === 200) {
                  clearInterval(intervalId); // إيقاف التحقق
                  console.log("File is ready! Downloading...");

                  // بناء رابط التحميل الكامل وتفعيل التحميل
                  // Construct the full download URL and trigger the download
                  const downloadUrl = `${baseApiUrl}${pollResponse.data}`;
                  const link = document.createElement("a");
                  link.href = downloadUrl;
                  link.download = "invitations.zip";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }
                // إذا كانت الحالة 202، فالعملية لا تزال قيد التنفيذ، لذا ننتظر
                // If the status is 202, it's still processing, so we wait
              } catch (error) {
                console.error("Polling error:", error);
                alert("An error occurred while checking for your file.");
                clearInterval(intervalId); // إيقاف التحقق عند حدوث خطأ
              }
            }, 10000); // التحقق كل 10 ثواني
          };

          // بدء عملية التحقق
          // Start the polling process
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
        // إعادة تعيين الحالات بعد اكتمال الطلب (سواء نجح أو فشل)
        // Reset the states after the request is complete (success or fail)
        setIsLoading(false);
        setSenddata(false);
      }
    };

    sendForm();
  }, [sendData]); // تم تبسيط مصفوفة الاعتماديات لمنع التكرار
                  // Simplified the dependency array to prevent loops

  return (
    <div className="flex flex-col min-w-full min-h-screen">
      <Component setSenddata={setSenddata} isLoading={isLoading} />
    </div>
  );
}
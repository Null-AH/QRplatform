"use client";

import React, { useRef, useEffect, useState } from "react";
import { FaCamera, FaPlayCircle, FaStopCircle } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import { MdMarkEmailRead } from "react-icons/md";
import axios from "axios";
import Webcam from "react-webcam";
import jsQR from "jsqr";
import { useParams } from "next/navigation";

function QRScanner() {
  // `useParams` تُستخدم لجلب معرف الحدث من الرابط (URL)
  const { id: eventId } = useParams(); // تم تغيير الاسم إلى eventId لزيادة الوضوح
  const baseApiUrl = "https://mk25szk5-7093.inc1.devtunnels.ms";

  const webcamRef = useRef(null);
  const [email, setEmail] = useState("");
  const [result, setResult] = useState("");
  const [count, setCount] = useState(0); // العدد الأولي للمسجلين هو 0
  const [scanned, setScanned] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  const captureAndScan = () => {
    // التأكد من أن الكاميرا تعمل ولا توجد عملية تحميل جارية
    if (!webcamRef.current || loading || !cameraOn) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      // إذا تم العثور على QR Code ولم يتم مسحه من قبل
      if (code && code.data && !scanned) {
        setScanned(true); // لمنع المسح المتكرر والفوري لنفس الكود
        setEmail(code.data);
        // استدعاء دالة تسجيل الحضور
        checkIn(code.data).finally(() => {
          // إعادة تعيين الحالة بعد 3 ثوانٍ للسماح بالمسح التالي
          setTimeout(() => {
            setScanned(false);
            setEmail("");
            setResult("");
          }, 3000);
        });
      }
    };
  };

  // --- دالة تسجيل الحضور (checkIn) المحدثة بالكامل ---
  const checkIn = async (scannedEmail) => {
    setLoading(true);

    // إصلاح: الحصول على التوكن مباشرة عند الحاجة إليه لتجنب الأخطاء
    const token = localStorage.getItem("token");
    if (!token) {
      setResult("❌ خطأ في المصادقة: أنت غير مسجل الدخول.");
      setLoading(false);
      return;
    }

    try {
      // إصلاح: استخدام الرابط الصحيح للـ API مع معرف الحدث
      const res = await axios.post(
        `${baseApiUrl}/api/event/${eventId}/check-in`,
        { email: scannedEmail }, // الجسم المرسل يحتوي على الإيميل
        {
          headers: {
            "Content-Type": "application/json",
            // إصلاح: إضافة التوكن إلى هيدر الطلب للمصادقة
            "Authorization": `Bearer ${token}` 
          }
        }
      );

      // إصلاح: قراءة الخصائص بصيغة camelCase التي يرسلها الباك-إند
      const data = res.data;
      if (data.status === "Success") {
        setResult(`✅ تم تسجيل الحضور: ${data.attendeeName}`);
        setCount(data.checkedInCount);
      }
    } catch (error) {
      // إصلاح: التعامل بشكل صحيح مع استجابات الخطأ من الباك-إند (مثل 409 و 404)
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (errorData.status === "AlreadyCheckedIn") {
          setResult(`� مسجل مسبقًا: ${errorData.attendeeName}`);
          setCount(errorData.checkedInCount); // تحديث العدد حتى في هذه الحالة
        } else if (errorData.status === "NotFound") {
          setResult("❌ هذا الشخص غير موجود في قائمة المدعوين لهذا الحدث.");
        } else {
          setResult("❌ حدث خطأ غير معروف في الخادم.");
        }
      } else {
        setResult("❌ لا يمكن الاتصال بالخادم.");
      }
    } finally {
      setLoading(false);
    }
  };

  // دالة لجلب عدد الحضور الحالي بشكل دوري
  const fetchCount = async () => {
    // إصلاح: الحصول على التوكن مباشرة عند الحاجة إليه
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("لم يتم العثور على توكن المصادقة لجلب العدد.");
      return; // الخروج بصمت بدون إظهار خطأ للمستخدم
    }

    try {
      const res = await axios.get(`${baseApiUrl}/api/event/${eventId}/count`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      // إصلاح: قراءة الخاصية بصيغة camelCase
      if (res.data && res.data.checkedInCount !== undefined) {
        setCount(res.data.checkedInCount);
      }
    } catch (err) {
      console.error("خطأ في جلب عدد الحضور:", err);
    }
  };

  // دالة useEffect الرئيسية التي تعمل عند تحميل المكون أو تغيير حالته
  useEffect(() => {
    fetchCount(); // جلب العدد الأولي عند تحميل الصفحة

    if (cameraOn) {
      // إعداد الفاصل الزمني لمسح الكاميرا
      intervalRef.current = setInterval(captureAndScan, 1000); // المسح كل ثانية
      
      // إعداد فاصل زمني منفصل لجلب العدد بشكل دوري للمزامنة
      const pollInterval = setInterval(fetchCount, 5000); // جلب البيانات كل 5 ثواني

      // دالة التنظيف: تتوقف الفواصل الزمنية عند إغلاق المكون لتجنب استهلاك الموارد
      return () => {
        clearInterval(intervalRef.current);
        clearInterval(pollInterval);
      };
    }
  }, [cameraOn]); // هذه الدالة تعتمد فقط على حالة تشغيل الكاميرا

  // --- جزء العرض (JSX) يبقى كما هو إلى حد كبير ---
  // لا توجد تغييرات مطلوبة في هذا الجزء
  return (
    <div className="min-h-screen py-10 px-4 flex flex-col items-center justify-center gap-4">
      <div
        className={`w-full max-w-3xl relative bg-white/5 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[7.3px] border border-white/20 transition-all duration-500 overflow-hidden ${
          cameraOn ? "min-h-[850px]" : "min-h-[500px]"
        } p-6 justify-center items-center space-y-6`}
      >
        <h1 className="text-2xl w-full flex-col justify-center font-bold flex items-center gap-2 text-[#fff]">
          <FaCamera /> <span>Read QR</span>
        </h1>

        <div className="flex justify-center">
          <button
            onClick={() => {
              setCameraOn(!cameraOn);
            }}
            disabled={loading}
            className={`px-5 py-2 cursor-pointer rounded-lg font-medium text-white flex items-center gap-2 transition ${
              cameraOn ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {cameraOn ? <FaStopCircle /> : <FaPlayCircle />}
            {cameraOn ? "Turn off camera" : "Turn on camera"}
          </button>
        </div>

        {cameraOn && (
          <div className="relative border rounded-md overflow-hidden">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/png"
              videoConstraints={{ facingMode: "environment" }}
              className="w-full min-h-[100px] max-h-[350px] object-cover"
            />
          </div>
        )}

        <div className="space-y-4 flex flex-col ">
          <div className="flex w-full items-center justify-center gap-2 text-gray-400">
            <MdMarkEmailRead className="text-indigo-500 text-xl" />
            <span className="font-medium">البريد الممسوح:</span>
            <span className="text-sm">{email || "لم يتم المسح بعد"}</span>
          </div>

          {loading && (
             <div className="flex items-center justify-center gap-2 text-sm text-blue-400">
              <span className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></span>
              جار التحقق...
            </div>
          )}

          {result && (
            <div
              className={`px-4 py-2 rounded-md text-sm text-center ${result.includes("✅")? "bg-green-100 text-green-800": result.includes("�") ? "bg-yellow-100 text-yellow-800": "bg-red-100 text-red-800" }`}
            >
              {result}
            </div>
          )}

          <div className="flex items-center gap-3 bg-[#ffffff1a] flex-col justify-center p-3 rounded-lg shadow-sm">
            <IoIosPeople className="text-2xl text-white" />
            <div className="flex flex-col justify-center items-center">
              <div className="text-5xl font-bold text-white">{count}</div>
              <div className="text-sm text-gray-400">عدد الحضور المسجلين</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QRScanner;



// "use client";

// import React, { useRef, useEffect, useState } from "react";
// import { FaCamera, FaPlayCircle, FaStopCircle } from "react-icons/fa";
// import { IoIosPeople } from "react-icons/io";
// import { MdMarkEmailRead } from "react-icons/md";
// import axios from "axios";
// import Webcam from "react-webcam";
// import jsQR from "jsqr";
// import { useParams } from "next/navigation";


// function QRScanner() {
//   const { id }=useParams();
//   const baseApiUrl = "https://mk25szk5-7093.inc1.devtunnels.ms";


//   console.log(id)
//   const webcamRef = useRef(null);
//   const [email, setEmail] = useState("");
//   const [result, setResult] = useState("");
//   const [count, setCount] = useState(0);
//   const [scanned, setScanned] = useState(false);
//   const [cameraOn, setCameraOn] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const intervalRef = useRef(null);

//   const captureAndScan = () => {
//     if (!webcamRef.current || loading) return;
//     const imageSrc = webcamRef.current.getScreenshot();
//     if (!imageSrc) return;

//     const img = new Image();
//     img.src = imageSrc;
//     img.onload = () => {
//       const canvas = document.createElement("canvas");
//       canvas.width = img.width;
//       canvas.height = img.height;

//       const ctx = canvas.getContext("2d");
//       ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//       const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//       const code = jsQR(imageData.data, imageData.width, imageData.height);

//       if (code && code.data && !scanned) {
//         setScanned(true);
//         setEmail(code.data);
//         checkIn(code.data).finally(() => {
//           setTimeout(() => {
//             setScanned(false);
//             setEmail("");
//             setResult("");
//           }, 3000);
//         });
//       }
//     };
//   };

//   // const checkIn = async (email) => {
//   //   setLoading(true);
//   //   try {
//   //     const res = await axios.post(`${baseApiUrl}/api/event/${id}/check-in`,
//   //       { email },
//   //       {
//   //         headers: { 
//   //           "Content-Type": "application/json",
//   //           "Authorization": `Bearer ${localStorage.getItem("token")}`
//   //            },
          
           
//   //       }
//   //     );

//   //     if (res.data.data.attendeeName) {
//   //       setResult(`✅ Attendance recorded: ${res.data.data.attendeeName}`);
//   //     } else {
//   //       setResult(res.data.data.status);
//   //     }

//   //     if (res.data.count !== undefined) {
//   //       setCount(res.data.data.CheckedInCount);
//   //     } else {
//   //       await fetchCount();
//   //     }

//   //     console.log(res)
//   //   } catch (error) {
//   //     if (error.response) {
//   //       setResult(error.response.data.message || "❌ Server error");
//   //     } else if (error.request) {
//   //       setResult("❌ Cannot connect to server");
//   //     } else {
//   //       setResult("❌ Sending error");
//   //     }
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

// const checkIn = async (email) => {
//   setLoading(true);
//   try {
//     const res = await axios.post(
//       `${baseApiUrl}/api/event/${id}/check-in`,
//       { email },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${localStorage.getItem("token")}`
//         }
//       }
//     );

//     const data = res.data; // هذا هو الـ EventCheckInResultDto
//     console.log(data);

//     if (data.Status === "Success") {
//       setResult(`✅ Attendance recorded: ${data.AttendeeName}`);
//     } else if (data.Status === "AlreadyCheckedIn") {
//       setResult(`⚠️ Already checked in: ${data.AttendeeName}`);
//     } else if (data.Status === "NotFound") {
//       setResult("❌ Attendee not found");
//     }

//     if (data.CheckedInCount) {
//       setCount(data.CheckedInCount);
//     } else {
//       await fetchCount();
//     }

//   } catch (error) {
//     if (error.response) {
//       setResult(error.response.data?.message || "❌ Server error");
//     } else if (error.request) {
//       setResult("❌ Cannot connect to server");
//     } else {
//       setResult("❌ Sending error");
//     }
//   } finally {
//     setLoading(false);
//   }
// };



  
//   const fetchCount = async () => {
//     try {
//       const res = await axios.get(`${baseApiUrl}/api/event/${id}/count`,
     
//         {
//           headers:{
//               "Authorization": `Bearer ${localStorage.getItem("token")}`,
//           }
//         }
//       );
//       setCount(res.data.CheckedInCount);
//     } catch (err) {
//       console.error("Error fetching count:", err);
//     }
//   };

//   useEffect(() => {
//     fetchCount();


//     if (cameraOn) {
//       intervalRef.current = setInterval(() => {
//         captureAndScan();
//       }, 1000);


//     } else {
//       clearInterval(intervalRef.current);
//     }

//     return () => clearInterval(intervalRef.current);
//   }, [cameraOn, scanned, loading]);

//   return (
//     <div className="min-h-screen py-10 px-4 flex flex-col items-center justify-center gap-4">
// <div
//   className={`w-full max-w-3xl relative bg-white/5 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[7.3px] border border-white/20 transition-all duration-500 overflow-hidden ${
//     cameraOn ? "min-h-[850px]" : "min-h-[500px]"
//   } p-6 justify-center items-center space-y-6`}
// >
//         <h1 className="text-2xl w-full flex-col justify-center font-bold flex items-center gap-2 text-[#fff]">
//           <FaCamera /> <span>Read QR</span>
//         </h1>

//         <div className="flex justify-center">
//           <button
//             onClick={() => {
//               setScanned(false);
//               setResult("");
//               setEmail("");
//               setCameraOn(!cameraOn);
//             }}
//             disabled={loading}
//             className={`px-5 py-2 cursor-pointer rounded-lg font-medium text-white flex items-center gap-2 transition ${
//               cameraOn ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"
//             }`}
//           >
//             {cameraOn ? <FaStopCircle /> : <FaPlayCircle />}
//             {cameraOn ? "Turn off camera" : "Turn on camera"}
//           </button>
//         </div>

//         {cameraOn && (
//           <div className="relative border rounded-md overflow-hidden">
//             <Webcam
//               audio={false}
//               ref={webcamRef}
//               screenshotFormat="image/png"
//               videoConstraints={{ facingMode: "environment" }}
//               className="w-full min-h-[100px] max-h-[350px] object-cover"
//             />
//             <div className="absolute inset-0 pointer-events-none rounded-md" />
//           </div>
//         )}

//         <div className="space-y-4 flex flex-col ">
//           <div className="flex w-full items-center justify-center gap-2 text-gray-700">
//             <MdMarkEmailRead className="text-indigo-500 text-xl" />
//             <span className="font-medium">Scanned mail:</span>
//             <span className="text-sm">{email || "Not scanned yet"}</span>
//           </div>

//           {loading && (
//             <div className="flex items-center gap-2 text-sm text-blue-500">
//               <span className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></span>
//               Sending...
//             </div>
//           )}

//           {result && (
//             <div
//               className={`px-4 py-2 rounded-md text-sm ${
//                 result.includes("✅")
//                   ? "bg-green-100 text-green-700"
//                   : "bg-red-100 text-red-700"
//               }`}
//             >
//               {result}
//             </div>
//           )}

//           <div className="flex items-center gap-3     bg-[#ffffff34] flex-col justify-center  p-3 rounded-lg shadow-sm">
//             <IoIosPeople className="text-2xl text-white" />
//             <div className="flex flex-col justify-center items-center ">
//               <div className="text-5xl  font-bold">{count}</div>
//               <div className="text-sm text-gray-400">Number of attendees</div>
//             </div>
//           </div>

//           {result.includes("❌") && (
//             <button
//               onClick={() => email && checkIn(email)}
//               disabled={loading || !email}
//               className="mt-2 px-4 py-2 bg-yellow-400 text-black justify-center  rounded hover:bg-yellow-600 flex items-center gap-2"
//             >
//               🔄 Retry
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default QRScanner;

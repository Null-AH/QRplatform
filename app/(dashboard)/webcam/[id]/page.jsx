"use client";

import React, { useRef, useEffect, useState } from "react";
import { FaCamera, FaPlayCircle, FaStopCircle } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import { MdMarkEmailRead } from "react-icons/md";
import axios from "axios";
import Webcam from "react-webcam";
import jsQR from "jsqr";

function QRScanner() {
  const webcamRef = useRef(null);
  const [email, setEmail] = useState("");
  const [result, setResult] = useState("");
  const [count, setCount] = useState(0);
  const [scanned, setScanned] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  const captureAndScan = () => {
    if (!webcamRef.current || loading) return;
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

      if (code && code.data && !scanned) {
        setScanned(true);
        setEmail(code.data);
        checkIn(code.data).finally(() => {
          setTimeout(() => {
            setScanned(false);
            setEmail("");
            setResult("");
          }, 3000);
        });
      }
    };
  };

  const checkIn = async (email) => {
    setLoading(true);
    try {
      const res = await axios.post(
        "https://223697be-dba2-4e1a-967b-05417df13393-00-1imqs6jxkgayy.pike.replit.dev/check-in",
        { email },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        }
      );

      if (res.data.guest?.name) {
        setResult(`✅ Attendance recorded: ${res.data.guest.name}`);
      } else {
        setResult(res.data.message);
      }

      if (res.data.count !== undefined) {
        setCount(res.data.count);
      } else {
        await fetchCount();
      }
    } catch (error) {
      if (error.response) {
        setResult(error.response.data.message || "❌ Server error");
      } else if (error.request) {
        setResult("❌ Cannot connect to server");
      } else {
        setResult("❌ Sending error");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCount = async () => {
    try {
      const res = await axios.get(
        "https://223697be-dba2-4e1a-967b-05417df13393-00-1imqs6jxkgayy.pike.replit.dev/count",
        { timeout: 5000 }
      );
      setCount(res.data.count);
    } catch (err) {
      console.error("Error fetching count:", err);
    }
  };

  useEffect(() => {
    fetchCount();
    if (cameraOn) {
      intervalRef.current = setInterval(() => {
        captureAndScan();
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [cameraOn, scanned, loading]);

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
              setScanned(false);
              setResult("");
              setEmail("");
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
            <div className="absolute inset-0 pointer-events-none rounded-md" />
          </div>
        )}

        <div className="space-y-4 flex flex-col ">
          <div className="flex w-full items-center justify-center gap-2 text-gray-700">
            <MdMarkEmailRead className="text-indigo-500 text-xl" />
            <span className="font-medium">Scanned mail:</span>
            <span className="text-sm">{email || "Not scanned yet"}</span>
          </div>

          {loading && (
            <div className="flex items-center gap-2 text-sm text-blue-500">
              <span className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></span>
              Sending...
            </div>
          )}

          {result && (
            <div
              className={`px-4 py-2 rounded-md text-sm ${
                result.includes("✅")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {result}
            </div>
          )}

          <div className="flex items-center gap-3     bg-[#ffffff34] flex-col justify-center  p-3 rounded-lg shadow-sm">
            <IoIosPeople className="text-2xl text-white" />
            <div className="flex flex-col justify-center items-center ">
              <div className="text-5xl  font-bold">{count}</div>
              <div className="text-sm text-gray-400">Number of attendees</div>
            </div>
          </div>

          {result.includes("❌") && (
            <button
              onClick={() => email && checkIn(email)}
              disabled={loading || !email}
              className="mt-2 px-4 py-2 bg-yellow-400 text-black justify-center  rounded hover:bg-yellow-600 flex items-center gap-2"
            >
              🔄 Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QRScanner;

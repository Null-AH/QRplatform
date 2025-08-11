"use client";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import Actions from "./modealCard";



export default function WaveCard({ tags, title, description, buttonText , imagurl=`https://placehold.co/600x400/2B2543/FFFFFF/png?text=${title}` ,href,id}) {
  const canvasRef = useRef(null);
const isValidImage = (url) => {
  if (!url) return false;
  const trimmed = url.trim().toLowerCase();
  // استبعاد أي رابط placeholder معروف
  if (trimmed.includes("placehold.co")) return false;
  // ممكن تضيف شروط أكثر إذا عندك روابط مزيفة ثانية
  return true;
};

const finalImage = isValidImage(imagurl)
  ? imagurl
  : `https://placehold.co/500x400/020618/FFFFFF/png?text=${encodeURIComponent(title)}`;


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let time = 0;
    const waveData = Array.from({ length: 8 }).map(() => ({
      value: Math.random() * 0.5 + 0.1,
      targetValue: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.02 + 0.01,
    }));
    function resizeCanvas() {
      if (!canvas) return;
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    }
    function updateWaveData() {
      waveData.forEach((data) => {
        if (Math.random() < 0.01) data.targetValue = Math.random() * 0.7 + 0.1;
        const diff = data.targetValue - data.value;
        data.value += diff * data.speed;
      });
    }
    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Removed background color
      waveData.forEach((data, i) => {
        const freq = data.value * 7;
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x++) {
          const nx = (x / canvas.width) * 2 - 1;
          const px = nx + i * 0.04 + freq * 0.03;
          const py =
            Math.sin(px * 10 + time) *
            Math.cos(px * 2) *
            freq *
            0.1 *
            ((i + 1) / 8);
          const y = ((py + 1) * canvas.height) / 2;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        const intensity = Math.min(1, freq * 0.3);
        const r = 79 + intensity * 100;
        const g = 70 + intensity * 130;
        const b = 229;
        ctx.lineWidth = 1 + i * 0.3;
        ctx.strokeStyle = `rgba(${r},${g},${b},0.6)`;
        ctx.shadowColor = `rgba(${r},${g},${b},0.5)`;
        ctx.shadowBlur = 5;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });
    }
    function animate() {
      time += 0.02;
      updateWaveData();
      draw();
      requestAnimationFrame(animate);
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    animate();
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Constrained Canvas */}
      {/* <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-0"
        style={{ background: "transparent" }}
      /> */}

      {/* Card Content */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center items-center p-2">
        <div className="w-full max-w-xs">
          <div className="relative border border-[#3C397A] overflow-hidden rounded-2xl flex flex-col animate-float bg-[#201A50]/30 backdrop-blur-lg">
            <div className="p-4 flex justify-center relative">
              <div className="w-full h-48 rounded-xl border border-[#2F5BB8] inner-glow overflow-hidden relative">
                <div className="absolute ">

                

                    <img  className="w-full h-full "  src={finalImage} alt={title} />
                  

                </div>
              </div>
            </div>
            <div className="w-full   h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />


            <div className="p-4">
      
      <div className="flex w-full justify-between">
              <span className="inline-block px-3 py-1 glass text-indigo-300 rounded-full text-xs font-medium mb-3 border border-indigo-400/30">
                {tags}
              </span>

             <Actions id={id} name={title} date={description} />
      </div>
             
              <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
              <p className="text-white/70 mb-4 leading-relaxed text-xs">
                {description}
              </p>
              <div className="flex justify-between items-center">
                <Link
                  href={href}
                  className="text-indigo-400 hover:text-indigo-300 transition flex items-center text-xs font-medium glass px-3 py-1.5 rounded-lg border border-indigo-400/30">
                  {buttonText}
                  <svg className="w-3 h-3 ml-1" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
                <Link href={`webcam/${id}`} className="text-white/50 text-xs glass px-2 py-1 rounded-full border border-white/10">
                  use
                </Link>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}

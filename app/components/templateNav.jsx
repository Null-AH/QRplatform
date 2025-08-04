"use client";
import Link from "next/link";
import { useState } from "react";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop NavBar */}
      <div className="hidden md:flex h-[60px] w-[70%] fixed top-6 z-50 left-1/2 -translate-x-1/2 
                      px-6 rounded-full border border-white/20 backdrop-blur-md bg-white/10 
                      text-white items-center justify-between shadow-md transition-all duration-300 
                      hover:shadow-[0_8px_40px_rgba(0,0,0,0.15)] hover:bg-white/15">

        <div className="text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent 
                        hover:from-blue-400 hover:to-purple-400 transition-all duration-300 cursor-pointer">
          LOGO
        </div>

        <div className="flex gap-6 text-sm font-medium">
          <Link href="/workspace"
                className="relative cursor-pointer inline-flex items-center gap-2 px-6 py-3 font-semibold text-blue-50 
                          bg-gradient-to-tr from-blue-900/30 via-blue-900/70 to-blue-900/30 ring-4 ring-blue-900/20 
                          rounded-full overflow-hidden hover:opacity-90 hover:ring-blue-800/30 hover:from-blue-800/40 
                          hover:via-blue-800/80 hover:to-blue-800/40 transition-all duration-300 
                          hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-105 active:scale-95
                          before:absolute before:top-4 before:left-1/2 before:-translate-x-1/2 before:w-[100px] 
                          before:h-[100px] before:rounded-full before:bg-gradient-to-b before:from-blue-50/10 before:blur-xl
                          after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-r after:from-transparent 
                          after:via-white/5 after:to-transparent after:opacity-0 hover:after:opacity-100 
                          after:transition-opacity after:duration-300">
            Create New
          </Link>
        </div>
      </div>

      {/* Mobile NavBar */}
      <div className="md:hidden fixed top-4 left-4 right-4 z-50">
        <div className="flex h-[55px] px-4 rounded-2xl border border-white/20 backdrop-blur-md bg-white/10 
                        text-white items-center justify-between shadow-md">
          
          <div className="text-lg font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            LOGO
          </div>

          {/* Hamburger Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex flex-col gap-1 p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
          >
            <div className={`w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
            <div className={`w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mt-2 rounded-2xl border border-white/20 backdrop-blur-md bg-white/10 
                        shadow-md text-white transition-all duration-300 overflow-hidden ${
                          isOpen ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                        }`}>
          <div className="flex flex-col p-4">
            <Link href="/workspace" 
                  onClick={() => setIsOpen(false)}
                  className="relative cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-3 
                            font-semibold text-blue-50 bg-gradient-to-tr from-blue-900/30 via-blue-900/70 to-blue-900/30 
                            ring-2 ring-blue-900/20 rounded-full overflow-hidden hover:opacity-90 hover:ring-blue-800/30 
                            hover:from-blue-800/40 hover:via-blue-800/80 hover:to-blue-800/40 transition-all duration-300 
                            hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] active:scale-95
                            before:absolute before:top-2 before:left-1/2 before:-translate-x-1/2 before:w-[80px] 
                            before:h-[80px] before:rounded-full before:bg-gradient-to-b before:from-blue-50/10 before:blur-xl
                            after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-r after:from-transparent 
                            after:via-white/5 after:to-transparent after:opacity-0 hover:after:opacity-100 
                            after:transition-opacity after:duration-300">
              Create New
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
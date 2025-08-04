"use client";
import Signup from "@/components/signup";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import Login from "@/components/login";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

   const [user, setUser] = useState(null);
   const [checkingVerification, setCheckingVerification] = useState(false);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      
      if (firebaseUser?.emailVerified) {
        setUser({
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photo: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const checkEmailVerification = async () => {
  if (auth.currentUser) {
    await auth.currentUser.reload();
    if (auth.currentUser.emailVerified) {
      setUser({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
        photo: auth.currentUser.photoURL,
      });
    }
  }
};
useEffect(() => {
  const interval = setInterval(() => {
    if (auth.currentUser && !auth.currentUser.emailVerified) {
      checkEmailVerification();
    }
  }, 5000); // كل 5 ثواني

  return () => clearInterval(interval);
}, []);


  return (
    <>
      {/* Desktop NavBar */}
      <div className="hidden md:flex h-[60px] w-[70%] fixed top-6 z-50 left-1/2 -translate-x-1/2 
                      px-6 rounded-full border border-gray-500/30 bg-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[10px]
                      text-white items-center justify-between transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.15)]">

        <div className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent 
                        hover:from-blue-400 hover:to-purple-400 transition-all duration-300 cursor-pointer">
          LOGO
        </div>

        <div className="flex gap-6 text-sm font-medium">
          <a href="#home" 
             className="cursor-pointer relative px-3 py-2 rounded-full transition-all duration-300 
                       hover:bg-white/10 hover:text-blue-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]
                       before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r 
                       before:from-blue-500/0 before:to-purple-500/0 hover:before:from-blue-500/20 
                       hover:before:to-purple-500/20 before:transition-all before:duration-300">
            Home
          </a>
          <a href="#questions" 
             className="cursor-pointer relative px-3 py-2 rounded-full transition-all duration-300 
                       hover:bg-white/10 hover:text-blue-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]
                       before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r 
                       before:from-blue-500/0 before:to-purple-500/0 hover:before:from-blue-500/20 
                       hover:before:to-purple-500/20 before:transition-all before:duration-300">
            About
          </a>
          <a href="#features" 
             className="cursor-pointer relative px-3 py-2 rounded-full transition-all duration-300 
                       hover:bg-white/10 hover:text-blue-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]
                       before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r 
                       before:from-blue-500/0 before:to-purple-500/0 hover:before:from-blue-500/20 
                       hover:before:to-purple-500/20 before:transition-all before:duration-300">
            Features
          </a>
          <a href="#contact" 
             className="cursor-pointer relative px-3 py-2 rounded-full transition-all duration-300 
                       hover:bg-white/10 hover:text-blue-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]
                       before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r 
                       before:from-blue-500/0 before:to-purple-500/0 hover:before:from-blue-500/20 
                       hover:before:to-purple-500/20 before:transition-all before:duration-300">
            Contact
          </a>
              {user?  <Link href="/templates" 
                className="cursor-pointer relative px-3 py-2 rounded-full transition-all duration-300 
                          bg-white/10 hover:text-purple-300 shadow-[0_0_15px_rgba(147,51,234,0.3)]
                          before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r 
                            before:from-purple-500/20 
                          before:to-pink-500/20 before:transition-all before:duration-300">
            Your Templates
          </Link> : <></>}

      {user? <></> :    <div className="flex gap-1"><div  
                    className="">
                      <Signup  />
                  </div>
                  <div>


                    <Login />
                  </div>
                  
                  </div> }
            
        </div>
      </div>

      {/* Mobile NavBar */}
      <div className="md:hidden fixed top-4 left-4 right-4 z-50">
        <div className="flex h-[55px] px-4 rounded-2xl border border-gray-500/30 bg-white/5 
                        shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[10px] text-white 
                        items-center justify-between">
          
          <div className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
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
        <div className={`mt-2 rounded-2xl border border-gray-500/30 bg-white/5 
                        shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[10px] text-white
                        transition-all duration-300 overflow-hidden ${
                          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}>
          <div className="flex flex-col p-4 gap-3">
            <a href="#home" 
               onClick={() => setIsOpen(false)}
               className="cursor-pointer px-4 py-3 rounded-xl transition-all duration-300 
                         hover:bg-white/10 hover:text-blue-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]
                         active:scale-95">
              Home
            </a>
            <a href="#questions" 
               onClick={() => setIsOpen(false)}
               className="cursor-pointer px-4 py-3 rounded-xl transition-all duration-300 
                         hover:bg-white/10 hover:text-blue-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]
                         active:scale-95">
              About
            </a>
            <a href="#features" 
               onClick={() => setIsOpen(false)}
               className="cursor-pointer px-4 py-3 rounded-xl transition-all duration-300 
                         hover:bg-white/10 hover:text-blue-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]
                         active:scale-95">
              Features
            </a>
            <a href="#contact" 
               onClick={() => setIsOpen(false)}
               className="cursor-pointer px-4 py-3 rounded-xl transition-all duration-300 
                         hover:bg-white/10 hover:text-blue-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]
                         active:scale-95">
              Contact
            </a>
           {user?  <Link href="/templates" 
                className="cursor-pointer relative px-3 py-2 rounded-full transition-all duration-300 
                          bg-white/10 hover:text-purple-300 shadow-[0_0_15px_rgba(147,51,234,0.3)]
                          before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r 
                            before:from-purple-500/20 
                          before:to-pink-500/20 before:transition-all before:duration-300">
            Your Templates
          </Link> : <></>}
         


        {user? <></> :    <><div  
                    className="">
                      <Signup  />
                  </div>
                  <div>


                    <Login />
                  </div>
                  
                  </> }
          </div>
        </div>
      </div>
    </>
  );
}
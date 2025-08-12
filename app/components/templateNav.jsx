"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "../firebase/config";







export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const [userinfo,setUserInfo]=useState({email:"",name:"",imgUrl:""});

 useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((currentUser) => {
    if (currentUser) {
      setUserInfo({
        email: currentUser.email || "",
        name: currentUser.displayName || "",
        imgUrl: currentUser.photoURL || "",
      });
      console.log(currentUser);
    }
  });

  return () => unsubscribe();
}, []); // خليه ثابت [] حتى ما يتغير

  return (
    <>
      {/* Desktop NavBar */}
      <div className="hidden md:flex h-[60px] w-[70%] fixed top-6 z-50 left-1/2 -translate-x-1/2 
                      px-6 rounded-full border border-white/20 backdrop-blur-md bg-white/10 
                      text-white items-center justify-between shadow-md transition-all duration-300 
                      hover:shadow-[0_8px_40px_rgba(0,0,0,0.15)] hover:bg-white/15">

        <div className="text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent 
                        hover:from-blue-400 hover:to-purple-400 transition-all duration-300 cursor-pointer">
        <div className="flex items-center justify-center gap-2">
                {/* صورة المستخدم + الإيميل */}
                <div className="flex flex-col p-2 items-start">
               

                {userinfo.imgUrl 
                      ? <img src={userinfo.imgUrl} alt="User"     className="w-11 h-11 rounded-full border border-white/30 shadow-sm" /> 
                      : <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf1fiSQO7JfDw0uv1Ae_Ye-Bo9nhGNg27dwg&s" alt="Default avatar"      className="w-11 h-11 rounded-full border border-white/30 shadow-sm"/>
                    }
                </div>

            <div className="flex flex-col  items-start">           
               
                <h3 className="text-sm font-semibold text-white">{userinfo.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{userinfo.email}</p> </div>
              
              </div>

        </div>

        <div className="flex gap-6 text-sm font-medium">

          <div>
                            <Link href="/workspace" className="buttonpro">
                  <div className="dots_border"></div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="sparkle"
                  >
                    <path
                      className="path"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      stroke="black"
                      fill="black"
                      d="M14.187 8.096L15 5.25L15.813 8.096C16.0231 8.83114 16.4171 9.50062 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.1689 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.9769 15.1689 13.5829 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.8311 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.50162 13.9759 8.83214 14.186 8.097L14.187 8.096Z"
                    ></path>
                    <path
                      className="path"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      stroke="black"
                      fill="black"
                      d="M6 14.25L5.741 15.285C5.59267 15.8785 5.28579 16.4206 4.85319 16.8532C4.42059 17.2858 3.87853 17.5927 3.285 17.741L2.25 18L3.285 18.259C3.87853 18.4073 4.42059 18.7142 4.85319 19.1468C5.28579 19.5794 5.59267 20.1215 5.741 20.715L6 21.75L6.259 20.715C6.40725 20.1216 6.71398 19.5796 7.14639 19.147C7.5788 18.7144 8.12065 18.4075 8.714 18.259L9.75 18L8.714 17.741C8.12065 17.5925 7.5788 17.2856 7.14639 16.853C6.71398 16.4204 6.40725 15.8784 6.259 15.285L6 14.25Z"
                    ></path>
                    <path
                      className="path"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      stroke="black"
                      fill="black"
                      d="M6.5 4L6.303 4.5915C6.24777 4.75718 6.15472 4.90774 6.03123 5.03123C5.90774 5.15472 5.75718 5.24777 5.5915 5.303L5 5.5L5.5915 5.697C5.75718 5.75223 5.90774 5.84528 6.03123 5.96877C6.15472 6.09226 6.24777 6.24282 6.303 6.4085L6.5 7L6.697 6.4085C6.75223 6.24282 6.84528 6.09226 6.96877 5.96877C7.09226 5.84528 7.24282 5.75223 7.4085 5.697L8 5.5L7.4085 5.303C7.24282 5.24777 7.09226 5.15472 6.96877 5.03123C6.84528 4.90774 6.75223 4.75718 6.697 4.5915L6.5 4Z"
                    ></path>
                  </svg>
                  <span className="text_button">Pro template</span>
                </Link >

          </div>

          
          <Link href="/workspacefree"
             className="relative cursor-pointer inline-flex items-center gap-2 px-6 py-3 font-semibold text-white
  bg-gradient-to-tr from-[#000000] via-[#1f1f1f] to-[#1b1b1b] ring-4 ring-black/10
  rounded-full overflow-hidden hover:opacity-95 hover:ring-black/10 hover:from-black hover:via-[#1f1f1f] hover:to-black
  transition-all duration-300
  hover:shadow-[0_0_25px_rgba(0,0,0,0.6)] hover:scale-105 active:scale-95
  before:absolute before:top-4 before:left-1/2 before:-translate-x-1/2 before:w-[100px]
  before:h-[100px] before:rounded-full before:bg-gradient-to-b before:from-white/10 before:blur-xl
  after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-r after:from-transparent
  after:via-white/5 after:to-transparent after:opacity-0 hover:after:opacity-100
  after:transition-opacity after:duration-300"

>
            Create New
          </Link>
        </div>
      </div>

      {/* Mobile NavBar */}
      <div className="md:hidden fixed top-4 left-4 right-4 z-50">
        <div className="flex h-[55px] px-4 rounded-2xl border border-white/20 backdrop-blur-md bg-white/10 
                        text-white items-center justify-between shadow-md">
          
           <div className="text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent 
                        hover:from-blue-400 hover:to-purple-400 transition-all duration-300 cursor-pointer">
        <div className="flex items-center justify-center gap-2">
                {/* صورة المستخدم + الإيميل */}
                <div className="flex flex-col p-2 items-start">
               

                {userinfo.imgUrl 
                      ? <img src={userinfo.imgUrl} alt="User"     className="w-11 h-11 rounded-full border border-white/30 shadow-sm" /> 
                      : <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf1fiSQO7JfDw0uv1Ae_Ye-Bo9nhGNg27dwg&s" alt="Default avatar"      className="w-11 h-11 rounded-full border border-white/30 shadow-sm"/>
                    }
                </div>

            <div className="flex flex-col  items-start">           
               
                <h3 className="text-sm font-semibold text-white">{userinfo.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{userinfo.email}</p> </div>
              
              </div>

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
                        shadow-md text-white transition-all duration-300 overflow-hidden p-7 ${
                          isOpen ? 'max-h-44 opacity-100' : 'max-h-0 opacity-0'
                        }`}>
               <div className="flex flex-col p-2 gap-5">
                <Link href="/workspacefree"
                            className="relative cursor-pointer inline-flex items-center gap-2 px-6 py-3 font-semibold text-white
                  bg-gradient-to-tr from-[#000000] via-[#1f1f1f] to-[#1b1b1b] ring-4 ring-black/10
                  rounded-full overflow-hidden hover:opacity-95 hover:ring-black/10 hover:from-black hover:via-[#1f1f1f] hover:to-black
                  transition-all duration-300
                  hover:shadow-[0_0_25px_rgba(0,0,0,0.6)] hover:scale-105 active:scale-95
                  before:absolute before:top-4 before:left-1/2 before:-translate-x-1/2 before:w-[100px]
                  before:h-[100px] before:rounded-full before:bg-gradient-to-b before:from-white/10 before:blur-xl
                  after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-r after:from-transparent
                  after:via-white/5 after:to-transparent after:opacity-0 hover:after:opacity-100
                  after:transition-opacity after:duration-300"

                >
                            Create New
          </Link>

             <div>
                            <Link href="/workspace" className="buttonpro">
                  <div className="dots_border"></div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="sparkle"
                  >
                    <path
                      className="path"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      stroke="black"
                      fill="black"
                      d="M14.187 8.096L15 5.25L15.813 8.096C16.0231 8.83114 16.4171 9.50062 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.1689 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.9769 15.1689 13.5829 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.8311 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.50162 13.9759 8.83214 14.186 8.097L14.187 8.096Z"
                    ></path>
                    <path
                      className="path"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      stroke="black"
                      fill="black"
                      d="M6 14.25L5.741 15.285C5.59267 15.8785 5.28579 16.4206 4.85319 16.8532C4.42059 17.2858 3.87853 17.5927 3.285 17.741L2.25 18L3.285 18.259C3.87853 18.4073 4.42059 18.7142 4.85319 19.1468C5.28579 19.5794 5.59267 20.1215 5.741 20.715L6 21.75L6.259 20.715C6.40725 20.1216 6.71398 19.5796 7.14639 19.147C7.5788 18.7144 8.12065 18.4075 8.714 18.259L9.75 18L8.714 17.741C8.12065 17.5925 7.5788 17.2856 7.14639 16.853C6.71398 16.4204 6.40725 15.8784 6.259 15.285L6 14.25Z"
                    ></path>
                    <path
                      className="path"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      stroke="black"
                      fill="black"
                      d="M6.5 4L6.303 4.5915C6.24777 4.75718 6.15472 4.90774 6.03123 5.03123C5.90774 5.15472 5.75718 5.24777 5.5915 5.303L5 5.5L5.5915 5.697C5.75718 5.75223 5.90774 5.84528 6.03123 5.96877C6.15472 6.09226 6.24777 6.24282 6.303 6.4085L6.5 7L6.697 6.4085C6.75223 6.24282 6.84528 6.09226 6.96877 5.96877C7.09226 5.84528 7.24282 5.75223 7.4085 5.697L8 5.5L7.4085 5.303C7.24282 5.24777 7.09226 5.15472 6.96877 5.03123C6.84528 4.90774 6.75223 4.75718 6.697 4.5915L6.5 4Z"
                    ></path>
                  </svg>
                  <span className="text_button">Pro template</span>
                </Link >

          </div>
          </div>
        </div>
      </div>
    </>
  );
}
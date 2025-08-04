"use client"
// import { useState } from "react"
import { useEvent } from "../../(dashboard)/context/StepsInfo";


export default function NameOfEvents(){
const {eventName,setEventName ,eventDate, setEventDate}=useEvent();




    return(<>
    
    <div className="flex  justify-center items-center w-full h-full">

        

                <div className="w-full flex flex-col justify-center items-center max-w-lg p-5  bg-[#ffffff27] rounded-lg font-mono gap-3">


                    <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="unique-input">
                       Event Name 
                     </label>
                
                <input
                    className="text-sm custom-input w-full px-4 py-2 border border-gray-500 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 focus:outline-[#fff] hover:shadow-lg hover:border-[#fff] bg-[#151515]"
                    placeholder="Enter text here"
                    value={eventName}
                    type="text"
                    id="unique-input"
                    onChange={(event=>{
                        setEventName(event.target.value);
                    })}
                />




                  <label className="block text-gray-300 text-sm font-bold mt-4 mb-2" htmlFor="unique-input">
                       Event Date 
                     </label>
                
                <input
                    className="text-sm text-white custom-input w-full px-4 py-2 border border-gray-500 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 focus:outline-[#fff] hover:shadow-lg hover:border-[#fff] bg-[#151515]"
                    value={eventDate}
                    type="date"
                    id="unique-input"
                    onChange={(event=>{
                        setEventDate(event.target.value);
                    })}
                />
                </div>

        

    </div>
    
    </>)



}







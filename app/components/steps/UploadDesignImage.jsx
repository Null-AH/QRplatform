
"use client"
import { useState } from "react"
import TablePreview from "./DisplayTable";
import { useEvent } from "../../(dashboard)/context/StepsInfo";

export default function UploatdDesignImage(){

    const {designImage,setDesignImage}=useEvent();




    return(<>
    <div className="flex  flex-col justify-center items-center max-w-full gap-3">



{designImage && (
        <img
          src={URL.createObjectURL(designImage)}
          alt="no image chosen"
          className="max-w-[300px] max-h-[300px] z-50 rounded-3xl shadow-[#fff] border-[#ffffff58] border object-contain"
        />
      )}
            
         <div className="input-div z-40">
                <input  className="input" onChange={(event)=>{
                    setDesignImage(event.target.files[0]);
                }} name="file"  type="file"  accept="image/png, image/jpeg"/>

                <svg xmlns="http://www.w3.org/2000/svg" width="1em"  height="1em" strokeLinejoin="round" strokeLinecap="round" viewBox="0 0 24 24" strokeWidth={2} fill="none" stroke="currentColor" className="icon -z-1"><polyline points="16 16 12 12 8 16" /><line y2={21} x2={12} y1={12} x1={12} /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /><polyline points="16 16 12 12 8 16" /></svg>
         </div>


            


    </div>
    
    
    
    </>)


}





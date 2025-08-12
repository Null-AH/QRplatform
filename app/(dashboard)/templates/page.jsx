"use client"
import TextType from "@/app/components/emptyTemplate";
import WaveCard from "@/app/components/EventCard";
import NavBar from "@/app/components/templateNav";
import ShinyText from "@/app/components/TextHomePAge";

import { LoaderOne } from "@/components/loding";
import axios from "axios";

import Link from "next/link";

import { useState } from "react";
import { useEffect } from "react";

export default function TemplatesPage() {

const [template,setTemplate]=useState([]);
const [loding,setloding]=useState(false);


const baseApiUrl = "https://mk25szk5-7093.inc1.devtunnels.ms";

useEffect(()=>{


const GetTemplate=async ()=>{

    setloding(true);


    console.log(localStorage.getItem("token"))
    try{
    const response =await axios.get(`${baseApiUrl}/api/event/all`,          
    {
    headers:{
    'Authorization': `Bearer ${localStorage.getItem("token")}`      

    }
    }

    )
    setloding(false);
    console.log(response.data);
    setTemplate(response.data);

    }
    catch(error)
    {
    console.log(error);

    } 
    finally{
    setloding(false)
    }

}


GetTemplate();
  },[])

  return (
    <div className="flex flex-wrap justify-center gap-6 p-6 b min-h-screen">
        <NavBar />

            <div className="w-full max-w-7xl mx-auto px-4 mt-[100px]">

        {loding?
        
        <div className="flex w-full h-full justify-center items-center"  >
          
          <LoaderOne />
          

          
          </div>
          
          
          : 
          
          <> 
          
          
           {template.length===0? <>
             
              <div className="flex w-full  justify-center items-center h-full ">




                <TextType 
                  text={["you dont have any Template yet", "Create New Template", "Click Create Teamplate"]}
                  typingSpeed={75}
                  pauseDuration={1500}
                  showCursor={true}
                  cursorCharacter="_"
                  className="text-[30px] mb-[100px] text-shadow-2xl p-3"
                  
                />
                {/* <ShinyText text="you dont have any Template yet" disabled={false} speed={3} className='custom-class' /> */}
                {/* <h1 className="text-[30px] text-[#c4d1e2] mb-[100px]"></h1> */}
              </div>
              
              </>: <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">



            



            {template.map((item) => (


          <WaveCard
              key={item.id}
              tags={`${item.attendeeCount} person`}
              title={item.name}
              description={item.eventDate}
              buttonText="Manage"
              imagurl={`${baseApiUrl}${item.backgroundImageUri}`} 
              href={`templates/${item.id}`}
              id={item.id}
            />
              
            
            ))}

          </div>}</>}
            
 
</div>

    
    </div>
  );
}



    {/* {template.map((item) => (

      
      <div key={item.id}>
        <div className="relative flex w-full flex-col rounded-xl bg-[#ffffff2a] backdrop-blur-3xl bg-clip-border justify-center items-center text-white shadow-md">
          <div className="relative w-[95%] -top-9  h-40 overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-gray-500/40">
            <img src={`${baseApiUrl}${item.backgroundImageUri}`} className="w-full h-full object-cover" />
          </div>


          <div className="flex flex-col relative -top-5"> 
          <div className="p-6">
            <h5 className="mb-2 text-xl font-semibold text-blue-gray-900">
              {item.name}
            </h5>
            <p className="text-base font-light text-gray-300">{item.eventDate}</p>
               <p className="text-base font-light text-gray-300">{item.attendeeCount}</p>
          </div>
          <div className="p-6 pt-0">
            <Link
              href={`templates/${item.id}`}
              className="select-none cursor-pointer rounded-lg bg-gradient-to-tr from-[#1e293b8f] via-[#475569] to-[#1e293b8f]  ring-4 ring-[#1e293b8f] py-3 px-6 text-center text-xs font-bold uppercase text-[#c4d1e2] shadow-md transition-all hover:shadow-lg"
            >
              Use Template
            </Link>
            
            
            </div>
          </div>
        </div>
      </div>
    ))} */}
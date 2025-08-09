"use client"
import { useEffect,useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import { auth } from "@/app/firebase/config";
import TasbleEventDetails from "@/components/TasbleEventDetails";
// import { headers } from "next/headers";




 const baseApiUrl = "https://mk25szk5-7093.inc1.devtunnels.ms";

const EventDetails=()=>{

    const {id}=useParams()


//     useEffect(()=>{

//         const GetEventDetails=async()=>{

//           const currentUser = auth.currentUser;
//       if (!currentUser) {
//         alert("You must be logged in to create an event.");
     
//         return;
//       }

//       const idToken = await currentUser.getIdToken();


//             try{
//                 console.log(id)
//                     const response =await axios.get(`${baseApiUrl}/api/event/${id}`,
//                         {
//                             headers:{
//                             'Authorization': `Bearer ${idToken}`      
                            
//                         }
                        
//                         })

//                         console.log(response.data)
//             }
//             catch(error){
//                 console.log("error her",error);
//             }




//         }

// GetEventDetails();

//     },[])





    return(
    
    <div className="p-10">

    <TasbleEventDetails url={`${baseApiUrl}/api/event/${id}`} />
    
    
    
    
    
    
    
    
    
    </div>
    
)



}








export default EventDetails;


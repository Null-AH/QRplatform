"use client"
import { useEffect,useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import { auth } from "@/app/firebase/config";
import TasbleEventDetails from "@/components/TasbleEventDetails";
import TableCollaborators from "@/components/tableCollaborator";
// import { headers } from "next/headers";




 const baseApiUrl = "https://mk25szk5-7093.inc1.devtunnels.ms";

const EventDetails=()=>{


    const [EventInfo,setEventInfo]=useState([]);
    const {id}=useParams()


    useEffect(()=>{

        const GetEventDetails=async()=>{

    //       const currentUser = auth.currentUser;
    //   if (!currentUser) {
    //     alert("You must be logged in to create an event.");
     
    //     return;
    //   }

    //   const idToken = await currentUser.getIdToken();


            try{
                console.log(id)
                    const response =await axios.get(`${baseApiUrl}/api/event/${id}`,
                        {
                            headers:{
                            'Authorization': `Bearer ${localStorage.getItem("token")}`      
                            
                        }
                        
                        })

                        console.log("peratn", response.data)
                        setEventInfo(response.data);
            }
            catch(error){
                console.log("error her",error);
            }




        }

GetEventDetails();

    },[])





    return(
    <div className="flex w-full h-full justify-center items-center">


    <div className="p-10 flex  flex-col lg:flex-row justify-center">

    <TasbleEventDetails url={`${baseApiUrl}/api/event/${id}`} />
    
    
    <TableCollaborators />
    
    
    
    
    
    
    </div>
        </div>
)



}








export default EventDetails;


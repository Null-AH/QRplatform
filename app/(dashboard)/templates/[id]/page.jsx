"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import { auth } from "@/app/firebase/config";
import TasbleEventDetails from "@/components/TasbleEventDetails";
import TableCollaborators from "@/components/tableCollaborator";

const baseApiUrl = "https://mk25szk5-7093.inc1.devtunnels.ms";

const EventDetails = () => {
    const [EventInfo, setEventInfo] = useState([]);
    const { id } = useParams()

    useEffect(() => {
        const GetEventDetails = async () => {
            try {
                console.log(id)
                const response = await axios.get(`${baseApiUrl}/api/event/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("token")}`
                    }
                })
                console.log("peratn", response.data)
                setEventInfo(response.data);
            }
            catch (error) {
                console.log("error her", error);
            }
        }
        GetEventDetails();
    }, [])

    return (
        <div className="w-full min-h-screen">
            <div className="max-w-full mx-auto py-10">
                {/* Layout responsive - عمود واحد دائماً لأن الجدول الأول كبير جداً */}
                <div className="flex flex-col gap-8">
                    
                    {/* Event Details Table - يأخذ العرض الكامل */}
                    <div className="w-full">
                        <TasbleEventDetails url={`${baseApiUrl}/api/event/${id}`} />
                    </div>
                    
                    {/* Collaborators Table - يظهر تحت الجدول الأول */}
                    <div className="w-full max-w-4xl mx-auto px-4">
                        <TableCollaborators id={id} />
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default EventDetails;
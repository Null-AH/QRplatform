"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import { auth } from "@/app/firebase/config";
import TasbleEventDetails from "@/components/TasbleEventDetails";
import TableCollaborators from "@/components/tableCollaborator";
import Link from "next/link";


const baseApiUrl = "https://mk25szk5-7093.inc1.devtunnels.ms";




const CameraIcon = ({ fill = "currentColor", size, height, width, ...props }) => {
  return (
    <svg
      fill="none"
      height={size || height || 24}
      viewBox="0 0 24 24"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M17.44 6.236c.04.07.11.12.2.12 2.4 0 4.36 1.958 4.36 4.355v5.934A4.368 4.368 0 0117.64 21H6.36A4.361 4.361 0 012 16.645V10.71a4.361 4.361 0 014.36-4.355c.08 0 .16-.04.19-.12l.06-.12.106-.222a97.79 97.79 0 01.714-1.486C7.89 3.51 8.67 3.01 9.64 3h4.71c.97.01 1.76.51 2.22 1.408.157.315.397.822.629 1.31l.141.299.1.22zm-.73 3.836c0 .5.4.9.9.9s.91-.4.91-.9-.41-.909-.91-.909-.9.41-.9.91zm-6.44 1.548c.47-.47 1.08-.719 1.73-.719.65 0 1.26.25 1.72.71.46.459.71 1.068.71 1.717A2.438 2.438 0 0112 15.756c-.65 0-1.26-.25-1.72-.71a2.408 2.408 0 01-.71-1.717v-.01c-.01-.63.24-1.24.7-1.699zm4.5 4.485a3.91 3.91 0 01-2.77 1.15 3.921 3.921 0 01-3.93-3.926 3.865 3.865 0 011.14-2.767A3.921 3.921 0 0112 9.402c1.05 0 2.04.41 2.78 1.15.74.749 1.15 1.738 1.15 2.777a3.958 3.958 0 01-1.16 2.776z"
        fill={fill}
        fillRule="evenodd"
      />
    </svg>
  );
};

const EnhancedCameraButton = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    console.log("Camera button clicked!");
    // يمكنك إضافة منطق التصوير هنا
  };

  return (
    <div className="relative">
      {/* Background glow effect */}
      <div 
        className={`absolute inset-0 rounded-full transition-all duration-300 ${
          isHovered ? 'bg-purple-400/20 scale-110 blur-xl' : 'bg-purple-500/10 scale-100 blur-lg'
        }`}
        style={{ backgroundColor: `#1F2937` }}
      />
      
      {/* Main button */}
      <button
        className={`cursor-pointer
          relative w-20 h-20 rounded-full border-2  border-white/20
          flex items-center justify-center
          transition-all duration-200 ease-out
          backdrop-blur-sm shadow-2xl
          ${isPressed ? 'scale-95' : isHovered ? 'scale-105' : 'scale-100'}
          ${isHovered ? 'shadow-purple-500/30' : 'shadow-black/30'}
        `}
        style={{ 
          backgroundColor: '#1F2937',
          boxShadow: isHovered 
            ? '0 20px 40px rgba(60, 57, 122, 0.4), 0 8px 16px rgba(0, 0, 0, 0.2)' 
            : '0 10px 25px rgba(0, 0, 0, 0.3)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onClick={handleClick}
        aria-label="Scan QR"
      >

        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/10 to-transparent" />
        

        <CameraIcon 
          size={28} 
          fill="white" 
          className={`
            transition-all duration-200
            ${isPressed ? 'scale-90' : 'scale-100'}
            drop-shadow-lg
          `}
        />
        
  
        <div 
          className={`
            absolute top-2 left-2 w-4 h-4 rounded-full
            bg-gradient-to-br from-white/40 to-transparent
            transition-all duration-300
            ${isHovered ? 'opacity-100 scale-110' : 'opacity-60 scale-100'}
          `}
        />
      </button>
      
  
      {isPressed && (
        <div className="absolute inset-0 rounded-full animate-ping border-2 border-white/30" />
      )}
    </div>
  );
};






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
           
                <div className="flex flex-col gap-8">
                    
                  
                    <div className="w-full">
                        <TasbleEventDetails url={`${baseApiUrl}/api/event/${id}`} />
                    </div>
                    
                  
                    <div className="w-full max-w-4xl mx-auto px-4">
                        <TableCollaborators id={id} />
                    </div>
                    
                  
                </div>
            </div>

             <Link href={`/webcam/${id}`} className="fixed cursor-pointer   lg:bottom-10 lg:right-20 bottom-8 right-10 z-50">
                <EnhancedCameraButton />
             </Link>
        </div>
    )
}

export default EventDetails;
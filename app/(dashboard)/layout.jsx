
import { EventProvider } from "./context/StepsInfo";


export default function DashboardLayout({ children }) {
  return (

    <EventProvider>
   
         {children}
      
    </EventProvider>
  );
}

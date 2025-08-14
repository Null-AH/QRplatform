import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Addcollaborator from "./addcollaborator";
import { cache, useEffect, useState } from "react";
import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle } from "lucide-react"







import { CircleAlertIcon } from "lucide-react"


import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

import EditRole from "./editRole";
import { useParams } from "next/navigation";
import { useAuth } from "@/app/(dashboard)/context/authLogin";
import { useReloadTemplate } from "@/app/(dashboard)/context/reloadTempleat";










function AlertDelete({CheckeArry ,setDeleteItem}) {
  const {id}=useParams();


  const StaffDeleteIds = CheckeArry
  .filter(item => item.status === true) // نخلي بس اللي status مالتهم true
  .map(item => item.userId); // نجيب بس الـ userId

  
const baseApiUrl = "https://mk25szk5-7093.inc1.devtunnels.ms";
  const handelDelete=async()=>{

   try{
    const respons= await axios.post(`${baseApiUrl}/api/event/${id}/deleteteam`,
      StaffDeleteIds
    ) 
    setDeleteItem(true);
    console.log(respons.data)
  }
  catch(error){
      console.error(error);
  }
 


  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className="bg-red-700 ml-3 cursor-pointer border-none hover:bg-red-500 hover:text-white">
        <Button variant="outline">Delete</Button>
      </AlertDialogTrigger>


     <AlertDialogContent className="bg-gray-950 border-gray-800 text-gray-100">
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border"
            style={{ backgroundColor: '#2F5BB8', borderColor: '#2F5BB8' }}
            aria-hidden="true"
          >
            <AlertCircle className="text-white opacity-90" size={16} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-100">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete your Event? All your data will
              be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-900 border-gray-700 text-gray-200 hover:bg-gray-800 cursor-pointer hover:text-gray-100">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
           className="bg-red-700 ml-3 cursor-pointer border-none hover:bg-red-500 hover:text-white"
           onClick={handelDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>

    </AlertDialog>
  );
}













export default function TableCollaborators({ url,urlRole }) {
  const { isSyncedWithBackend } = useAuth();
  const [deleteitem,setDeleteItem]=useState(false);
  // const [addItem,setAddItem]=useState(false);
  const [staff,setStaff]=useState([]);
  const [CheckeArry,setCheckArry]=useState([]);
  const [role,setRole]=useState("");
  const [openButtons,setOpenButtons]=useState(false);
  const [roleCollaborator,setRoleCollaborator]=useState("Editor");
  const [open,setOpen]=useState(false);
  const [loding,setloding]=useState(false);
  const [sendRole,setSendRole]=useState(false);

  const {addItem,setAddItem}=useReloadTemplate();

  const {id}=useParams();


  const StaffEditIds = CheckeArry
  .filter(item => item.status === true) // نخلي بس اللي status مالتهم true
  .map(item => item.userId); // نجيب بس الـ userId

  console.log(StaffEditIds);
const baseApiUrl = "https://mk25szk5-7093.inc1.devtunnels.ms";



useEffect(() => {
  if (!sendRole) return;

  const updatedData = staff
    .filter(item => StaffEditIds.includes(item.userId))
    .map(item => ({
      userId: item.userId,
      email: item.email,
      role: roleCollaborator
    }));

  console.log("data", updatedData);

  const sendEditRoles = async () => {
    try {
      const response = await axios.put(`${baseApiUrl}/api/event/${id}/editteam`, updatedData);
      console.log(response.data);
      setSendRole(false);
      setOpen(false)
    } catch (error) {
      console.log(error);
    }
    finally{
      setOpen(false)
    }
  };

  sendEditRoles();
}, [sendRole, staff, StaffEditIds, roleCollaborator]);


// fetch table
  useEffect(() => {
    const fetchdata=async()=>{
      
      if(!isSyncedWithBackend) return


      try{
        const response=await axios.get(urlRole)
        
        setRole(response.data.role)
        
        console.log(response.data.role, "from role")
      }
      catch(error){
        console.log(error);
      }
    }

    if (urlRole) {
      fetchdata();
    }
  }, [urlRole, isSyncedWithBackend])

  useEffect(() => {
    const fetchdata=async()=>{
      console.log(url)
      
      if(!isSyncedWithBackend) return

      try{
        const response=await axios.get(url)
        

        console.log("table collaborator",response.data)
        setStaff(response.data);
        setDeleteItem(false);
        setAddItem(false);
        setloding(false);
      }
      catch(error){
        console.log(error);
      }
      
    }

    if (url) {
      fetchdata();
    }
  }, [url,isSyncedWithBackend,sendRole,deleteitem,addItem])


  const handleStatusChange = (status, userId) => {
  setCheckArry((prev) => {
    const exists = prev.find((item) => item.userId === userId);

    let updated;
    if (exists) {
      updated = prev.map((item) =>
        item.userId === userId ? { ...item, status } : item
      );
    } else {
      updated = [...prev, { userId, status }];
    }


    const anyChecked = updated.some((item) => item.status === true);
    setOpenButtons(anyChecked);

    return updated;
  });

  console.log("check", status, " ", userId);
};


console.log(roleCollaborator);

  return (
    <div className="w-full">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Collaborators</h2>
        
   {role==="Owner"?  <div className="flex justify-around items-center mb-4">
             
                
                
                <div className="flex w-fit justify-end rounded-md p-1 cursor-pointer bg-[#1e2939]">
          <Addcollaborator id={id}  />
         
        </div>
       {openButtons?
       <> 
       <AlertDelete CheckeArry={CheckeArry} setDeleteItem={setDeleteItem}/>

         <EditRole loding={loding} setloding={setloding} setSendRole={setSendRole} Role={roleCollaborator} open={open} setOpen={setOpen} setRole={setRoleCollaborator} />
         </>:<></>}

        
        </div>:<></>}
      
  
      </div>


      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="min-w-[200px]">Name</TableHead>
              <TableHead className="min-w-[180px]">Email</TableHead>
              <TableHead className="min-w-[120px]">Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((item) => (
              <TableRow key={item.email} className="hover:bg-muted/50 ">
                <TableCell className={`flex justify-start gap-3 items-center`}>
                  {/* uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu */}
                   
                   {role==="Owner"?   <Checkbox
                    id={`${item.userId}`}
                    checked={CheckeArry.find((u) => u.userId === item.userId)?.status || false}
                    onCheckedChange={(checked) =>
                      handleStatusChange(checked,item.userId)
                    }
                    className="border-gray-600 cursor-pointer data-[state=checked]:bg-blue-600 h-6 w-6 data-[state=checked]:border-blue-600" />
                :<></>}
                   <div className="flex items-center gap-3">
                    <img
                      className="rounded-full flex-shrink-0"
                      src={item.pictureUrl}
                      width={40}
                      height={40}
                      alt={item.displayName} 
                    />
                    <div className="min-w-0">
                      <div className="font-medium truncate">{item.displayName}</div>
                      <span className="text-muted-foreground mt-0.5 text-xs truncate block">
                        {item.role}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="truncate" title={item.email}>
                    {item.email}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="truncate" title={item.role}>
                    {item.role}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <p className="text-muted-foreground mt-4 text-center text-sm">
        Table of Staff
      </p>
    </div>
  );
}
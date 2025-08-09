
"use client";

import {
  MoreHorizontal,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { AlertCircle } from "lucide-react"
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
import { useEffect ,useState} from "react";
import axios from "axios";
// import EditEvent from "@/components/editEvent";



import { useId } from "react"
import { CreditCardIcon, WalletIcon } from "lucide-react"
import { usePaymentInputs } from "react-payment-inputs"
import images from "react-payment-inputs/images";

// import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function EditEvent({id ,name,date}) {

const [nameState,setName]=useState(name);
const [dateState,setDate]=useState(date);

const handleEditEvent = async () => {
  console.log("clicked");
  try {
    const response = await axios.put(
      "https://mk25szk5-7093.inc1.devtunnels.ms/api/event/edit",
      {
        id: id,
        eventName: nameState,
        date: dateState,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log(response.data);
  } catch (error) {
    console.error("error in edit", error);
  }
};




  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="w-full cursor-pointer">Edit</span>
      </DialogTrigger>
      <DialogContent className="bg-gray-950 border-gray-800 text-gray-100">
        <DialogHeader>
          <DialogTitle className="text-left text-gray-100">
            Edit Event
          </DialogTitle>
          <DialogDescription className="text-left text-gray-400">
            Update your event details below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Name Event */}
          <div className="space-y-2">
            <Label htmlFor={`name`} className="text-gray-200">
              Event Name
            </Label>
            <Input
              id={`name`}
              type="text"
              value={nameState}
              placeholder="Enter event name"
              className="bg-gray-900 border-gray-700 text-gray-200 placeholder-gray-500"
              required
              onChange={(event)=>{
                setName(event.target.value);
              }}
            />
          </div>

          {/* Date Event */}
          <div className="space-y-2">
            <Label htmlFor={`date`} className="text-gray-200">
              Event Date
            </Label>
            <Input
              id={`date`}
              type="date"
              className="bg-gray-900 border-gray-700 text-gray-200"
              required
              value={dateState}
               onChange={(event)=>{
                setDate(event.target.value);
              }}
            />
          </div>

          {/* Update Button */}
          <Button
            type="button"
            className="w-full text-white hover:opacity-90"
            style={{ backgroundColor: "#2F5BB8" }}

            onClick={handleEditEvent}
          >
            Update Event
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}





function DeleteAlert({id}) {

   

const handleDelete = async () => {

     console.log("clicked");
  try {
    const response = await axios.delete(
      "https://mk25szk5-7093.inc1.devtunnels.ms/api/event/delete",
        { id: id }, 
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },

      }
    );
    console.log(response.data);
  } catch (error) {
    console.error("error in delet",error);
  }
};




  return (
    <AlertDialog >
      <AlertDialogTrigger asChild>
        <DropdownMenuItem 
          className="text-red-400 focus:text-red-300 focus:bg-red-500 cursor-pointer"
          onSelect={(e) => e.preventDefault()}
        >
          <span>Delete</span>
          <DropdownMenuShortcut className="text-red-400">⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </AlertDialogTrigger>
      
      <AlertDialogContent className="bg-gray-950  border-gray-800 text-gray-100">
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
          <AlertDialogCancel className="bg-gray-900 border-gray-700 text-gray-200 hover:bg-gray-800 hover:text-gray-100">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            className="text-white hover:opacity-90"
            style={{ backgroundColor: '#2F5BB8' }}

           onClick={handleDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}


export default function Actions({ id,date,name }) {
  return (
    <DropdownMenu className="relative">
      <DropdownMenuTrigger asChild>
        <div className="flex justify-end">
          <Button
            size="icon"
            variant="ghost"
            className="shadow-none mr-2 text-gray-500 hover:text-gray-200 cursor-pointer hover:bg-[#162038]"
            aria-label="Edit item"
          >
            <MoreHorizontal size={16} aria-hidden="true" />
          </Button>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="bg-[#060f27] border-gray-800"
      >
        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="text-gray-200 focus:bg-[#04256d] focus:text-[#fff]"
          >
            <EditEvent  id={id}  date={date} name={name} />
            <DropdownMenuShortcut className="text-gray-500">⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DeleteAlert id={id} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

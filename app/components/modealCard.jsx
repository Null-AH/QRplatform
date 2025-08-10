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

import { useId } from "react"
import { CreditCardIcon, WalletIcon } from "lucide-react"
import { usePaymentInputs } from "react-payment-inputs"
import images from "react-payment-inputs/images";

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

function EditEvent({id ,name,date, onEditClick}) { 
  const [loding,setloding]=useState(false);
  const [open, setOpen] = useState(false);
  const [nameState, setName] = useState("");
  const [dateState, setDate] = useState("");

  // فتح المودال عند الضغط من الخارج
  useEffect(() => {
    if (open) {
      setName(name);
      setDate(date);
    }
  }, [open, name, date]);

const handleEditEvent = async () => {
 setloding(true);
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
    // سكّر المودال أولاً
      setOpen(false);
      setloding(false);
      // بعد نص ثانية مثلاً، سوي ريلود
      setTimeout(() => {
        window.location.reload();
      }, 300);

  } catch (error) {
    console.error("error in edit", error);
    setloding(false);
  }
};

  // إضافة معالج لمنع انتشار أحداث لوحة المفاتيح
  const handleKeyDown = (e) => {
    // منع انتشار أحداث المسافة وأحداث أخرى مهمة
    if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
      e.stopPropagation();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div></div>
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
              onKeyDown={handleKeyDown} // إضافة معالج أحداث لوحة المفاتيح
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
              onKeyDown={handleKeyDown} // إضافة معالج أحداث لوحة المفاتيح
            />
          </div>

          {/* Update Button */}
          <Button
            type="button"
            className="w-full text-white hover:opacity-90"
            style={{ backgroundColor: "#2F5BB8" }}
            onClick={handleEditEvent}
            disabled={loding}
          >
            {loding?"Sending...":" Update Event"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DeleteAlert({id}) {
  const [loding,setloding]=useState(false);
  const [open, setOpen] = useState(false);

const handleDelete = async () => {
  setloding(true);
  try {
    const response = await axios.delete(`https://mk25szk5-7093.inc1.devtunnels.ms/api/event/delete?id=${encodeURIComponent(id)}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log(response.data);

     // سكّر المودال أولاً
      setOpen(false);
      setloding(false);
      // بعد نص ثانية مثلاً، سوي ريلود
      setTimeout(() => {
        window.location.reload();
      }, 300);

  } catch (error) {
    console.error("error in delete",error);
    setloding(false);
  }
};

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
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
            disabled={loding}
          >
         {loding?"Deleting...":"Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default function Actions({ id, date, name }) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  return (
    <>
      <DropdownMenu>
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
              className="text-gray-200 focus:bg-[#04256d] focus:text-[#fff] cursor-pointer"
              onClick={handleEditClick}
            >
              <span>Edit</span>
              <DropdownMenuShortcut className="text-gray-500">⌘E</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DeleteAlert id={id} />
        </DropdownMenuContent>
      </DropdownMenu>

      {/* نقل EditEvent خارج DropdownMenu */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-gray-950 border-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-left text-gray-100">
              Edit Event
            </DialogTitle>
            <DialogDescription className="text-left text-gray-400">
              Update your event details below.
            </DialogDescription>
          </DialogHeader>
          <EditEventForm 
            id={id} 
            name={name} 
            date={date} 
            onClose={() => setEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

// إنشاء مكون منفصل لنموذج التعديل
function EditEventForm({ id, name, date, onClose }) {
  const [loading, setLoading] = useState(false);
  const [nameState, setNameState] = useState(name);
  const [dateState, setDateState] = useState(date);

  const handleEditEvent = async () => {
    setLoading(true);
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
      
      onClose();
      setTimeout(() => {
        window.location.reload();
      }, 300);

    } catch (error) {
      console.error("error in edit", error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 mt-4">
      {/* Name Event */}
      <div className="space-y-2">
        <Label htmlFor="edit-name" className="text-gray-200">
          Event Name
        </Label>
        <Input
          id="edit-name"
          type="text"
          value={nameState}
          placeholder="Enter event name"
          className="bg-gray-900 border-gray-700 text-gray-200 placeholder-gray-500"
          onChange={(e) => setNameState(e.target.value)}
        />
      </div>

      {/* Date Event */}
      <div className="space-y-2">
        <Label htmlFor="edit-date" className="text-gray-200">
          Event Date
        </Label>
        <Input
          id="edit-date"
          type="date"
          className="bg-gray-900 border-gray-700 text-gray-200"
          value={dateState}
          onChange={(e) => setDateState(e.target.value)}
        />
      </div>

      {/* Update Button */}
      <Button
        type="button"
        className="w-full text-white hover:opacity-90"
        style={{ backgroundColor: "#2F5BB8" }}
        onClick={handleEditEvent}
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Event"}
      </Button>
    </div>
  );
}
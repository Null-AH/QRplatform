"use client"
import { IoMdPersonAdd } from "react-icons/io";
import { useEffect, useId, useRef, useState } from "react"
import { CheckIcon, CopyIcon, UserRoundPlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Select from "./select";
import axios from "axios";

export default function Addcollaborator({id}) {
  // const id = useId()
  const [emails, setEmails] = useState([
    "",
  ])

  const [invitData,setInviteData]=useState([{email:"",role:""}])

  const [copied, setCopied] = useState(false);
  const [loding,setloding]=useState(false);
  // const inputRef = useRef(null)
  const lastInputRef = useRef(null)

  const addEmail = () => {
    setInviteData([...invitData, {email:"",role:""}])
  }

  // const handleEmailChange = (index, value) => {
  //   const newEmails = [...emails]
  //   newEmails[index] = value
  //   setEmails(newEmails)
  // }

  // const handleCopy = () => {
  //   if (inputRef.current) {
  //     navigator.clipboard.writeText(inputRef.current.value)
  //     setCopied(true)
  //     setTimeout(() => setCopied(false), 1500)
  //   }
  // }

const handelAddInvitemember = async () => {
  setloding(true);
  const baseApiUrl = "https://mk25szk5-7093.inc1.devtunnels.ms";

  try {
    const respons=await axios.post(
      `${baseApiUrl}/api/event/${id}/addteam`,
      invitData, 
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );


    console.log(respons.data);

  } catch (error) {
    console.error(error);
  } finally {
    setloding(false);
  }
};


  return (
    <div className="dark">
      <Dialog>
        <DialogTrigger className="bg-transparent w-full flex items-start" asChild>
          <Button 
            variant="ghost" 
            className="!border-none cursor-pointer !text-start !flex !items-center   !justify-between  !bg-transparent !text-gray-100 hover:!bg-transparent hover:!text-gray-100 focus:!bg-transparent active:!bg-transparent !shadow-none !outline-none !ring-0 !p-2 !h-auto"
            style={{ 
              backgroundColor: 'transparent !important',
              border: 'none !important',
              boxShadow: 'none !important'
            }}
          >
            <span className="block">Invite members</span>

            <IoMdPersonAdd className="ml-3 text-[#fff] block" />
          </Button>
        </DialogTrigger>
        <DialogContent
          className="bg-gray-900 border-gray-700 text-gray-100"
          onOpenAutoFocus={(e) => {
            e.preventDefault()
            lastInputRef.current?.focus()
          }}>
          <div className="flex flex-col gap-2">
            <div
              className="flex size-11 shrink-0 items-center justify-center rounded-full border border-gray-700 bg-gray-800"
              aria-hidden="true">
              <UserRoundPlusIcon className="opacity-80 text-gray-300" size={16} />
            </div>
            <DialogHeader>
              <DialogTitle className="text-left text-gray-100">Invite team members</DialogTitle>
              <DialogDescription className="text-left text-gray-400">
                Invite teammates to earn free components.
              </DialogDescription>
            </DialogHeader>
          </div>

          <form className="space-y-5">
            <div className="space-y-4">
              <div className="*:not-first:mt-2">
                <Label className="text-gray-200">Invite via email</Label>
                <div className="space-y-3">
                 {invitData.map((item, index) => (
                  <div className="flex justify-between items-center gap-1" key={index}>
                    <Input
                      id={`team-email-${index + 1}`}
                      placeholder="hi@yourcompany.com"
                      type="email"
                      value={item.email}
                      onChange={(e) => {
                        setInviteData((prev) => {
                          const updated = [...prev]
                          updated[index] = { ...updated[index], email: e.target.value }
                          return updated
                        })
                      }}
                      ref={index === emails.length - 1 ? lastInputRef : undefined}
                      className="bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-gray-600 focus:ring-gray-600"
                    />
                    <Select index={index} setInviteData={setInviteData} />
                  </div>
                ))}

                </div>
              </div>
              <button
                type="button"
                onClick={addEmail}
                className="text-sm underline hover:no-underline text-blue-400 cursor-pointer hover:text-blue-300">
                + Add another
              </button>
            </div>
            <Button onClick={handelAddInvitemember} type="button" className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white">
              Send invites
            </Button>
          </form>

          <hr className="my-1 border-t border-gray-700" />

        </DialogContent>
      </Dialog>
    </div>
  );
}
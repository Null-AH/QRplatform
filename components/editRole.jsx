"use client"

import { useId, useState } from "react"
import { CheckIcon, RefreshCcwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Loading from "@/app/components/loading"

export default function EditRole({setRole,Role,setSendRole,open,setOpen,loding,setloding}) {

  
    
  const id = useId()
  
  return (

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="border-gray-600  ml-3 cursor-pointer border-none bg-gray-800 text-gray-200 hover:bg-gray-700  hover:text-white">Change Role</Button>
        </DialogTrigger>
        <DialogContent className="bg-gray-800 border-gray-600 text-gray-200">
          <div className="mb-2 flex flex-col gap-2">
            <div
              className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-600 bg-gray-700"
              aria-hidden="true">
              <RefreshCcwIcon className="opacity-80 text-gray-300" size={16} />
            </div>
            <DialogHeader>
              <DialogTitle className="text-left text-gray-100">Change Role</DialogTitle>
              <DialogDescription className="text-left text-gray-400">
                Pick one of the following Roles.
              </DialogDescription>
            </DialogHeader>
          </div>

          <form className="space-y-5">
            <RadioGroup className="gap-2"
            
            defaultValue={Role}

            onValueChange={(value)=>{
              setRole(value)
            }}
            
            >
              {/* Radio card #1 */}
              <div
                className="border-gray-600 cursor-pointer has-data-[state=checked]:border-blue-500/50 has-data-[state=checked]:bg-gray-700 relative flex w-full items-center gap-2 rounded-md border px-4 py-3 shadow-xs outline-none bg-gray-750 hover:bg-gray-700">
                <RadioGroupItem
                  value="Owner"
                  id={`${id}-1`}
                  aria-describedby={`${id}-1-description`}
                  className="order-1 after:absolute after:inset-0 cursor-pointer border-gray-500 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500" />
                <div className="grid grow gap-1">
                  <Label htmlFor={`${id}-1`} className="text-gray-200">Owner</Label>
                  <p id={`${id}-1-description`} className="text-gray-400 text-xs">
                    Can Add,Delete,Mange and Scan
                  </p>
                </div>
              </div>
              {/* Radio card #2 */}
              <div
                className="border-gray-600 cursor-pointer has-data-[state=checked]:border-blue-500/50 has-data-[state=checked]:bg-gray-700 relative flex w-full items-center gap-2 rounded-md border px-4 py-3 shadow-xs outline-none bg-gray-750 hover:bg-gray-700">
                <RadioGroupItem
                  value="Editor"
                  id={`${id}-2`}
                  aria-describedby={`${id}-2-description`}
                  className="order-1 after:absolute after:inset-0 cursor-pointer border-gray-500 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500" />
                <div className="grid grow gap-1">
                  <Label htmlFor={`${id}-2`} className="text-gray-200">Editor</Label>
                  <p id={`${id}-2-description`} className="text-gray-400 text-xs">
                    Can Mange and Scan
                  </p>
                </div>
              </div>
              {/* Radio card #3 */}
              <div
                className="border-gray-600 cursor-pointer has-data-[state=checked]:border-blue-500/50 has-data-[state=checked]:bg-gray-700 relative flex w-full items-center gap-2 rounded-md border px-4 py-3 shadow-xs outline-none bg-gray-750 hover:bg-gray-700">
                <RadioGroupItem
                  value="Check-In Staff"
                  id={`${id}-3`}
                  
                  aria-describedby={`${id}-3-description`}
                  className="order-1 after:absolute after:inset-0 cursor-pointer border-gray-500 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500" />
                <div className="grid grow gap-1">
                  <Label htmlFor={`${id}-3`} className="text-gray-200 ">Check-In Staff</Label>
                  <p id={`${id}-3-description`} className="text-gray-400 text-xs">
                   Scan only
                  </p>
                </div>
              </div>
            </RadioGroup>

        

            <div className="grid gap-2">
              <Button disabled={loding}  onClick={()=>{setSendRole(true)

                setloding(true);
                
              }} type="button" className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white border-0">
                {loding?"Changing...":"Change Role"}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="ghost" className="w-full cursor-pointer text-gray-300 hover:bg-gray-700 hover:text-white">
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </form>
        </DialogContent>
      </Dialog>
 
  );
}
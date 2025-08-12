"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
} from "@/components/ui/stepper"
import UploatdExcelFile from "@/app/components/steps/UploadExcelFile"
import UploatdDesignImage from "@/app/components/steps/UploadDesignImage"
import ImageWithBoxes from "@/app/components/steps/ImageBoxs"
import NameOfEvents from "@/app/components/steps/nameOfinvite"
import ErrorAlart from "./ErrorAlert"
import { useEvent } from "@/app/(dashboard)/context/StepsInfo"
import Loading from "@/app/components/loading"


const stepAlerts = [
  "", 
  "Please enter the event name before proceeding.",
  "Please upload the Excel file containing the invitees list.",

];



const steps = [1, 2]

const StepContent = ({ currentStep }) => { 
  switch (currentStep) {
    case 1:
      return <NameOfEvents />
    case 2:
      return <UploatdExcelFile />
   
    default:
      return null;
  }
};

export default function Component({setSenddata}) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const [openAlert,setOpenAlert]=useState(false);



  const[typeofError,SetTypeOfError]=useState(stepAlerts[0]);




      const {eventName,excelData,designImage,boxes ,eventDate, fontColor}=useEvent();







  const handleNextStep = () => {
   
     
    if(currentStep === 1 &&  (eventName==="" || eventDate=="")){
      setOpenAlert(true);
      SetTypeOfError(stepAlerts[1]);
      return;
    }
       if(currentStep === 2 && excelData===null){
      setOpenAlert(true);
      SetTypeOfError(stepAlerts[2]);
      return;
    }

 
  

else{
  setOpenAlert(false);
    setIsLoading(true)
    setTimeout(() => {
      setCurrentStep((prev) => prev + 1)
      setIsLoading(false)
      
    }, 100)}

  

  }



  useEffect(()=>{

    if(currentStep===3){
      setSenddata(true);
    }


  },[currentStep,setSenddata])



  return (
    <div className="mx-auto  w-1/2 mt-20 space-y-8 text-center">
      <Stepper value={currentStep} onValueChange={setCurrentStep}>
        {steps.map((step) => (
          <StepperItem key={step} step={step} className="not-last:flex-1" loading={isLoading}>
            <StepperTrigger asChild>
              <StepperIndicator />
            </StepperTrigger>
            {step < steps.length && <StepperSeparator />}
          </StepperItem>
        ))}
      </Stepper>


      {/* step تحميل الصورة والفايل */}
          <div className="flex w-full  min-h-[450px] items-center justify-center ">
              
               <StepContent  currentStep={currentStep} />
              {/* {currentStep === 5  && setSenddata(true)} */}
              {currentStep === 3  && ( <Loading />)}
              
            </div>
     {/*  step تحميل الصورة والفايل */}

     {openAlert && <ErrorAlart  typeError={typeofError}/>}
               {currentStep !== 3  && ( <div className="flex  justify-center space-x-4">
        <Button
          variant="outline"
          className="w-32 bg-[#0f172b] border-none hover:bg-[rgb(19,23,43)] cursor-pointer  hover:text-white"
          onClick={() => setCurrentStep((prev) => prev - 1)}
          disabled={currentStep === 1}>
          Prev step
        </Button>
        <Button
          variant="outline"
          className="w-32 bg-[#0f172b] border-none hover:bg-[rgb(19,23,43)] cursor-pointer   hover:text-white"
          onClick={handleNextStep}
          disabled={currentStep > steps.length}>
            {currentStep===2?"Send Data":" Next step"}
        </Button>
      </div>
 
)}
     
      <p className="text-muted-foreground mt-2  mb-2 text-sm" role="region" aria-live="polite">
          {currentStep === 1 && "Enter the name of your event to begin setting up your invitation."}
          {currentStep === 2 && "Upload an Excel file with the list of invitees."}
        
        </p>

    </div>
  );
}

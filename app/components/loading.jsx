import TextType from "./emptyTemplate";



const Loading=()=>{


    return (<>
    <div className=" flex flex-col w-full mt-[100px] h-full justify-center items-center gap-5">
    <div className="loader">
        <div className="box1"></div>
        <div className="box2"></div>
        <div className="box3"></div>
        
    </div>
    <TextType 
        text={[
  "Generating your invitation images...",
  "Please wait a moment, processing in progress...",
  "Creating personalized invitations..."
]}

          typingSpeed={100}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter="|"
          className="text-[20px] text-shadow-2xl p-3"
          
        />

    </div>
    </>)


}

export default Loading;


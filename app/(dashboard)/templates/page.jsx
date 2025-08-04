"use client"
import TextType from "@/app/components/emptyTemplate";
import NavBar from "@/app/components/templateNav";
import ShinyText from "@/app/components/TextHomePAge";
import Link from "next/link";

export default function TemplatesPage() {
  const templates = [
    {
      id: 1,
      name: "Tailwind Card",
      image: "/imagtest.jpg",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      id: 2,
      name: "Elegant Style",
      image: "/imagtest.jpg",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
    {
      id: 3,
      name: "Minimal Gray",
      image: "/imagtest.jpg",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
        {
      id: 4,
      name: "Minimal Gray",
      image: "/imagtest.jpg",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },

         {
      id: 5,
      name: "Minimal Gray",
      image: "/imagtest.jpg",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-6 p-6 b min-h-screen">
        <NavBar />

    <div className="w-full max-w-7xl mx-auto px-4 mt-[150px]">


      {templates.length===0? <>
      
      <div className="flex w-full  justify-center items-center h-full ">




        <TextType 
          text={["you dont have any Template yet", "Create New Template", "Click Create Teamplate"]}
          typingSpeed={75}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter="_"
          className="text-[30px] mb-[100px] text-shadow-2xl p-3"
          
        />
   {/* <ShinyText text="you dont have any Template yet" disabled={false} speed={3} className='custom-class' /> */}
        {/* <h1 className="text-[30px] text-[#c4d1e2] mb-[100px]"></h1> */}
      </div>
      
      </>: <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-15">

    
    {templates.map((template) => (
      <div key={template.id}>
        <div className="relative flex w-full flex-col rounded-xl bg-[#ffffff2a] backdrop-blur-3xl bg-clip-border justify-center items-center text-white shadow-md">
          <div className="relative w-[95%] -top-9  h-40 overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-gray-500/40">
            <img src={template.image} className="w-full h-full object-cover" />
          </div>


          <div className="flex flex-col relative -top-5"> 
          <div className="p-6">
            <h5 className="mb-2 text-xl font-semibold text-blue-gray-900">
              {template.name}
            </h5>
            <p className="text-base font-light text-gray-300">{template.description}</p>
          </div>
          <div className="p-6 pt-0">
            <Link
              href="webcam/32"
              className="select-none cursor-pointer rounded-lg bg-gradient-to-tr from-[#1e293b8f] via-[#475569] to-[#1e293b8f]  ring-4 ring-[#1e293b8f] py-3 px-6 text-center text-xs font-bold uppercase text-[#c4d1e2] shadow-md transition-all hover:shadow-lg"
            >
              Use Template
            </Link>
            
            
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>}
 
</div>

    
    </div>
  );
}

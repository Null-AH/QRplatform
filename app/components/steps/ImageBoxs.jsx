"use client";
import { MdDeleteForever } from "react-icons/md";
import { useEvent } from "../../(dashboard)/context/StepsInfo";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Rnd } from "react-rnd";

export default function ImageWithBoxes() {
  const [boxs, setBoxs] = useState([]);
  const [imagSize, setImageSize] = useState({ width: 0, hight: 0 });
  


    const {  setBoxes, designImage  , setfontcolor} = useEvent();




  const [imageUrl, setImageUrl] = useState(null);

const [color, setColor] = useState("#000");
  useEffect(() => {

    if (designImage) {
      const newImageUrl = URL.createObjectURL(designImage);
      setImageUrl(newImageUrl);
      
   
      return () => {
        URL.revokeObjectURL(newImageUrl);
      };
    } else {
      setImageUrl(null);
    }
  }, [designImage]);




  const handelAddbox = (type) => {
    setBoxs([
      ...boxs,
      {
        type: type,
        id: Date.now(),
        width: 100,
        hight: 70,
        x: 10,
        y: 10,
      },
    ]);
  };



  const handelSave=()=>{

    setBoxes(boxs);
    setfontcolor(color);

    
  }

  const handeldeltebox = (id) => {
    setBoxs((prev) => prev.filter((i) => i.id !== id));
  };

  console.log(boxs);
  return (
    <div className=" flex justify-center max-w-[390px]  items-center flex-col  gap-5">
      
      <div className={`flex flex-col justify-center items-center w-[${imagSize.width}] h-[${imagSize.hight}]  border border-[#fff]`}  >
       
        <img
          src={imageUrl}
          onLoad={(e) => {
            const img = e.target;
            setImageSize({
              width: img.naturalWidth,
              height: img.naturalHeight,
            });
          }}
        />


        {boxs.map((item) => (
          <Rnd
            key={item.id}
            default={{
              x: item.x,
              y: item.y,
              width: item.width,
              height: item.hight,
            }}
            minWidth={100}
            minHeight={20}
            bounds="parent"
            enableResizing={{
              top: true,
              right: true,
              bottom: true,
              left: true,
              topRight: true,
              bottomRight: true,
              bottomLeft: true,
              topLeft: true,
            }}
            onDragStop={(e, d) => {
              setBoxs((prev) =>
                prev.map((box) =>
                  box.id === item.id ? { ...box, x: d.x, y: d.y } : box
                )
              );
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              setBoxs((prev) =>
                prev.map((box) =>
                  box.id === item.id
                    ? {
                        ...box,
                        width: ref.offsetWidth,
                        hight: ref.offsetHeight,
                        x: position.x,
                        y: position.y,
                      }
                    : box
                )
              );
            }}
          >
            <div className={`w-full ${item.type ==="QR" ? "border-[#008cff] border-2"  :"border-[#37ff00] border-2"} h-full bg-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[2.3px] p-3 flex`}>
            
                <MdDeleteForever        className="text-red-500 absolute z-50 text-2xl -top-6 -left-5 cursor-pointer" onClick={() => {
                  handeldeltebox(item.id);
                }}/>
             
            </div>
          </Rnd>
        ))}
      </div>

      <div className="flex flex-col items-center gap-3">


        <div className="flex gap-3 w-full">
        <button
          onClick={() => handelAddbox("QR")}
          className=" h-10 text-[13px] p-1 cursor-pointer bg-[#1e293b] hover:bg-[#1b222df2]  w-[100px] rounded-xl"
        >
          Add <span className="text-[#008cff] font-bold">QR</span> Box
        </button>
        <button
          onClick={() => handelAddbox("Name")}
          className=" h-10 text-[13px] p-1 cursor-pointer bg-[#1e293b] hover:bg-[#1b222df2] w-[100px] rounded-xl"
        >
          Add <span className="text-[#37ff00] font-bold">Name</span> Box
        </button>

        <button
          onClick={handelSave}
          className=" h-10 text-[13px] p-1 cursor-pointer bg-[#007517] hover:bg-[#006517] w-[100px] rounded-xl"
          >
          Save
        </button>
        </div>

        <label     className=" text-[13px]  flex flex-col items-center  cursor-pointer  rounded-xl p-3 bg-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[2.3px]" > 
        
        <input 
          type="color"
          id="inputcolor"
          className="appearance-none w-[50px] h-[50px] bg-transparent border-none cursor-pointer"
          value={color}
          onChange={event=>{
          setColor(event.target.value)
          }}

        />
  Choice Name color
        </label>
      </div>
    </div>
  );
}





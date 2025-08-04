import NavBar from "@/app/components/navBar";
import Component from "@/components/questions";
import { FaAngleDown } from "react-icons/fa6";
import Link from "next/link";


import ShinyText from "@/app/components/TextHomePAge";
  


import { FaMagic, FaFileExcel, FaObjectGroup, FaQrcode } from "react-icons/fa";
import PixelTransition from "@/app/components/imagePixle";
import PricingCard from "@/app/components/PriceingCard";




export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center text-white pt-[60px] px-4">

      <NavBar />

{/* سكسشن ال  home */}
      <section id="home" className="flex flex-col justify-center items-center relative min-h-screen text-center max-w-3xl gap-2">
   
        <ShinyText text="Effortlessly Organize Your Event Invitations" disabled={false} speed={30} className='custom-class text-2xl md:text-5xl lg:text-5xl ' />
        <p className="text-lg  mb-30  text-gray-600 leading-relaxed">
          Upload your names list and design, and let our platform generate
          professional, personalized invitations with QR codes for everyone!
        </p> 
        
        <Link href="/workspace" className="button-container  mb-30 ">
            <div className="button">
                <span>Get Started</span>
            </div>
        </Link>

      <FaAngleDown  className="absolute bottom-[100px] text-gray-500 left-[50%]"
        style={{
          animation: "float 1.5s ease-in-out infinite",
        }}
      />


      </section>
{/* سكسشن ال  home */}
       


{/* سكسشن الاسئلة */}
    <section id="questions" className="w-full py-20 px-4 ">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
       
        <div>
     
          <Component />
        </div>

        <div className="flex justify-center items-center">
                    
              <PixelTransition
                firstContent={
                  <img
                    src="https://w0.peakpx.com/wallpaper/395/225/HD-wallpaper-black-knight-logo-code-geass-silver-cool-logo-symbol-mecha-anime-dark-black-knight.jpg"
                    alt="default pixel transition content, a cat!"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                }
                secondContent={
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "grid",
                      placeItems: "center",
                      backgroundColor: "#111"
                    }}
                  >
                    <p style={{ fontWeight: 900, fontSize: "3rem", color: "#ffffff" }}>MAS</p>
                  </div>
                }
                gridSize={12}
                pixelColor='#100319'
                animationStepDuration={0.4}
                className="custom-pixel-card"
              />
        </div>
      </div>
    </section>
{/* سكسشن الاسئلة */}


{/* سكشن ال features */}
 <section id="features" className="w-full py-20 px-4 ">



      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12">Why Use Our Platform?</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <FeatureCard
            icon={<FaMagic className="text-4xl text-blue-600 mb-4" />}
            title="Auto Invitation Generation"
            desc="Automatically create personalized invitations with guest names and QR codes."
            pro={true}
          />
          <FeatureCard
            icon={<FaFileExcel className="text-4xl text-green-600 mb-4" />}
            title="Excel Support"
            desc="Upload your guest list as an Excel file – we handle the rest."
          />
          <FeatureCard
            icon={<FaObjectGroup className="text-4xl text-purple-600 mb-4" />}
            title="Custom Placement"
            desc="Manually choose where to place each name and QR code on your design."
            pro={true}
          />
          <FeatureCard
            icon={<FaQrcode className="text-4xl text-rose-600 mb-4" />}
            title="Smart QR Verification"
            desc="Use any camera to scan and verify QR codes for accurate attendance."
          />
        </div>
      </div>
 </section>
{/* سكشن ال features */}



<PricingCard />





  <footer id="contact" className="w-full border-t border-gray-700  text-gray-300 py-12 px-4">
  <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
    
    {/* Logo & Description */}
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">InviteMAS</h2>
      <p className="text-sm">
        Effortless invitation management. Personalized event invites with QR verification – all in one place.
      </p>
    </div>

    {/* Links */}
    <div>
      <h3 className="text-lg font-semibold text-white mb-3">Links</h3>
      <ul className="space-y-2 text-sm">
        <li><a href="/" className="hover:underline">Home</a></li>
        <li><a href="/login" className="hover:underline">Login</a></li>
        <li><a href="#features" className="hover:underline">Features</a></li>
        <li><a href="#faq" className="hover:underline">FAQ</a></li>
      </ul>
    </div>

    {/* Contact or Social (اختياري) */}
    <div>
      <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
      <ul className="space-y-2 text-sm">
        <li>Email: info@invitemas.app</li>
        <li>Support: support@invitemas.app</li>
      </ul>
    </div>

  </div>

  {/* Bottom line */}
  <div className="border-t border-gray-700  mt-10 pt-6 text-center text-sm text-gray-500">
    © {new Date().getFullYear()} InviteMAS. All rights reserved.
  </div>
  </footer>



    </div>
  );
}

// فيجر كارت
function FeatureCard({ icon, title, desc, pro=false }) {
  return (
    <div className=" border border-white/20 
                    backdrop-blur-md bg-white/10 relative p-6 rounded-3xl shadow-sm hover:shadow-md transition">
{pro? <div className="     bg-white/10 text-blue-300 font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)]
                       before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r 
                       before:from-blue-500/20 
                       before:to-purple-500/20 before:transition-all before:duration-300
                       
                       
                       
                       
                       rounded-full top-2 flex justify-center items-center p-1 text-[10px] left-2  absolute  w-15 backdrop-blur-3xl">pro</div>
:<></>}
      <div className="flex flex-col items-center text-center">
        {icon}
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
    </div>
  );
}
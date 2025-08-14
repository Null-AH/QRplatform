"use client"

import { useId } from "react"
import { useState } from "react"
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
import axios from "axios"

import { auth ,googleProvider} from "@/app/firebase/config";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { signInWithPopup } from "firebase/auth";

export default function Signup() {
  
  
  const id = useId();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null); 
  const [photo,setphoto]=useState("");
  const [token,setToken]=useState("");
  const [name,setName]=useState("");


  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage("");
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const name = result.user.displayName;
      const userEmail = result.user.email;
      const photo = result.user.photoURL;

      setUserInfo({ name, email: userEmail, photo });
      setMessage("✅ تم تسجيل الدخول بجوجل بنجاح");
    } catch (error) {
      setMessage("❌ فشل تسجيل الدخول بجوجل: " + error.message);
    }
    setLoading(false);
  };



//   const handleGoogleLogin = async () => {
    
//   try {
//     setLoading(true);
//     const result = await signInWithPopup(auth, googleProvider);
//     console.log(result)
//     const idToken = await result.user.getIdToken();
//     localStorage.setItem("token",idToken);

//     const name = result.user.displayName;
//     const email = result.user.email;
//     const photo = result.user.photoURL;


//     setphoto(photo);
//     setName(name);

//     console.log("Name:", name);
//     console.log("Email:", email);
//     console.log("Photo URL:", photo);

//     const response = await axios.post("https://mk25szk5-7093.inc1.devtunnels.ms/api/account/sync", {},
//     {headers:{
//       "Authorization":`Bearer ${idToken}`
//     }},
//   );

//     const jwt = response.data.token;
//     setToken(jwt);
//     localStorage.setItem("token", jwt);
//     alert("تم تسجيل الدخول بنجاح ✅");
//   } catch (error) {
//     console.error("Login error:", error);
//     alert("فشل تسجيل الدخول ❌");
//   } finally {
//     setLoading(false);
//   }
// };



  const handleRegister = async () => {
    setMessage("");
    setUserInfo(null);
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);

      const defaultPhoto = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0D8ABC&color=fff`;

      await updateProfile(result.user, {
        displayName,
        photoURL: defaultPhoto,
      });

      await sendEmailVerification(result.user);

      // حفظ معلومات المستخدم
      setUserInfo({
        name: displayName,
        email: result.user.email,
        photo: defaultPhoto,
      });

      setMessage("✅ تم إنشاء الحساب، وتم إرسال رابط التحقق إلى بريدك.");
    } catch (error) {
      setMessage("❌ فشل تسجيل الحساب: " + error.message);
    }
    setLoading(false);
  };






  return (
   <Dialog>
  <DialogTrigger asChild>
    <Button variant="outline" className="text-black hover:text-black cursor-pointer bg-white">Sign up</Button>

  </DialogTrigger>
  
  <DialogContent className="dark bg-zinc-900 text-white">
  
    <div className="flex flex-col items-center gap-2">
  
      <div
        className="flex size-11 shrink-0 items-center justify-center rounded-full border border-zinc-700"
        aria-hidden="true">
        <svg
          className="stroke-white"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 32 32"
          aria-hidden="true">
          <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
        </svg>
      </div>
      <DialogHeader>
        <DialogTitle className="sm:text-center text-white">
          Sign up MAS
        </DialogTitle>
        <DialogDescription className="sm:text-center text-zinc-300">
          We just need a few details to get you started.
        </DialogDescription>
      </DialogHeader>
    </div>

    <form className="space-y-5">
      <div className="space-y-4">
        <div className="*:not-first:mt-2">
          <Label htmlFor={`${id}-name`} className="text-white">Full name</Label>
          <Input  id={`${id}-name`} placeholder="Matt Welsh"   onChange={(e) => setDisplayName(e.target.value)} type="text" required />
        </div>
        <div className="*:not-first:mt-2">
          <Label htmlFor={`${id}-email`} className="text-white">Email</Label>
          <Input id={`${id}-email`} placeholder="hi@yourcompany.com"   onChange={(e) => setEmail(e.target.value)}  type="email" required />
        </div>
        <div className="*:not-first:mt-2">
          <Label htmlFor={`${id}-password`}  className="text-white">Password</Label>
          <Input
            id={`${id}-password`}
            placeholder="Enter your password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            required />
        </div>
      </div>
      <Button onClick={handleRegister} type="button" className="w-full bg-white text-black cursor-pointer hover:bg-zinc-200">
        {!loading?  "Sign up":"singing up..."}
      </Button>
    </form>

    <div className="before:bg-zinc-700 after:bg-zinc-700 flex items-center gap-3 before:h-px before:flex-1 after:h-px after:flex-1">
      <span className="text-zinc-400 text-xs">Or</span>
    </div>

    <Button onClick={handleGoogleLogin} variant="outline" className="text-white border-zinc-600 cursor-pointer hover:bg-zinc-800">
      Continue with Google
    </Button>

    <p className="text-zinc-400 text-center text-xs">
      By signing up you agree to our{" "}
      <a className="underline hover:no-underline text-zinc-200" href="#">
        Terms
      </a>
    </p>
  </DialogContent>
</Dialog>

  );
}

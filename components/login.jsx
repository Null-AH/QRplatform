"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

import { auth, googleProvider } from "@/app/firebase/config";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

export default function Login() {
  const id = useId();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const handleLogin = async () => {
    setLoading(true);
    setMessage("");
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await result.user.getIdToken();

      // بيانات المستخدم
      const name = result.user.displayName;
      const photo = result.user.photoURL;

      setUserInfo({ name, email, photo });

      // إرسال التوكن للباك إند
      const response = await axios.post("https://mk25szk5-7093.inc1.devtunnels.ms/api/account/sync", {},
    {headers:{
      "Authorization":`Bearer ${idToken}`
    }},
  );

      const jwt = response.data.token;
      localStorage.setItem("my_token", jwt);
      setMessage("✅ تم تسجيل الدخول بنجاح");
    } catch (error) {
      setMessage("❌ فشل تسجيل الدخول: " + error.message);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const name = result.user.displayName;
      const email = result.user.email;
      const photo = result.user.photoURL;

      setUserInfo({ name, email, photo });

      const response = await axios.post("https://mk25szk5-7093.inc1.devtunnels.ms/api/account/sync", {},
    {headers:{
      "Authorization":`Bearer ${idToken}`
    }},
  );
        console.log("from post")
      const jwt = response.data.token;
      localStorage.setItem("my_token", jwt);
      setMessage("✅ تم تسجيل الدخول بجوجل بنجاح");
    } catch (error) {
      setMessage("❌ فشل تسجيل الدخول بجوجل: " + error.message);
    }
    setLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-black hover:text-black cursor-pointer bg-white" variant="outline">
          Sign in
        </Button>
      </DialogTrigger>

      <DialogContent className="dark bg-zinc-900 text-white">
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-zinc-700"
            aria-hidden="true"
          >
            <svg className="stroke-white" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
            </svg>
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center text-white">Welcome back</DialogTitle>
            <DialogDescription className="sm:text-center text-zinc-300">
              Enter your credentials to login to your account.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5">
          <div className="space-y-4">
            <div className="*:not-first:mt-2">
              <Label htmlFor={`${id}-email`} className="text-white">
                Email
              </Label>
              <Input
                id={`${id}-email`}
                placeholder="hi@yourcompany.com"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="*:not-first:mt-2">
              <Label htmlFor={`${id}-password`} className="text-white">
                Password
              </Label>
              <Input
                id={`${id}-password`}
                placeholder="Enter your password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <div className="flex items-center gap-2">
              <Checkbox id={`${id}-remember`} />
              <Label htmlFor={`${id}-remember`} className="text-zinc-400 font-normal">
                Remember me
              </Label>
            </div>
            <a className="text-sm underline hover:no-underline text-zinc-300" href="#">
              Forgot password?
            </a>
          </div>
          <Button onClick={handleLogin} type="button" className="w-full bg-white text-black hover:bg-zinc-200">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="before:bg-zinc-700 after:bg-zinc-700 flex items-center gap-3 before:h-px before:flex-1 after:h-px after:flex-1">
          <span className="text-zinc-400 text-xs">Or</span>
        </div>

        <Button onClick={handleGoogleLogin} variant="outline" className="text-white border-zinc-600 hover:bg-zinc-800">
          Login with Google
        </Button>

        {message && (
          <p className="text-sm mt-3" style={{ color: message.startsWith("✅") ? "lightgreen" : "red" }}>
            {message}
          </p>
        )}

        {userInfo && (
          <div className="mt-4 text-center">
            <img src={userInfo.photo} alt="profile" className="mx-auto rounded-full w-14 h-14" />
            <p>{userInfo.name}</p>
            <p>{userInfo.email}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

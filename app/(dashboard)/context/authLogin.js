"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";

const AuthContext = createContext();
const baseApiUrl = "https://mk25szk5-7093.inc1.devtunnels.ms";

export const AuthProvider = ({ children }) => {
  const [isSyncedWithBackend, setIsSyncedWithBackend] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsSyncedWithBackend(false);
        return;
      }

      setIsSyncedWithBackend(false);

      try {
        const idToken = await user.getIdToken();

        // ضبط هيدر axios لكل الطلبات القادمة
        axios.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;

        // مزامنة مع الباكند (POST)
        const response = await axios.post(`${baseApiUrl}/api/account/sync`);

        // حفظ JWT من الباكند إذا أرجع
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }

        console.log("✅ Sync complete");
        setIsSyncedWithBackend(true);
      } catch (err) {
        console.error("❌ Sync failed", err);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ isSyncedWithBackend }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// "use client";

// import { createContext, useContext, useState } from "react";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [displayName, setDisplayName] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [userInfo, setUserInfo] = useState(null);
//   const [photo,setphoto]=useState("");
//   const [name,setName]=useState("");

//   return (
//     <UserContext.Provider
//       value={{
//      email, setEmail,password, setPassword,displayName, setDisplayName,message, setMessage,
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUserInfo = () => useContext(UserContext);

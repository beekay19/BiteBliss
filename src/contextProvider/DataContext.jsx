/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import { db } from "../firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useParams } from "react-router-dom";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [userDataA, setUserData] = useState([]);
  const auth = getAuth();

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const docRef = doc(db, "users", auth.currentUser.uid);
  //     const docSnap = await getDoc(docRef);

  //     setUserData(docSnap.data());
  //     // console.log(userDataA);
  //   };
  //   fetchUser();
  // }, []);

  return <DataContext.Provider value={{}}>{children}</DataContext.Provider>;
};

export default DataContext;

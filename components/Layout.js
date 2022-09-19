import Header from "./header";
import { addDoc, serverTimestamp, collection, onSnapshot, query, orderBy, where, setDoc, doc, deleteDoc} from "firebase/firestore";
import { useSession } from "next-auth/react";
import {useEffect, useState} from "react";
import {db} from "../firebase";

const Layout = ({children}) =>{

  

    return(
        <div>
            <Header />
                {children}
        </div>
    )
}

export default Layout;
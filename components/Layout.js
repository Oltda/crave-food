import Header from "./Header";
import { addDoc, serverTimestamp, collection, onSnapshot, query, orderBy, where, setDoc, doc, deleteDoc} from "firebase/firestore";
import { useSession } from "next-auth/react";
import {useEffect, useState} from "react";
import {db} from "../firebase";
import Head from 'next/head'

const Layout = ({children}) =>{

  

    return(
        <div>
             {/* <Head>
                 
                 <meta name="viewport" content="initial-scale=1.0, width=device-width" />
             </Head> */}

            <Header />
                {children}
        </div>
    )
}

export default Layout;
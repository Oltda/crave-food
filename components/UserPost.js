import {useEffect, useState} from "react";
import Link from 'next/link'
import { doc, deleteDoc} from "firebase/firestore";
import {db} from "../firebase";
import {
    TrashIcon,
} from "@heroicons/react/outline";

const UserPost = ({key, img, caption, description, id, currentUserName, postUsername}) =>{

    const [shortDesc, setShortDesc] = useState();

    useEffect(() => {
        let desc = "";
        if(description){
          var splitdesc =  description.split(" ")
            
          splitdesc.forEach(element => {
            if(element.length + desc.length < 70){
                desc += " " + element;
            }
          });
          desc += " ..."

          setShortDesc(desc)
        }
       

     }, [])


     const deletePost = async (postId) =>{
        await deleteDoc(doc(db, 'posts', postId));
     }



    return(
       
        <div className="cursor-pointer h-80  w-52 rounded-md bg-white overflow-hidden shadow-md mb-5 
            hover:scale-110 transition transform duration-200 ease-out " 
            key={key}>
            
            <Link href={'/userRecipe/' + id}>
                <div>
                    <div className="w-full h-40  overflow-hidden ">
                        {img ? (
                            <img className="w-full h-full object-cover" src={img[0]} />
                        ):(
                            <></>
                        )}
                    
                    </div>
                    <div className=" px-2 ">
                        <p className="font-bold mb-2">{caption}</p>
                        <p className="text-gray-600 font-light h-20 overflow-hidden" >{shortDesc}</p>
                    </div>
                </div>
            </Link>
            <div  className="flex justify-end px-3">
                {currentUserName == postUsername && (
                    <TrashIcon onClick={()=>deletePost(id)} className="h-6 w-6 hover:text-red-600" />
                )}             
            </div>

        </div>
        
    )

}

export default UserPost;
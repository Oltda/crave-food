import {useEffect, useState} from "react";
import Link from 'next/link'


const UserPost = ({key, img, caption, description, id}) =>{

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




    return(
        <Link href={'/userRecipe/' + id}>
        <div className="cursor-pointer h-80  w-52 rounded-md bg-white overflow-hidden shadow-md mb-5 
            hover:scale-110 transition transform duration-200 ease-out " 
            key={key}>
            <div className="w-full h-40  overflow-hidden ">
                <img className="w-full h-40 object-cover" src={img[0]} />
            </div>
            <div className=" px-2 ">
                <p className="font-bold mb-2">{caption}</p>
                <p className="text-gray-600 font-light h-20 overflow-hidden" >{shortDesc}</p>
            </div>
            
        </div>
        </Link>
    )

}

export default UserPost;
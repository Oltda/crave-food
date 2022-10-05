
import { postDataState } from "../atoms/postDataAtom";
import {useRecoilState} from "recoil";

import { editPostState } from "../atoms/editPostAtom";
import { useState, useRef } from "react";
import {doc, getDoc, setDoc, updateDoc} from "@firebase/firestore"; 

const DescriptionBox = ({documentRef}) =>{
    const [editing, setEditing] = useRecoilState(editPostState);
    const descrRef = useRef(null);
    const [postData, setPostData] = useRecoilState(postDataState);
    const [description, setDescription] = useState(postData.recipeDescription);

    const handleChangeDescription = async (event) =>{
        setDescription(event.target.value)
   
        const updateRef =  await updateDoc(documentRef,{recipeDescription: event.target.value} )
   
        const snapshot = await getDoc(documentRef);
        setPostData(snapshot.data())
    }

    return(
        <div className="mb-3 px-7" >
            <h2 className='text-2xl lg:text-3xl mb-3'>This is how you make it</h2>
                {editing ? (
                    <div>
                        <textarea 
                        className=" rounded-md h-40 w-full overflow-y-scroll scrollbar-thin scrollbar-thumb-black max-h-[200px] min-h-[200px] lg:max-h-[100px] lg:min-h-[100px] border border-gray-400"
                        placeholder="How do you cook it..."
                        type="text"
                        onChange={handleChangeDescription}
                        value={description}
                        ref={descrRef}
                        ></textarea>
                    </div>
                ):(
                        <div>             
                        {postData?.recipeDescription? (
                            <div>{postData.recipeDescription}</div>
                        ):(
                            <></>
                        )}
                        </div>
                )}
        </div>
    )
}

export default DescriptionBox;
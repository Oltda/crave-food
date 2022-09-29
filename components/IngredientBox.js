import { postDataState } from "../atoms/postDataAtom";
import {useRecoilState} from "recoil";
import { useState, useRef } from "react";
import { editPostState } from "../atoms/editPostAtom";
import {
    PencilIcon,
    PlusCircleIcon,
    TrashIcon,
    CameraIcon
} from "@heroicons/react/outline";
import {doc, getDoc, setDoc, updateDoc} from "@firebase/firestore"; 

const IngredientBox =({documentRef})=>{
    const [postData, setPostData] = useRecoilState(postDataState);
    const [addButton, setAddButton] = useState(false);
    const [editing, setEditing] = useRecoilState(editPostState);
    const captionTwoRef = useRef(null);

    const showHideAddButton = () =>{
        if(captionTwoRef.current.value != ""){
            setAddButton(true)
        }
    }

    const deleteIngredient = async (event) =>{
        let index =  event.currentTarget.id;
        const newIngredienceArr = [...postData.captionTwo]
        newIngredienceArr.splice(index, 1)
        const updateRef =  await updateDoc(documentRef,{captionTwo: [...newIngredienceArr]} )
        const snapshot = await getDoc(documentRef);
        setPostData(snapshot.data())  
      }

    
      const addIgredience = async ()=>{
     
        setAddButton(false)
    
        const updateRef =  await updateDoc(documentRef,{captionTwo: [...postData.captionTwo, captionTwoRef.current.value]} )
    
        const snapshot = await getDoc(documentRef);
        setPostData(snapshot.data())
    
        captionTwoRef.current.value = "";
        }



    return(
        <div className='mb-10 w-full relative  py-7 px-12 rounded-md border border-gray-500 '>
        <div className='absolute p-1 left-7 -top-7 bg-white'>
            <div className='w-full h-full border-dotted border-black relative'>
                <h2 className='text-3xl'>INGREDIENCE</h2>
            </div>                        
        </div>
        {editing ? (
         <div>
            <div className=' flex items-center mb-3'>
                <input
                    className="border-b-2 border-gray-400 focus:border-black focus:outline-none w-1/2 lg:w-1/2 md:w-1/4 sm:w-1/4"
                    type="text"
                    ref={captionTwoRef}
                    placeholder="Ingredient..."
                    onChange={showHideAddButton}
                />
                <div className="inline-block w-8 h-8 ml-3">
                    <PlusCircleIcon className={addButton ? "w-8 h-8 text-blue-500 hover:text-blue-700 cursor-pointer block" : "hidden"} onClick={addIgredience} / >
                </div>
            </div>

            {postData?.captionTwo.map((ingredient, index)=>(
                <div className="mr-3 mt-3 inline-block"> 
                        <p className="px-2 bg-gray-400 border border-white rounded-full " key={index}>{ingredient} 
                            <span className="cursor-pointer ml-3" onClick={deleteIngredient}  id={index}>x</span>
                        </p>                              
                </div>
                
            ))}
         </div> 
        ):(
            <div>
            {postData?.captionTwo.map((e, i)=>(
                <div key={i} className='lg:w-1/2 lg:inline-block sm:w-full sm:block'>
                   <p>&#x2713; {e}</p>
                </div>
                
            ))}
        </div>
        )}

    
    </div>
    )
}

export default IngredientBox;
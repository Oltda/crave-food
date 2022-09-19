import { useRecoilState } from "recoil"
import { modalState } from "../atoms/modalAtom";
import {useState, useRef} from "react";
import { useSession } from "next-auth/react";
import {addDoc, collection, doc, serverTimestamp, updateDoc} from "@firebase/firestore"; 
import {db, storage} from "../firebase";
import {ref, getDownloadURL, uploadString} from '@firebase/storage';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
    PlusCircleIcon,
    CameraIcon,
    ArrowRightIcon,
    ArrowLeftIcon,
    ChevronDownIcon,
    XIcon
    
} from "@heroicons/react/outline";
import {Dialog, Transition} from "@headlessui/react";

const chosenPhotos = [];

function PostFormTest(){
    
    const captionRef = useRef(null);
    const captionTwoRef = useRef(null);
    const recipeDescr = useRef(null);
    const [loading, setLoading] = useState(false);
    const {data: session} = useSession();
    const [selectedFile, setSelectedFile] = useState([]);
    const filePickerRef = useRef(null);
    const [open, setOpen] = useRecoilState(modalState)
    const [ingredience, setIngredience] = useState([]);
    const [finishPhotoPick, setFinishPhotoPick ] = useState(false);
    const [showIngredience, setShowIngredience] = useState(false);
    const [showDescription, setShowDescription] = useState(false);
    const [addButton, setAddButton] = useState(false);
    const [modalSize, setModalSize] = useState("h-3/5")
  





    const uploadPost = async () =>{
        if(loading) return;

        setLoading(true);

        const docRef = await addDoc(collection(db, 'posts'), {
            username: session.user.username,
            userId: session.user.uid,
            email: session.user.email,
            caption: captionRef.current.value,
            captionTwo: ingredience,
            recipeDescription: recipeDescr.current.value,
            timestamp: serverTimestamp()
        })
        


        const imageRefList = [];

        for(let i = 0; i < selectedFile.length; i++){
            const imageRef = ref(storage, `posts/${docRef.id}/image ${i}`);

            imageRefList.push(imageRef);
           

            await uploadString(imageRef, selectedFile[i], "data_url").then(async () =>{

                const downloadDict = {image:[]}; 
                for(let x = 0; x < imageRefList.length; x++){
                    let downloadURL = await getDownloadURL(imageRefList[x]);
                    downloadDict["image"].push(downloadURL);
                    }
                    await updateDoc(doc(db, 'posts', docRef.id), downloadDict)
            });

        
        }

        setLoading(false); 
        setOpen(false);
    }



    
     
   

    const addImageToPost = (e) =>{
        const reader = new FileReader();
        if(e.target.files[0]){
            reader.readAsDataURL(e.target.files[0]);
        }
        
        reader.onload = (readerEvent)=>{
            chosenPhotos.push(readerEvent.target.result);

            
            
            setSelectedFile(oldArray => [...oldArray, readerEvent.target.result]);
        };       
    };


    const addIgredience =()=>{
        setIngredience([...ingredience, captionTwoRef.current.value]);
        captionTwoRef.current.value = "";
        setAddButton(false)
    }

    const finishPhotoPicking = () =>{
        if(finishPhotoPick){
            setFinishPhotoPick(false)

            setShowIngredience(false)
            setShowDescription(false)
            setModalSize("lg:h-3/5")
        }
        else{
            setFinishPhotoPick(true)
        }
      
    }

   
    const deleteIngredient = event =>{
      let index =  event.currentTarget.id;
      const newIngredience = ingredience.splice(index, 1)
 
      setIngredience([...ingredience])

      
    }

    const showIngredienceBox = () =>{
        if(showIngredience){
            setShowIngredience(false)
            //setModalSize("lg:h-3/5")
        }
        else{
            setShowIngredience(true)
            setShowDescription(false)
            //setModalSize("lg:h-4/5")
        }
        
    }

    const showDescriptionBox = () =>{
        if(showDescription){
            setShowDescription(false)
            //setModalSize("lg:h-3/5")
        }else{
            setShowDescription(true) 
            setShowIngredience(false)
           // setModalSize("lg:h-4/5")
        }
    }

    const showHideAddPutton = () =>{
        if(captionTwoRef.current.value != ""){
            setAddButton(true)
        }
    }
  

    
   

    return(

    
<Transition.Root show={open} >
    <Dialog as='div' onClose={setOpen} className={`absolute min-h-[550px] left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 shadow bg-white w-full  
                lg:w-2/5 sm:w-5/6 h-full lg:h-4/5 sm:h-4/5 rounded-lg  z-50 py-3 px-3 lg:px-9`}>

                            <div>

                                    <div className="w-full relative mb-10 lg:mb-5">
                                        <div className="w-full flex place-content-between items-center">
                                            <div className="w-10 h-10">
                                                {finishPhotoPick ?(
                                                    <ArrowLeftIcon onClick={finishPhotoPicking} className="w-8 h-8 hover:text-red-400 cursor-pointer" />
                                                ):(
                                                    <XIcon onClick={()=>setOpen(false)} className="h-8 w-8  hover:text-red-400 cursor-pointer mb-5 lg:mb-0" />
                                                )}
                                                
                                            </div>
                                            
                                            
                                            <div className="w-10 h-10">
                                            {!finishPhotoPick && selectedFile.length > 0 ?(
                                                
                                                <ArrowRightIcon onClick={finishPhotoPicking} className="w-8 h-8 hover:text-red-400 cursor-pointer" />
                                            ):(<></>)}
                                            </div>
                                        
                                        </div>        
                                    </div>

                                     <p as="h3" className="text-2xl leading-6 font-medium text-gray-900 text-center mb-10 lg:mb-5 ">
                                        {finishPhotoPick ? 
                                            "What are you cooking?" : " Choose photos to upload"
                                        }
                                       
                                    </p>
                            </div>
                            
                            {!finishPhotoPick ? (
                            <div className="h-4/5 w-full relative">
                                  

                                    <div className="relative w-full min-h-[100px] ">
                                        <div className="w-full overflow-x-scroll scrollbar-thin scrollbar-thumb-black inline-flex justify-center">
                                            {selectedFile.map( e =>
                                                <img 
                                                src={e} 
                                                className="h-36 object-contain cursor-pointer mr-2"
                                                alt=""
                                                />  
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className=" relative w-full h-1/3  ">
                                        <div className="w-full h-full flex items-center">
                                                <div
                                                    onClick={()=> filePickerRef.current.click()}
                                                    className="mx-auto flex items-center justify-center h-12 w-40 rounded-md bg-red-100 hover:bg-red-300 hover:text-white
                                                    cursor-pointer"
                                                    >   
                                                        {selectedFile.length < 1 ? (
                                                             <CameraIcon className="h-8 w-8" />
                                                        ):(
                                                            <PlusCircleIcon className="h-8 w-8" />
                                                        )}
                                                       
                                                </div>
                                        </div>
                                    </div>

                             

                            </div>
                            ):(
                                <div className="h-3/5 lg:h-4/5 relative ">
                                    <div className="" >
                                    <input
                                                className=" focus:border-black focus:outline-none w-full   text-xl"
                                                type="text"
                                                ref={captionRef}
                                                placeholder="Recipe name..."
                                            />  
                                    </div>

                                    {/* ingrediences ----------------------------------- */}
                                    <div className="mt-3 border-t-2 border-gray-200 pt-1" >

                                                <div className="text-lg leading-6 font-medium text-gray-900  mb-5">
                                                        <p className="inline-block mr-3 w-28">Ingrediences</p>
                                                      
                                                        <ChevronDownIcon 
                                                            className={showIngredience ? "inline-block w-6 h-6 rotate-180 cursor-pointer" : "inline-block w-6 h-6 cursor-pointer" } 
                                                            onClick={showIngredienceBox}
                                                            />
                                                </div>
                                                <div className={showIngredience ? "flex items-center mb-2" : "hidden"}>
                                                    <input
                                                        className="border-b-1 border-gray-400 focus:border-black focus:outline-none w-1/2 lg:w-1/4 md:w-1/4 sm:w-1/4"
                                                        type="text"
                                                        ref={captionTwoRef}
                                                        placeholder="Ingredient..."
                                                        onChange={showHideAddPutton}
                                                    />
                                                    <div className="inline-block w-8 h-8 ml-3">
                                                        <PlusCircleIcon className={addButton ? "w-8 h-8 text-blue-500 hover:text-blue-700 cursor-pointer block" : "hidden"} onClick={addIgredience} / >
                                                    </div>
                                                
                                                </div>
                                                <div className={showIngredience ? "max-h-[100px] lg:max-h-[150px] overflow-y-scroll scrollbar-thin scrollbar-thumb-black mb-5" : "h-0 w-0 overflow-hidden"}>
                                                
                                                <div className="">
                                                    {ingredience.length > 0 && (
                                                        ingredience.map((ingredient, index)=>(
                                                        <div className="mr-3 mt-3 inline-block"> 
                                                                <p className="px-2 bg-gray-400 border border-white rounded-full inline-block" key={index}>{ingredient} <span className="cursor-pointer ml-3" onClick={deleteIngredient} id={index}>x</span></p>                              
                                                            </div>
                                                        ))
                                                    
                                                    )}
                                                </div>
                                          
                                        </div>

                                    </div>

                                    {/* description ----------------------------------- */}
                                    
                                    <div className="mt-2  border-t-2 border-b-2 border-gray-200 pt-1" >
                                                <div className="text-lg leading-6 font-medium text-gray-900 mb-5">
                                                        <p className="inline-block mr-3 w-28">Description</p> 
                                                        <ChevronDownIcon className={showDescription ? "inline-block w-6 h-6 rotate-180 cursor-pointer" : "inline-block w-6 h-6 cursor-pointer" } onClick={showDescriptionBox}/>
                                                    </div>
                                                    <div className={showDescription ? "max-h-[200px]" : "h-0 w-0 overflow-hidden"}>
                                                    <textarea 
                                                                className="h-40 w-full overflow-y-scroll scrollbar-thin scrollbar-thumb-black max-h-[200px] min-h-[200px] lg:max-h-[200px] lg:min-h-[200px] border border-gray-400"
                                                                placeholder="How do you cook it..."
                                                                type="text"
                                                                ref={recipeDescr}
                                                                ></textarea>
                                                </div>
                                    </div>
                                       
                                        {/* submit button ----------------------------------- */}
                                        <div className="absolute w-full top-full -translate-y-full " >
                                            <button
                                                type="button"
                                                disabled={!selectedFile}
                                                className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4
                                                py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                                                focus:ring-red-500 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:disabled:bg-gray-300"
                                                onClick={uploadPost}
                                                >
                                                {loading? "Uploading..": "Upload Post"}
                                            </button>
                                        </div>
                                        
                                </div>  
                            )}
         

       

                            <div>
                                <div className="mt-3 text-center sm:mt-5">

                                            <div>
                                                <input
                                                ref={filePickerRef}
                                                type="file"
                                                hidden
                                                onChange={addImageToPost}
                                                />
                                            </div>

                                            <div className="mt-2">
                                            </div>
                                </div>
                            </div>
                                
   
        </Dialog>
         </Transition.Root>
    )
}

export default PostFormTest;
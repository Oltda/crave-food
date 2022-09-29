import { useRouter } from 'next/router'
import {db, storage} from "../../firebase";
import {useEffect, useState, useRef} from "react";
import {doc, getDoc, setDoc, updateDoc} from "@firebase/firestore"; 
import ClipLoader from "react-spinners/ClipLoader";
import {
    PencilIcon,
    CameraIcon
} from "@heroicons/react/outline";
import {useSession} from "next-auth/react";
import Head from 'next/head'
import PhotoAlert from '../../components/PhotoAlert';
import {useRecoilState} from "recoil";
import { photoAlertState } from '../../atoms/photoAlertAtom';
import { imageArrayState } from '../../atoms/imageArrayAtom';
import RecipeMainPhoto from '../../components/RecipeMainPhoto';
import { editPostState } from '../../atoms/editPostAtom';
import { postDataState } from '../../atoms/postDataAtom';
import IngredientBox from '../../components/IngredientBox';
import DescriptionBox from '../../components/DescriptionBox';
import { photoPreviewState } from '../../atoms/photoPreviewAtom';
import PhotoPreview from '../../components/PhotoPreview';

const UserName = () =>{
    const router = useRouter()
    
    const [editing, setEditing] = useRecoilState(editPostState);
    const [documentRef, setDocumentRef] = useState();
    const [caption, setCaption] = useState(); 
    const filePickerRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState();
    const {data: session} = useSession();
    const [userName, setUserName] = useState(null)
    const [showAlert, setShowAlert] = useRecoilState(photoAlertState)
    const [imageArray, setImageArray] = useRecoilState(imageArrayState)
    const [postData, setPostData] = useRecoilState(postDataState);
    const [openPreview, setOpenPreview] = useRecoilState(photoPreviewState);
 


   useEffect(() => {
      if(router.isReady){
        const { nameUser } = router.query

        const fetchData = async () => {
            const docRef = doc(db, "posts", nameUser);
            setDocumentRef(docRef)
            const snapshot = await getDoc(docRef);
            setPostData(snapshot.data())
            setCaption(snapshot.data().caption)
            setUserName(snapshot.data().username)
        }   
        fetchData()
          .catch(console.error);     
      }
   }, [router.isReady])



   useEffect(()=>{
    if(postData){
        setImageArray(postData.image)
    }

   }, [postData])


   

   const handleEdit = () =>{
    if(editing){
        setEditing(false)
    }
    else{
        setEditing(true)
    } 
   }



    const handleChangeCaption = async (event) =>{
        setCaption(event.target.value)

        const updateRef =  await updateDoc(documentRef,{caption: event.target.value} )

        const snapshot = await getDoc(documentRef);
        setPostData(snapshot.data())
    }



    const addImageToPost = (e) =>{
        const reader = new FileReader();
        if(e.target.files[0]){
            reader.readAsDataURL(e.target.files[0]);
        }
        reader.onload = (readerEvent)=>{
            setSelectedFile(readerEvent.target.result);
        };

        setOpenPreview(true)
        
    };



    return(
        <div>


        {postData?.image.length ? (
        <div className=" w-full top-24 absolute lg:px-6  ">
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            </Head>
               
            <div className="lg:inline-block sm:block h-full lg:w-1/2 sm:w-full mb-16">
                <div className='lg:hidden  mb-10'>
                    <div className='w-full'>
                                    {editing  ? (
                                        <input 
                                            className=' w-full  text-6xl   text-center
                                            mb-14 border-b-2 border-gray-400 focus:border-black 
                                            focus:outline-none text-gray-600' 
                                            type="text" 
                                            value={caption}
                                            onChange={handleChangeCaption}
                                            />
                                    ):(
                                        <h1 className='  text-6xl text-center mb-8 '>{caption}</h1>
                                    )}
                    </div>
                    {userName == session?.user?.username &&(
                            <div className=' flex place-content-center  w-full'>
                                <div className="  mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-200 hover:bg-gray-300
                                    cursor-pointer">
                                    <PencilIcon onClick={handleEdit} className=' h-6 w-6' />
                                </div>
                                
                                <div
                                onClick={()=> filePickerRef.current.click()}
                                className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-200 hover:bg-gray-300
                                cursor-pointer"
                                >
                                    <CameraIcon 
                                        className="h-6 w-6"
                                        area-hidden="true"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                <RecipeMainPhoto documentRef={documentRef} />
            </div>

            <div className="lg:inline-block sm:block h-full lg:w-1/2 sm:w-full px-10 lg:px-10 align-top">
                
                <div className='hidden lg:flex place-content-between w-full  mb-10 ' >
                    <div className='w-full  mr-3 '>
                        {editing  ? (
                            <input 
                                className=' w-full  text-6xl   text-center
                                mb-14 border-b-2 border-gray-400 focus:border-black 
                                focus:outline-none text-gray-600' 
                                type="text" 
                                value={caption}
                                onChange={handleChangeCaption}
                                />
                        ):(
                            <h1 className='hidden lg:block text-6xl text-center mb-14 '>{caption}</h1>
                        )}
                    </div>
                    
                    {userName == session?.user?.username &&(
                    <div>
                        <div className="  mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-200 hover:bg-gray-300
                            cursor-pointer mb-2">
                            <PencilIcon onClick={handleEdit} className=' h-6 w-6' />
                        </div>
                        
                        <div
                        onClick={()=> filePickerRef.current.click()}
                        className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-200 hover:bg-gray-300
                        cursor-pointer"
                        >
                            <CameraIcon 
                                className="h-6 w-6"
                                area-hidden="true"
                            />
                        </div>
                    </div>
                    )}

                    <div>
                        <div>
                            <input
                            ref={filePickerRef}
                            type="file"
                            hidden
                                onChange={addImageToPost}
                            />
                        </div>
                    </div>


                </div>

                <IngredientBox documentRef={documentRef} />
                
                <DescriptionBox documentRef={documentRef} />

            </div>
            <div className='h-10'>

            </div>
           
        </div>
        ):(
            <div className='absolute flex justify-center w-full top-1/2 -translate-y-1/2'>
                <ClipLoader />
            </div>
        )}

        {openPreview ? (
            <PhotoPreview selectedFile={selectedFile} documentRef={documentRef} />
          
        ):(
            <></>
        )}

            {showAlert ? (
                <PhotoAlert />
            ):(
                <></>
            )}
            
     
       </div>
    )
}

export default UserName;
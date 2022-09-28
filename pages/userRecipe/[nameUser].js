import { useRouter } from 'next/router'
import {db, storage} from "../../firebase";
import {useEffect, useState, useRef} from "react";
import {doc, getDoc, setDoc, updateDoc} from "@firebase/firestore"; 
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import ClipLoader from "react-spinners/ClipLoader";
import {
    PencilIcon,
    PlusCircleIcon,
    TrashIcon,
    CameraIcon
} from "@heroicons/react/outline";
import {ref, getDownloadURL, uploadString } from '@firebase/storage';
import {Dialog, Transition} from "@headlessui/react";
import {useSession} from "next-auth/react";
import PhotoLoader from '../../components/PhotoLoader';
import Head from 'next/head'


const UserName = () =>{
    const router = useRouter()
    const [postData, setPostData] = useState();
    const [editing, setEditing] = useState(false);
    const [documentRef, setDocumentRef] = useState();
    const descrRef = useRef(null);
    const captionTwoRef = useRef(null);
    const [addButton, setAddButton] = useState(false);
    const [ingredience, setIngredience] = useState([]);
    const [descriptionText, setDescriptionText] = useState();
    const [caption, setCaption] = useState();
    const [imageArray, setImageArray] = useState([])
    const filePickerRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState();
    const [openPreview, setOpenPreview] = useState(false);
    const {data: session} = useSession();
    const [userName, setUserName] = useState(null)
    const [pictureLoading, setPictureLoading] = useState(true)

    console.log(pictureLoading)

    //----------------------------


   useEffect(() => {
      if(router.isReady){
        const { nameUser } = router.query

       

        const fetchData = async () => {
            const docRef = doc(db, "posts", nameUser);
            setDocumentRef(docRef)
            const snapshot = await getDoc(docRef);
            setPostData(snapshot.data())
            setIngredience(snapshot.data().captionTwo)
            setDescriptionText(snapshot.data().recipeDescription)
            setCaption(snapshot.data().caption)
            setUserName(snapshot.data().username)
            //setImageArray(snapshot.data().image)
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



   
   const handleChangeDescription = async (event) =>{
     setDescriptionText(event.target.value)

     const updateRef =  await updateDoc(documentRef,{recipeDescription: event.target.value} )

     const snapshot = await getDoc(documentRef);
     setPostData(snapshot.data())
 }


 const handleChangeCaption = async (event) =>{
    setCaption(event.target.value)

    const updateRef =  await updateDoc(documentRef,{caption: event.target.value} )

    const snapshot = await getDoc(documentRef);
    setPostData(snapshot.data())
}




   const addIgredience = async ()=>{
    setIngredience([...ingredience, captionTwoRef.current.value]);
   
    setAddButton(false)

    const updateRef =  await updateDoc(documentRef,{captionTwo: [...ingredience, captionTwoRef.current.value]} )

    const snapshot = await getDoc(documentRef);
    setPostData(snapshot.data())

    captionTwoRef.current.value = "";
    }





    const addPhoto = async ()=>{

     
        const imageRef = ref(storage, `posts/${documentRef.id}/image ${imageArray.length}`);

        await uploadString(imageRef, selectedFile, "data_url").then(async snapshot =>{
            const downloadURL = await getDownloadURL(imageRef);
            await updateDoc(doc(db, 'posts', documentRef.id), {
                image: [...imageArray, downloadURL]
            })
            setImageArray([...imageArray, downloadURL])
        });
    
        setSelectedFile();
        setOpenPreview(false)

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



    const deleteIngredient = async (event) =>{
        let index =  event.currentTarget.id;
        const newIngredience = ingredience.splice(index, 1)
   
        setIngredience([...ingredience])

        const updateRef =  await updateDoc(documentRef,{captionTwo: [...ingredience]} )

        const snapshot = await getDoc(documentRef);
        setPostData(snapshot.data())

      
    
      }

    const deletePhoto = async (event) =>{
        let index =  event.currentTarget.id;
        const newImageArr = imageArray.splice(index, 1)
        setImageArray([...newImageArr])

        const updateRef =  await updateDoc(documentRef,{image: [...imageArray]} )

        const snapshot = await getDoc(documentRef);
        setPostData(snapshot.data())
      
    }



    const showHideAddButton = () =>{
        if(captionTwoRef.current.value != ""){
            setAddButton(true)
        }
    }


    const loadFce = () =>{
        setPictureLoading(false)
    }

   const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3, 
    
  };


  const settings2 = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1, 
  };

    return(
        <div className=''>


        {postData?.image.length ? (
        <div className=" w-full top-24 absolute lg:px-6  ">
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            </Head>
               

            <div className="lg:inline-block sm:block h-full lg:w-1/2 sm:w-full mb-16 ">
                   
                        {postData?.image.length ? (
                            <div className=''>
                                        <div className= ' lg:hidden  w-full  mb-10 ' >

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
                           
                                    

                                        {postData?.image.length == 2 ? (
                                            <Slider {...settings2}>
                                                <div className='relative'>
                        
                                                    {/* <div className='overflow-hidden max-h-[500px] bg-gray-200  min-w-[500px] min-h-[300px] lg:min-h-[500px]'> */}
                                                    <div className='bg-gray-200 overflow-hidden w-full h-[300px] md:h-[500px] lg:h-[500px]'>
                                                            <PhotoLoader loading={pictureLoading} />
                                                    
                                                            <img onLoad={loadFce} src={imageArray[0]} className="w-full h-full object-cover absolute"/>
                                                    </div>


                                                    <div className='p-5 absolute flex place-content-end w-full top-full -translate-y-full' >
                                                        {editing ? (
                                                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gray-500
                                                                cursor-pointer hover:bg-gray-600">
                                                                <TrashIcon onClick={deletePhoto} id={0} className='w-14 h-14 text-white  ' />
                                                            </div>
                                                        ):(<></>)}
                                                
                                                    </div>


                                                </div>
                                                <div className='relative'>
                        
                                                        <div className='bg-gray-200 overflow-hidden w-full h-[300px] md:h-[500px] lg:h-[500px]'>                                                  
                                                        
                                                                <img src={imageArray[1]} className="w-full h-full object-cover absolute"/>
                                                        </div>


                                                        <div className='p-5 absolute flex place-content-end w-full top-full -translate-y-full' >
                                                            {editing ? (
                                                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gray-500
                                                                    cursor-pointer hover:bg-gray-600">
                                                                    <TrashIcon onClick={deletePhoto} id={1} className='w-14 h-14 text-white  ' />
                                                                </div>
                                                            ):(<></>)}
                                                    
                                                        </div>


                                                </div>
                                                
                                        </Slider>
                                        ):(<></>)}

                                         {postData?.image.length == 1 ? (
                                            <div className='relative'>

                                                <div className=' bg-gray-200 overflow-hidden w-full h-[300px] md:h-[500px] lg:h-[500px]' >

                                                        <PhotoLoader loading={pictureLoading} />
                                                
                                                        <img onLoad={loadFce} src={imageArray[0]} className="w-full h-full object-cover absolute"/>
                                                </div>


                                                <div className='p-5 absolute flex place-content-end w-full top-full -translate-y-full' >
                                                    {editing ? (
                                                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gray-500
                                                            cursor-pointer hover:bg-gray-600">
                                                            <TrashIcon onClick={deletePhoto} id={0} className='w-14 h-14 text-white  ' />
                                                        </div>
                                                    ):(<></>)}
                                            
                                                </div>


                                            </div>
                                         ):(<></>)}

                                        {postData?.image.length > 2 ? (
                                                <div className='relative'>

                                                <div className='bg-gray-200 overflow-hidden w-full h-[300px] md:h-[500px] lg:h-[500px]'>

                                                        <PhotoLoader loading={pictureLoading} />
                                                
                                                        <img onLoad={loadFce} src={imageArray[0]} className="w-full h-full object-cover absolute"/>
                                                </div>


                                                <div className='p-5 absolute flex place-content-end w-full top-full -translate-y-full' >
                                                    {editing ? (
                                                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gray-500
                                                            cursor-pointer hover:bg-gray-600">
                                                            <TrashIcon onClick={deletePhoto} id={0} className='w-14 h-14 text-white  ' />
                                                        </div>
                                                    ):(<></>)}
                                            
                                                </div>


                                            </div>
                                         ):(<></>)}


                      
                                
                                <div>
                                    {postData?.image.length > 3 && (
                                            <Slider {...settings}>
                                           { imageArray.slice(1).map((pic, index)=>( 
                                                
                                                <div className='h-40 w-64 bg-gray-100 border-2 border-white flex items-center relative'>
                                                    <img src={pic} className="h-full w-full object-cover absolute"/>
                                                    <div className='p-2 absolute w-full top-full -translate-y-full flex place-content-end' >
                                                        {editing ? (
                                                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-500
                                                                cursor-pointer hover:bg-gray-600">
                                                                <TrashIcon onClick={deletePhoto} id={index +1} className='w-8 h-8 text-white cursor-pointer' />
                                                            </div>
                                                         ):(<></>)}
                                                    </div>
                                                </div>                                                              
                                             ))}
                                             </Slider>
                                    )} 
                                    
                                    {postData?.image.length == 3 && (
                                        imageArray.slice(1).map((pic, index)=>( 
                                            
                                            <div className='w-1/2 h-52 bg-gray-100 border-2 border-white inline-block relative'>
                                                <img src={pic} className="h-52 w-full object-cover absolute"/>
                                                <div className='p-2 absolute w-full top-full -translate-y-full flex place-content-end' >
                                                    {editing ? (
                                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-500
                                                            cursor-pointer hover:bg-gray-600">
                                                        <TrashIcon onClick={deletePhoto} id={index +1} className='w-8 h-8 text-white' />
                                                    </div>
                                                    ):(<></>)}
                                                </div>
                                            </div>                                                              
                                        ))
                                    )}

       

                                </div>
                            </div>
                        ):(
                            <></>
                        )}           

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

                        {ingredience.map((ingredient, index)=>(
                            <div className="mr-3 mt-3 inline-block"> 
                                    <p className="px-2 bg-gray-400 border border-white rounded-full " key={index}>{ingredient} 
                                        <span className="cursor-pointer ml-3" onClick={deleteIngredient}  id={index}>x</span>
                                    </p>                              
                            </div>
                            
                        ))}
                     </div> 
                    ):(
                        <div>
                        {ingredience.map((e)=>(
                            <div className='lg:w-1/2 lg:inline-block sm:w-full sm:block'>
                               <p>&#x2713; {e}</p>
                            </div>
                            
                        ))}
                    </div>
                    )}
        
                
                </div>

                <h2 className='text-3xl mb-3'>This is how you make it:</h2>
                {editing ? (
                    <div>
                        <textarea 
                        className=" rounded-md h-40 w-full overflow-y-scroll scrollbar-thin scrollbar-thumb-black max-h-[200px] min-h-[200px] lg:max-h-[100px] lg:min-h-[100px] border border-gray-400"
                        placeholder="How do you cook it..."
                        type="text"
                        onChange={handleChangeDescription}
                        value={descriptionText}
                        ref={descrRef}
                        ></textarea>
                    </div>
                ):(
                        <div>             
                        {postData?.recipeDescription? (
                            <div>{descriptionText}</div>
                        ):(
                            <></>
                        )}
                        </div>
                )}



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
            
            <Transition.Root show={openPreview} >
                <Dialog as='div' onClose={setOpenPreview} 
                        className="w-full h-full lg:max-h-[450px] lg:max-w-[400px] md:max-h-[450px] md:max-w-[400px] shadow-xl p-2                   
                                fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2  rounded-md bg-gray-100">

                    <div className='w-full h-4/5 lg:h-full md:h-full sm:h-full  relative top-1/4 lg:top-0 md:top-0 sm:top-20'>
                        <div className=' w-full h-3/5 lg:h-4/5  relative mb-10 lg:mb-5 '>
                            <img className="w-full h-full object-cover absolute" src={selectedFile} />
                        </div>
                        <div onClick={addPhoto} className='cursor-pointer text-center p-3 bg-red-400 hover:bg-red-600 w-full text-white' >Add photo</div>
                    </div>   

                    {/* <div className=' w-full h-2/5 lg:h-4/5 relative mb-5 '>
                         <img className="w-full h-full object-cover absolute" src={selectedFile} />
                    </div>
                    <div onClick={addPhoto} className='cursor-pointer text-center p-3 bg-red-400 hover:bg-red-600 w-full text-white' >Add photo</div> */}


                </Dialog>
            </Transition.Root>
          
        ):(
            <></>
        )}
       </div>
    )
}

export default UserName;
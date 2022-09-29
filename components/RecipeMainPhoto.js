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
import PhotoLoader from "./PhotoLoader";
import { useState } from "react";
import {useRecoilState} from "recoil";
import { imageArrayState } from "../atoms/imageArrayAtom";
import {doc, getDoc, setDoc, updateDoc} from "@firebase/firestore"; 
import { editPostState } from "../atoms/editPostAtom";
import { photoAlertState } from "../atoms/photoAlertAtom";

const RecipeMainPhoto = ({documentRef}) =>{

    const [pictureLoading, setPictureLoading] = useState(true)
    const [editing, setEditing] = useRecoilState(editPostState);
    const [imageArray, setImageArray] = useRecoilState(imageArrayState)
    const [showAlert, setShowAlert] = useRecoilState(photoAlertState)

    const loadFce = () =>{
        setPictureLoading(false)
    }

    const deletePhoto = async (event) =>{
        if(imageArray.length > 1){
            let index =  event.currentTarget.id;
          


            const newArr = [...imageArray]
            newArr.splice(index, 1)

            setImageArray([...newArr])
            
            const updateRef =  await updateDoc(documentRef,{image: [...[...newArr]]} )
    
            const snapshot = await getDoc(documentRef);
            //setPostData(snapshot.data())
        }
        else{
            setShowAlert(true)
        }
    
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
        <div >
                   
        {imageArray?.length ? (
            <div className=''>
              
                        {imageArray.length == 2 ? (
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

                         {imageArray.length == 1 ? (
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

                        {imageArray.length > 2 ? (
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
                    {imageArray.length > 3 && (
                            <Slider {...settings}>
                           { imageArray.slice(1).map((pic, index)=>( 
                                
                                <div key={index} className='h-40 w-64 bg-gray-100 border-2 border-white flex items-center relative'>
                                    <img src={pic} className="h-full w-full object-cover absolute"/>
                                    <div className='p-2 absolute w-full top-full -translate-y-full flex place-content-end' >
                                        {editing ? (
                                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-500
                                                cursor-pointer hover:bg-gray-600">
                                                <TrashIcon onClick={deletePhoto}  id={index +1} className='w-8 h-8 text-white cursor-pointer' />
                                            </div>
                                         ):(<></>)}
                                    </div>
                                </div>                                                              
                             ))}
                             </Slider>
                    )} 
                    
                    {imageArray.length == 3 && (
                        imageArray.slice(1).map((pic, index)=>( 
                            
                            <div key={index} className='w-1/2 h-52 bg-gray-100 border-2 border-white inline-block relative'>
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
    )
}

export default RecipeMainPhoto;
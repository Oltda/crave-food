import { useRouter } from 'next/router'
import {db} from "../../firebase";
import {useEffect, useState} from "react";
import {doc, getDoc} from "@firebase/firestore"; 
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import ClipLoader from "react-spinners/ClipLoader";


const UserName = () =>{
    const router = useRouter()
    const [postData, setPostData] = useState();



   useEffect(() => {
      if(router.isReady){
        const { nameUser } = router.query

        const fetchData = async () => {
            const docRef = doc(db, "posts", nameUser);
            const snapshot = await getDoc(docRef);
            setPostData(snapshot.data())
        }
      
        fetchData()
          .catch(console.error);
        
        
      }
   }, [router.isReady])


   const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3
  };

    return(
        <div>
        {postData?.image.length ? (
        <div className="h-full top-24 relative">

            <div className="lg:inline-block sm:block h-full lg:w-1/2 sm:w-full mb-16">
                   
                        {postData?.image.length ? (
                            <div>
                                    <h1 className='lg:hidden text-3xl text-center mb-10 '>{postData?.caption}</h1>

                                    <div className={postData?.image.length > 1 ?' overflow-hidden max-h-[500px]' : 'h-full'}>
                                            <img src={postData.image[0]} className="w-full relative"/>
                                    </div>

                                    
                      
                                
                                    <div>
                                    {postData?.image.length > 3 ? (
                                            <Slider {...settings}>
                                           { postData.image.map((pic, index)=>( 
                                                
                                                <div className='h-40 w-64 bg-gray-100 border-2 border-white flex items-center'>
                                                    <img src={pic} className="h-40 w-64 object-cover"/>
                                                </div>                                                              
                                             ))}
                                             </Slider>
                                    ):(
                                        postData.image.slice(1).map((pic)=>( 
                                            <div className='w-1/2 h-52 bg-gray-100 border-2 border-white inline-block'>
                                                <img src={pic} className="h-52 w-full object-cover"/>
                                            </div>                                                              
                                        ))
                                    )}
                                    </div>
                            </div>
                        ):(
                            <></>
                        )}           

            </div>

            <div className="lg:inline-block sm:block h-full lg:w-1/2 sm:w-full px-10 lg:px-20 align-top">
                <h1 className='hidden lg:block text-6xl text-center mb-14 '>{postData?.caption}</h1>

                <div className='mb-10 w-full relative border border-gray-500 py-7 px-12 rounded-md'>
                    <div className='absolute p-1 left-7 -top-7 bg-white'>
                        <div className='w-full h-full border-dotted border-black relative'>
                            <h2 className='text-3xl'>INGREDIENCE</h2>
                        </div>                        
                    </div>
                    
                    {postData?.captionTwo.length ?(
                        postData.captionTwo.map((e)=>(
                            <div className='lg:w-1/2 lg:inline-block sm:w-full sm:block'>
                               <p>&#x2713; {e}</p>
                            </div>
                            
                        ))
                        
                    ):(
                        <></>
                    )}
                </div>

                <div>
                <h2 className='text-3xl mb-3'>This is how you make it:</h2>
                    {postData?.recipeDescription? (
                        <div>{postData.recipeDescription}</div>
                    ):(
                        <></>
                    )}
                </div>
            </div>
            <div className='h-10'>

            </div>
           
        </div>
        ):(
            <div className='absolute flex justify-center w-full top-1/2 -translate-y-1/2'>
                <ClipLoader />
            </div>
        )}
       </div>
    )
}

export default UserName;
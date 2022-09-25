import { LazyLoadImage } from 'react-lazy-load-image-component';
import {useEffect, useState } from "react";

const LandingPhoto = () =>{
    const [loading, setLoading] = useState(true);

    
    const loaded = () =>{
        console.log("jo")
    }

 
  

    return(
        <div onLoad={() => console.log('LOADED')}  className="top-0 h-1/3 lg:h-1/2  overflow-hidden bg-cover bg-header-picture relative py-32">
                    <div className='relative w-full'>
                <div className=' w-full text-center rounded-lg bg-white opacity-90  p-4 shadow-lg '>
                    <h1 className=" text-xl lg:text-6xl  ">Where foodies meet</h1>   
                </div>
            </div> 

     {/* <div className="top-0 h-1/3 lg:h-1/2  overflow-hidden relative">
            <img onLoad={() => loaded()}  className="w-full absolute object-cover"   src="/static/images/foodies.jpg/"/>
            <div className='absolute top-32 h-full w-full'>
                <div className=' w-full text-center rounded-lg bg-white opacity-90  p-4 shadow-lg '>
                    <h1 className=" text-xl lg:text-6xl  ">Where foodies meet</h1>   
                </div>
            </div> */}

    
                
    </div>
    )
}

export default LandingPhoto;
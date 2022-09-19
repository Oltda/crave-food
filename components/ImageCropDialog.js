import  React, {useState, useEffect} from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImage';

const aspectRatios = [
    {value:4/3, text:"4/3"},
    {value:16/9, text:"16/9"},
    {value:1/2, text:"1/2"},
]

const ImageCropDialog = ({
    id, 
    imageUrl,
    cropInit, 
    zoomInit, 
    aspectInit,
    onCancel,
    setCroppedImageFor, 
    }) =>{
    
    if(zoomInit == null){
    zoomInit = 1;
    }
    if(cropInit == null){
        cropInit = {x:0, y:0};
    }

    if(aspectInit == null){
        aspectInit = aspectRatios[0]
    }

    const [zoom, setZoom] = useState(zoomInit);
    const [crop, setCrop] = useState(cropInit);
    const [aspect, setAspect] = useState(aspectInit);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);


    //const onCropChange =()=>{}

    const onCropChange =(crop)=>{
        setCrop(crop);
    }

    const onZoomChange =(zoom)=>{
        setZoom(zoom);
    }

    // const onAspectChange =(e)=>{
    //     const value = e.target.value;
    //     const ratio = aspectRatios.find(ratio=>ratio.value == value);
    //     setAspect(ratio)
    // };

    const onCropComplete=(croppedArea, croppedAreaPixels)=>{
        setCroppedAreaPixels(croppedAreaPixels)
    };

 

    const onCrop = async ()=>{
        const croppedImageUrl = await getCroppedImg(imageUrl, croppedAreaPixels)

        console.log("corpped image url!! " + croppedImageUrl);

        setCroppedImageFor(id, crop, zoom, aspect, croppedImageUrl)
    };

   

    const onResetImage=()=>{
        resetImage(id);
    }

    return (
    <div>

     
        <div className='h-2/3  z-50'>
            <Cropper 
                image={imageUrl} 
                zoom={zoom} 
                crop={crop} 
                aspect={aspect.value}
                onCropChange={onCropChange}
                onZoomChange={onZoomChange}
                onCropComplete={onCropComplete}  
                />            
        </div>  

        <div className='z-100 h-1/3 absolute'>
                <button className='mx-5 border-2 border-blue-600 bg-white' onClick={onCancel}>cancel</button>
                <button className='mx-5 border-2 border-blue-600 bg-white'>reset</button> 
                <button className='mx-5 border-2 border-blue-600 bg-white' onClick={onCrop} >crop</button>
        </div>    
    </div>
    
    );
}

export default ImageCropDialog;
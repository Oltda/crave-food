import {Dialog, Transition} from "@headlessui/react";
import { photoPreviewState } from "../atoms/photoPreviewAtom";
import {useRecoilState} from "recoil";
import { imageArrayState } from "../atoms/imageArrayAtom";
import { db, storage } from "../firebase";
import {ref, getDownloadURL, uploadString } from '@firebase/storage';
import {doc, getDoc, setDoc, updateDoc} from "@firebase/firestore"; 


const PhotoPreview = ({selectedFile, documentRef}) =>{
    const [openPreview, setOpenPreview] = useRecoilState(photoPreviewState);
    const [imageArray, setImageArray] = useRecoilState(imageArrayState)

    const addPhoto = async ()=>{

     
        const imageRef = ref(storage, `posts/${documentRef.id}/image ${imageArray.length}`);

        await uploadString(imageRef, selectedFile, "data_url").then(async snapshot =>{
            const downloadURL = await getDownloadURL(imageRef);
            await updateDoc(doc(db, 'posts', documentRef.id), {
                image: [...imageArray, downloadURL]
            })
            setImageArray([...imageArray, downloadURL])
        });
    
        setOpenPreview(false)

    }

    return(
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
        </Dialog>
    </Transition.Root>
    )
}

export default PhotoPreview;
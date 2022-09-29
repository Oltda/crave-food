import {Dialog, Transition} from "@headlessui/react";
import { photoAlertState } from "../atoms/photoAlertAtom";
import {useRecoilState} from "recoil";
import {
    ExclamationIcon
} from "@heroicons/react/outline";
import {signIn} from "next-auth/react";
import { useState } from "react";

const PhotoAlert = () =>{
    const [alert, setAlert] = useRecoilState(photoAlertState)

    return(
        <Transition.Root show={alert} >
            <Dialog as='div' onClose={setAlert} className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white h-72 min-w-[300px] w-1/3  text-center shadow-xl">
                <div className="w-full flex justify-center items-center bg-red-300 h-1/2">
                    <ExclamationIcon className=" h-14 w-14 text-white" />
                </div>
                <div className=" bg-white h-1/2">
                    <p className="my-5 text-lg font-semibold">Your post needs to have at least 1 photo.</p>
                </div>
            </Dialog>
        </Transition.Root>



  
    )
}

export default PhotoAlert;
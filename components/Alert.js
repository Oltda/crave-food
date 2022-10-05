import {Dialog, Transition} from "@headlessui/react";
import {alertState} from "../atoms/alertAtom";
import {useRecoilState} from "recoil";
import {
    ExclamationIcon,
    XIcon
} from "@heroicons/react/outline";
import {signIn} from "next-auth/react";

const Alert = () =>{
    const [alert, setAlert] = useRecoilState(alertState)

    return(
        <Transition.Root show={alert} >
            <Dialog 
                as='div' 
                onClose={setAlert} 
                className=" border border-gray-200 absolute top-1/2 -translate-y-1/2 
                left-1/2 -translate-x-1/2 bg-white h-full w-full lg:h-72 lg:w-1/3 min-w-[300px]   text-center shadow-xl"
                >
                <div className="mt-10 lg:mt-0 w-full flex justify-center items-center bg-red-300 h-1/3 lg:h-1/2">
                    <ExclamationIcon className=" h-20 w-20 text-white" />
                </div>
                <div className=" bg-white h-1/2">
                    <p className="my-5 text-lg font-semibold">Please sign in</p>

                    <div className=" cursor-pointer m-auto h-10 w-40 rounded-md bg-blue-400 hover:bg-blue-500 text-white flex items-center justify-center" onClick={signIn} >Sign in</div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default Alert;
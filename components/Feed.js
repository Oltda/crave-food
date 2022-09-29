import PostForm from "./PostForm";
import {useSession} from "next-auth/react";
import Posts from './Posts';
import {modalState} from "../atoms/modalAtom";
import {useRecoilState} from "recoil";
import {alertState} from "../atoms/alertAtom";
import Alert from "./Alert";



function Feed(){
    const {data: session} = useSession();
    const [open, setOpen] = useRecoilState(modalState)
    const [alert, setAlert] = useRecoilState(alertState)

   


    return(
        <div className="grid grid-cols-5 h-96">
            <div className="bg-gray-100 hidden lg:block lg:col-span-1">
                    
            </div>
            
        
            <div className="col-span-5 lg:col-span-3 pt-10">
                    

            {open?(   
                <PostForm />

            ):(
                <></>
            )}

            {alert ?(
    
                <Alert />
            ):(<></>)}
            
                <Posts />              
            </div>
            <div className="bg-gray-100 hidden lg:block lg:col-span-1"></div>             
        </div>
    )
}

export default Feed;
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
            <div className="bg-gray-100 col-span-1">
                    {/* <img src="image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD…icRtjCXrzkjsHovE26DTDCEWJsYbQqUnB2++H3gLyyzpZP//Z" /> */}
            </div>
            
        
            <div className="col-span-5 lg:col-span-3 pt-10">
                    

            {open?(
            
                // <PostFormTest />
                <PostForm />

            ):(
                <></>
            )}

            {alert ?(
    
                <Alert />
            ):(<></>)}

            
            <Posts />

                    
            </div>
            <div className="bg-gray-100 col-span-1">
                            
            </div>   



            

                
        </div>
    )
}

export default Feed;
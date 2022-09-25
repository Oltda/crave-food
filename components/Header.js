
import {
    PlusCircleIcon,
    UserCircleIcon,
    LogoutIcon,
    LoginIcon,
} from "@heroicons/react/outline";
import {signIn, signOut, useSession} from "next-auth/react";
import {useRecoilState} from "recoil";
import {modalState} from "../atoms/modalAtom";
import Link from 'next/link'




function Header(){
    const {data: session} = useSession();
    const [open, setOpen] = useRecoilState(modalState)
       

    return(
       
        <div className="top-0 h-1/7 w-full bg-white shadow-sm border-b fixed flex items-center py-4 px-6 lg:px-16 z-50 place-content-between">
                <Link href={'/'} >
                    <div className="w-20 lg:w-36 cursor-pointer">
                    
                        <img className="w-full relative hidden lg:block"  src="/static/images/CraveFood.png"/>
                    
                        <img className="w-8 relative lg:hidden"  src="/static/images/CraveLogo.png"/>
                    </div>
                </Link>
       

                <div className="flex flex-row">
                {session?(
                    <div className="flex flex-row">
                        <Link href={'/userProfile/' + session?.user?.username}><UserCircleIcon className="h-8 w-8 mr-4 cursor-pointer hover:scale-125 transition transform duration-200 ease-out"  /></Link>                       
                        <PlusCircleIcon onClick={()=>setOpen(true)} className="h-8 w-8 mr-4 cursor-pointer hover:scale-125 transition transform duration-200 ease-out" />
                        <LogoutIcon onClick={signOut} className="h-8 w-8 cursor-pointer hover:scale-125 transition transform duration-200 ease-out" />
                    </div>
                ):(<LoginIcon onClick={signIn} className="h-8 w-8 cursor-pointer hover:scale-125 transition transform duration-200 ease-out" />)}
                    
                </div>
                 
                    
            </div>
    
       
    )
}

export default Header;
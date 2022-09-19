
import {
    SearchIcon,
    PlusCircleIcon,
    UserGroupIcon,
    HeartIcon,
    PaperAirplaneIcon,
    MenuIcon,
    CakeIcon
} from "@heroicons/react/outline";

import TopPicks from "./TopPicks";


function TestFeed(){

    let hidden = true;
    const showCategory = (e) =>{
     
        //e.target.parentElement.nextElementSibling.classList.toggle("-left-20")
        e.target.parentElement.nextElementSibling.firstElementChild.classList.toggle("-left-32")
        // if(hidden){
        //     e.target.parentElement.nextElementSibling.firstElementChild.classList.remove("-left-20")
        //     e.target.parentElement.nextElementSibling.firstElementChild.classList.add("left-0")
        // }
    }


    return(
        <div className="grid grid-cols-5 h-96" >
            <div className="bg-gray-100 col-span-1">
                             
            </div>

            <div className="col-span-3">
               
            
            </div>
            <div className="bg-gray-100 col-span-1">
                             
             </div>          
        </div>
    )
}

export default TestFeed;
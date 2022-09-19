
import Link from 'next/link'
import { addDoc, serverTimestamp, collection, onSnapshot, query, orderBy, setDoc, doc, deleteDoc} from "firebase/firestore";
import { useSession } from "next-auth/react";
import {useEffect, useState} from "react";
import {db} from "../firebase";
import Moment from "react-moment";

import {
    ChatIcon,
    ChartBarIcon,
    ThumbUpIcon,
    ThumbDownIcon
} from "@heroicons/react/outline";
import {alertState} from "../atoms/alertAtom";
import {useRecoilState} from "recoil";


function Post({id, username, img, caption}){

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const {data: session} = useSession();
  const [chat, setChat] = useState(false);
  const [likes, setLikes] = useState([])
  const [alreadyLiked, setAlreadyLiked] = useState(false);
  const [dislikes, setDislikes] = useState([])
  const [alreadyDisliked, setAlreadyDisliked] = useState(false);
  const [alert, setAlert] = useRecoilState(alertState)

    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
      };


    useEffect(
        ()=> 
            onSnapshot(
                query(
                    collection(db, 'posts', id, 'comments' ), 
                    orderBy('timestamp', 'desc')
                ), (snapshot) => setComments(snapshot.docs)
            ), 
        [db, id]
    ); 




    useEffect(
        ()=>
        setAlreadyLiked(
            likes.findIndex((like) => like.id == session?.user?.uid) !== -1
            ),
            [likes]
        );
    
    useEffect(
        ()=>
        setAlreadyDisliked(
            dislikes.findIndex((dislike) => dislike.id == session?.user?.uid) !== -1
            ),
            [dislikes]
        );


   




    useEffect(
        ()=> 
            onSnapshot(
                query(collection(db, 'posts', id, 'likes' )), (snapshot) => setLikes(snapshot.docs),
              
            ), 
        [db, id]
    ); 


    useEffect(
        ()=> 
            onSnapshot(
                query(collection(db, 'posts', id, 'dislikes' )), (snapshot) => setDislikes(snapshot.docs)
            ), 
        [db, id]
    ); 


    const sendComment = async (e) =>{
        
        e.preventDefault();
        if(session?.user){
            const commentToSend = comment;
            setComment('');

            await addDoc(collection(db, 'posts', id, 'comments'), {
                comment: commentToSend,
                username: session.user.username,
                timestamp: serverTimestamp(),

            })
        }else{
            setAlert(true)
        }
    }



    const likePost = async () => {
        if(session?.user){

            if(alreadyLiked){
                await deleteDoc(doc(db, 'posts', id, 'likes', session.user.uid));
            }
            else{
                await setDoc(doc(db, 'posts', id, 'likes', session.user.uid), {
                    username: session.user.username
                })
            }
        }else{
            setAlert(true)
        }
    };


    
    const dislikePost = async () => {
        if(session?.user){
            if(alreadyDisliked){
                await deleteDoc(doc(db, 'posts', id, 'dislikes', session.user.uid));
            }
            else{
                await setDoc(doc(db, 'posts', id, 'dislikes', session.user.uid), {
                    username: session.user.username
                })
            } 
        }else{
            setAlert(true)
        }    
    };



    const openChat = () =>{
        if(chat){
            setChat(false);
        }
        else{
            setChat(true);
        }
    }

    

   
    return(
    <div className="w-full lg:w-2/3 md:w-2/3  m-auto mb-10">
         
    {img ? (
          <div className=" bg-white lg:rounded-lg border border-gray-300">
              
                    <div className="text-2xl lg:text-3xl text-center font-medium  mb-3 p-2">{caption}</div>
                               
                    <div className="w-full overflow-hidden">
                        
                        <Link href={'/userRecipe/' + id}>
                            <img src={img[0]} className="w-full cursor-pointer"/>
                        </Link>
                    </div>

                    {/* <div className="text-2xl font-semibold">{caption}</div> */}
                    <div className="" >
                        By <Link href={'/userProfile/' + username}><span className="font-semibold cursor-pointer hover:text-red-400" >{username}</span></Link>
                    </div>

                    <div className="px-4 py-4 flex place-content-between items-center">
                        <div className="h-full flex  items-center">
                            <ThumbUpIcon onClick={likePost} className="h-10 w-10 cursor-pointer mr-1 hover:text-red-400" /><span>{likes.length}</span>
                            <ThumbDownIcon onClick={dislikePost} className="h-10 w-10 cursor-pointer mr-1 ml-4 hover:text-red-400" /><span>{dislikes.length}</span>
                        </div>

                        <ChatIcon onClick={openChat} className="h-10 w-10 cursor-pointer hover:text-red-400" />
                    </div>
           


                {chat &&(
                <div>


                {comments.length > 0 && (
                <div className="lg:ml-10 h-16 lg:h-20 overflow-y-scroll
                    scrollbar-thumb-black scrollbar-thin">
                    {comments.map(comment =>(
                        <div key={comment.id} className="flex items-center space-x-2 mb-3">
                            <img
                                className="h-7 rounded-full" 
                                src={comment.data().userImage} 
                                alt="" />
                            <p className="text-sm flex-1">
                                <span className="font-bold">{comment.data().username}
                                </span> {comment.data().comment}
                            </p>

                            <Moment className="pr-5 text-xs" fromNow>
                                {comment.data().timestamp?.toDate()}
                            </Moment> 
                        </div>
                    ))}
                </div>
            )}
            <form className="flex items-center p-4">
         
            <input
                type="text"
                value={comment}
                onChange={e=> setComment(e.target.value)}
                placeholder="Add a comment..."
                className="border-none flex-1 focus:ring-0 outline-none"
            />
            <button 
                type='submit' 
                //disabled={!comment.trim()} 
                onClick={sendComment}
                className="font-semibold text-blue-400" 
                >
                Post
            </button>
            </form>


            </div>
            )}
          </div>
          
    ):(
        <></>
    )}


    </div>
    )
}

export default Post;
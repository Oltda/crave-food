import { useRouter } from 'next/router'
import {db} from "../../firebase";
import {useEffect, useState, useRef} from "react";
import { collection, onSnapshot, orderBy, query, doc, getDoc, where, addDoc, setDoc } from 'firebase/firestore';
import UserPost from '../../components/UserPost';
import {useSession} from "next-auth/react";
import {
    PencilIcon,
    UserAddIcon
} from "@heroicons/react/outline";
import {useRecoilState} from "recoil";
import {alertState} from "../../atoms/alertAtom";
import Alert from "../../components/alert";



const userProfile = () =>{
    const router = useRouter()
    const [posts, setPosts] = useState([]);
    const [numRows, setNumRows] = useState(null)
    const [userName, setUserName] = useState(null)
    const {data: session} = useSession();
    const [userInfo, setUserInfo] = useState([]);
    const infoTextRef = useRef(null);
    const [infoBoxValue, setInfoBoxValue] = useState();
    const [edit, setEdit] = useState(false);
    const [currentUserInfo, setCurrentUserInfo] = useState([])
    const [followed, setFollowed] = useState([])
    const [followers, setFollowers] = useState([])
    const [alert, setAlert] = useRecoilState(alertState)



    useEffect(() => {
        if(router.isReady){
          const { profileUser } = router.query
          onSnapshot(
            query(collection(db, 'posts'), 
            where('username', '==', profileUser),        
            ),           
            (snapshot) =>{
             setPosts(snapshot.docs);
             }
         ),

         
         onSnapshot(
            query(collection(db, 'users'), 
            where('username', '==', profileUser),        
            ),           
            (snapshot) =>{
                setUserInfo(snapshot.docs);
             }
         )

        setUserName(profileUser)
        }
     }, [router.isReady])



     useEffect(() => {

        if(session?.user){
            onSnapshot(
                query(collection(db, 'users'), 
                where('username', '==', session?.user?.username),        
                ),           
                (snapshot) =>{
                    setCurrentUserInfo(snapshot.docs);
                }
            )
        }

     }, [session])


     useEffect(() => {
        if(userInfo.length > 0){
            setInfoBoxValue(userInfo[0].data().infoText)
        }

     }, [userInfo])


     useEffect(()=>{

        if(userInfo.length > 0){
            onSnapshot(
                query(collection(db, 'users', userInfo[0].id, 'followedUsers' )), (snapshot) => setFollowed(snapshot.docs),
              
            ),

            onSnapshot(
                query(collection(db, 'users', userInfo[0].id, 'followers' )), (snapshot) => setFollowers(snapshot.docs),
              
            )
        }
  
     },[userInfo]); 



    const postUserInfo = async ()=>{

        if(userInfo.length == 0){
            await addDoc(collection(db, "users"), {
                username: session.user.username,
                infoText: infoTextRef.current.value,
                //followedUser: []
            })

        }
        else{
            const infoId = userInfo[0].id;
            await setDoc(doc(db, 'users', infoId), {
                infoText: infoTextRef.current.value,
                username: session.user.username,
                //followedUser: [userInfo[0].data().followedUser]
            })
            
        }
     }



     const followUser = async ()=>{
        const { profileUser } = router.query
        // if current user does not have an account -> create account
        if(session?.user){
        if(currentUserInfo.length == 0){
           const docRef = await addDoc(collection(db, "users"), {
                username: session.user.username,
                infoText: "",
            })
            // if followed user has an account
            if(userInfo.length > 0){
                // and add collection to current user profile with followed users and add collection to followed user profile with followers users
                await Promise.all([
                    setDoc(doc(db, 'users', docRef.id, 'followedUsers',userInfo[0].id), {
                        followedUser: userInfo[0].data().username
                    }), 
                    setDoc(doc(db, 'users', userInfo[0].id, 'followers',docRef.id), {
                        follower: session.user.username,
                    })
                ]);

            }
            // if followed user does not have an account -> create an account for him 
            else{
                const newUserRef = await addDoc(collection(db, "users"), {
                    username: profileUser,
                    infoText: "",
                })

                // and add collection to current user profile with followed users and add collection to followed user profile with followers users
                await Promise.all([
                    setDoc(doc(db, 'users', docRef.id, 'followedUsers',newUserRef.id), {
                        followedUser: profileUser
                    }), setDoc(doc(db, 'users', newUserRef.id, 'followers',docRef.id), {
                        follower: session.user.username,
                    })
                ]);


            }

        }
        else{
              // if current user has an account
            const currentInfoId = currentUserInfo[0].id;
            await setDoc(doc(db, 'users', currentInfoId), {
                infoText: currentUserInfo[0].data().infoText,
                username: session.user.username,
            })
          // if followed user has an account
            if(userInfo.length > 0){
                await setDoc(doc(db, 'users', currentInfoId, 'followedUsers', userInfo[0].id), {
                    followedUser: userInfo[0].data().username
                })
                //  and add collection to followed user profile with followers users
                await setDoc(doc(db, 'users', userInfo[0].id, 'followers',currentInfoId), {
                    follower: session.user.username,
                })
            }
            else{
                   // if followed user does not have an account -> create an account for him 
                const newUserRef = await addDoc(collection(db, "users"), {
                    username: profileUser,
                    infoText: "",
                })
                //  and add collection to current user profile with followed users
                await setDoc(doc(db, 'users', currentInfoId, 'followedUsers',newUserRef.id), {
                    followedUser: profileUser
                })
                //  and add collection to followed user profile with followers users
                await setDoc(doc(db, 'users', newUserRef.id, 'followers',currentInfoId), {
                    follower: session.user.username,
                })
            }
            
        }
        setEdit(false)
        }else{
            setAlert(true)
        }
     }




     const handleChangeInfo = event =>{
        setInfoBoxValue(event.target.value)
     }


     const showEditBox = () =>{
        if(edit){
            setEdit(false)
        }
        else{
            setEdit(true)
        }
     }


   

    return(
        <div className='grid grid-cols-6  pt-28 absolute bg-gray-100 border border-black h-full w-full' >
            <div className='col-span-1'>
       
            </div>

            <div className='lg:col-span-4 col-span-6 text-center'>
             <div className='w-full  mb-5'>

                <div className='flex place-content-center h-14 items-baseline'>
                    <div className='font-semibold text-3xl mb-5' >{userName}</div> 
                    {userName != session?.user?.username &&(
                    <UserAddIcon onClick={followUser} className='cursor-pointer ml-6 w-6 h-6 hover:text-red-400' />
                    )}
                </div>

                {userName === session?.user?.username ?(
                    <div className=' px-10'>
                        <div className='flex place-content-end mb-2'>
                            <div className=' h-10 w-10 rounded-full  bg-gray-200 flex place-content-center items-center'> 
                                <PencilIcon className='h-6 w-6 cursor-pointer' onClick={showEditBox}  />
                            </div>                          
                        </div>
                        {edit ? (
                        <div className=''>
                                <textarea 
                                className="w-full overflow-y-scroll 
                                        scrollbar-thin scrollbar-thumb-black max-h-[200px]  
                                        focus:border border-gray-400 py-5 text-center"
                                placeholder="Write something about yourself.."
                                type="text"
                                ref={infoTextRef}
                                onChange={handleChangeInfo}
                                value={infoBoxValue}
                                ></textarea>
                                <div className='flex place-content-end mb-2'>
                                     <button className='' onClick={postUserInfo} >Save</button>
                                </div>
                        </div>
                        ):(

                        <div className=''>
                                {infoBoxValue}
                        </div>
                        )}

                    </div>
                ):(
                   <div className=' w-full'>
                        {infoBoxValue}
                   </div>
                )}
                </div>
                
              
                <div className='mx-10 border-b-2 border-gray-200'>
                </div>
                <div className='mb-14 text-gray-500 text-left px-10 flex place-content-between'>
                    <p className=' min-w-[100px]' >Recipes <span className='font-bold'>{posts.length}</span> </p>
                    <p className=' min-w-[100px]' >Follows <span className='font-bold'>{followed.length}</span> </p>
                    <p className=' min-w-[100px]' >Followers <span className='font-bold'>{followers.length}</span></p>
                </div>                   
                
                {posts.map((post)=>(
                    <div key={post.id}   className='inline-block mx-4'>
                        <UserPost    
                        id={post.id}
                        img={post.data().image}
                        caption={post.data().caption}
                        description={post.data().recipeDescription}
                        />
                    </div>
                ))}
                <Alert />
            </div>

            <div className='col-span-1'>
                 
            </div>
     

        </div>
    )
}

export default userProfile;
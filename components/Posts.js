import Post from './Post';
import {useEffect, useState, CSSProperties } from "react";
import { collection, onSnapshot, orderBy, query} from 'firebase/firestore';
import {db} from "../firebase";
import ClipLoader from "react-spinners/ClipLoader";

function Posts(){

    const [posts, setPosts] = useState([]);
    const [ready, setReady] = useState(false)
    


    useEffect(
        ()=>
       onSnapshot(
           query(collection(db, 'posts'), orderBy('timestamp', 'desc')), 
           (snapshot) =>{
            setPosts(snapshot.docs);
            setReady(true)
            }
        ), 
        [db]
    );

    const override = {
        display: "block",
        margin: "0 auto",
        borderColor: "red",
        outerHeight: "100%",
        outerWidth: "100%",
        position: "relative",
      };

        

    return(
        <div>
            {!ready? (
                <div className=' '>
                <ClipLoader cssOverride={override} />
                </div>
            ):(

                <div>
                {posts.map((post)=>(
                    <Post
                    key={post.id} 
                    id={post.id} 
                    username={post.data().username} 
                    img={post.data().image}
                    caption={post.data().caption}
                    />
                ))}
            </div>
            )}


        </div>
        
    )
}

export default Posts;
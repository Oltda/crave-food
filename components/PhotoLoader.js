import ClipLoader from "react-spinners/ClipLoader";

const PhotoLoader = ({loading}) =>{

    return(
       
        <div className={loading ? 'absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 ' : 'hidden'}>
                <ClipLoader />
        </div>
       
    )
}

export default PhotoLoader;

const PreviewPhoto =({photo})=>{

    return(
        <div className=" bg-slate-300 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-1/3 border border-black">
            <img className="w-full" src={photo} />
        </div>
    )
}

export default PreviewPhoto;
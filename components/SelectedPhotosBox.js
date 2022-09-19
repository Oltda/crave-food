

function SelectedPhotosBox({selectedPhotosArr}){

 

    return(
    <div className="w-2/3 m-auto border-2 border-black">
        {selectedPhotosArr.map((pic)=>{
            <img 
            src={pic} 
            className="w-1/3 object-contain cursor-pointer"
            alt=""
            />   
        })}

    </div>
    )
}

export default SelectedPhotosBox;
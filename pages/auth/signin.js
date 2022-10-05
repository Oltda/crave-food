import {getProviders, signIn as SignIntoProvider} from "next-auth/react";


// Runs On the browser
function signIn({providers}){ 
    
    return (
    
        <>
        <div className="flex flex-col items-center justify-center min-h-screen
        py-2 -mt-56 px-14 text-center">
      
          

          <div className="mt-20 lg:mt-40  relative top-40">
          <img className="m-auto w-60 mb-10 "  src="/static/images/LoginDoor.png"/>
          {Object.values(providers).map((provider) => (
              <div key={provider.name}>
                
                <button
                  className="p-3 w-full bg-blue-500 rounded-lg text-white" 
                  onClick={() => SignIntoProvider(provider.id, {callbackUrl: "/"})}>
                  Sign in with {provider.name}
                </button>
              </div>
            ))}
          </div>
        </div>


        </>
      )
}


export async function getServerSideProps(){
    const providers = await getProviders();


    return {
        props:{
            providers,
        },
    };
}
export default signIn;
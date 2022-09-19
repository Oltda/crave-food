import type { NextPage } from 'next'
import Head from 'next/head'

import Feed from '../components/Feed';
import LandingPhoto from '../components/LandingPhoto';


const Home: NextPage = () => {
  return (
    <div className="bg-gray-50 h-screen overflow-y-scroll scrollbar-hide">
      <Head>
          Tuyen App
      </Head>

      

      <LandingPhoto />
   
      <Feed />
 
      
    </div>
  )
}

export default Home

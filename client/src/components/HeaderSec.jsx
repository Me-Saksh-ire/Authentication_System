import React from 'react'
import { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const HeaderSec = () => {

  const { userData } = useContext(AppContext)

  return (
    <div className='flex flex-col items-center mt-25 text-center text-gray-800'>
      <img src={assets.header_img} className='w-36 h-36 rounded-full mb-6' />

      <h1 className='flex items-center gap-1 text-xl sm:text-3xl font-medium mb-2'>Hey { userData ? userData.name : 'Developer'}!
        <img src={assets.hand_wave} className='w-8 aspect-square' />
      </h1>

      <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to our app</h2>

      <p className='mb-4 max-w-md'>Let's start with the quick product tour and we will have you up and running in no time!</p>

      <button className='px-8 py-2 rounded-full border border-gray-500 hover:bg-gray-100 text-gray-800 transition-all'>Get Started</button>
    </div>
  )
}

export default HeaderSec
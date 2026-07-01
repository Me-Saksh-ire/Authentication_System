import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {

  axios.defaults.withCredentials = true

  const navigate = useNavigate(); // useNavigate() it's a react router used to navigate through pages

  const { setIsLoggedIn, userData, setUserData, backendUrl } = useContext(AppContext)

  const sendVerificationOTP = async () => {
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp')
      
      if(data.success){
        navigate('/verify-email')
        toast.success(error.message)
      }else{
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(backendUrl + '/api/auth/logout')
      data.success && setIsLoggedIn(false)
      data.success && setUserData(false)
      navigate('/')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
      <img src={assets.logo} className='w-28 sm:w-32' />

      {userData

        ? <div className='w-8 h-8 flex justify-center items-center rounded-full text-white bg-black relative group'>
          {userData.name[0].toUpperCase()}

          <div className='absolute hidden group-hover:block  text-black right-0 rounded pt-10 z-10 top-0'>
            <ul className='list-none m-0 p-2 bg-slate-100 text-sm'>
              {!userData.isAccountVerified && <li onClick={sendVerificationOTP} className='px-2 py-1 hover:bg-slate-200 '>Verify Email</li>}

              <li onClick={logout} className='px-2 py-1 hover:bg-slate-200 pr-10'>Logout</li>
            </ul>
          </div>

        </div>

        : <button onClick={() => navigate('/login')} className='flex items-center gap-2 px-6 py-2 rounded-full border border-gray-500 text-gray-800 
      hover:bg-gray-100 transition-all'>Login <img src={assets.arrow_icon} /> </button>}


    </div>
  )
}

export default Navbar

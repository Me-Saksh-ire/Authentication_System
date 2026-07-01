import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const EmailVerify = () => {

  const navigate = useNavigate();

  axios.defaults.withCredentials = true

  const { backendUrl, isLoggedIn, getUserData, userData } = useContext(AppContext)

  const inputRefs = React.useRef([])

  const inputHandler = (e, index) => {
    if (e.target.value > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }

  const keyDownHandler = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('')
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    })
  }

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value)
      const otp = otpArray.join('')

      const { data } = await axios.post(backendUrl + '/api/auth/verify-account', { otp })
      if (data.success) {
        toast.success(data.message)
        getUserData()
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (isLoggedIn && userData && userData.isAccountVerified) {
      navigate('/')
    }
  }, [isLoggedIn, userData, navigate])

  return (
    <div className='flex justify-center items-center min-h-screen sm:px-24'>
      <img onClick={() => navigate('/')} src={assets.logo} alt='Logo' className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer mb-8' />  {/* Header Logo */}

      <form onSubmit={onSubmitHandler} className='bg-slate-900 rounded-lg p-8 shadow-lg w-96 text-sm'>
        <h1 className='text-white text-2xl text-center mb-4 font-semibold'>Email Verify OTP</h1>
        <p className='text-indigo-300 mb-6 text-center'>Enter the 6-digit code sent to your Email Id.</p>

        <div className='flex justify-between mb-8' onPaste={handlePaste}>
          {Array(6).fill(0).map((_, index) => (
            <input type="text" maxLength={1} key={index} required className='w-12 h-12 rounded-md bg-[#333A5C] text-xl text-white text-center'
              ref={e => inputRefs.current[index] = e}
              onInput={(e) => inputHandler(e, index)}
              onKeyDown={(e) => keyDownHandler(e, index)} />
          ))}
        </div>

        <button className='w-full py-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-center text-white'>Verify Email</button>
      </form>
    </div>
  )
}

export default EmailVerify

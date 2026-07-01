import react from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {

  const navigate = useNavigate();

  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;

      let response;

      if (state === 'Sign Up') {
        response = await axios.post(backendUrl + '/api/auth/register', {
          name, email, password
        });
        if (response.data.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate('/');
        } else {
          toast.error(response.data.message);
        }

      } else {
        response = await axios.post(backendUrl + '/api/auth/login', {
          email, password
        });

        if (response.data.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate('/');
        } else {
          toast.error(response.data.message);
        }
      }

    } catch (error) {
      toast.error(error.message);
    }
  }


  return (
    <div className='flex justify-center items-center min-h-screen sm:px-24'>
      <img onClick={() => navigate('/')} src={assets.logo} alt='Logo' className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer mb-8' />  {/* Header Logo */}


      <div className='w-full flex flex-col items-center mt-6 p-4 sm:p-6 sm:px-24'>

        <div className='bg-slate-900 text-white shadow-lg rounded-lg w-full sm:w-96'>
          <form onSubmit={onSubmitHandler} className='flex flex-col items-center p-6 sm:p-8'>

            <h2 className='text-2xl font-bold mb-6'>{state}</h2>

            {/* Name Input */}
            {state === 'Sign Up' &&
              (<div className='flex items-center text-white bg-slate-600 gap-2 p-2 w-full mb-4  rounded-full'>
                <img src={assets.lock_icon} alt='Name icon' />
                <input onChange={e => setName(e.target.value)}
                  value={name}
                  className='bg-transparent outline-none w-full' type="text" name="name" id="name" placeholder='Full Name' required />
              </div>)
            }

            {/* Email Input */}
            <div className='flex items-center gap-2 p-2 w-full bg-slate-600 mb-4  rounded-full'>
              <img src={assets.mail_icon} alt='Email icon' />
              <input onChange={e => setEmail(e.target.value)}
                value={email}
                className='bg-transparent outline-none w-full' type="email" name="email" id="email" placeholder='Email' required />
            </div>

            {/* Password Input */}
            <div className='flex items-center gap-2 p-2 w-full bg-slate-600 mb-4 rounded-full'>
              <img src={assets.lock_icon} alt='Lock icon' />
              <input onChange={ e => setPassword(e.target.value) }
                value={password}
                className='bg-transparent outline-none w-full' type="password" name="password" id="password" placeholder='Password' required />
            </div>

            <button type='submit' className='w-full mb-3 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-center text-white'> {state} </button >

            <button type='button' onClick={() => navigate('/password-reset')} className='text-indigo-300  hover:text-indigo-400 mb-1'>Forgot Password?</button>


            {state === 'Sign Up'

              ? (<div className='cursor-pointer'>
                <p className='text-indigo-100'>  Already have an account? <span onClick={() => setState('Login')} className='text-indigo-300  hover:text-indigo-400  mb-2 underline'>Login here</span>  </p>
              </div>)

              : (<div className='mt-2 cursor-pointer'>
                <p className='text-indigo-100'>  Don't have an account? <span onClick={() => setState('Sign Up')} className='text-blue-400 hover:text-indigo-400 mb-2 underline'>Sign Up</span>  </p>
              </div>)
            }

          </form >
        </div >
      </div >
    </div>
  )
}

export default Login

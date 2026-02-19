import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import useAuth from '../context/AuthProvider';

const Signin = () => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const navigate = useNavigate();
    const {signin,user} = useAuth();
    useEffect(()=> {
      if(user){
        navigate('/dashboard');
      }
    },[])
    
    const signhandler = async (e) => {
      e.preventDefault();
      await signin({email,password});
    }
  return (
    <>
      <form onSubmit={signhandler}>
          Email : <input type="text" placeholder='Enter Your Email' onChange={(e) => setEmail(e.target.value)} value={email} /> <br />
          Password : <input type="text" placeholder='Enter Your Password' onChange={(e) => setPassword(e.target.value)} value={password} /> <br />
          <button type='Submit'>Submit</button>
      </form>
      You Have Not A Account : <button onClick={() => navigate('/signup')}>Signup</button>
    </>
    
  )
}

export default Signin
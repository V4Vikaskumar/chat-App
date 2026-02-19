import React, { useEffect, useState } from 'react'
import {Navigate, useNavigate} from 'react-router'
import useAuth from '../context/AuthProvider';
const Signup = () => {
  const navigate = useNavigate();
  const {user} = useAuth();
  useEffect(() => {
    if(user){
      navigate('/dashboard')
    }
  },[])
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const {signup} = useAuth();
    const signupHandler = async (e) => {
        e.preventDefault();
        try {
            await signup({name,email,password});
        } catch (error) {
          console.log(error);
          return error;
        }
    }

  return (
    <>
      <form onSubmit={signupHandler}>
          Name : <input type="text" placeholder='Enter Your Name' value={name} onChange={(e) => setName(e.target.value)} /> <br />
          Email : <input type="text" placeholder='Enter Your Email' value={email} onChange={(e) => setEmail(e.target.value)} /> <br />
          Password : <input type="text" placeholder='Enter Your PassWord' value={password} onChange={(e) => setPassword(e.target.value)} /> <br />
          <button type='Submit'>Signup</button>
      </form>
      If You Have A Account : <button onClick={() => navigate('/signin')}>Signin</button>
    </>
    
  )
}

export default Signup
import React, { createContext, useContext, useState } from 'react'
import auth from '../lib/auth';
import Auth from '../Apis/Auth';
import { useNavigate } from 'react-router-dom';


const context = createContext();
export const AuthProvider = ({children}) => {
    const navigate = useNavigate();
    const [user, setuser] = useState(auth.user || null);
    const [isloggedIn,Setisloggedin] = useState(user ? true : false);
    async function signup({name,password,email}){
        const {user, token} = await Auth.signup({name,password,email});
        set({user,token});
        return {user,token};
    }
    async function signin({password,email}){
        const {user, token} = await Auth.signin({password,email});
       set({user,token});
        // console.log(data.data);
        return {user, token};
    }
    function set({user, token}){
        setuser(user);
        auth.user = user;
        auth.token = token;
        Setisloggedin(true);
        navigate('/');
    }

    function logout(){
        auth.logout();
        setuser(null);
        Setisloggedin(false);
    }
    

  return (
    <context.Provider value={
        {
            user,
            signup,
            signin,
            isloggedIn,
            token : auth.token || '',
            logout
        }
    }>
        {children}
    </context.Provider>
  )
}

export default function useAuth(){
    return useContext(context);
}
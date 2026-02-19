import React from 'react'
import Signup from './Pages/Signup'
import { Routes,Route, Navigate } from 'react-router-dom';
import Signin from './Pages/Signin';
import Dashboard from './Pages/Dashboard';
import useAuth from './context/AuthProvider';


const App = () => {
  const {isloggedIn} = useAuth();
  return (
    <>
    <Routes>
      <Route path='/dashboard' 
        element={isloggedIn ? <Dashboard /> : <Navigate to={'/signup'}/> } />
      <Route path='/signup' 
        element={!isloggedIn ? <Signup/> : <Navigate to={'/dashboard'}/>} />
      <Route path='/signin' 
        element={!isloggedIn ? <Signin/> : <Navigate to={'/dashboard'}/> } />
      <Route path='*' 
        element={!isloggedIn ? <Signin/> : <Dashboard/>} />
    </Routes>
    </>
    
  )
}

export default App
import React from 'react'
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignUpPage';
import './App.css'
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChattingPage from './pages/ChattingPage';
import SocialLoginRedirect from './pages/SocialLoginRedirect';
import Profile from './pages/ProfilePage';
import ContactPage from './pages/ContactPage'
import QrPage from './pages/QrPage';
import AiChat from './pages/AichatPage';
import FgpwdPage from './pages/FgpwdPage';
function App() {
  

  return (
     
    <Router>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path = '/home' element ={ <HomePage /> }   />
        <Route path = '/chat/:recipientId' element ={<ChattingPage />} />
        <Route path = '/social-redirect' element={<SocialLoginRedirect/>}/>
        <Route path ='/profile' element ={<Profile />} />
        <Route path= '/contact' element ={<ContactPage />} />
        <Route path = '/qr-page' element ={<QrPage />} />
        <Route path = '/ai-chat' element ={<AiChat />} />
        <Route path ='forgot-password' element ={<FgpwdPage />} />
      </Routes>
    </Router>


  
  )
}

export default App

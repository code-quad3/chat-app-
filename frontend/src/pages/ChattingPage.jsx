import Header from "../components/Header";
import React, { useState,useEffect } from "react";
import ChatWindow from "../components/ChatWindow";
import { useParams ,useLocation } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";

function ChattingPage(){
    const [isDarkMode,setIsDarkMode] = useState(false);
    const {recipientId} =useParams();
    const [userId,setUserId] =useState(null);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
        useEffect(()=>{
            if(token !==null){  
    
                const decoded = jwtDecode(token);
                 setUserId(decoded.id);
                 
            }else{
                navigate('/login');
            }
        },[token,navigate])
    const location = useLocation();
    const recipientName = location.state?.name || "Unknown";
    
    const toogleDarkMode = ()=>{
      setIsDarkMode(prevMode => !prevMode);}
         

      return ( 
        <> 
        
      <ChatWindow isDarkMode={isDarkMode} userId={userId} recipientId={recipientId} recipientName={recipientName}/>
       </>)
}


export default ChattingPage;
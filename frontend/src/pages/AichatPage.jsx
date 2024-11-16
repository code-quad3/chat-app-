import React, { useState, useRef, useEffect } from 'react';
import MessagesList from '../components/MessageList';
import { Send,ArrowLeft } from 'lucide-react';
import axios from 'axios';
import{Typography,Input} from '@material-tailwind/react';

import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";

function AichatPage(){
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messageEndRef = useRef(null);
    const recipientId = "chatwithAibot";
    const [userId,setUserId] =useState(null);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const recipientName ="Ai Bhai";
        useEffect(()=>{
            if(token !==null){  
    
                const decoded = jwtDecode(token);
                 setUserId(decoded.id);
                 
            }else{
                navigate('/login');
            }
        },[token,navigate])
    


      useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, [messages]);
    
      const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, '0'); // Day with leading zero
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month with leading zero
        const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }); // Time in 12-hour format
        
        return `${day}/${month} ${time}`;
      };
      

           
         // Handle sending a message to the backend (OpenAI AI response)
  const handleSendMessage = async (e) => {
    console.log("submitted");
    e.preventDefault();
    if (newMessage.trim()) {
      const newMsg = {
        id: new Date(),
        text: newMessage,
        sender: userId,
        timestamp: new Date().toISOString(),
      };

      // Add user message to chat
      setMessages((prevMessages) => [...prevMessages, newMsg]);
      setNewMessage('');

      try {
        // Send the message to the AI chat endpoint
        const response = await axios.post('http://localhost:4000/ai-chat/', { message: newMessage });
        const aiMessage = response.data.message;

        // Handle AI response by adding it to the messages
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: aiMessage, sender: recipientId, timestamp: new Date().toISOString() },
        ]);
      } catch (error) {
        console.error('Error sending message to AI', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Error processing AI response', sender: recipientId, timestamp: new Date().toISOString() },
        ]);
      }
    }
  };


                              





    return( <div >
        <div className =' bg-blue-400 flex'>
        <button className='text-white h-6 w-6 m-5' onClick={()=>{
          window.location.href= 'http://localhost:5173/home'
        }}>
        <ArrowLeft/>
        </button>
        
        <header className='text-white flex flex-col m-auto '><Typography variant ="h5">{recipientName} </Typography>
    
        </header>   
        
        </div>             
<div className={'flex flex-col h-screen bg-gray text-black'}>
<MessagesList
  messages={messages}
  userId={userId}
  formatTimestamp={formatTimestamp}
  isDarkMode={null}
  messageEndRef={messageEndRef}
/>
<form onSubmit={handleSendMessage} className={'p-4 bg-white flex items-center'}>
  <Input
    type="text" variant='outlined' label='Type a message...' color='blue'
    value={newMessage}
    onChange={(e) => setNewMessage(e.target.value)}
    placeholder="Type a message..."
  
  />
  <button
    type="submit"
    className={'bg-blue-400 p-3 rounded-md text-white ml-3 hover:bg-light-green-400 hover:text-black'  }
  >
    <Send className="h-5 w-5" />
  </button>
</form>
</div>
</div>);
}


export default AichatPage;
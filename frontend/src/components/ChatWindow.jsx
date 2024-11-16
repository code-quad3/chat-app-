import React, { useState, useRef, useEffect } from 'react';
import MessagesList from './MessageList';
import { Send,ArrowLeft } from 'lucide-react';
import { io } from 'socket.io-client';
import axios from 'axios';
import{Typography,Input} from '@material-tailwind/react';

const ChatWindow = ({ isDarkMode, userId, recipientId ,recipientName }) => {
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipientOnline,setRecipientOnline] =useState('');
  const messageEndRef = useRef(null);
  const socket = useRef(null);
  
  // Initialize Socket.IO connection
  
  useEffect(() => {
    
    socket.current = io('http://localhost:4000');
    
    

    //whenenver user is connect is userOnline must be online
      socket.current.emit('userOnline',userId);

   socket.current.on('connect',()=>{
  socket.current.emit('userOnline',userId);
   });
         

            socket.current.emit('checkOnlineStatus',recipientId);

        // Listen for global onlineUser updates
        socket.current.on('onlineUser', ({userId: x,status: y}) => {
          
        if(x === recipientId ){
          
            setRecipientOnline(y);
        }

    });
      
          
        
          
      

      

    
    // Private message handler
  const handlePrivateMessage = ({ message, senderId }) => {
      if(senderId === recipientId){
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, sender: senderId, timestamp: new Date().toISOString() },
      ]);
    
          // Trigger push notification for the recipient (if subscribed)
          if (senderId !== userId) {
            const notificationTitle = 'New Message';
            const notificationBody = `You received a new message from ${senderId}: "${message}"`;
            // Emit the notification event to the client
            socket.current.emit('newMessage', { userId: recipientId, notificationTitle, notificationBody });
          }
        
      
    
    
    
    
    }
    };
    //Presence update handler
    

     socket.current.on('privateMessage',handlePrivateMessage);
    // Clean up on component unmount
    return () => {
     socket.current.off('privateMessage',handlePrivateMessage); // Remove listener
     
      socket.current.disconnect();
      socket.current = null;
    }; 
  },[userId,recipientId]);
  
  


  // Fetch chat history on mount
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/chat/history/${recipientId}`,{
          headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
        });
        console.log(response.data);
       setMessages(response.data);
       
        
      } catch (error) {
        console.error("Error fetching chat history:", error);
        if(error.status=== 401){
          window.location.href='http://localhost:5173/login';
        }
      }
    };
    fetchChatHistory();
  },[]);

  // Scroll to the bottom when a new message is received
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

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const newMsg = {
        id: new Date(),
        text: newMessage,
        sender: userId, // Use the actual user ID for the sender
        timestamp: new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, newMsg]);
      setNewMessage('');
  
       
      // Emit the private message via Socket.IO
       
      if(socket.current && socket.current.connected){
        console.log("Emitting the event");
      socket.current.emit('privateMessage', { recipientId, message: newMessage, userId });}
          else{
            console.log("Socket is not connected");
          }
    }
  };

  return (
            <div >
              <div className =' bg-blue-400 flex'>
              <button className='text-white h-6 w-6 m-5' onClick={()=>{
                window.location.href= 'http://localhost:5173/contact'
              }}>
              <ArrowLeft/>
              </button>
              
              <header className='text-white flex flex-col m-auto '><Typography variant ="h5">{recipientName} </Typography>
              <span><Typography variant='lead'>{recipientOnline}</Typography></span>
              </header>   
              
              </div>             
    <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray text-black'}`}>
      <MessagesList
        messages={messages}
        userId={userId}
        formatTimestamp={formatTimestamp}
        isDarkMode={isDarkMode}
        messageEndRef={messageEndRef}
      />
      <form onSubmit={handleSendMessage} className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} flex items-center`}>
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
    </div>
  );
};

export default ChatWindow;

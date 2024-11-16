import React from 'react'
import {Card, CardBody, CardFooter,Typography} from '@material-tailwind/react'


const MessagesList = ({messages,userId,formatTimestamp, isDarkMode, messageEndRef }) => {
  
  return (
    <div className="flex-1 p-4 space-y-4 ">
      {messages.map((msg) => (
        <Card
          key={msg.id} 
          className={` max-w-xs rounded-lg  ${
            msg.sender === userId
              ? `${isDarkMode ? 'bg-blue' : 'bg-primary-default'} text-white ml-auto` 
              : `${isDarkMode ? 'bg-gray text-white' : 'bg-white text-gray-800'} `
          }`}
        >
          <CardBody className='text-balance ...'><Typography>{msg.text}</Typography></CardBody>
          <CardFooter className={`text-xs mt-1 ${
            msg.sender === userId
              ? (isDarkMode ? 'text-blue-200' : 'text-primary-light')
              : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
          }`}>
            {formatTimestamp(msg.timestamp)}
          </CardFooter>
        </Card>
      ))}
      <div ref={messageEndRef} />
    </div>
  )
}

export default MessagesList
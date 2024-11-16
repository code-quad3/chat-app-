import React from 'react'
import { MessageSquare, User, Bot } from 'lucide-react'

const BottomNavbar = ({ isDarkMode }) => {
  return (
    <nav className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t absolute bottom-0 left-0 right-0`}>
      <ul className="flex justify-around">
        <li className="flex-1">
          <a href="#" className={`flex flex-col items-center py-4 ${isDarkMode ? 'text-blue-400 hover:bg-gray-700' : 'text-primary hover:bg-gray-100'}`}>
            <MessageSquare className="h-6 w-6" />
            <span className="text-xs mt-1">Chats</span>
          </a>
        </li>
        <li className="flex-1">
          <a href="http://localhost:5173/ai-chat" className={`flex flex-col items-center py-4 ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Bot className="h-6 w-6" />
            <span className="text-xs mt-1">Ai chat</span>
          </a>
        </li>
        <li className="flex-1">
          <a href="http://localhost:5173/profile" className={`flex flex-col items-center py-4 ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Profile</span>
          </a>
        </li>
      </ul>
    </nav>
  )
}

export default BottomNavbar
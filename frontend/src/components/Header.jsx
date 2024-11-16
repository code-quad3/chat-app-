import React from 'react'
import { Sun, Moon } from 'lucide-react'

const Header = ({ isDarkMode, toggleDarkMode, title }) => {
  return (
    <header className={`${isDarkMode ? 'bg-gray-800' : 'bg-primary-dark'} text-white p-4 flex justify-between items-center`}>
      <h1 className="text-2xl font-bold">{title}</h1>
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
      </button>
    </header>
  )
}

export default Header
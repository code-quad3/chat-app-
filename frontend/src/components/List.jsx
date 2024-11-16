import React from 'react'
import { User, Users } from 'lucide-react'

const ListComponent = ({ items = [], isDarkMode, type = 'contact' }) => {
  const getIcon = () => {
    switch (type) {
      case 'group':
        return <Users className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />;
      case 'contact':
      default:
        return <User className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />;
    }
  }

  return (
    <main className="flex-1 overflow-y-auto">
      {items && items.length > 0 ? (
        <ul className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
          {items.map((item) => (
            <li key={item.id} className={`p-4 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} cursor-pointer`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-12 h-12 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded-full mr-4 flex items-center justify-center`}>
                    {getIcon()}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {type === 'group' ? `${item.membersCount} members` : item.lastMessage}
                    </p>
                  </div>
                </div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {type === 'group' ? item.lastActivity : item.time}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className={`p-4 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          No {type === 'group' ? 'groups' : 'contacts'} available.
        </p>
      )}
    </main>
  )
}

export default ListComponent
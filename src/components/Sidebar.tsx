import React from 'react';
import { useRouter } from 'next/router';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const router = useRouter();
  const { restaurantId } = router.query;

  console.log('Sidebar loaded. Current restaurantId:', restaurantId);

  return (
    <div className="relative">
      <div className={`${!isOpen ? 'minimized-sidebar' : ''} fixed top-0 left-0 h-full text-white transition-transform duration-300 transform`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex flex-col space-y-1">
            {isOpen ? (
              <>
                <div className="text-lg font-bold">Loading...</div>
                <div className="text-sm text-gray-400">Location</div>
              </>
            ) : (
              <i className="fas fa-utensils text-2xl"></i>
            )}
          </div>
        </div>
        <ul className="space-y-4 p-4">
          {/* Links are temporarily disabled */}
        </ul>
      </div>
      <div className={`fixed top-4 ${isOpen ? 'left-64' : 'left-16'} z-50 transition-all duration-300`}>
        <button
          onClick={toggleSidebar}
          className="text-white bg-gray-900 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
        >
          <i className={`fas ${isOpen ? 'fa-angle-double-left' : 'fa-angle-double-right'}`}></i>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

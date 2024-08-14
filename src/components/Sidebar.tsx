import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import styles from './Sidebar.module.css'; // Import the CSS module

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const router = useRouter();
  const { restaurantId } = router.query;
  const [restaurantName, setRestaurantName] = useState<string>('');
  const [restaurantLocation, setRestaurantLocation] = useState<string>('');

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      if (restaurantId) {
        const { data, error } = await supabase
          .from('restaurants')
          .select('name, address')
          .eq('id', restaurantId)
          .single();

        if (data) {
          setRestaurantName(data.name);
          setRestaurantLocation(data.address);
        } else {
          console.error('Error fetching restaurant details:', error.message);
        }
      }
    };

    fetchRestaurantDetails();
  }, [restaurantId]);

  return (
    <div className="relative">
      <div
        className={`${styles.sidebar} ${!isOpen ? styles.sidebarMinimized : ''} fixed top-0 left-0 h-full text-white transition-transform duration-300 transform`}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex flex-col space-y-1">
            {isOpen ? (
              <>
                <div className="text-lg font-bold">{restaurantName}</div>
                <div className="text-sm text-gray-400">{restaurantLocation}</div>
              </>
            ) : (
              <i className="fas fa-utensils text-2xl"></i> // Example icon, change as needed
            )}
          </div>
        </div>
        <ul className="space-y-4 p-4">
          <li>
            <Link href={`/restaurants/${restaurantId}/dashboard`} legacyBehavior>
              <a className="flex items-center p-2 hover:bg-gray-800 rounded-md">
                <i className="fas fa-tachometer-alt"></i>
                {isOpen && <span className="ml-4">Dashboard</span>}
              </a>
            </Link>
          </li>
          <li>
            <Link href={`/restaurants/${restaurantId}/reports`} legacyBehavior>
              <a className="flex items-center p-2 hover:bg-gray-800 rounded-md">
                <i className="fas fa-chart-line"></i>
                {isOpen && <span className="ml-4">Reports</span>}
              </a>
            </Link>
          </li>
          <li>
            <Link href={`/restaurants/${restaurantId}/recommendations`} legacyBehavior>
              <a className="flex items-center p-2 hover:bg-gray-800 rounded-md">
                <i className="fas fa-star"></i>
                {isOpen && <span className="ml-4">Recommendations</span>}
              </a>
            </Link>
          </li>
          <li>
            <Link href={`/restaurants/${restaurantId}/orders`} legacyBehavior>
              <a className="flex items-center p-2 hover:bg-gray-800 rounded-md">
                <i className="fas fa-receipt"></i>
                {isOpen && <span className="ml-4">Orders</span>}
              </a>
            </Link>
          </li>
          <li>
            <Link href={`/restaurants/${restaurantId}/menu-management`} legacyBehavior>
              <a className="flex items-center p-2 hover:bg-gray-800 rounded-md">
                <i className="fas fa-utensils"></i>
                {isOpen && <span className="ml-4">Menu Management</span>}
              </a>
            </Link>
          </li>
          <li>
            <Link href={`/restaurants/${restaurantId}/staff-management`} legacyBehavior>
              <a className="flex items-center p-2 hover:bg-gray-800 rounded-md">
                <i className="fas fa-users-cog"></i> {/* Added icon */}
                {isOpen && <span className="ml-4">Staff Management</span>}
              </a>
            </Link>
          </li>
          <li>
            <Link href={`/restaurants/${restaurantId}/feedbacks`} legacyBehavior>
              <a className="flex items-center p-2 hover:bg-gray-800 rounded-md">
                <i className="fas fa-comments"></i>
                {isOpen && <span className="ml-4">Feedbacks</span>}
              </a>
            </Link>
          </li>

          <li>
            <Link href={`/restaurants/${restaurantId}/contact-us`} legacyBehavior>
              <a className="flex items-center p-2 hover:bg-gray-800 rounded-md">
                <i className="fas fa-phone"></i>
                {isOpen && <span className="ml-4">Contact Us</span>}
              </a>
            </Link>
          </li>
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

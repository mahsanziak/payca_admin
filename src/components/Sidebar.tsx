import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";
import styles from "./Sidebar.module.css"; // Import the CSS module

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const router = useRouter();
  const { restaurantId } = router.query;

  const [restaurantName, setRestaurantName] = useState<string>("");
  const [restaurantLocation, setRestaurantLocation] = useState<string>("");
  const [pricingTier, setPricingTier] = useState<string>("");

  const lockedSections = [
    "reports",
    "recommendations",
    "inventory-dashboard",
    "staff-management",
  ];

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      if (restaurantId) {
        const { data, error } = await supabase
          .from("restaurants")
          .select("name, address, pricing_tier")
          .eq("id", restaurantId)
          .single();

        if (data) {
          setRestaurantName(data.name);
          setRestaurantLocation(data.address);
          setPricingTier(data.pricing_tier);
        } else if (error) {
          console.error("Error fetching restaurant details:", error.message);
        }
      }
    };

    fetchRestaurantDetails();
  }, [restaurantId]);

  const isLocked = (section: string) => pricingTier === "Basic" && lockedSections.includes(section);

  const handleLogout = async () => {
    // Perform logout logic (e.g., clear session, etc.)
    await supabase.auth.signOut(); // Assuming you're using Supabase for authentication
    router.push('/login'); // Redirect to the login page
  };

  return (
    <div className="relative">
      <div
        className={`${styles.sidebar} ${
          !isOpen ? styles.sidebarMinimized : ""
        } fixed top-0 left-0 h-full text-white transition-transform duration-300 transform`}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex flex-col space-y-1">
            {isOpen ? (
              <>
                <div className="text-lg font-bold">{restaurantName}</div>
                <div className="text-sm text-gray-400">{restaurantLocation}</div>
              </>
            ) : (
              <i className="fas fa-utensils text-2xl"></i>
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
          {[
            { label: "Reports", icon: "fa-chart-line", path: "reports" },
            { label: "Recommendations", icon: "fa-star", path: "recommendations" },
            { label: "Inventory Management", icon: "fa-warehouse", path: "inventory-dashboard" },
            { label: "Orders", icon: "fas fa-receipt", path: "orders" },
            { label: "Staff Management", icon: "fa-users-cog", path: "staff-management" },
            { label: "Menu Management", icon: "fa-utensils", path: "menu-management" },
            { label: "Feedbacks", icon: "fas fa-comments", path: "feedbacks" },
            { label: "Contact Us", icon: "fa-phone", path: "contact-us" },
          ].map((link) => (
            <li
              key={link.path}
              className={isLocked(link.path) ? styles.locked : ""}
            >
              <Link href={`/restaurants/${restaurantId}/${link.path}`} legacyBehavior>
                <a
                  className={`flex items-center p-2 hover:bg-gray-800 rounded-md ${
                    isLocked(link.path) ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  <i className={`fas ${link.icon}`}></i>
                  {isOpen && <span className="ml-4">{link.label}</span>}
                </a>
              </Link>
            </li>
          ))}
        </ul>
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="flex items-center p-2 hover:bg-gray-800 rounded-md text-red-500"
          >
            <i className="fas fa-sign-out-alt"></i>
            {isOpen && <span className="ml-4">Logout</span>}
          </button>
        </div>
      </div>
      <div
        className={`fixed top-4 ${
          isOpen ? "left-64" : "left-16"
        } z-50 transition-all duration-300`}
      >
        <button
          onClick={toggleSidebar}
          className="text-white bg-gray-900 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
        >
          <i
            className={`fas ${
              isOpen ? "fa-angle-double-left" : "fa-angle-double-right"
            }`}
          ></i>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

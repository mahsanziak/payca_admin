import React, { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import styles from "./MenuSelection.module.css";
import { useRouter } from "next/router";

interface MenuSelectionProps {
  menus: any[];
  selectedMenuId: string | null;
  setSelectedMenuId: (id: string) => void;
  refreshMenus: () => void;
}

const MenuSelection: React.FC<MenuSelectionProps> = ({
  menus,
  selectedMenuId,
  setSelectedMenuId,
  refreshMenus,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [newMenuName, setNewMenuName] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleMenuEnabled = async (menuId: string) => {
    try {
      const menu = menus.find((menu) => menu.id === menuId);
      if (!menu) return;

      // Disable all other menus for the restaurant
      await supabase
        .from("menus")
        .update({ enabled: false })
        .eq("restaurant_id", menu.restaurant_id);

      // Enable the selected menu
      await supabase.from("menus").update({ enabled: true }).eq("id", menuId);

      refreshMenus(); // Refresh the menus list
    } catch (error) {
      console.error("Error toggling menu enabled state:", error);
    }
  };

  const handleCreateMenu = async () => {
    if (!newMenuName) return; // Ensure the menu name is provided
    setLoading(true);
    try {
      const { restaurantId } = router.query; // Get restaurant_id from the URL
      if (!restaurantId || Array.isArray(restaurantId)) {
        console.error("Restaurant ID not found or invalid.");
        return;
      }
  
      const { error } = await supabase.from("menus").insert({
        name: newMenuName,
        restaurant_id: restaurantId, // Use restaurant_id from the URL
        enabled: false, // Default to disabled
      });
  
      if (error) {
        console.error("Error creating menu:", error);
      } else {
        refreshMenus(); // Refresh menus after adding a new one
        setShowModal(false); // Close modal
        setNewMenuName(""); // Clear input
      }
    } catch (error) {
      console.error("Error creating menu:", error);
    } finally {
      setLoading(false);
    }
  };
  const router = useRouter(); 

  return (
    <div className={styles.menuSelection}>
      {/* New Menu Button */}
      <div className={styles.createMenuContainer}>
        <button
          className={styles.createMenuButton}
          onClick={() => setShowModal(true)}
        >
          + Create New Menu
        </button>
      </div>

      {/* Modal for Creating New Menu */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Create New Menu</h3>
            <input
              type="text"
              placeholder="Menu Name"
              value={newMenuName}
              onChange={(e) => setNewMenuName(e.target.value)}
              className={styles.modalInput}
            />
            <div className={styles.modalActions}>
              <button
                className={styles.saveButton}
                onClick={handleCreateMenu}
                disabled={loading}
              >
                {loading ? "Creating..." : "Save"}
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 className={styles.title}>Select a Menu</h2>
      <ul className={styles.menuList}>
        {menus.map((menu) => (
          <li
            key={menu.id}
            className={`${styles.menuItem} ${
              selectedMenuId === menu.id ? styles.selected : ""
            }`}
          >
            <div className={styles.menuInfo}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={menu.enabled}
                  onChange={() => toggleMenuEnabled(menu.id)}
                  className={styles.checkbox}
                />
                {menu.name}
              </label>
            </div>
            <button
              onClick={() => setSelectedMenuId(menu.id)}
              className={styles.button}
            >
              {selectedMenuId === menu.id ? "Viewing" : "View Details"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuSelection;

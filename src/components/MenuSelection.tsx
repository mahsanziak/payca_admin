import React from "react";
import { supabase } from "../utils/supabaseClient";
import styles from "./MenuSelection.module.css";

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

  return (
    <div className={styles.menuSelection}>
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

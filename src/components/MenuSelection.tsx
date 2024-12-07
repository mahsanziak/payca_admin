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
      <h2>Select a Menu</h2>
      <select
        className={styles.dropdown}
        value={selectedMenuId || ""}
        onChange={(e) => setSelectedMenuId(e.target.value)}
      >
        <option value="" disabled>Select a menu</option>
        {menus.map((menu) => (
          <option key={menu.id} value={menu.id}>
            {menu.name}
          </option>
        ))}
      </select>
      <ul>
        {menus.map((menu) => (
          <li key={menu.id} style={{ marginBottom: "1rem" }}>
            <label>
              <input
                type="checkbox"
                checked={menu.enabled}
                onChange={() => toggleMenuEnabled(menu.id)}
              />
              {menu.name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuSelection;

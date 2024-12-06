import React from "react";
import { supabase } from "../utils/supabaseClient";

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
    <div>
      <h2>Select a Menu</h2>
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
            <button
              onClick={() => setSelectedMenuId(menu.id)}
              style={{
                marginLeft: "1rem",
                fontWeight: selectedMenuId === menu.id ? "bold" : "normal",
              }}
            >
              View Details
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuSelection;

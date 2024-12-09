import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient"; // Import your Supabase client
import styles from "./PreviewMenu.module.css";

interface PreviewMenuProps {
  restaurantId: string;
}

const PreviewMenu: React.FC<PreviewMenuProps> = ({ restaurantId }) => {
  const [menuUrl, setMenuUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuUrl = async () => {
      try {
        // Fetch any table for the given restaurantId
        const { data: tables, error } = await supabase
          .from("tables")
          .select("id")
          .eq("restaurant_id", restaurantId)
          .limit(1)
          .single();

        if (error || !tables?.id) {
          setMenuUrl(null); // Handle case where no table exists
        } else {
          const tableId = tables.id;
          const constructedUrl = `https://paycamenu.com/restaurants/${restaurantId}/tables/${tableId}`;
          setMenuUrl(constructedUrl);
        }
      } catch (error) {
        console.error("Unexpected error fetching table:", error);
        setMenuUrl(null); // Handle unexpected errors
      }
    };

    if (restaurantId) {
      fetchMenuUrl();
    }
  }, [restaurantId]);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Preview Live Menu</h3>
      {menuUrl ? (
        <div className={styles.previewBox}>
          <iframe
            src={menuUrl}
            className={styles.iframe}
            title="Menu Preview"
            sandbox="allow-same-origin allow-scripts allow-popups"
          />
        </div>
      ) : (
        <p className={styles.placeholder}>
          Create a Table in the Orders page to view your live menu
        </p>
      )}
    </div>
  );
};

export default PreviewMenu;

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
        const { data, error } = await supabase
          .from("restaurants")
          .select("url")
          .eq("id", restaurantId)
          .single();

        if (error) {
          console.error("Error fetching menu URL:", error.message);
        } else if (data?.url) {
          setMenuUrl(data.url);
        } else {
          setMenuUrl(null); // Handle case where URL is not set
        }
      } catch (error) {
        console.error("Unexpected error fetching menu URL:", error);
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
        <p className={styles.placeholder}>Menu preview not available</p>
      )}
    </div>
  );
};

export default PreviewMenu;

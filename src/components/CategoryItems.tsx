import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import styles from "./CategoryItems.module.css";

interface CategoryItemsProps {
  items: any[];
  editItem: (itemId: string, updatedItem: any) => void;
  deleteItem: (itemId: string) => void;
}

const CategoryItems: React.FC<CategoryItemsProps> = ({
  items,
  editItem,
  deleteItem,
}) => {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  return (
    <ul className={styles.itemsList}>
      {items.map((item) => (
        <li key={item.id} className={styles.item}>
          {editingItemId === item.id ? (
            <div className={styles.editItem}>
              <input
                type="text"
                value={editingItem.name}
                onChange={(e) =>
                  setEditingItem((prev: any) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className={styles.input}
              />
              <input
                type="text"
                value={editingItem.description}
                onChange={(e) =>
                  setEditingItem((prev: any) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className={styles.input}
              />
              <input
                type="number"
                value={editingItem.price}
                onChange={(e) =>
                  setEditingItem((prev: any) => ({
                    ...prev,
                    price: parseFloat(e.target.value),
                  }))
                }
                className={styles.input}
              />
              <IconButton
                onClick={() => {
                  editItem(item.id, editingItem);
                  setEditingItemId(null);
                }}
              >
                <SaveIcon />
              </IconButton>
              <IconButton onClick={() => setEditingItemId(null)}>
                <CancelIcon />
              </IconButton>
            </div>
          ) : (
            <div className={styles.itemDetails}>
              {item.name} - {item.description} - ${item.price.toFixed(2)}
              <IconButton
                onClick={() => {
                  setEditingItemId(item.id);
                  setEditingItem(item);
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => deleteItem(item.id)}>
                <DeleteIcon />
              </IconButton>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default CategoryItems;

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
  addItem: (newItem: any) => void; // Accept the addItem function from parent
  categoryId: string; // The category ID for associating the new item
}

const CategoryItems: React.FC<CategoryItemsProps> = ({
  items,
  editItem,
  deleteItem,
  addItem,
  categoryId,
}) => {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
  });

  const handleAddItem = () => {
    if (newItem.name.trim() && newItem.price) {
      addItem({ ...newItem, category_id: categoryId });
      setNewItem({ name: "", description: "", price: "" }); // Reset fields
    }
  };

  return (
    <div>
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
  <div className={styles.itemText}>
    {item.name} - {item.description} - ${item.price.toFixed(2)}
  </div>
  <div className={styles.iconContainer}>
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
</div>


            )}
          </li>
        ))}
      </ul>
      <div className={styles.addItem}>
        <h4>Add New Item</h4>
        <input
          type="text"
          placeholder="Item name"
          value={newItem.name}
          onChange={(e) => setNewItem((prev) => ({ ...prev, name: e.target.value }))}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Description"
          value={newItem.description}
          onChange={(e) => setNewItem((prev) => ({ ...prev, description: e.target.value }))}
          className={styles.input}
        />
        <input
          type="number"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem((prev) => ({ ...prev, price: e.target.value }))}
          className={styles.input}
        />
        <button className={styles.button} onClick={handleAddItem}>
          Add Item
        </button>
      </div>
    </div>
  );
};

export default CategoryItems;

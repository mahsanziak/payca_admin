import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import styles from "./CategoryList.module.css";
import CategoryItems from "./CategoryItems"; 

const CategoryList = ({
  menuCategories = [],
  menuItems = [],
  addCategory,
  deleteCategory,
  editCategory,
  addItem,
  editItem,
  deleteItem,
}: any) => {
  const [newCategory, setNewCategory] = useState<string>("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [editingCategoryName, setEditingCategoryName] = useState<string>("");
  const [newItem, setNewItem] = useState<any>({
    name: "",
    description: "",
    price: "",
    menu_category_id: "",
  });
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  return (
    <div className={styles.categoryList}>
      <h3>Menu Categories</h3>
      <ul>
        {menuCategories.map((category: any) => (
          <li key={category.id} className={styles.category}>
            {editingCategoryId === category.id ? (
              <div>
                <input
                  type="text"
                  className={styles.formElement}
                  value={editingCategoryName}
                  onChange={(e) => setEditingCategoryName(e.target.value)}
                />
                <IconButton
                  onClick={() => {
                    editCategory(category.id, editingCategoryName);
                    setEditingCategoryId(null);
                  }}
                >
                  <SaveIcon />
                </IconButton>
                <IconButton onClick={() => setEditingCategoryId(null)}>
                  <CancelIcon />
                </IconButton>
              </div>
            ) : (
              <div>
                {category.name}
                <IconButton
                  onClick={() => {
                    setEditingCategoryId(category.id);
                    setEditingCategoryName(category.name);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => deleteCategory(category.id)}>
                  <DeleteIcon />
                </IconButton>
              </div>
            )}

            <ul>
              {menuItems
                .filter((item: any) => item.menu_category_id === category.id)
                .map((item: any) => (
                  <li key={item.id} className={styles.menuItem}>
                    {editingItemId === item.id ? (
                      <div>
                        <input
                          type="text"
                          className={styles.formElement}
                          value={newItem.name}
                          onChange={(e) =>
                            setNewItem((prev: any) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                        />
                        <input
                          type="text"
                          className={styles.formElement}
                          value={newItem.description}
                          onChange={(e) =>
                            setNewItem((prev: any) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                        />
                        <input
                          type="number"
                          className={styles.formElement}
                          value={newItem.price}
                          onChange={(e) =>
                            setNewItem((prev: any) => ({
                              ...prev,
                              price: e.target.value,
                            }))
                          }
                        />
                        <IconButton
                          onClick={() => {
                            editItem(item.id, newItem);
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
                      <div>
                        {item.name} - {item.description} - ${item.price}
                        <IconButton
                          onClick={() => {
                            setEditingItemId(item.id);
                            setNewItem(item);
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
          </li>
        ))}
      </ul>

      
      <div>
        <input
          type="text"
          className={styles.formElement}
          placeholder="New category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button
          className={styles.button}
          onClick={() => addCategory(newCategory)}
        >
          Add Category
        </button>
      </div>
      <div>
        <h4>Add New Item</h4>
        <input
          type="text"
          className={styles.formElement}
          placeholder="Item name"
          value={newItem.name}
          onChange={(e) =>
            setNewItem((prev: any) => ({ ...prev, name: e.target.value }))
          }
        />
        <input
          type="text"
          className={styles.formElement}
          placeholder="Description"
          value={newItem.description}
          onChange={(e) =>
            setNewItem((prev: any) => ({
              ...prev,
              description: e.target.value,
            }))
          }
        />
        <input
          type="number"
          className={styles.formElement}
          placeholder="Price"
          value={newItem.price}
          onChange={(e) =>
            setNewItem((prev: any) => ({ ...prev, price: e.target.value }))
          }
        />
        <select
          className={styles.formElement}
          value={newItem.menu_category_id}
          onChange={(e) =>
            setNewItem((prev: any) => ({
              ...prev,
              menu_category_id: e.target.value,
            }))
          }
        >
          <option value="">Select Category</option>
          {menuCategories.map((category: any) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <button
          className={styles.button}
          onClick={() => {
            addItem(newItem);
            setNewItem({
              name: "",
              description: "",
              price: "",
              menu_category_id: "",
            });
          }}
        >
          Add Item
        </button>
      </div>
    </div>
  );
};

export default CategoryList;

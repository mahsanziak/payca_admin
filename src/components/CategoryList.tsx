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

  return (
    <div className={styles.categoryList}>
      <h3 className={styles.title}>Menu Categories</h3>
      <ul className={styles.categoryContainer}>
        {menuCategories.map((category: any) => (
          <li key={category.id} className={styles.category}>
            <div className={styles.categoryHeader}>
              {editingCategoryId === category.id ? (
                <>
                  <input
                    type="text"
                    className={styles.formElement}
                    value={editingCategoryName}
                    onChange={(e) => setEditingCategoryName(e.target.value)}
                  />
                  <div className={styles.iconContainer}>
                    <IconButton
                      onClick={() => {
                        editCategory(category.id, editingCategoryName);
                        setEditingCategoryId(null);
                      }}
                      className={styles.iconButton}
                    >
                      <SaveIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => setEditingCategoryId(null)}
                      className={styles.iconButton}
                    >
                      <CancelIcon />
                    </IconButton>
                  </div>
                </>
              ) : (
                <>
                  <span className={styles.categoryName}>{category.name}</span>
                  <div className={styles.iconContainer}>
                    <IconButton
                      onClick={() => {
                        setEditingCategoryId(category.id);
                        setEditingCategoryName(category.name);
                      }}
                      className={styles.iconButton}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => deleteCategory(category.id)}
                      className={styles.iconButton}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </>
              )}
            </div>

            <CategoryItems
              items={menuItems.filter(
                (item: any) => item.category_id === category.id
              )}
              editItem={editItem}
              deleteItem={deleteItem}
              addItem={(newItem) =>
                addItem({ ...newItem, category_id: category.id })
              } // Pass addItem here
            />
          </li>
        ))}
      </ul>

      <div className={styles.addSection}>
        <h4 className={styles.addTitle}>Add New Category</h4>
        <input
          type="text"
          className={styles.formElement}
          placeholder="Category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button
          className={styles.button}
          onClick={() => {
            addCategory(newCategory);
            setNewCategory("");
          }}
        >
          Add Category
        </button>
      </div>
    </div>
  );
};

export default CategoryList;

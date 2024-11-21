import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../utils/supabaseClient";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import styles from "../../../components/Menus.module.css";

const MenusPage = () => {
  const router = useRouter();
  const { restaurantId } = router.query;

  const [menus, setMenus] = useState<any[]>([]);
  const [menuCategories, setMenuCategories] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);

  const [selectedMenu, setSelectedMenu] = useState<any | null>(null);
  const [newMenu, setNewMenu] = useState({ name: "" });
  const [newCategory, setNewCategory] = useState({ name: "" });
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    image_url: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingType, setEditingType] = useState<"menu" | "category" | "item">(
    null
  );

  // Fetch menus
  useEffect(() => {
    if (restaurantId) {
      fetchMenus();
    }
  }, [restaurantId]);

  const fetchMenus = async () => {
    const { data, error } = await supabase
      .from("menus")
      .select("*")
      .eq("restaurant_id", restaurantId);

    if (error) console.error("Error fetching menus:", error.message);
    else setMenus(data);
  };

  const fetchCategories = async (menuId: string) => {
    const { data, error } = await supabase
      .from("menu_categories")
      .select("*")
      .eq("menu_id", menuId);

    if (error) console.error("Error fetching categories:", error.message);
    else setMenuCategories(data);
  };

  const fetchMenuItems = async (menuId: string) => {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("menu_id", menuId);

    if (error) console.error("Error fetching items:", error.message);
    else setMenuItems(data);
  };

  // Handle menu selection
  const handleMenuClick = (menu: any) => {
    setSelectedMenu(menu);
    fetchCategories(menu.id);
    fetchMenuItems(menu.id);
  };

  // Add a new menu
  const addNewMenu = async () => {
    const { data, error } = await supabase
      .from("menus")
      .insert([{ name: newMenu.name, restaurant_id: restaurantId }])
      .select()
      .single();

    if (error) console.error("Error creating menu:", error.message);
    else {
      setMenus([...menus, data]);
      setNewMenu({ name: "" });
    }
  };

  // Add a new category
  const addNewCategory = async () => {
    const { data, error } = await supabase
      .from("menu_categories")
      .insert([{ name: newCategory.name, menu_id: selectedMenu.id }])
      .select()
      .single();

    if (error) console.error("Error creating category:", error.message);
    else {
      setMenuCategories([...menuCategories, data]);
      setNewCategory({ name: "" });
    }
  };

  // Add a new item
  const addNewItem = async () => {
    const { data, error } = await supabase
      .from("menu_items")
      .insert([
        {
          ...newItem,
          menu_id: selectedMenu.id,
          price: parseFloat(newItem.price),
        },
      ])
      .select()
      .single();

    if (error) console.error("Error creating item:", error.message);
    else {
      setMenuItems([...menuItems, data]);
      setNewItem({
        name: "",
        description: "",
        price: "",
        category_id: "",
        image_url: "",
      });
    }
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
  
    reader.onload = () => {
      if (reader.result) {
        setNewItem((prev) => ({ ...prev, image_url: reader.result as string }));
      }
    };
  
    reader.onerror = (error) => {
      console.error("Error reading image file:", error);
    };
  
    reader.readAsDataURL(file);
  };
  
  





  const handleInputChange = (
    e,
    setState,
    key,
    isObject = true
  ) => {
    const { name, value } = e.target;
    if (isObject) {
      setState((prev) => ({ ...prev, [name]: value }));
    } else {
      setState(value);
    }
  };

  const deleteEntity = async (id, table, stateSetter, state) => {
    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) {
      console.error(`Error deleting ${table}:`, error.message);
    } else {
      const updatedState = state.filter((item) => item.id !== id);
      stateSetter(updatedState);
    }
  };

  const saveChanges = async (entity, table, stateSetter, state) => {
    const { error } = await supabase.from(table).update(entity).eq("id", entity.id);

    if (error) {
      console.error(`Error updating ${table}:`, error.message);
    } else {
      const updatedState = state.map((item) => (item.id === entity.id ? entity : item));
      stateSetter(updatedState);
      setEditingId(null);
      setEditingType(null);
    }
  };

  return (
    <div className={styles.inventoryManagement}>
      <h1 className={styles.settingsTitle}>Manage Menus</h1>

      {/* Menu Selection */}
      <div className={styles.itemForm}>
        <label htmlFor="menuSelect">Select a Menu:</label>
        <select
          id="menuSelect"
          className={styles.inputField}
          onChange={(e) => {
            const menu = menus.find((m) => m.id === e.target.value);
            handleMenuClick(menu);
          }}
        >
          <option value="">Select a Menu</option>
          {menus.map((menu) => (
            <option key={menu.id} value={menu.id}>
              {menu.name}
            </option>
          ))}
        </select>

        <div>
          <input
            type="text"
            name="name"
            placeholder="New Menu Name"
            value={newMenu.name}
            className={styles.inputField}
            onChange={(e) => handleInputChange(e, setNewMenu)}
          />
          <button className={styles.addButton} onClick={addNewMenu}>
            Add Menu
          </button>
        </div>
      </div>

      {selectedMenu && (
        <>
          {/* Categories */}
          <h2 className={styles.sectionTitle}>Categories</h2>
          <div>
            {menuCategories.map((category) => (
              <div key={category.id} className={styles.categoryItem}>
                {editingId === category.id && editingType === "category" ? (
                  <>
                    <input
                      type="text"
                      name="name"
                      value={category.name}
                      className={styles.inputField}
                      onChange={(e) =>
                        handleInputChange(e, (name) => {
                          const updatedCategory = { ...category, name };
                          saveChanges(updatedCategory, "menu_categories", setMenuCategories, menuCategories);
                        })
                      }
                    />
                    <IconButton
                      onClick={() =>
                        saveChanges(category, "menu_categories", setMenuCategories, menuCategories)
                      }
                    >
                      <SaveIcon />
                    </IconButton>
                    <IconButton onClick={() => setEditingId(null)}>
                      <CancelIcon />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <span>{category.name}</span>
                    <IconButton
                      onClick={() => {
                        setEditingId(category.id);
                        setEditingType("category");
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        deleteEntity(category.id, "menu_categories", setMenuCategories, menuCategories)
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </div>
            ))}

            <div>
              <input
                type="text"
                name="name"
                placeholder="New Category Name"
                value={newCategory.name}
                className={styles.inputField}
                onChange={(e) => handleInputChange(e, setNewCategory)}
              />
              <button className={styles.addButton} onClick={addNewCategory}>
                Add Category
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <h2 className={styles.sectionTitle}>Menu Items</h2>
          {menuItems.map((item) => (
            <div key={item.id} className={styles.menuItem}>
              {editingId === item.id && editingType === "item" ? (
                <>
                  <input
                    type="text"
                    name="name"
                    value={item.name}
                    className={styles.inputField}
                    onChange={(e) =>
                      handleInputChange(e, (name) => {
                        const updatedItem = { ...item, name };
                        saveChanges(updatedItem, "menu_items", setMenuItems, menuItems);
                      })
                    }
                  />
                  <IconButton onClick={() => saveChanges(item, "menu_items", setMenuItems, menuItems)}>
                    <SaveIcon />
                  </IconButton>
                  <IconButton onClick={() => setEditingId(null)}>
                    <CancelIcon />
                  </IconButton>
                </>
              ) : (
                <>
                  <span>{item.name}</span>
                  <IconButton
                    onClick={() => {
                      setEditingId(item.id);
                      setEditingType("item");
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => deleteEntity(item.id, "menu_items", setMenuItems, menuItems)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              )}
            </div>
          ))}

<div>
  <h2 className={styles.sectionTitle}>Add New Menu Item</h2>
  <div>
  <input
    type="text"
    name="name"
    placeholder="New Item Name"
    value={newItem.name}
    className={styles.inputField}
    onChange={(e) => handleInputChange(e, setNewItem)}
  />
  <textarea
    name="description"
    placeholder="Item Description"
    value={newItem.description}
    className={styles.inputField}
    onChange={(e) => handleInputChange(e, setNewItem)}
  ></textarea>
  <input
    type="number"
    name="price"
    placeholder="Item Price"
    value={newItem.price}
    className={styles.inputField}
    onChange={(e) => handleInputChange(e, setNewItem)}
  />
  <select
    name="category_id"
    value={newItem.category_id}
    className={styles.inputField}
    onChange={(e) => handleInputChange(e, setNewItem)}
  >
    <option value="">Select Category</option>
    {menuCategories.map((category) => (
      <option key={category.id} value={category.id}>
        {category.name}
      </option>
    ))}
  </select>
  <input
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    className={styles.inputField}
  />
  <button className={styles.addButton} onClick={addNewItem}>
    Add Item
  </button>
</div>

  {newItem.image_url && (
    <div>
      <h3 className={styles.previewTitle}>Image Preview</h3>
      <img
        src={newItem.image_url}
        alt="Preview"
        className={styles.imagePreview}
      />
    </div>
  )}
</div>

        </>
      )}
    </div>
  );
};

export default MenusPage;

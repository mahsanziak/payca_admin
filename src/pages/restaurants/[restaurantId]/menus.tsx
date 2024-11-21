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

  // New state for success message
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
    if (!newItem.name || !newItem.description || !newItem.price || !newItem.category_id) {
      alert("Please fill in all fields.");
      return;
    }

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

    if (error) {
      console.error("Error creating item:", error.message);
    } else {
      setMenuItems([...menuItems, data]);
      setNewItem({
        name: "",
        description: "",
        price: "",
        category_id: "",
        image_url: "",
      });
      // Set success message
      setSuccessMessage("Item added successfully!");
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    stateSetter: React.Dispatch<React.SetStateAction<any>>,
  ) => {
    const { name, value } = e.target;
    stateSetter((prev) => ({ ...prev, [name]: value }));
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
    }
  };

  return (
    <div className={styles.inventoryManagement}>
      <h1 className={styles.settingsTitle}>Manage Menus</h1>

      {/* Display success message */}
      {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

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
                    <div className={styles.buttonGroup}>
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
                    </div>
                  </>
                ) : (
                  <>
                    <span>{category.name}</span>
                    <div className={styles.buttonGroup}>
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
                    </div>
                  </>
                )}
                {/* Display Menu Items under the Category */}
                {menuItems.filter(item => item.category_id === category.id).map(item => (
                  <div key={item.id} className={styles.menuItem}>
                    <img src={item.image_url} alt={item.name} className={styles.imagePreview} />
                    {editingId === item.id ? (
                      <>
                        <input
                          type="text"
                          name="name"
                          value={item.name}
                          className={styles.inputField}
                          onChange={(e) => handleInputChange(e, setMenuItems, item.id, false)}
                        />
                        <textarea
                          name="description"
                          value={item.description}
                          className={styles.inputField}
                          onChange={(e) => handleInputChange(e, setMenuItems, item.id, false)}
                        />
                        <input
                          type="number"
                          name="price"
                          value={item.price}
                          className={styles.inputField}
                          onChange={(e) => handleInputChange(e, setMenuItems, item.id, false)}
                        />
                        <div className={styles.buttonGroup}>
                          <IconButton
                            onClick={() => {
                              saveChanges(item, "menu_items", setMenuItems, menuItems);
                              setEditingId(null); // Reset editing state
                            }}
                          >
                            <SaveIcon />
                          </IconButton>
                          <IconButton onClick={() => setEditingId(null)}>
                            <CancelIcon />
                          </IconButton>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className={styles.itemName}>{item.name}</span>
                        <span className={styles.itemDescription}>{item.description}</span>
                        <span className={styles.itemPrice}>${item.price.toFixed(2)}</span>
                        <div className={styles.buttonGroup}>
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
                        </div>
                      </>
                    )}
                  </div>
                ))}
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

          {/* Add New Menu Item Section */}
          <div>
            <h2 className={styles.sectionTitle}>Add New Menu Item</h2>
            <div className={styles.addItemContainer}>
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
                rows={1}
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


import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../../utils/supabaseClient';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styles from '../../../components/Menus.module.css'; // Adjust the import path if needed

const MenusPage = () => {
  const router = useRouter();
  const { restaurantId } = router.query;

  const [menus, setMenus] = useState<any[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<any | null>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', category_id: '', image_url: '' });
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchMenus = async () => {
      if (restaurantId) {
        const { data, error } = await supabase
          .from('menus')
          .select('*')
          .eq('restaurant_id', restaurantId);

        if (error) {
          console.error('Error fetching menus:', error.message);
        } else {
          setMenus(data);
        }
      }
    };

    fetchMenus();
  }, [restaurantId]);

  const fetchMenuItems = async (menuId: string) => {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('menu_id', menuId);

    if (error) {
      console.error('Error fetching menu items:', error.message);
    } else {
      setMenuItems(data || []);
    }
  };

  const fetchCategories = async (menuId: string) => {
    const { data, error } = await supabase
      .from('menu_categories')
      .select('*')
      .eq('menu_id', menuId);

    if (error) {
      console.error('Error fetching categories:', error.message);
    } else {
      setCategories(data || []);
    }
  };

  const handleMenuClick = (menu: any) => {
    setSelectedMenu(menu);
    fetchMenuItems(menu.id);
    fetchCategories(menu.id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, itemId: string | null = null) => {
    const { name, value } = e.target;
    if (itemId) {
      setMenuItems(menuItems.map(item => (item.id === itemId ? { ...item, [name]: value } : item)));
    } else {
      setNewItem({ ...newItem, [name]: value });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, itemId: string | null = null) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (itemId) {
          setMenuItems(menuItems.map(item => 
            item.id === itemId ? { ...item, image_url: reader.result } : item
          ));
        } else {
          setNewItem({ ...newItem, image_url: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const saveChanges = async (itemId: string) => {
    const itemToUpdate = menuItems.find(item => item.id === itemId);
    const { error } = await supabase
      .from('menu_items')
      .update(itemToUpdate)
      .eq('id', itemId);

    if (error) {
      console.error('Error updating menu item:', error.message);
    } else {
      setEditingItemId(null);
    }
  };

  const addItem = async () => {
    const { name, description, price, category_id, image_url } = newItem;
    if (name && description && price && category_id) {
      const { data, error } = await supabase
        .from('menu_items')
        .insert([{ name, description, price: parseFloat(price), category_id, image_url, menu_id: selectedMenu.id }])
        .single();

      if (error) {
        console.error('Error adding menu item:', error.message);
      } else {
        setMenuItems([...menuItems, data]);
        setNewItem({ name: '', description: '', price: '', category_id: '', image_url: '' });
      }
    } else {
      alert('Please fill out all fields');
    }
  };

  const startEditingItem = (itemId: string) => {
    setEditingItemId(itemId);
  };

  const cancelEditing = () => {
    setEditingItemId(null);
  };

  const deleteMenuItem = async (itemId: string) => {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', itemId);

    if (error) {
      console.error('Error deleting menu item:', error.message);
    } else {
      setMenuItems(menuItems.filter(item => item.id !== itemId));
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    const movedItem = menuItems.find(item => item.id === draggableId);
    if (movedItem && destination.droppableId) {
      const updatedItem = { ...movedItem, category_id: destination.droppableId };

      // Update in state
      const updatedMenuItems = menuItems.map(item => 
        item.id === draggableId ? updatedItem : item
      );

      setMenuItems(updatedMenuItems);

      // Update in database
      const { error } = await supabase
        .from('menu_items')
        .update({ category_id: destination.droppableId })
        .eq('id', draggableId);

      if (error) {
        console.error('Error updating menu item category:', error.message);
      }
    }
  };

  return (
    <div className={styles.inventoryManagement}>
      <h1 className={styles.settingsTitle}>My Menus</h1>
      <div className={styles.itemForm}>
        <select
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
      </div>

      {selectedMenu && (
        <>
          <div className={styles.addItemForm}>
            <h2 className={styles.addItemTitle}>Add New Menu Item</h2>
            <div className={styles.formRow}>
              <input
                type="text"
                name="name"
                placeholder="Item Name"
                className={styles.inputField}
                value={newItem.name}
                onChange={(e) => handleInputChange(e)}
              />
              <textarea
                name="description"
                placeholder="Description"
                className={styles.inputField}
                value={newItem.description}
                onChange={(e) => handleInputChange(e)}
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                className={styles.inputField}
                value={newItem.price}
                onChange={(e) => handleInputChange(e)}
              />
              <select
                name="category_id"
                className={styles.inputField}
                value={newItem.category_id}
                onChange={(e) => handleInputChange(e)}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e)}
              />
              <button onClick={addItem} className={styles.addButton}>
                Add Item
              </button>
            </div>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              {categories.map((category) => (
                <Droppable droppableId={category.id} key={category.id}>
                  {(provided) => (
                    <tbody
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      <tr>
                        <td colSpan={5} className={styles.categoryRow}>
                          {category.name}
                        </td>
                      </tr>
                      {menuItems
                        .filter(item => item && item.category_id === category.id)
                        .map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided) => (
                              <tr
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <td>
                                  {editingItemId === item.id ? (
                                    <input
                                      type="text"
                                      name="name"
                                      className={styles.inputField}
                                      value={item.name}
                                      onChange={(e) => handleInputChange(e, item.id)}
                                    />
                                  ) : (
                                    item.name
                                  )}
                                </td>
                                <td>
                                  {editingItemId === item.id ? (
                                    <textarea
                                      name="description"
                                      className={styles.inputField}
                                      value={item.description}
                                      onChange={(e) => handleInputChange(e, item.id)}
                                    />
                                  ) : (
                                    item.description
                                  )}
                                </td>
                                <td>
                                  {editingItemId === item.id ? (
                                    <input
                                      type="number"
                                      name="price"
                                      className={styles.inputField}
                                      value={item.price}
                                      onChange={(e) => handleInputChange(e, item.id)}
                                    />
                                  ) : (
                                    `$${item.price.toFixed(2)}`
                                  )}
                                </td>
                                <td>
                                  {editingItemId === item.id ? (
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleImageChange(e, item.id)}
                                    />
                                  ) : (
                                    item.image_url ? (
                                      <img src={item.image_url} alt={item.name} className={styles.imagePreview} />
                                    ) : (
                                      'No image'
                                    )
                                  )}
                                </td>
                                <td>
                                  {editingItemId === item.id ? (
                                    <>
                                      <IconButton onClick={() => saveChanges(item.id)}>
                                        <SaveIcon style={{ fontSize: '1.5rem', color: 'green' }} />
                                      </IconButton>
                                      <IconButton onClick={cancelEditing}>
                                        <CancelIcon style={{ fontSize: '1.5rem', color: 'red' }} />
                                      </IconButton>
                                    </>
                                  ) : (
                                    <>
                                      <IconButton onClick={() => startEditingItem(item.id)}>
                                        <EditIcon style={{ fontSize: '1.5rem', color: 'orange' }} />
                                      </IconButton>
                                      <IconButton onClick={() => deleteMenuItem(item.id)}>
                                        <DeleteIcon style={{ fontSize: '1.5rem', color: 'red' }} />
                                      </IconButton>
                                    </>
                                  )}
                                </td>
                              </tr>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </tbody>
                  )}
                </Droppable>
              ))}
            </table>
          </DragDropContext>
        </>
      )}
    </div>
  );
};

export default MenusPage;

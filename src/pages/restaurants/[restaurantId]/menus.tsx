import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../../utils/supabaseClient';
import { FaTrash, FaEdit } from 'react-icons/fa';

const MenusPage = () => {
  const router = useRouter();
  const { restaurantId } = router.query;

  const [menus, setMenus] = useState<any[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<any | null>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [editingMenu, setEditingMenu] = useState<any | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [newMenu, setNewMenu] = useState({ name: '', description: '', image_url: '' });
  const [newMenuItem, setNewMenuItem] = useState({ name: '', description: '', price: 0, image_url: '', category_id: '' });
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

    const fetchCategories = async () => {
      if (restaurantId) {
        const { data, error } = await supabase
          .from('menu_categories')
          .select('*')
          .eq('menu_id', restaurantId);

        if (error) {
          console.error('Error fetching categories:', error.message);
        } else {
          setCategories(data);
        }
      }
    };

    fetchMenus();
    fetchCategories();
  }, [restaurantId]);

  const fetchMenuItems = async (menuId: string) => {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('menu_id', menuId);

    if (error) {
      console.error('Error fetching menu items:', error.message);
    } else {
      setMenuItems(data);
    }
  };

  const handleMenuClick = (menu: any) => {
    setSelectedMenu(menu);
    fetchMenuItems(menu.id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, setState: any) => {
    const { name, value } = e.target;
    setState((prevState: any) => ({ ...prevState, [name]: value }));
  };

  const addMenu = async () => {
    const { data, error } = await supabase
      .from('menus')
      .insert({ ...newMenu, restaurant_id: restaurantId })
      .single();

    if (error) {
      console.error('Error adding menu:', error.message);
    } else {
      setMenus([...menus, data]);
      setNewMenu({ name: '', description: '', image_url: '' });
    }
  };

  const addMenuItem = async () => {
    const { data, error } = await supabase
      .from('menu_items')
      .insert({ ...newMenuItem, menu_id: selectedMenu.id })
      .single();

    if (error) {
      console.error('Error adding menu item:', error.message);
    } else {
      setMenuItems([...menuItems, data]);
      setNewMenuItem({ name: '', description: '', price: 0, image_url: '', category_id: '' });
    }
  };

  const deleteMenu = async (menuId: string) => {
    const { error } = await supabase
      .from('menus')
      .delete()
      .eq('id', menuId);

    if (error) {
      console.error('Error deleting menu:', error.message);
    } else {
      setMenus(menus.filter(menu => menu.id !== menuId));
      setSelectedMenu(null);
      setMenuItems([]);
    }
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

  const updateMenu = async () => {
    const { error } = await supabase
      .from('menus')
      .update(editingMenu)
      .eq('id', editingMenu.id);

    if (error) {
      console.error('Error updating menu:', error.message);
    } else {
      setMenus(menus.map(menu => (menu.id === editingMenu.id ? editingMenu : menu)));
      setEditingMenu(null);
    }
  };

  const updateMenuItem = async () => {
    const { error } = await supabase
      .from('menu_items')
      .update(editingItem)
      .eq('id', editingItem.id);

    if (error) {
      console.error('Error updating menu item:', error.message);
    } else {
      setMenuItems(menuItems.map(item => (item.id === editingItem.id ? editingItem : item)));
      setEditingItem(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Menus</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Add New Menu</h3>
          <input
            type="text"
            name="name"
            value={newMenu.name}
            onChange={(e) => handleInputChange(e, setNewMenu)}
            placeholder="Menu Name"
            className="w-full p-2 mb-2 border rounded"
          />
          <textarea
            name="description"
            value={newMenu.description}
            onChange={(e) => handleInputChange(e, setNewMenu)}
            placeholder="Menu Description"
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="text"
            name="image_url"
            value={newMenu.image_url}
            onChange={(e) => handleInputChange(e, setNewMenu)}
            placeholder="Image URL"
            className="w-full p-2 mb-2 border rounded"
          />
          <button onClick={addMenu} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
            Add Menu
          </button>
        </div>
        {selectedMenu && (
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-2">{selectedMenu.name}</h3>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <p>{item.description}</p>
                    <p>Price: ${item.price}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => deleteMenuItem(item.id)} className="text-red-500 hover:text-red-700">
                      <FaTrash />
                    </button>
                    <button onClick={() => setEditingItem(item)} className="text-blue-500 hover:text-blue-700">
                      <FaEdit />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {editingMenu && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h4 className="text-lg font-semibold">Edit Menu</h4>
            <input
              type="text"
              name="name"
              value={editingMenu.name}
              onChange={(e) => handleInputChange(e, setEditingMenu)}
              className="w-full p-2 mb-2 border rounded"
            />
            <textarea
              name="description"
              value={editingMenu.description}
              onChange={(e) => handleInputChange(e, setEditingMenu)}
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="text"
              name="image_url"
              value={editingMenu.image_url}
              onChange={(e) => handleInputChange(e, setEditingMenu)}
              className="w-full p-2 mb-2 border rounded"
            />
            <div className="flex justify-end">
              <button onClick={updateMenu} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 mr-2">
                Update Menu
              </button>
              <button onClick={() => setEditingMenu(null)} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-700">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {editingItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h4 className="text-lg font-semibold">Edit Item</h4>
            <input
              type="text"
              name="name"
              value={editingItem.name}
              onChange={(e) => handleInputChange(e, setEditingItem)}
              className="w-full p-2 mb-2 border rounded"
            />
            <textarea
              name="description"
              value={editingItem.description}
              onChange={(e) => handleInputChange(e, setEditingItem)}
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="number"
              name="price"
              value={editingItem.price}
              onChange={(e) => handleInputChange(e, setEditingItem)}
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="text"
              name="image_url"
              value={editingItem.image_url}
              onChange={(e) => handleInputChange(e, setEditingItem)}
              className="w-full p-2 mb-2 border rounded"
            />
            <div className="flex justify-end">
              <button onClick={updateMenuItem} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 mr-2">
                Update Item
              </button>
              <button onClick={() => setEditingItem(null)} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-700">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white p-4 rounded shadow mt-4">
        <h3 className="text-xl font-semibold mb-2">Add New Item</h3>
        <input
          type="text"
          name="name"
          value={newMenuItem.name}
          onChange={(e) => handleInputChange(e, setNewMenuItem)}
          placeholder="Item Name"
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          name="description"
          value={newMenuItem.description}
          onChange={(e) => handleInputChange(e, setNewMenuItem)}
          placeholder="Item Description"
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="number"
          name="price"
          value={newMenuItem.price}
          onChange={(e) => handleInputChange(e, setNewMenuItem)}
          placeholder="Price"
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="text"
          name="image_url"
          value={newMenuItem.image_url}
          onChange={(e) => handleInputChange(e, setNewMenuItem)}
          placeholder="Image URL"
          className="w-full p-2 mb-2 border rounded"
        />
        <select
          name="category_id"
          value={newMenuItem.category_id}
          onChange={(e) => handleInputChange(e, setNewMenuItem)}
          className="w-full p-2 mb-2 border rounded"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <button onClick={addMenuItem} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
          Add Item
        </button>
      </div>
    </div>
  );
};

export default MenusPage;

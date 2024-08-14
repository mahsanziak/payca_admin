import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../../utils/supabaseClient';
import { FaTrash, FaEdit } from 'react-icons/fa';
import QRCode from 'qrcode.react';

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
  const [qrColor, setQrColor] = useState('#000000');
  const [qrValue, setQrValue] = useState('');

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
      setMenuItems(data);
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
      setCategories(data);
    }
  };

  const handleMenuClick = (menu: any) => {
    setSelectedMenu(menu);
    fetchMenuItems(menu.id);
    fetchCategories(menu.id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, setState: any) => {
    const { name, value } = e.target;
    setState((prevState: any) => ({ ...prevState, [name]: value }));
  };

  const addMenuItem = async () => {
    if (editingItem) {
      await updateMenuItem(); // Call the update function if editing an item
    } else {
      const { data, error } = await supabase
        .from('menu_items')
        .insert({ ...newMenuItem, menu_id: selectedMenu.id, hide: 'No' }) // Set hide to "No" by default
        .single();

      if (error) {
        console.error('Error adding menu item:', error.message);
      } else {
        setMenuItems([...menuItems, data]);
        setNewMenuItem({ name: '', description: '', price: 0, image_url: '', category_id: '' });
      }
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

  const updateMenuItem = async () => {
    if (editingItem) {
      const { error } = await supabase
        .from('menu_items')
        .update(editingItem)
        .eq('id', editingItem.id);

      if (error) {
        console.error('Error updating menu item:', error.message);
      } else {
        setMenuItems(menuItems.map(item => (item.id === editingItem.id ? editingItem : item)));
        setEditingItem(null);
        setNewMenuItem({ name: '', description: '', price: 0, image_url: '', category_id: '' });
      }
    }
  };

  const startEditingItem = (item: any) => {
    setEditingItem(item);
    setNewMenuItem({
      name: item.name,
      description: item.description,
      price: item.price,
      image_url: item.image_url,
      category_id: item.category_id,
      hide: item.hide
    });
  };

  const toggleHideStatus = async (item: any) => {
    const updatedHideStatus = item.hide === 'Yes' ? 'No' : 'Yes';
    const updatedItem = { ...item, hide: updatedHideStatus };
    
    const { error } = await supabase
      .from('menu_items')
      .update({ hide: updatedHideStatus })
      .eq('id', updatedItem.id);

    if (error) {
      console.error('Error updating hide status:', error.message);
    } else {
      setMenuItems(menuItems.map(i => (i.id === updatedItem.id ? updatedItem : i)));
    }
  };

  const generateNewQrCode = () => {
    const randomString = Math.random().toString(36).substring(2, 10);
    setQrValue(`https://playlystify.com?code=${randomString}`);
  };

  const handleQrColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQrColor(e.target.value);
  };

  const printQRCode = () => {
    generateNewQrCode(); // Ensure a new QR code is generated each time

    const qrCodeElement = document.getElementById('qrcode')?.firstChild as HTMLCanvasElement;
    if (qrCodeElement) {
      const qrCodeImage = qrCodeElement.toDataURL('image/png');
      const qrText = "<p style='font-size: 20px; text-align: center; margin-top: 20px;'>Scan Here! 😊</p>";
      const printWindow = window.open('', '_blank');

      if (printWindow && qrCodeImage) {
        printWindow.document.write('<html><head><title>Print QR Code</title></head><body>');
        printWindow.document.write('<div style="text-align:center; padding: 50px;">');
        printWindow.document.write('<img src="' + qrCodeImage + '" style="transform: scale(2); transform-origin: top center;">');
        printWindow.document.write(qrText);
        printWindow.document.write('</div>');
        printWindow.document.close();

        printWindow.onload = function () {
          setTimeout(function () {
            printWindow.print();
            printWindow.close();
          }, 500);
        };
      }
    }
  };

  useEffect(() => {
    generateNewQrCode();
  }, [selectedMenu]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center mb-8">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-2xl font-semibold text-center mb-6">My Menus</h2>
          <select
            className="w-full mb-4 p-2 border rounded"
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
          {selectedMenu && (
            <>
              <input
                type="text"
                placeholder="Item Name"
                className="w-full mb-4 p-2 border rounded"
                name="name"
                value={newMenuItem.name}
                onChange={(e) => handleInputChange(e, setNewMenuItem)}
              />
              <input
                type="number"
                placeholder="Price"
                className="w-full mb-4 p-2 border rounded"
                name="price"
                value={newMenuItem.price}
                onChange={(e) => handleInputChange(e, setNewMenuItem)}
              />
              <textarea
                placeholder="Description"
                className="w-full mb-4 p-2 border rounded"
                name="description"
                value={newMenuItem.description}
                onChange={(e) => handleInputChange(e, setNewMenuItem)}
              />
              <select
                className="w-full mb-4 p-2 border rounded"
                name="category_id"
                value={newMenuItem.category_id}
                onChange={(e) => handleInputChange(e, setNewMenuItem)}
              >
                <option value="">Select a Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <button
                className="bg-blue-500 text-white p-2 w-full rounded"
                onClick={addMenuItem}
              >
                {editingItem ? 'Update Item' : 'Add Item'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Display the list of menu items grouped by category */}
      {categories.length > 0 && (
        <div className="flex justify-center mb-8">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
            {categories.map((category) => (
              <div key={category.id}>
                <h2 className="text-xl font-semibold mb-4">{category.name}</h2>
                <ul>
                  {menuItems
                    .filter((item) => item.category_id === category.id)
                    .map((item) => (
                      <li key={item.id} className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{item.name}</h3>
                          <p className="text-gray-600">${item.price.toFixed(2)}</p>
                          <p className="text-gray-600">{item.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FaEdit
                            className="text-blue-500 cursor-pointer"
                            onClick={() => startEditingItem(item)}
                          />
                          <FaTrash
                            className="text-red-500 cursor-pointer"
                            onClick={() => deleteMenuItem(item.id)}
                          />
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={item.hide === 'Yes'}
                              onChange={() => toggleHideStatus(item)}
                            />
                            <span className="ml-2">Hide</span>
                          </label>
                        </div>
                      </li>
                    ))}
                </ul>
                <hr className="my-6" /> {/* Horizontal line after each category */}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-2xl font-semibold text-center mb-6">QR Code</h2>
          <div className="flex justify-center mb-4" id="qrcode">
            <QRCode value={`https://playlystify.com?code=${qrValue}`} fgColor={qrColor} />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-center font-semibold">
              Select QR Code Color:
            </label>
            <input
              type="color"
              value={qrColor}
              onChange={handleQrColorChange}
              className="w-full p-2"
            />
          </div>
          <button
            onClick={printQRCode}
            className="bg-blue-500 text-white p-2 w-full rounded"
          >
            Print QR Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenusPage;

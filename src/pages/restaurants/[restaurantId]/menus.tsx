import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../../utils/supabaseClient';
import { FaTrash, FaEdit } from 'react-icons/fa';
import QRCode from 'qrcode.react'; // Import the QRCode component

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
  const [qrColor, setQrColor] = useState('#000000'); // State for QR code color
  const [qrValue, setQrValue] = useState(''); // State for QR code value

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

  const generateRandomString = () => {
    return Math.random().toString(36).substring(2, 10);
  };

  const handleQrColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQrColor(e.target.value);
  };

  const generateNewQrCode = () => {
    const randomString = generateRandomString();
    setQrValue(`https://playlystify.com?code=${randomString}`);
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
    generateNewQrCode(); // Generate an initial QR code when the component mounts
  }, [selectedMenu]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center mb-8">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-2xl font-semibold text-center mb-6">My Menus</h2>
          <select className="w-full mb-4 p-2 border rounded">
            <option>Breakfast Menu</option>
            {/* Add more options here */}
          </select>
          <input
            type="text"
            placeholder="Item Name"
            className="w-full mb-4 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Price"
            className="w-full mb-4 p-2 border rounded"
          />
          <textarea
            placeholder="Description"
            className="w-full mb-4 p-2 border rounded"
          />
          <button className="bg-blue-500 text-white p-2 w-full rounded">Add Item</button>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-2xl font-semibold text-center mb-6">QR Code</h2>
          <div className="flex justify-center mb-4">
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

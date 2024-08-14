import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../../utils/supabaseClient';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import QRCode from 'qrcode.react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styles from '../../../components/Menus.module.css'; // Adjust the import path if needed

const MenusPage = () => {
  const router = useRouter();
  const { restaurantId } = router.query;

  const [menus, setMenus] = useState<any[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<any | null>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
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
    generateNewQrCode(); // Generate new QR code when menu is selected
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, itemId: string) => {
    const { name, value } = e.target;
    setMenuItems(menuItems.map(item => (item.id === itemId ? { ...item, [name]: value } : item)));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMenuItems(menuItems.map(item => 
          item.id === itemId ? { ...item, image_url: reader.result } : item
        ));
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
    if (selectedMenu) {
      generateNewQrCode(); // Generate new QR code when menu is selected
    }
  }, [selectedMenu]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    const movedItem = menuItems.find(item => item.id === draggableId);
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
                        .filter(item => item.category_id === category.id)
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

          <div className={styles.qrCodeContainer}>
            <h2 className={styles.qrCodeTitle}>QR Code</h2>
            <div className={styles.qrCode} id="qrcode">
              <QRCode value={`https://playlystify.com?code=${qrValue}`} fgColor={qrColor} />
            </div>
            <input
              type="color"
              value={qrColor}
              onChange={handleQrColorChange}
              className={styles.colorPicker}
            />
            <button
              onClick={printQRCode}
              className={styles.printButton}
            >
              Print QR Code
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MenusPage;

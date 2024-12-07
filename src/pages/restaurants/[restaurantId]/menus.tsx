import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MenuSelection from "../../../components/MenuSelection";
import CategoryList from "../../../components/CategoryList";
import { supabase } from "../../../utils/supabaseClient";
import styles from "../../../components/MenusPage.module.css";

const MenusPage = () => {
  const router = useRouter();
  const { restaurantId } = router.query;

  const [menus, setMenus] = useState<any[]>([]);
  const [menuCategories, setMenuCategories] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]); // Explicitly fetch and store menu items
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (restaurantId) fetchMenus();
  }, [restaurantId]);

  useEffect(() => {
    if (selectedMenuId) {
      fetchCategories(selectedMenuId);
      fetchMenuItems(selectedMenuId); // Fetch menu items for the selected menu
    }
  }, [selectedMenuId]);

  const fetchMenus = async () => {
    try {
      const { data } = await supabase
        .from("menus")
        .select("*")
        .eq("restaurant_id", restaurantId);
      setMenus(data || []);
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  };

  const fetchCategories = async (menuId: string) => {
    try {
      const { data } = await supabase
        .from("menu_categories")
        .select("*")
        .eq("menu_id", menuId);
      setMenuCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchMenuItems = async (menuId: string) => {
    try {
      const { data } = await supabase
        .from("menu_items")
        .select("*")
        .eq("menu_id", menuId);
      setMenuItems(data || []);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  const addItem = async (item: any) => {
    try {
      const { data, error } = await supabase
        .from("menu_items")
        .insert([
          {
            ...item,
            menu_id: selectedMenuId,
            price: parseFloat(item.price),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error adding item:", error.message);
      } else {
        setMenuItems((prevItems) => [...prevItems, data]);
      }
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const addCategory = async (newCategoryName: string) => {
    try {
      const { data, error } = await supabase
        .from("menu_categories")
        .insert([{ name: newCategoryName, menu_id: selectedMenuId }])
        .select()
        .single();

      if (error) {
        console.error("Error adding category:", error.message);
      } else {
        setMenuCategories((prevCategories) => [...prevCategories, data]);
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const editCategory = async (categoryId: string, newCategoryName: string) => {
    try {
      const { error } = await supabase
        .from("menu_categories")
        .update({ name: newCategoryName })
        .eq("id", categoryId);

      if (error) {
        console.error("Error editing category:", error.message);
      } else {
        setMenuCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.id === categoryId
              ? { ...category, name: newCategoryName }
              : category
          )
        );
      }
    } catch (error) {
      console.error("Error editing category:", error);
    }
  };

  const editItem = async (itemId: string, updatedItem: any) => {
    try {
      const { data, error } = await supabase
        .from("menu_items")
        .update(updatedItem)
        .eq("id", itemId)
        .select()
        .single();

      if (error) {
        console.error("Error updating item:", error.message);
      } else {
        setMenuItems((prevItems) =>
          prevItems.map((item) => (item.id === itemId ? data : item))
        );
      }
    } catch (error) {
      console.error("Error editing item:", error);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      const { error: deleteItemsError } = await supabase
        .from("menu_items")
        .delete()
        .or(`menu_category_id.eq.${categoryId},category_id.eq.${categoryId}`);

      if (deleteItemsError) {
        console.error(
          "Error deleting items associated with category:",
          deleteItemsError.message
        );
        return;
      }

      const { error: deleteCategoryError } = await supabase
        .from("menu_categories")
        .delete()
        .eq("id", categoryId);

      if (deleteCategoryError) {
        console.error("Error deleting category:", deleteCategoryError.message);
      } else {
        setMenuCategories((prevCategories) =>
          prevCategories.filter((category) => category.id !== categoryId)
        );
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className={styles.menusPage}>
      <h1 className={styles.pageTitle}>Menus Management</h1>
      <MenuSelection
        menus={menus}
        selectedMenuId={selectedMenuId}
        setSelectedMenuId={setSelectedMenuId}
        refreshMenus={fetchMenus}
      />
      {selectedMenuId && (
        <CategoryList
          menuCategories={menuCategories}
          menuItems={menuItems} // Pass menuItems explicitly
          addCategory={addCategory}
          deleteCategory={deleteCategory}
          editCategory={editCategory}
          addItem={addItem}
          editItem={editItem}
          deleteItem={async (itemId) => {
            try {
              const { error } = await supabase
                .from("menu_items")
                .delete()
                .eq("id", itemId);
              if (error) {
                console.error("Error deleting item:", error.message);
              } else {
                setMenuItems((prevItems) =>
                  prevItems.filter((item) => item.id !== itemId)
                );
              }
            } catch (error) {
              console.error("Error deleting item:", error);
            }
          }}
        />
      )}
    </div>
  );
};

export default MenusPage;

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
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (restaurantId) fetchMenus();
  }, [restaurantId]);

  useEffect(() => {
    if (selectedMenuId) fetchCategories(selectedMenuId);
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
      const { data: categories } = await supabase
        .from("menu_categories")
        .select("*")
        .eq("menu_id", menuId);

      const { data: items } = await supabase
        .from("menu_items")
        .select("*")
        .eq("menu_id", menuId);

      const categoriesWithItems = categories.map((category: any) => ({
        ...category,
        items: items.filter((item: any) => item.menu_category_id === category.id),
      }));

      setMenuCategories(categoriesWithItems);
    } catch (error) {
      console.error("Error fetching categories or items:", error);
    }
  };
  // Add a new menu item
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
        setMenuCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.id === item.menu_category_id
              ? {
                  ...category,
                  items: [...(category.items || []), data],
                }
              : category
          )
        );
      }
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };
  // Add a new category
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

  // Edit a category
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
    // Edit an existing menu item
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
          setMenuCategories((prevCategories) =>
            prevCategories.map((category) => ({
              ...category,
              items: (category.items || []).map((item: any) =>
                item.id === itemId ? data : item
              ),
            }))
          );
        }
      } catch (error) {
        console.error("Error editing item:", error);
      }
    };
  
  // Define the deleteCategory function
  const deleteCategory = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from("menu_categories")
        .delete()
        .eq("id", categoryId);

      if (error) {
        console.error("Error deleting category:", error.message);
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
          addCategory={addCategory}
          deleteCategory={deleteCategory}
          editCategory={editCategory}
          addItem={addItem}
          editItem={editItem}
          deleteItem={async (itemId) => {
            try {
              const { error } = await supabase.from("menu_items").delete().eq("id", itemId);
              if (error) {
                console.error("Error deleting item:", error.message);
              } else {
                setMenuCategories((prevCategories) =>
                  prevCategories.map((category) => ({
                    ...category,
                    items: (category.items || []).filter((item: any) => item.id !== itemId),
                  }))
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

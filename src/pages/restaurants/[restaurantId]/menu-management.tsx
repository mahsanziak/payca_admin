import React from 'react';
import Link from 'next/link';
import styles from '../../../components/MenuManagement.module.css'; // Adjust the import path if needed

const MenuManagementPage = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Menu Management</h2>
      <div className={styles.gridContainer}>
        <Link href="/restaurants/[restaurantId]/menus" as="/restaurants/your_restaurant_id/menus" legacyBehavior>
          <a className={styles.menuItem}>
            <i className="fas fa-book-open fa-2x"></i>
            <h3 className={styles.menuTitle}>My Menus</h3>
            <span className={styles.description}>Manage and customize your menus.</span>
          </a>
        </Link>
        <Link href="/restaurants/[restaurantId]/modifiers" as="/restaurants/your_restaurant_id/modifiers" legacyBehavior>
          <a className={styles.menuItem}>
            <i className="fas fa-cogs fa-2x"></i>
            <h3 className={styles.menuTitle}>Modifiers</h3>
            <span className={styles.description}>Adjust menu items with modifiers.</span>
          </a>
        </Link>
        <Link href="/restaurants/[restaurantId]/promotions" as="/restaurants/your_restaurant_id/promotions" legacyBehavior>
          <a className={styles.menuItem}>
            <i className="fas fa-bullhorn fa-2x"></i>
            <h3 className={styles.menuTitle}>Promotions</h3>
            <span className={styles.description}>Set up in-app promotions and manage promo codes.</span>
          </a>
        </Link>
        <Link href="/restaurants/[restaurantId]/archive" as="/restaurants/your_restaurant_id/archive" legacyBehavior>
          <a className={styles.menuItem}>
            <i className="fas fa-archive fa-2x"></i>
            <h3 className={styles.menuTitle}>Archive</h3>
            <span className={styles.description}>Access and manage archived items.</span>
          </a>
        </Link>
        <Link href="/restaurants/[restaurantId]/email-notifications" as="/restaurants/your_restaurant_id/email-notifications" legacyBehavior>
          <a className={styles.menuItem}>
            <i className="fas fa-envelope fa-2x"></i>
            <h3 className={styles.menuTitle}>Email Notifications</h3>
            <span className={styles.description}>Setup frequency and times for receiving emails for reports.</span>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default MenuManagementPage;

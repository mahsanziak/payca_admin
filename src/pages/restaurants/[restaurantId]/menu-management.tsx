import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../../components/MenuManagement.module.css'; // Adjust the import path if needed

const MenuManagementPage = () => {
  const router = useRouter();
  const { restaurantId } = router.query;

  // Handle case where restaurantId might not be available
  if (!restaurantId) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Menu Management</h2>
        <p className={styles.error}>
          Restaurant ID not found. Please select a restaurant first.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Menu Management</h2>
      <div className={styles.gridContainer}>
        <Link href={`/restaurants/${restaurantId}/menus`} legacyBehavior>
          <a className={styles.menuItem}>
            <i className="fas fa-book-open fa-2x"></i>
            <h3 className={styles.menuTitle}>My Menus</h3>
            <span className={styles.description}>Manage and customize your menus.</span>
          </a>
        </Link>

        {/* Promotions - Coming Soon */}
        <div className={`${styles.menuItem} ${styles.comingSoon}`}>
          <i className="fas fa-bullhorn fa-2x"></i>
          <h3 className={styles.menuTitle}>Promotions</h3>
          <span className={styles.description}>Coming Soon!</span>
        </div>

        {/* Archive - Coming Soon */}
        <div className={`${styles.menuItem} ${styles.comingSoon}`}>
          <i className="fas fa-archive fa-2x"></i>
          <h3 className={styles.menuTitle}>Archive</h3>
          <span className={styles.description}>Coming Soon!</span>
        </div>

        {/* Email Notifications - Coming Soon */}
        <div className={`${styles.menuItem} ${styles.comingSoon}`}>
          <i className="fas fa-envelope fa-2x"></i>
          <h3 className={styles.menuTitle}>Email Notifications</h3>
          <span className={styles.description}>Coming Soon!</span>
        </div>
      </div>
    </div>
  );
};

export default MenuManagementPage;

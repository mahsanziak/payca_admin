import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../../../components/InventoryManagement.module.css';

const InventoryDashboard: React.FC = () => {
  const router = useRouter();
  const { restaurantId } = router.query; // Get the restaurantId from the URL

  return (
    <div className={styles.inventoryManagementContainer}>
      <h1 className={styles.title}>Inventory Dashboard</h1>
      <div className={styles.cardGrid}>
        
        {/* Franchise Inventory Management */}
        {restaurantId && (
          <Link href={`/restaurants/${restaurantId}/inventory-dashboard/franchise`} legacyBehavior>
            <a className={styles.card}>
              <i className="fas fa-building"></i>
              <h2>Franchise Inventory Management</h2>
              <p>Manage inventory across all franchise locations.</p>
            </a>
          </Link>
        )}
        
        {/* Independent Inventory Management */}
        {restaurantId && (
          <Link href={`/restaurants/${restaurantId}/inventory-dashboard/independent`} legacyBehavior>
            <a className={styles.card}>
              <i className="fas fa-store"></i>
              <h2>Independent Inventory Management</h2>
              <p>Manage inventory for a single restaurant location.</p>
            </a>
          </Link>
        )}
      </div>
    </div>
  );
};

export default InventoryDashboard;

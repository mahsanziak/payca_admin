import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../../../components/InventoryManagement.module.css';

const IndependentInventory: React.FC = () => {
  const router = useRouter();
  const { restaurantId } = router.query; // Get the restaurantId from the URL

  const handleGoBack = () => {
    router.push(`/restaurants/${restaurantId}/inventory-dashboard`);
  };

  return (
    <div className={styles.inventoryManagementContainer}>
      {/* Go Back Button */}
      <button onClick={handleGoBack} className={styles.goBackButton}>
        &larr; Go back
      </button>

      <h1 className={styles.title}>Independent Inventory Management</h1>
      <div className={styles.cardGrid}>
        <Link href={`/restaurants/${restaurantId}/billing`}>
          <div className={styles.card}>
            <i className="fas fa-receipt"></i>
            <h2>Billing Management</h2>
            <p>Handle billing and invoices for your restaurant.</p>
          </div>
        </Link>
        <Link href={`/restaurants/${restaurantId}/locations`}>
          <div className={styles.card}>
            <i className="fas fa-map-marker-alt"></i>
            <h2>Locations</h2>
            <p>Manage your restaurant location and orders.</p>
          </div>
        </Link>
        <Link href={`/restaurants/${restaurantId}/financials`}>
          <div className={styles.card}>
            <i className="fas fa-chart-pie"></i>
            <h2>Financials</h2>
            <p>View financial reports and analytics for your restaurant.</p>
          </div>
        </Link>
        <Link href={`/restaurants/${restaurantId}/settings`}>
          <div className={styles.card}>
            <i className="fas fa-cogs"></i>
            <h2>Settings</h2>
            <p>Configure settings and preferences.</p>
          </div>
        </Link>
        <Link href={`/restaurants/${restaurantId}/recommendations`}>
          <div className={styles.card}>
            <i className="fas fa-lightbulb"></i>
            <h2>Recommendations</h2>
            <p>Get recommendations for improving operations.</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default IndependentInventory;

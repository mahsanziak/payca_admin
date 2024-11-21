import React from 'react';
import Link from 'next/link';
import styles from '../../../components/InventoryManagement.module.css';

const FranchiseInventory: React.FC = () => {
  const restaurantId = "1234"; // Replace with actual restaurantId or dynamically fetch it

  return (
    <div className={styles.inventoryManagementContainer}>
      <h1 className={styles.title}>Franchise Inventory Management</h1>
      <div className={styles.cardGrid}>
        <Link href={`/restaurants/${restaurantId}/billing`}>
          <div className={styles.card}>
            <i className="fas fa-receipt"></i>
            <h2>Billing Management</h2>
            <p>Handle billing and invoices for your branches.</p>
          </div>
        </Link>
        <Link href={`/restaurants/${restaurantId}/locations`}>
          <div className={styles.card}>
            <i className="fas fa-map-marker-alt"></i>
            <h2>Locations</h2>
            <p>Manage all restaurant locations and their orders.</p>
          </div>
        </Link>
        <Link href={`/restaurants/${restaurantId}/financials`}>
          <div className={styles.card}>
            <i className="fas fa-chart-pie"></i>
            <h2>Financials</h2>
            <p>View financial reports and analytics.</p>
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

export default FranchiseInventory;

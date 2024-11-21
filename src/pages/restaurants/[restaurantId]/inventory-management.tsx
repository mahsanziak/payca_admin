import React, { useState } from 'react';
import Link from 'next/link';
import styles from '../../../components/InventoryManagement.module.css';

const InventoryManagement: React.FC = () => {
  const [view, setView] = useState<'default' | 'franchise' | 'independent'>('default');
  const restaurantId = "1234"; // Replace with actual restaurantId or dynamically fetch it

  return (
    <div className={styles.inventoryManagementContainer}>
      <h1 className={styles.title}>Inventory Management</h1>

      {/* Initial View with Franchise and Independent Options */}
      {view === 'default' && (
        <div className={styles.cardGrid}>
          <div className={styles.card} onClick={() => setView('franchise')}>
            <i className="fas fa-building"></i>
            <h2>Franchise Inventory Management</h2>
            <p>Manage inventory across all franchise locations.</p>
          </div>
          
          <div className={styles.card} onClick={() => setView('independent')}>
            <i className="fas fa-store"></i>
            <h2>Independent Inventory Management</h2>
            <p>Manage inventory for a single restaurant location.</p>
          </div>
        </div>
      )}

      {/* Franchise Inventory Management View */}
      {view === 'franchise' && (
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
      )}

      {/* Independent Inventory Management View */}
      {view === 'independent' && (
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
      )}
    </div>
  );
};

export default InventoryManagement;

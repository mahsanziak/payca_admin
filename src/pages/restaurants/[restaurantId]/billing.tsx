import React, { useState, useEffect } from 'react';
import styles from '../../../components/billing.module.css';

const Billing: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [billingPeriod, setBillingPeriod] = useState('bi-weekly');
  const [invoices, setInvoices] = useState([
    { name: 'Restaurant A', total: 4500.25 },
    { name: 'Restaurant B', total: 3200.75 },
    { name: 'Restaurant C', total: 5600.50 }
  ]);

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBillingPeriod(e.target.value);
  };

  return (
    <div className={styles.billingContainer}>
      <h1 className={styles.billingTitle}>Billing Management</h1>
      <div className={styles.billingForm}>
        <label htmlFor="billing-period">Select Billing Period:</label>
        <select id="billing-period" onChange={handlePeriodChange} value={billingPeriod}>
          <option value="weekly">Weekly</option>
          <option value="bi-weekly">Bi-Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div className={styles.invoiceGrid}>
        {invoices.map((invoice, index) => (
          <div key={index} className={styles.invoiceCard}>
            <h2>{invoice.name}</h2>
            <p>Invoice for the period: {billingPeriod}</p>
            <p className={styles.invoiceTotal}>Total: ${invoice.total.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Billing;

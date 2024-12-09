import React, { useState } from 'react';
import styles from '../../../components/locations.module.css';

type Order = {
  name: string;
  quantity: number;
  cost: number;
  date: string;
};

type AcceptedOrders = {
  [key: string]: Order[]; // Explicitly allow string indexing
};

const Locations: React.FC = () => {
  const [locations, setLocations] = useState([
    { id: 'loc1', name: 'Location 1' },
    { id: 'loc2', name: 'Location 2' },
    { id: 'loc3', name: 'Location 3' },
  ]);

  const [selectedLocation, setSelectedLocation] = useState<string | null>(
    locations[0].id
  );

  const [acceptedOrders, setAcceptedOrders] = useState<AcceptedOrders>({
    August: [
      { name: 'Item A', quantity: 10, cost: 100, date: '2024-08-16 10:00' },
      { name: 'Item B', quantity: 5, cost: 50, date: '2024-08-16 11:00' },
    ],
    September: [
      { name: 'Item C', quantity: 7, cost: 70, date: '2024-09-01 09:00' },
    ],
  });

  const [invoices, setInvoices] = useState([
    {
      invoice_id: 'inv1',
      subtotal: 200,
      due_date: '2024-08-20',
      last_payment: '2024-08-15',
      created_at: '2024-08-01',
    },
    {
      invoice_id: 'inv2',
      subtotal: 150,
      due_date: '2024-09-15',
      last_payment: '2024-09-10',
      created_at: '2024-09-01',
    },
  ]);

  const handleLocationChange = (locationId: string) => {
    setSelectedLocation(locationId);
  };

  return (
    <div className={styles.locationsContainer}>
      <h1>Locations</h1>
      <select
        onChange={(e) => handleLocationChange(e.target.value)}
        value={selectedLocation || ''}
      >
        <option value="" disabled>
          Select a location
        </option>
        {locations.map((location) => (
          <option key={location.id} value={location.id}>
            {location.name}
          </option>
        ))}
      </select>

      {selectedLocation && (
        <div className={styles.locationDetails}>
          <h2>{locations.find((loc) => loc.id === selectedLocation)?.name}</h2>

          {/* Accepted Orders Section */}
          <h3>Accepted Orders by Month</h3>
          {Object.keys(acceptedOrders).length > 0 ? (
            Object.keys(acceptedOrders).map((month) => (
              <div key={month}>
                <h4>Month: {month}</h4>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Unit Cost</th>
                      <th>Total Cost</th>
                      <th>Date and Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {acceptedOrders[month]?.map((order, index) => (
                      <tr key={index}>
                        <td>{order.name}</td>
                        <td>{order.quantity}</td>
                        <td>${order.cost}</td>
                        <td>${(order.quantity * order.cost).toFixed(2)}</td>
                        <td>{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3}>
                        <strong>Subtotal</strong>
                      </td>
                      <td colSpan={2}>
                        <strong>
                          $
                          {acceptedOrders[month]
                            ?.reduce(
                              (acc, order) => acc + order.quantity * order.cost,
                              0
                            )
                            .toFixed(2)}
                        </strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ))
          ) : (
            <p>No accepted orders.</p>
          )}

          {/* Invoices Section */}
          <h3>Invoices</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Subtotal</th>
                <th>Due Date</th>
                <th>Last Payment</th>
                <th>Month</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice, index) => (
                <tr key={index}>
                  <td>{invoice.invoice_id}</td>
                  <td>${invoice.subtotal.toFixed(2)}</td>
                  <td>{invoice.due_date}</td>
                  <td>{invoice.last_payment}</td>
                  <td>{invoice.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Locations;

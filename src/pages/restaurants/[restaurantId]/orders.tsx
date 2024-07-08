import { useRouter } from 'next/router';
import styles from '../../../components/Orders.module.css'; // Adjust the path according to your directory structure
import { useEffect, useState } from 'react';

type Order = {
  id: string;
  status: string;
  table: string;
  time: string;
  total: number;
};

const OrdersPage = () => {
  const router = useRouter();
  const { restaurantId } = router.query;

  const [orders, setOrders] = useState<Order[]>([]);
  const [showPastOrders, setShowPastOrders] = useState(false);

  useEffect(() => {
    // Fetch orders based on restaurantId
    const fetchOrders = async () => {
      if (restaurantId) {
        // Replace with actual fetch call
        const response = await fetch(`/api/orders?restaurantId=${restaurantId}`);
        const data: Order[] = await response.json();
        setOrders(data);
      }
    };

    fetchOrders();
  }, [restaurantId]);

  return (
    <div className={`${styles.container}`}>
      <h2 className={`${styles.title} text-3xl font-bold mb-6`}>Orders</h2>
      <div className={`${styles.orderOptions}`}>
        <button onClick={() => setShowPastOrders(false)}>Live Orders</button>
        <button onClick={() => setShowPastOrders(true)}>Past Orders</button>
      </div>
      <div className={`${styles.ordersTableContainer}`}>
        <table className={`${styles.ordersTable}`}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Table</th>
              <th>Time</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders
                .filter(order => (showPastOrders ? order.status === 'completed' : order.status !== 'completed'))
                .map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.status}</td>
                    <td>{order.table}</td>
                    <td>{order.time}</td>
                    <td>{order.total}</td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan={5} className={styles.noData}>
                  <i className="fas fa-database"></i> No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className={styles.tableMapContainer}>
        <h2 className="text-2xl font-semibold mb-4">Table Layout</h2>
        <div className={styles.tableMap} id="tableMap">
          {[...Array(7)].map((_, rowIndex) => (
            <div key={rowIndex} className={styles.tableRow}>
              {[...Array(7)].map((_, cellIndex) => (
                <div key={cellIndex} className={styles.tableCell}></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;

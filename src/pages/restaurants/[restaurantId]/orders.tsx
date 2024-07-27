// orders.tsx

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
  const [tableNumbers, setTableNumbers] = useState<string[][]>(
    Array(6)
      .fill(null)
      .map(() => Array(6).fill(''))
  );
  const [tableStatus, setTableStatus] = useState<string[][]>(
    Array(6)
      .fill(null)
      .map(() => Array(6).fill(''))
  );

  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState<[number, number]>([0, 0]);
  const [inputValue, setInputValue] = useState('');

  const [editMode, setEditMode] = useState(false);

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

  const handleTableNumberChange = (
    rowIndex: number,
    cellIndex: number,
    value: string
  ) => {
    const updatedTableNumbers = [...tableNumbers];
    updatedTableNumbers[rowIndex][cellIndex] = value;
    setTableNumbers(updatedTableNumbers);
  };

  const assignTableNumber = () => {
    const [rowIndex, cellIndex] = popupPosition;
    handleTableNumberChange(rowIndex, cellIndex, inputValue);
    const updatedTableStatus = [...tableStatus];
    updatedTableStatus[rowIndex][cellIndex] = 'green';
    setTableStatus(updatedTableStatus);
    setShowPopup(false);
    setInputValue('');
  };

  const handleCellClick = (rowIndex: number, cellIndex: number) => {
    if (tableNumbers[rowIndex][cellIndex] && !editMode) {
      const updatedTableStatus = [...tableStatus];
      if (tableStatus[rowIndex][cellIndex] === 'green') {
        updatedTableStatus[rowIndex][cellIndex] = 'red';
      } else if (tableStatus[rowIndex][cellIndex] === 'red') {
        updatedTableStatus[rowIndex][cellIndex] = '';
      } else {
        updatedTableStatus[rowIndex][cellIndex] = 'green';
      }
      setTableStatus(updatedTableStatus);
    } else {
      setPopupPosition([rowIndex, cellIndex]);
      setShowPopup(true);
    }
  };

  return (
    <div className={`${styles.container}`}>
      <h2 className={`${styles.title} text-3xl font-bold mb-6`}>Orders</h2>
      <div className={`${styles.orderOptions}`}>
        <button onClick={() => setShowPastOrders(false)}>Live Orders</button>
        <button onClick={() => setShowPastOrders(true)}>Past Orders</button>
        <button onClick={() => setEditMode(!editMode)}>
          {editMode ? 'Disable Edit' : 'Enable Edit'}
        </button>
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
                .filter(order =>
                  showPastOrders ? order.status === 'completed' : order.status !== 'completed'
                )
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
          {tableNumbers.map((row, rowIndex) => (
            <div key={rowIndex} className={styles.tableRow}>
              {row.map((tableNumber, cellIndex) => (
                <div
                  key={cellIndex}
                  className={`${styles.tableCell} ${styles[tableStatus[rowIndex][cellIndex]]}`}
                  onClick={() => handleCellClick(rowIndex, cellIndex)}
                >
                  {tableNumber || ''}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {showPopup && (
        <>
          <div className={styles.overlay} onClick={() => setShowPopup(false)} />
          <div className={styles.popup}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Table #"
            />
            <button onClick={assignTableNumber}>Assign</button>
          </div>
        </>
      )}
    </div>
  );
};

export default OrdersPage;

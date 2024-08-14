import { useRouter } from 'next/router';
import styles from '../../../components/Orders.module.css'; // Adjust the path according to your directory structure
import { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabaseClient'; // Import your Supabase client
import Draggable from 'react-draggable';

type Order = {
  id: string;
  status: string;
  table: string;
  time: string;
  total: number;
};

type Table = {
  id: string;
  seats: number;
  shape: 'square' | 'rectangle' | 'circle';
  position: { x: number; y: number };
  occupied: boolean;
  occupiedSince: Date | null;
};

const OrdersPage = () => {
  const router = useRouter();
  const { restaurantId } = router.query;

  const [orders, setOrders] = useState<Order[]>([]);
  const [showPastOrders, setShowPastOrders] = useState(false);
  const [tables, setTables] = useState<Table[]>(() => {
    const savedTables = localStorage.getItem('tables');
    return savedTables ? JSON.parse(savedTables) : [
      { id: '200', seats: 4, shape: 'square', position: { x: 100, y: 100 }, occupied: false, occupiedSince: null },
      { id: '201', seats: 4, shape: 'square', position: { x: 250, y: 100 }, occupied: false, occupiedSince: null },
      { id: '202', seats: 4, shape: 'rectangle', position: { x: 400, y: 100 }, occupied: false, occupiedSince: null },
      { id: '203', seats: 4, shape: 'rectangle', position: { x: 550, y: 100 }, occupied: false, occupiedSince: null },
      { id: '204', seats: 4, shape: 'circle', position: { x: 700, y: 100 }, occupied: false, occupiedSince: null },
      { id: '205', seats: 4, shape: 'square', position: { x: 100, y: 250 }, occupied: false, occupiedSince: null },
      { id: '206', seats: 4, shape: 'square', position: { x: 250, y: 250 }, occupied: false, occupiedSince: null },
      { id: '207', seats: 4, shape: 'rectangle', position: { x: 400, y: 250 }, occupied: false, occupiedSince: null },
      { id: '208', seats: 4, shape: 'rectangle', position: { x: 550, y: 250 }, occupied: false, occupiedSince: null },
      { id: '209', seats: 4, shape: 'circle', position: { x: 700, y: 250 }, occupied: false, occupiedSince: null },
    ];
  });

  const [editMode, setEditMode] = useState(false);
  const [showShapeModal, setShowShapeModal] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (restaurantId) {
        try {
          const response = await fetch(`/api/orders?restaurantId=${restaurantId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data: Order[] = await response.json();
          setOrders(data);
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      }
    };

    fetchOrders();
  }, [restaurantId]);

  useEffect(() => {
    localStorage.setItem('tables', JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    if (tables.some(table => table.occupied)) {
      const interval = setInterval(() => {
        setTables([...tables]); // Trigger re-render to update time
      }, 1000);

      return () => clearInterval(interval); // Clean up interval on unmount
    }
  }, [tables]);

  const handleAddTable = (shape: 'square' | 'rectangle' | 'circle') => {
    const newTable: Table = {
      id: (tables.length + 200).toString(),
      seats: 4,
      shape,
      position: { x: 0, y: 0 },
      occupied: false,
      occupiedSince: null,
    };
    setTables([...tables, newTable]);
    setShowShapeModal(false); // Hide the shape selection modal
  };

  const handleSeatsChange = (tableId: string, seats: number) => {
    const updatedTables = tables.map(table => 
      table.id === tableId ? { ...table, seats } : table
    );
    setTables(updatedTables);
  };

  const handleTableNumberChange = (tableId: string, newId: string) => {
    const updatedTables = tables.map(table => 
      table.id === tableId ? { ...table, id: newId } : table
    );
    setTables(updatedTables);
  };

  const handleDrag = (e, position, tableId) => {
    const { x, y } = position;
    setTables(tables.map(table => 
      table.id === tableId ? { ...table, position: { x, y } } : table
    ));
  };

  const handleTableClick = (tableId: string) => {
    if (!editMode) {
      const updatedTables = tables.map(table =>
        table.id === tableId 
          ? { 
              ...table, 
              occupied: !table.occupied,
              occupiedSince: !table.occupied ? new Date() : null,
            } 
          : table
      );
      setTables(updatedTables);
    }
  };

  const handleDeleteTable = (tableId: string) => {
    setTables(tables.filter(table => table.id !== tableId));
  };

  const formatTimeElapsed = (startTime: Date | null) => {
    if (!startTime) return '';
    const elapsed = Date.now() - new Date(startTime).getTime();
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
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
        <button onClick={() => setShowShapeModal(true)}>Add Table</button>
      </div>
      {showShapeModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Select Table Shape</h3>
            <div className={styles.shapeOptions}>
              <div
                className={`${styles.shapeOption} ${styles.square}`}
                onClick={() => handleAddTable('square')}
              />
              <div
                className={`${styles.shapeOption} ${styles.rectangle}`}
                onClick={() => handleAddTable('rectangle')}
              />
              <div
                className={`${styles.shapeOption} ${styles.circle}`}
                onClick={() => handleAddTable('circle')}
              />
            </div>
            <button onClick={() => setShowShapeModal(false)}>Cancel</button>
          </div>
        </div>
      )}
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
          {tables.map((table) => (
            <Draggable
              key={table.id}
              bounds="parent"
              position={{ x: table.position.x, y: table.position.y }}
              onStop={(e, position) => handleDrag(e, position, table.id)}
              disabled={!editMode}
            >
              <div
                className={`${styles.tableCell} ${styles[table.shape]} ${table.occupied ? styles.occupied : styles.empty}`}
                onClick={() => handleTableClick(table.id)}
                title={table.occupied ? `Occupied for: ${formatTimeElapsed(table.occupiedSince)}` : ''}
              >
                {editMode ? (
                  <>
                    <input
                      type="text"
                      value={table.id}
                      onChange={(e) => handleTableNumberChange(table.id, e.target.value)}
                      className={styles.tableNumberInput}
                    />
                    <select
                      value={table.seats}
                      onChange={(e) => handleSeatsChange(table.id, Number(e.target.value))}
                      className={styles.seatsSelect}
                      onClick={(e) => e.stopPropagation()} // Prevent dragging when interacting with dropdown
                    >
                      {Array.from({ length: 20 }, (_, i) => i + 1).map(seats => (
                        <option key={seats} value={seats}>
                          {seats} Seats
                        </option>
                      ))}
                    </select>
                    <button className={styles.deleteButton} onClick={() => handleDeleteTable(table.id)}>Delete</button>
                  </>
                ) : (
                  <>
                    Table {table.id} <br />
                    {table.seats} Seats
                  </>
                )}
              </div>
            </Draggable>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;

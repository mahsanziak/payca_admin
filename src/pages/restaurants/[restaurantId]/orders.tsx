import { useRouter } from 'next/router';
import styles from '../../../components/Orders.module.css'; // Adjust the path according to your directory structure
import { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabaseClient'; // Import your Supabase client
import Draggable from 'react-draggable';
import _ from 'lodash';
import { DraggableEvent, DraggableData } from "react-draggable"; // Import types for event and position
import TableQRCode from '../../../components/TableQRCode';


type Order = {
  id: string;
  order_number: number;
  status: string;
  table: string | number;
  time: string;
  total: number;
  waiterName: string | null;
  items: { name: string; quantity: number }[];
};

type Table = {
  id: string;
  table_number: number;
  seats: number;
  shape: "square" | "rectangle" | "circle";
  position: { x: number; y: number };
  occupied: boolean;
  occupiedSince: Date | null;
  orderEndTime: Date | null;
};

const OrdersPage = () => {
  const router = useRouter();
  const { restaurantId } = router.query;

  const [orders, setOrders] = useState<Order[]>([]);
  const [showPastOrders, setShowPastOrders] = useState(false);
  const [tables, setTables] = useState<Table[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [showShapeModal, setShowShapeModal] = useState(false);
  const [selectedOrderItems, setSelectedOrderItems] = useState<
    { name: string; quantity: number }[] | null
  >(null);
  const [showQRCodes, setShowQRCodes] = useState(false);
  const [rowsToShow, setRowsToShow] = useState(5); // Default to 5 rows

  // Calculate the height based on the number of rows selected
  const rowHeight = 40; // Example height for each row (adjust as needed)
  const headerHeight = 50; // Example height for the header (adjust as needed)
  const tableHeight = headerHeight + (rowHeight * rowsToShow); // Total height of the table
  
  
  const handleShowItems = (items: { name: string; quantity: number }[]) => {
    setSelectedOrderItems(items);
  };

  const handleClosePopup = () => {
    setSelectedOrderItems(null);
  };
  
  useEffect(() => {
    const fetchTables = async () => {
      if (restaurantId) {
        const { data, error } = await supabase
          .from("tables")
          .select("*")
          .eq("restaurant_id", restaurantId);

        if (error) {
          console.error("Error fetching tables:", error);
        } else {
          const formattedTables = data.map((table) => ({
            id: table.id,
            table_number: table.table_number,
            seats: table.seats,
            shape: table.shape,
            position: { x: table.position_x, y: table.position_y },
            occupied: table.occupied,
            occupiedSince: table.occupied_since
              ? new Date(table.occupied_since)
              : null,
            orderEndTime: table.order_end_time
              ? new Date(table.order_end_time)
              : null,
          }));
          setTables(formattedTables);
        }
      }
    };

    fetchTables();
  }, [restaurantId]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (restaurantId) {
        try {
          const { data, error } = await supabase
            .from("orders")
            .select(
              `
                id,
                order_number,
                status,
                total_price,
                created_at,
                table_id,
                items
              `
            )
            .eq("restaurant_id", restaurantId);

          if (error) {
            console.error("Error fetching orders:", error);
          } else {
            const formattedOrders = data.map((order) => ({
              id: order.id,
              order_number: order.order_number,
              status: order.status,
              table:
                tables.find((t) => t.id === order.table_id)?.table_number ||
                "N/A",
              time: new Date(order.created_at).toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
                month: "short",
                day: "numeric",
              }),
              total: order.total_price,
              waiterName: "N/A",
              items: order.items || [],
            }));
            setOrders(formattedOrders);
          }
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      }
    };

    fetchOrders();

    const orderSubscription = supabase
      .channel('orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders(); // Re-fetch orders on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(orderSubscription);
    };
  }, [restaurantId, tables]);
  

  useEffect(() => {
    if (tables.some((table) => table.occupied)) {
      const interval = setInterval(() => {
        setTables([...tables]); // Trigger re-render to update time
      }, 1000);

      return () => clearInterval(interval); // Clean up interval on unmount
    }
  }, [tables]);

  const handleAddTable = async (shape: 'square' | 'rectangle' | 'circle') => {
    const newTable = {
      restaurant_id: restaurantId,
      table_number: tables.length + 1, // Generate a new table number based on the existing number of tables
      seats: 4,
      shape,
      position_x: 0,
      position_y: 0,
      occupied: false,
      occupied_since: null,
      order_end_time: null,
    };

    const { data, error } = await supabase
      .from('tables')
      .insert(newTable)
      .select();

    if (error) {
      console.error('Error adding table:', error);
    } else {
      const formattedTable = {
        id: data[0].id,
        table_number: data[0].table_number,
        seats: data[0].seats,
        shape: data[0].shape,
        position: { x: data[0].position_x, y: data[0].position_y },
        occupied: data[0].occupied,
        occupiedSince: data[0].occupied_since ? new Date(data[0].occupied_since) : null,
        orderEndTime: data[0].order_end_time ? new Date(data[0].order_end_time) : null,
      };
      setTables([...tables, formattedTable]);
    }

    setShowShapeModal(false); // Hide the shape selection modal
  };

  const handleSeatsChange = async (tableId: string, seats: number) => {
    const updatedTables = tables.map(table => 
      table.id === tableId ? { ...table, seats } : table
    );
    setTables(updatedTables);

    const { error } = await supabase
      .from('tables')
      .update({ seats })
      .eq('id', tableId);

    if (error) {
      console.error('Error updating seats:', error);
    }
  };

  const handleTableNumberChange = async (tableId: string, newTableNumber: number) => {
    const updatedTables = tables.map(table => 
      table.id === tableId ? { ...table, table_number: newTableNumber } : table
    );
    setTables(updatedTables);

    const { error } = await supabase
      .from('tables')
      .update({ table_number: newTableNumber })
      .eq('id', tableId);

    if (error) {
      console.error('Error updating table number:', error);
    }
  };

  const handleDrag = _.throttle((e, position, tableId) => {
    const { x, y } = position;
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === tableId ? { ...table, position: { x, y } } : table
      )
    );
  }, 100);


  const handleDragStop = (e: DraggableEvent, position: DraggableData, tableId: string): void => {
    const { x, y } = position;
  
    // Use an async IIFE to handle the async logic
    (async () => {
      try {
        const { error } = await supabase
          .from("tables")
          .update({ position_x: x, position_y: y })
          .eq("id", tableId);
  
        if (error) {
          console.error("Error updating table position:", error);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    })();
  };
  
  
  

  const handleTableClick = async (tableId: string) => {
    if (editMode) return; // Prevent toggling status if in edit mode

    const selectedTable = tables.find(table => table.id === tableId);
    const now = new Date();

    if (selectedTable && !selectedTable.occupied) {
      // If the table is not occupied, set it to occupied and populate `occupied_since`
      const updatedTables = tables.map(table =>
        table.id === tableId 
          ? { 
              ...table, 
              occupied: true,
              occupiedSince: now,
              orderEndTime: null, // Reset the order end time
            } 
          : table
      );
      setTables(updatedTables);

      const { error } = await supabase
        .from('tables')
        .update({ 
          occupied: true,
          occupied_since: now.toISOString(),
          order_end_time: null, // Reset the order end time in the database
        })
        .eq('id', tableId);

      if (error) {
        console.error('Error updating table occupation status:', error);
      }
    } else if (selectedTable && selectedTable.occupied) {
      // If the table is already occupied, set `order_end_time`
      const updatedTables = tables.map(table =>
        table.id === tableId 
          ? { 
              ...table, 
              occupied: false,
              orderEndTime: now,
            } 
          : table
      );
      setTables(updatedTables);

      const { error } = await supabase
        .from('tables')
        .update({ 
          occupied: false,
          order_end_time: now.toISOString(),
        })
        .eq('id', tableId);

      if (error) {
        console.error('Error updating table occupation status:', error);
      }
    }
  };

  const handleDeleteTable = async (tableId: string) => {
    const { error } = await supabase
      .from('tables')
      .delete()
      .eq('id', tableId);

    if (error) {
      console.error('Error deleting table:', error);
    } else {
      setTables(tables.filter(table => table.id !== tableId));
    }
  };

  const formatTimeElapsed = (startTime: Date | null) => {
    if (!startTime) return '';
    const elapsed = Date.now() - new Date(startTime).getTime();
    const minutes = Math.floor(elapsed / 60000);
    return `${minutes}m`;
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
        <button onClick={() => setShowQRCodes(!showQRCodes)}>
          {showQRCodes ? 'Disable QR' : 'Enable QR'}
        </button>
        <button onClick={() => setShowShapeModal(true)}>Add Table</button>
        <label>
          Number of rows in view:
          <select value={rowsToShow} onChange={(e) => setRowsToShow(Number(e.target.value))}>
            <option value={1}>1</option>
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={7}>7</option>
          </select>
        </label>
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
  
  <div className={styles.ordersTableContainer}>
    <table className={styles.ordersTable}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Status</th>
          <th>Table</th>
          <th>Time</th>
          <th>Total</th>
          <th>Waiter</th>
        </tr>
      </thead>
    </table>
    <div className={styles.scrollableTableBody} style={{ maxHeight: `${tableHeight}px`, overflowY: 'auto' }}>
      <table className={styles.ordersTable}>
        <tbody>
          {orders.length > 0 ? (
            orders
              .sort((a, b) => {
                if (a.status === "ready" && b.status !== "ready") return 1;
                if (a.status !== "ready" && b.status === "ready") return -1;
                return b.order_number - a.order_number;
              })
              .filter((order) => order.status !== "archive")
              .filter((order) =>
                showPastOrders
                  ? order.status === "paid"
                  : order.status === "pending" || order.status === "ready"
              )
              .map((order) => (
                <tr key={order.id}>
                  <td className={styles.clickableId} onClick={() => handleShowItems(order.items || [])}>
                    {order.order_number}
                  </td>
                  <td>
                    <select
                      value={order.status}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        const { error } = await supabase
                          .from("orders")
                          .update({ status: newStatus })
                          .eq("id", order.id);

                        if (!error) {
                          setOrders((prevOrders) =>
                            prevOrders.map((o) =>
                              o.id === order.id ? { ...o, status: newStatus } : o
                            )
                          );
                        }
                      }}
                      className={styles.statusDropdown}
                    >
                      <option value="pending">Pending</option>
                      <option value="ready">Ready</option>
                      <option value="paid">Paid</option>
                      <option value="archive">Archive</option>
                    </select>
                  </td>
                  <td>{order.table}</td>
                  <td>{order.time}</td>
                  <td>${order.total.toFixed(2)}</td>
                  <td>{order.waiterName || ""}</td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan={6} className={styles.noData}>
                <i className="fas fa-database"></i> No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>


{selectedOrderItems && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <button
              className={styles.closeButton}
              onClick={handleClosePopup}
            >
              &times;
            </button>
            <h3 className={styles.popupTitle}>Ordered Items</h3>
            <ul>
              {selectedOrderItems.map((item, index) => (
                <li key={index}>
                  {item.name} - Quantity: {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}




  
      <div className={styles.tableMapContainer}>
        <h2 className="text-2xl font-semibold mb-4">Table Layout</h2>
        <div className={styles.tableMap} id="tableMap">
          {tables.map((table) => (
            <Draggable
  key={table.id}
  bounds="parent"
  position={{ x: table.position.x, y: table.position.y }}
  onStop={(e, position) => handleDragStop(e, position, table.id)}
  onDrag={(e, position) => handleDrag(e, position, table.id)}
  disabled={!editMode}
  scale={1} // Default scaling, adjust if your layout is scaled
>
  <div
    className={`${styles.tableCell} ${styles[table.shape]} ${
      table.occupied ? styles.occupied : styles.empty
    }`}
    onClick={() => handleTableClick(table.id)}
    title={table.occupied ? `Occupied for: ${formatTimeElapsed(table.occupiedSince)}` : ""}
  >
    {editMode ? (
      <>
        <input
          type="number"
          value={table.table_number}
          onChange={(e) =>
            handleTableNumberChange(table.id, Number(e.target.value))
          }
          className={styles.tableNumberInput}
        />
        <select
          value={table.seats}
          onChange={(e) => handleSeatsChange(table.id, Number(e.target.value))}
          className={styles.seatsSelect}
          onClick={(e) => e.stopPropagation()} // Prevent dragging when interacting with dropdown
        >
          {Array.from({ length: 20 }, (_, i) => i + 1).map((seats) => (
            <option key={seats} value={seats}>
              {seats} Seats
            </option>
          ))}
        </select>
        <button
          className={styles.deleteButton}
          onClick={() => handleDeleteTable(table.id)}
        >
          Delete
        </button>
      </>
    ) : showQRCodes ? (
      <TableQRCode 
        restaurantId={restaurantId as string}
        tableId={table.id}
        tableNumber={table.table_number}
      />
    ) : (
      <>
        Table {table.table_number} <br />
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

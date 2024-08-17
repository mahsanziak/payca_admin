import React, { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { useRouter } from 'next/router';

type Order = {
  id: string;
  total_price: number;
  status: string;
  table_id: string;
  user_id: string;
  created_at: string;
};

type Table = {
  id: string;
  table_number: number;
};

type Waiter = {
  id: string;
  name: string;
};

const Dashboard = () => {
  const router = useRouter();
  const { restaurantId } = router.query;
  const [restaurantName, setRestaurantName] = useState('');
  const [revenue, setRevenue] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);
  const [averageOrderSize, setAverageOrderSize] = useState(0);
  const [tip, setTip] = useState(0);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [tablesMap, setTablesMap] = useState<Record<string, number>>({});
  const [waitersMap, setWaitersMap] = useState<Record<string, string>>({});
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchRestaurantName = async () => {
      if (restaurantId) {
        const { data, error } = await supabase
          .from('restaurants')
          .select('name')
          .eq('id', restaurantId)
          .single();
        if (data) {
          setRestaurantName(data.name);
        } else {
          console.error('Error fetching restaurant name:', error.message);
        }
      }
    };

    const fetchTables = async () => {
      if (restaurantId) {
        const { data: tables, error } = await supabase
          .from('tables')
          .select('id, table_number')
          .eq('restaurant_id', restaurantId);

        if (error) {
          console.error('Error fetching tables:', error.message);
        } else {
          const tableMapping: Record<string, number> = {};
          tables.forEach((table: Table) => {
            tableMapping[table.id] = table.table_number;
          });
          setTablesMap(tableMapping);
        }
      }
    };

    const fetchWaiters = async () => {
      if (restaurantId) {
        const { data: waiters, error } = await supabase
          .from('staff')
          .select('id, name')
          .eq('restaurant_id', restaurantId);

        if (error) {
          console.error('Error fetching waiters:', error.message);
        } else {
          const waiterMapping: Record<string, string> = {};
          waiters.forEach((waiter: Waiter) => {
            waiterMapping[waiter.id] = waiter.name;
          });
          setWaitersMap(waiterMapping);
        }
      }
    };

    const fetchStats = async () => {
      if (restaurantId) {
        const { data, error } = await supabase
          .from('orders')
          .select('id, total_price, status, table_id, user_id, created_at, tip_amount')
          .eq('restaurant_id', restaurantId);

        if (error) {
          console.error('Error fetching orders:', error.message);
        } else {
          console.log('Fetched Orders Data:', data);
          const ordersData: Order[] = data as Order[];
          const revenue = ordersData.reduce((acc, order) => acc + order.total_price, 0);
          const ordersCount = ordersData.length;
          const customersCount = new Set(ordersData.map(order => order.user_id)).size;
          const averageOrderSize = ordersCount ? revenue / ordersCount : 0;
          const tipAmount = ordersData.reduce((acc, order) => acc + order.tip_amount, 0);
          const recentOrders = ordersData
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 5);

          setRevenue(revenue);
          setOrdersCount(ordersCount);
          setCustomersCount(customersCount);
          setAverageOrderSize(averageOrderSize);
          setTip(tipAmount);
          setRecentOrders(recentOrders);
        }
      }
    };

    fetchRestaurantName();
    fetchTables();
    fetchWaiters();
    fetchStats();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [restaurantId]);

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const formatOrderTime = (time: string) => {
    const date = new Date(time);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex">
      <div className="main-content flex-1 p-6">
        <div className="dashboard-header mb-8 text-center">
          <h2 className="text-6xl font-bold animate-pulse">{`Welcome to ${restaurantName}`}</h2>
          <p className="text-xl text-gray-500 mt-2">
            {formattedDate} {formattedTime}
          </p>
        </div>

        <div className="today-stats mb-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Today</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 justify-center">
            <div className="stat-item p-6 bg-gray-100 rounded shadow flex items-center justify-center space-x-4">
              <i className="fas fa-dollar-sign text-2xl"></i>
              <span>Revenue: CA${revenue.toFixed(2)}</span>
            </div>
            <div className="stat-item p-6 bg-gray-100 rounded shadow flex items-center justify-center space-x-4">
              <i className="fas fa-shopping-cart text-2xl"></i>
              <span>Orders: {ordersCount}</span>
            </div>
            <div className="stat-item p-6 bg-gray-100 rounded shadow flex items-center justify-center space-x-4">
              <i className="fas fa-shopping-bag text-2xl"></i>
              <span>Average Order Size: CA${averageOrderSize.toFixed(2)}</span>
            </div>
            <div className="stat-item p-6 bg-gray-100 rounded shadow flex items-center justify-center space-x-4">
              <i className="fas fa-hand-holding-usd text-2xl"></i>
              <span>Tip: CA${tip.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="recent-orders text-center">
          <h2 className="text-2xl font-semibold mb-4">Recent Orders</h2>
          <table className="orders-table w-full bg-white rounded shadow mx-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Order Time</th>
                <th className="p-2">Status</th>
                <th className="p-2">Table</th>
                <th className="p-2">Waiter</th>
                <th className="p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="p-2">{formatOrderTime(order.created_at)}</td>
                    <td className="p-2">{order.status}</td>
                    <td className="p-2">{tablesMap[order.table_id] || 'Unknown'}</td>
                    <td className="p-2">{waitersMap[order.user_id] || ''}</td>
                    <td className="p-2">CA${order.total_price.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr className="no-data">
                  <td colSpan={5} className="text-center p-4">
                    <i className="fas fa-database"></i> No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { useRouter } from 'next/router';

type Order = {
  total_price: number;
  status: string;
  table_id: string;
  user_id: string;
  created_at: string; // Ensure this is typed as a string
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

    const fetchStats = async () => {
      if (restaurantId) {
        const { data, error } = await supabase
          .from('orders')
          .select('total_price, status, table_id, user_id, created_at')
          .eq('restaurant_id', restaurantId)
          .gte('created_at', new Date().toISOString().slice(0, 10)); // Fetch today's orders

        if (error) {
          console.error('Error fetching orders:', error.message);
        } else {
          const ordersData: Order[] = data as Order[];
          const revenue = ordersData.reduce((acc, order) => acc + order.total_price, 0);
          const ordersCount = ordersData.length;
          const customersCount = new Set(ordersData.map(order => order.user_id)).size;
          const averageOrderSize = ordersCount ? revenue / ordersCount : 0;
          const recentOrders = ordersData
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 5);

          setRevenue(revenue);
          setOrdersCount(ordersCount);
          setCustomersCount(customersCount);
          setAverageOrderSize(averageOrderSize);
          setRecentOrders(recentOrders);
        }
      }
    };

    fetchRestaurantName();
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
  const formattedTime = currentTime.toLocaleTimeString();

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
                <th className="p-2">ID</th>
                <th className="p-2">Status</th>
                <th className="p-2">Table</th>
                <th className="p-2">Waiter</th>
                <th className="p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.created_at}>
                    <td className="p-2">{order.created_at}</td>
                    <td className="p-2">{order.status}</td>
                    <td className="p-2">{order.table_id}</td>
                    <td className="p-2">{order.user_id}</td>
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

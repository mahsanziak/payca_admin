import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { FaArrowLeft } from 'react-icons/fa';
import { supabase } from '../../../utils/supabaseClient';

const COLORS = ['#FF8042', '#00C49F'];

const CustomerTurnoverReportsPage = () => {
  const router = useRouter();
  const [averageOrderDuration, setAverageOrderDuration] = useState<number | null>(null);
  const [occupancyData, setOccupancyData] = useState([]);
  const [occupancyByTimeData, setOccupancyByTimeData] = useState([]);
  const [occupancyByDayData, setOccupancyByDayData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('Overview');

  useEffect(() => {
    const calculateAverageOrderDuration = async () => {
      const { data: tables, error } = await supabase
        .from('tables')
        .select('occupied_since, order_end_time')
        .not('occupied_since', 'is', null)
        .not('order_end_time', 'is', null);

      if (error) {
        console.error('Error fetching table data:', error);
        return;
      }

      if (tables && tables.length > 0) {
        let totalDuration = 0;
        let count = 0;

        tables.forEach(table => {
          const startTime = new Date(table.occupied_since);
          const endTime = new Date(table.order_end_time);
          const duration = (endTime.getTime() - startTime.getTime()) / 60000; // Duration in minutes
          
          totalDuration += duration;
          count += 1;
        });

        setAverageOrderDuration(totalDuration / count);
      } else {
        setAverageOrderDuration(0); // Set to 0 if no data
      }
    };

    calculateAverageOrderDuration();
  }, []);

  useEffect(() => {
    const fetchOccupancyData = async () => {
      const { data: tables, error } = await supabase
        .from('tables')
        .select('seats, occupied');

      if (error) {
        console.error('Error fetching occupancy data:', error);
        return;
      }

      if (tables && tables.length > 0) {
        const totalSeats = tables.reduce((acc, table) => acc + table.seats, 0);
        const occupiedSeats = tables
          .filter(table => table.occupied)
          .reduce((acc, table) => acc + table.seats, 0);

        setOccupancyData([
          { name: 'Occupied', value: occupiedSeats },
          { name: 'Available', value: totalSeats - occupiedSeats },
        ]);
      }
    };

    fetchOccupancyData();
  }, []);

  useEffect(() => {
    const fetchOccupancyByTimeData = async () => {
      const { data: orders, error } = await supabase
        .from('tables')
        .select('occupied_since, order_end_time');

      if (error) {
        console.error('Error fetching occupancy by time data:', error);
        return;
      }

      // Process the data to create the time of day occupancy graph data
      if (orders && orders.length > 0) {
        const timeData = {};

        orders.forEach(order => {
          const startTime = new Date(order.occupied_since);
          const endTime = new Date(order.order_end_time);
          const startHour = startTime.getHours();
          const endHour = endTime.getHours();

          for (let hour = startHour; hour <= endHour; hour++) {
            const formattedHour = hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`;

            if (!timeData[formattedHour]) {
              timeData[formattedHour] = 0;
            }
            timeData[formattedHour]++;
          }
        });

        setOccupancyByTimeData(
          Object.keys(timeData).map(hour => ({
            time: hour,
            seatsOccupied: timeData[hour],
          }))
        );
      }
    };

    fetchOccupancyByTimeData();
  }, []);

  useEffect(() => {
    const fetchOccupancyByDayData = async () => {
      const { data: orders, error } = await supabase
        .from('tables')
        .select('occupied_since, order_end_time');

      if (error) {
        console.error('Error fetching occupancy by day data:', error);
        return;
      }

      // Initialize data for each day of the week with 0
      const dayData = {
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0,
        Sunday: 0,
      };

      // Process the data to create the day of the week occupancy graph data
      if (orders && orders.length > 0) {
        orders.forEach(order => {
          const startTime = new Date(order.occupied_since);
          const dayOfWeek = startTime.toLocaleDateString('en-US', { weekday: 'long' });

          dayData[dayOfWeek]++;
        });

        setOccupancyByDayData(
          Object.keys(dayData).map(day => ({
            day: day,
            seatsOccupied: dayData[day],
          }))
        );
      }
    };

    fetchOccupancyByDayData();
  }, []);

  const averageOrderData = [
    { name: 'Average Order Size', size: 50 }, // Example hardcoded data
    { name: 'Average Tip Size', size: 10 },   // Example hardcoded data
    { name: 'Average Order Duration', duration: averageOrderDuration || 0 }, // Calculated value
  ];

  return (
    <div className="container mx-auto p-4">
      {/* Back Arrow */}
      <div className="mb-4">
        <button onClick={() => router.back()} className="flex items-center text-gray-700 hover:text-gray-900">
          <FaArrowLeft className="mr-2" />
          Back to Reports
        </button>
      </div>

      <h2 className="text-3xl font-bold mb-4">Customer Duration and Table Turnover Reports</h2>

      {/* Average Order Size and Duration */}
      <div className="bg-white p-4 rounded shadow-lg mb-8">
        <h3 className="text-xl font-semibold mb-4">Average Order Size and Duration</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={averageOrderData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="size" fill="#8884d8" />
            <Bar dataKey="duration" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Restaurant Occupancy */}
      <div className="bg-white p-4 rounded shadow-lg mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Restaurant Occupancy</h3>
          <select
            className="border border-gray-300 rounded px-4 py-2"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="Overview">Overview</option>
            <option value="ByTime">By Time of Day</option>
            <option value="ByDay">By Day of the Week</option>
          </select>
        </div>
        
        <ResponsiveContainer width="100%" height={400}>
          {selectedFilter === 'Overview' ? (
            <PieChart>
              <Pie
                data={occupancyData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label
              >
                {occupancyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          ) : selectedFilter === 'ByTime' ? (
            <BarChart data={occupancyByTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="seatsOccupied" fill="#FF8042" />
            </BarChart>
          ) : (
            <BarChart data={occupancyByDayData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="seatsOccupied" fill="#FF8042" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CustomerTurnoverReportsPage;

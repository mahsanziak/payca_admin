import React, { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { useRouter } from 'next/router';

const StaffManagement = () => {
  const router = useRouter();
  const { restaurantId } = router.query;
  const [staff, setStaff] = useState<any[]>([]);

  useEffect(() => {
    const fetchStaff = async () => {
      if (restaurantId) {
        const { data, error } = await supabase
          .from('staff')
          .select('id, name, role, table_id')
          .eq('restaurant_id', restaurantId);

        if (error) {
          console.error('Error fetching staff:', error.message);
        } else {
          setStaff(data);
        }
      }
    };

    fetchStaff();
  }, [restaurantId]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Staff Management</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Role</th>
            <th className="py-2">Assigned Table</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((staffMember) => (
            <tr key={staffMember.id}>
              <td className="border px-4 py-2">{staffMember.name}</td>
              <td className="border px-4 py-2">{staffMember.role}</td>
              <td className="border px-4 py-2">{staffMember.table_id || 'Not Assigned'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffManagement;

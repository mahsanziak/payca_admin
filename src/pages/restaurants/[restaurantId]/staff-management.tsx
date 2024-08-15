import React, { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { useRouter } from 'next/router';
import { FaEdit, FaTrash, FaSave } from 'react-icons/fa';

const StaffManagement = () => {
  const router = useRouter();
  const { restaurantId } = router.query;
  const [staff, setStaff] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [newStaff, setNewStaff] = useState({
    name: '',
    role: '',
    table_id: '',
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [editingStaff, setEditingStaff] = useState<any>({});

  useEffect(() => {
    const fetchStaff = async () => {
      if (restaurantId) {
        const { data, error } = await supabase
          .from('staff')
          .select('id, name, role, table_id')
          .eq('restaurant_id', restaurantId);

        if (error) {
          console.error('Error fetching staff:', error.message);
        } else if (data) {
          setStaff(data);
        }
      }
    };

    const fetchTables = async () => {
      if (restaurantId) {
        const { data, error } = await supabase
          .from('tables')
          .select('id, table_number')
          .eq('restaurant_id', restaurantId);

        if (error) {
          console.error('Error fetching tables:', error.message);
        } else if (data) {
          setTables(data);
        }
      }
    };

    fetchStaff();
    fetchTables();
  }, [restaurantId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: string) => {
    setEditingStaff({ ...editingStaff, [field]: e.target.value });
  };

  const handleAddStaffChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewStaff({ ...newStaff, [e.target.name]: e.target.value });
  };

  const handleEditStaff = (staffMember: any) => {
    setEditingStaffId(staffMember.id);
    setEditingStaff(staffMember);
  };

  const handleSaveStaff = async (id: string) => {
    const { data, error } = await supabase
      .from('staff')
      .update({
        name: editingStaff.name,
        role: editingStaff.role,
        table_id: editingStaff.table_id,
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating staff:', error.message);
    } else if (data && data.length > 0) {
      setStaff(staff.map((s) => (s.id === id ? data[0] : s)));
      setEditingStaffId(null);
      setEditingStaff({});
    }
  };

  const handleDeleteStaff = async (id: string) => {
    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting staff:', error.message);
    } else {
      setStaff(staff.filter((s) => s.id !== id));
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const { data, error } = await supabase
      .from('staff')
      .insert([
        {
          ...newStaff,
          restaurant_id: restaurantId,
        },
      ]);
  
    if (error) {
      console.error('Error adding staff:', error.message);
    } else if (data) {
      setStaff([...staff, ...data]);
      setSuccessMessage(`${newStaff.name} has been added successfully!`);
      setNewStaff({ name: '', role: '', table_id: '' }); // Reset the form
      setTimeout(() => setSuccessMessage(null), 3000); // Clear message after 3 seconds
    }
  };
  

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Staff Management</h1>

      <form onSubmit={handleAddStaff} className="mb-4 flex items-center space-x-4">
        <div>
          <label className="block mb-2">Name:</label>
          <input
            type="text"
            name="name"
            value={newStaff.name}
            onChange={handleAddStaffChange}
            className="border px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Role:</label>
          <select
            name="role"
            value={newStaff.role}
            onChange={handleAddStaffChange}
            className="border px-4 py-2"
            required
          >
            <option value="">Select a Role</option>
            <option value="waiter">Waiter</option>
            <option value="cashier">Cashier</option>
            <option value="chef">Chef</option>
            <option value="manager">Manager</option>
          </select>
        </div>
        <div>
          <label className="block mb-2">Assigned Table:</label>
          <select
            name="table_id"
            value={newStaff.table_id}
            onChange={handleAddStaffChange}
            className="border px-4 py-2"
          >
            <option value="">Select a Table</option>
            {tables.map((table) => (
              <option key={table.id} value={table.id}>
                Table {table.table_number}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2"
        >
          Add Staff
        </button>
      </form>

      {successMessage && (
        <div className="mb-4 text-green-600">
          {successMessage}
        </div>
      )}

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Role</th>
            <th className="py-2">Assigned Table</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((staffMember) => (
            staffMember && staffMember.id ? (
              <tr key={staffMember.id}>
                <td className="border px-4 py-2">
                  {editingStaffId === staffMember.id ? (
                    <input
                      type="text"
                      value={editingStaff.name}
                      onChange={(e) => handleInputChange(e, 'name')}
                      className="border px-2 py-1"
                    />
                  ) : (
                    staffMember.name
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editingStaffId === staffMember.id ? (
                    <select
                      value={editingStaff.role}
                      onChange={(e) => handleInputChange(e, 'role')}
                      className="border px-2 py-1"
                    >
                      <option value="waiter">Waiter</option>
                      <option value="cashier">Cashier</option>
                      <option value="chef">Chef</option>
                      <option value="manager">Manager</option>
                    </select>
                  ) : (
                    staffMember.role
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editingStaffId === staffMember.id ? (
                    <select
                      value={editingStaff.table_id}
                      onChange={(e) => handleInputChange(e, 'table_id')}
                      className="border px-2 py-1"
                    >
                      <option value="">Select a Table</option>
                      {tables.map((table) => (
                        <option key={table.id} value={table.id}>
                          Table {table.table_number}
                        </option>
                      ))}
                    </select>
                  ) : (
                    staffMember.table_id ? tables.find((table) => table.id === staffMember.table_id)?.table_number : 'Not Assigned'
                  )}
                </td>
                <td className="border px-4 py-2 flex space-x-2">
                  {editingStaffId === staffMember.id ? (
                    <FaSave
                      onClick={() => handleSaveStaff(staffMember.id)}
                      className="text-green-500 cursor-pointer"
                    />
                  ) : (
                    <FaEdit
                      onClick={() => handleEditStaff(staffMember)}
                      className="text-blue-500 cursor-pointer"
                    />
                  )}
                  <FaTrash
                    onClick={() => handleDeleteStaff(staffMember.id)}
                    className="text-red-500 cursor-pointer"
                  />
                </td>
              </tr>
            ) : null // Safeguard rendering if staffMember or id is missing
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffManagement;
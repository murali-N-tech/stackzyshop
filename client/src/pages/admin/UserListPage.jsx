import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const UserListPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State to trigger a refetch after deletion
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/users', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Could not fetch users');
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [userInfo.token, refetch]); // Refetch when 'refetch' state changes

  // --- NEW DELETE HANDLER ---
  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const res = await fetch(`/api/users/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Could not delete user');
        // Trigger a refetch of the user list
        setRefetch(!refetch);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      {loading ? ( <div>Loading...</div> ) : error ? ( <div className="text-red-500">{error}</div> ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            {/* ... (table head is the same) ... */}
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="px-5 py-5 text-sm">{user._id}</td>
                  <td className="px-5 py-5 text-sm">{user.name}</td>
                  <td className="px-5 py-5 text-sm"><a href={`mailto:${user.email}`} className="text-blue-500">{user.email}</a></td>
                  <td className="px-5 py-5 text-sm">
                    {user.isAdmin ? ( <span className="text-green-600 font-bold">✓</span> ) : ( <span className="text-red-600 font-bold">✗</span> )}
                  </td>
                  <td className="px-5 py-5 text-sm">
                    {/* --- ADD DELETE BUTTON --- */}
                    {/* Do not show delete button for the admin user themselves */}
                    {!user.isAdmin && (
                      <button onClick={() => deleteHandler(user._id)} className="text-red-600 hover:text-red-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserListPage;
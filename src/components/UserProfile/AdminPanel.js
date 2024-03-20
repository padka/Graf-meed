import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import './AdminPanel.css';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { token } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError(`Error: ${err.message}`);
        setLoading(false);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token]);

  const handleUserAction = async (userId, action, newRole = null) => {
    let url = `http://localhost:3001e/api/users/${userId}`;
    let options = {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    };

    if (action === 'changeRole') {
      url += `/role`;
      options = {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      };
    }

    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`Failed to ${action} user`);
      action === 'delete' 
        ? setUsers(users.filter(user => user.id !== userId))
        : setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  return (
    <div className="admin-panel">
      <h2>User Management</h2>
      {loading && <p>Loading users...</p>}
      {error && <p className="error">{error}</p>}
      <div className="users-list">
        {users.map(user => (
          <div key={user.id} className="user-item">
            <p>{user.username} ({user.email}) - Role: {user.role}</p>
            <button onClick={() => handleUserAction(user.id, 'delete')}>Delete User</button>
            <button onClick={() => handleUserAction(user.id, 'changeRole', user.role === 'admin' ? 'user' : 'admin')}>
              Change Role to {user.role === 'admin' ? 'User' : 'Admin'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;

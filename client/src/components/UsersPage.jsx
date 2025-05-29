import { useEffect, useState } from 'react';
import axios from 'axios';
import UserInvite from './UserInvite';
import '../styles/UserPage.css';

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [isInviteOpen, setInviteOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedRole, setEditedRole] = useState('');

  // Get current user info from localStorage
  const currentUserRole = localStorage.getItem('userRole');
  const currentUserId = JSON.parse(localStorage.getItem('userInfo'))?.id;

  // Determine if current user can edit/add/delete users
  const canEditUsers = currentUserRole !== 'caregiver' && currentUserRole !== 'family';

  // Function to broadcast permission changes
  const broadcastPermissionChange = () => {
    const event = new CustomEvent('permissionsChanged', {
      detail: { timestamp: Date.now() }
    });
    window.dispatchEvent(event);
  };
  
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/contactusers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      });
      setUsers(res.data);

      // Update current user's permissions in localStorage if they exist in the users list
      const currentUser = res.data.find(user => user._id === currentUserId);
      if (currentUser) {
        localStorage.setItem('isContributor', currentUser.isContributor);
        localStorage.setItem('isViewOnly', currentUser.isViewOnly);
        // Broadcast the permission change
        broadcastPermissionChange();
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/contactusers/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      });
      fetchUsers();
    } catch (err) {
      console.error('Failed to delete user', err);
    }
  };

  const toggleContributor = async (id, isContributor) => {
    const user = users.find(u => u._id === id);

    setUsers(prevUsers =>
      prevUsers.map(user =>
        user._id === id ? { ...user, isContributor } : user
      )
    );

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/contactusers/${id}`,
        {
          isContributor,
          isViewOnly: user?.isViewOnly ?? false,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      );

      // If the updated user is the current user, update their permissions in localStorage
      if (id === currentUserId) {
        localStorage.setItem('isContributor', isContributor);
        // Broadcast the permission change
        broadcastPermissionChange();
      }
    } catch (err) {
      console.error('Failed to update contributor status', err);
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === id ? { ...user, isContributor: !isContributor } : user
        )
      );
    }
  };

  const toggleViewOnly = async (id, isViewOnly) => {
    const user = users.find(u => u._id === id);

    setUsers(prevUsers =>
      prevUsers.map(user =>
        user._id === id ? { ...user, isViewOnly } : user
      )
    );

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/contactusers/${id}`,
        {
          isViewOnly,
          isContributor: user?.isContributor ?? false,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      );

      // If the updated user is the current user, update their permissions in localStorage
      if (id === currentUserId) {
        localStorage.setItem('isViewOnly', isViewOnly);
        // Broadcast the permission change
        broadcastPermissionChange();
      }
    } catch (err) {
      console.error('Failed to update view only status', err);
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === id ? { ...user, isViewOnly: !isViewOnly } : user
        )
      );
    }
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/contactusers/${id}`,
        {
          fullname: editedName,
          email: editedEmail,
          role: editedRole,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      );
      setEditingUserId(null);
      setEditedName('');
      setEditedEmail('');
      setEditedRole('');
      fetchUsers();
    } catch (err) {
      console.error('Failed to update user', err);
    }
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setEditedName('');
    setEditedEmail('');
    setEditedRole('');
  };

  useEffect(() => {
    fetchUsers();
  }, [refreshTrigger]);

  const handleInviteClose = () => {
    setInviteOpen(false);
    // Trigger a refresh when the invite modal closes
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="userPage-container">
      {canEditUsers && (
        <button onClick={() => setInviteOpen(true)} className="add-user-button">
          Add User
        </button>
      )}

      {isInviteOpen && (
        <UserInvite 
          isOpen={isInviteOpen} 
          onClose={handleInviteClose}
          onUserAdded={fetchUsers}
        />
      )}

      <table className="table">
        <thead>
          <tr className="table-header-row">
            <th className="table-header-cell">Full Name</th>
            <th className="table-header-cell">Email</th>
            <th className="table-header-cell">Role</th>
            <th className="table-header-cell">Restriction</th>
            <th className="table-header-cell">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} className="table-row">
              <td className="table-cell">
                {editingUserId === user._id && canEditUsers ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  user.fullname
                )}
              </td>
              <td className="table-cell">
                {editingUserId === user._id && canEditUsers ? (
                  <input
                    type="email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  user.email
                )}
              </td>
              <td className="table-cell">
                {editingUserId === user._id && canEditUsers ? (
                  <input
                    type="text"
                    value={editedRole}
                    onChange={(e) => setEditedRole(e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  user.role
                )}
              </td>
              <td className="table-cell restriction-cell">
                <label htmlFor={`contrib-${user._id}`} className="checkbox-label">
                  <input
                    id={`contrib-${user._id}`}
                    type="checkbox"
                    checked={!!user.isContributor}
                    onChange={e => toggleContributor(user._id, e.target.checked)}
                    className="checkbox-input"
                    disabled={!canEditUsers}
                  />
                  Contributor
                </label>

                <label htmlFor={`viewonly-${user._id}`} className="checkbox-label">
                  <input
                    id={`viewonly-${user._id}`}
                    type="checkbox"
                    checked={!!user.isViewOnly}
                    onChange={e => toggleViewOnly(user._id, e.target.checked)}
                    className="checkbox-input"
                    disabled={!canEditUsers}
                  />
                  View Only
                </label>
              </td>
              <td className="table-cell">
                {editingUserId === user._id && canEditUsers ? (
                  <>
                    <button
                      className="action-button-save"
                      onClick={() => saveEdit(user._id)}
                    >
                      Save
                    </button>
                    <button
                      className="action-button-cancel"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  canEditUsers && (
                    <>
                      <button
                        className="action-button-edit"
                        onClick={() => {
                          setEditingUserId(user._id);
                          setEditedName(user.fullname);
                          setEditedEmail(user.email);
                          setEditedRole(user.role);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="action-button-delete"
                      >
                        Delete
                      </button>
                    </>
                  )
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserPage;

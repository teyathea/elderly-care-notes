import { useEffect, useState } from 'react';
import axios from 'axios';
import UserInvite from './UserInvite';
import '../styles/UserPage.css';

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [isInviteOpen, setInviteOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedRole, setEditedRole] = useState('');

  // Get current user role from localStorage (adjust if your app uses a different method)
  const currentUserRole = localStorage.getItem('userRole');

  // Determine if current user can edit/add/delete users
  const canEditUsers = currentUserRole !== 'caregiver' && currentUserRole !== 'family';

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/contactusers', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/contactusers/${id}`, {
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
        `http://localhost:8000/api/contactusers/${id}`,
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
        `http://localhost:8000/api/contactusers/${id}`,
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
        `http://localhost:8000/api/contactusers/${id}`,
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
  }, []);

  return (
    <div className="userPage-container">
      {canEditUsers && (
        <button onClick={() => setInviteOpen(true)} className="add-user-button">
          Add User
        </button>
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

      <UserInvite isOpen={isInviteOpen} onClose={() => setInviteOpen(false)} />
    </div>
  );
};

export default UserPage;

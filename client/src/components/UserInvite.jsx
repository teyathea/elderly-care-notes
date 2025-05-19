import { useState } from 'react';
import axios from 'axios';

import '../styles/UserInvite.css';

const UserInvite = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({ fullname: '', email: '', role: '' });
    const [message, setMessage] = useState('');

    if (!isOpen) return null;

    const handleChange = e => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('userToken');
            const res = await axios.post('http://localhost:8000/api/contactusers/invite', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(res.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error sending invite');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                <h2 className="title">Add User</h2>
                <form onSubmit={handleSubmit} className="form">
                    <input
                        name="fullname"
                        placeholder="Full Name"
                        value={formData.fullname}
                        onChange={handleChange}
                        required
                        className="input"
                    />
                    <input
                        name="email"
                        placeholder="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="input"
                    />
                    <select
                        name="role"
                        onChange={handleChange}
                        value={formData.role}
                        required
                        className="select"
                    >
                        <option value="" disabled>Select Role</option>
                        <option value="family">Family</option>
                        <option value="caregiver">Caregiver</option>
                    </select>
                    <button type="submit" className="submit-button">
                        Add User
                    </button>
                </form>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};

export default UserInvite;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiEdit3, FiLogOut, FiSave } from 'react-icons/fi';
import { MdHistory, MdCancel, MdLocationOn } from 'react-icons/md';
import authService from '../api/authService';

const EditProfile = () => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        gender: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setFormData({
                name: parsedUser.name || '',
                email: parsedUser.email || '',
                gender: parsedUser.gender || ''
            });
        } else {
            navigate('/loginSignUp');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            // We pass the user's phone number and the form data to the update function
            const response = await authService.updateUserProfile(user.phoneNumber, formData);
            
            // Update localStorage with the fresh user data from the API response
            localStorage.setItem("user", JSON.stringify(response.data));
            
            setMessage("Profile updated successfully!");
            setTimeout(() => navigate("/profile"), 1500);

        } catch (err) {
            setMessage("Failed to update profile. Please try again.");
            console.error("Update profile error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
    }

    const sidebarLinkClass = "flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200";
    const activeSidebarLinkClass = "flex items-center w-full px-4 py-3 text-white bg-black rounded-lg font-semibold";
    const primaryInputClasses = "w-full text-lg text-gray-800 p-3 bg-gray-50 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black";

    return (
        <div className="min-h-screen bg-gray-100 font-['Poppins','sans-serif'] p-4 sm:p-8">
            <div className="max-w-6xl mx-auto md:flex gap-8">
                {/* --- Sidebar --- */}
                <aside className="md:w-1/4 mb-8 md:mb-0">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                         <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                                <p className="text-sm text-gray-500">Editing Profile</p>
                            </div>
                        </div>
                        <nav className="space-y-2">
                            <Link to="/profile" className={sidebarLinkClass}>
                                <FiUser className="mr-3" /> My Profile
                            </Link>
                             <Link to="/profile/addresses" className={sidebarLinkClass}>
                                <MdLocationOn className="mr-3" /> My Addresses
                            </Link>
                            <Link to="/orders" className={sidebarLinkClass}>
                                <MdHistory className="mr-3" /> My Orders
                            </Link>
                            <Link to="/profile/edit" className={activeSidebarLinkClass}>
                                <FiEdit3 className="mr-3" /> Edit Profile
                            </Link>
                            <button onClick={handleLogout} className={`${sidebarLinkClass} text-red-600 hover:bg-red-50 hover:text-red-700`}>
                                <FiLogOut className="mr-3" /> Logout
                            </button>
                        </nav>
                    </div>
                </aside>

                {/* --- Main Content --- */}
                <main className="md:w-3/4">
                    <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
                        <div className="border-b border-gray-200 pb-6 mb-8">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Edit Profile</h1>
                            <p className="text-gray-500 mt-1">Update your personal information below.</p>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="name" className="text-sm font-semibold text-gray-500 mb-2 block">Full Name</label>
                                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={primaryInputClasses} />
                            </div>
                            <div>
                                <label htmlFor="email" className="text-sm font-semibold text-gray-500 mb-2 block">Email Address</label>
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={primaryInputClasses} />
                            </div>
                            <div>
                                <label htmlFor="gender" className="text-sm font-semibold text-gray-500 mb-2 block">Gender</label>
                                <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className={primaryInputClasses}>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-500 mb-2 block">Phone Number</label>
                                <p className="text-lg text-gray-500 p-3 bg-gray-100 rounded-lg">
                                    {user.phoneNumber} (cannot be changed)
                                </p>
                            </div>
                        </div>

                        {message && <p className={`mt-6 text-center font-semibold ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}

                        <div className="flex justify-end items-center gap-4 border-t border-gray-200 pt-6 mt-8">
                            <Link to="/profile" className="text-gray-600 px-5 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2">
                                <MdCancel/> Cancel
                            </Link>
                            <button type="submit" disabled={loading} className="bg-black text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200 flex items-center gap-2 disabled:bg-gray-400">
                                <FiSave/> {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default EditProfile;

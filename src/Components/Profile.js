import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiEdit3, FiLogOut, FiMail, FiPhone, FiInfo } from 'react-icons/fi';
import { MdHistory, MdLocationOn } from 'react-icons/md';

const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/loginSignUp');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        window.location.href = '/';
    };

    if (!user) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
    }

    const sidebarLinkClass = "flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200";
    const activeSidebarLinkClass = "flex items-center w-full px-4 py-3 text-white bg-black rounded-lg font-semibold";

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
                                <p className="text-sm text-gray-500">Welcome back!</p>
                            </div>
                        </div>
                        <nav className="space-y-2">
                            <Link to="/profile" className={activeSidebarLinkClass}>
                                <FiUser className="mr-3" /> My Profile
                            </Link>
                             <Link to="/profile/addresses" className={sidebarLinkClass}>
                                <MdLocationOn className="mr-3" /> My Addresses
                            </Link>
                            <Link to="/orders" className={sidebarLinkClass}>
                                <MdHistory className="mr-3" /> My Orders
                            </Link>
                            <Link to="/profile/edit" className={sidebarLinkClass}>
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
                    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-6 mb-8">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Account Details</h1>
                                <p className="text-gray-500 mt-1">Manage your personal information.</p>
                            </div>
                            <Link to="/profile/edit" className="bg-black text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200 flex items-center gap-2">
                                <FiEdit3 /> Edit
                            </Link>
                        </div>
                        
                        <div className="space-y-6">
                             <div className="grid sm:grid-cols-2 gap-6">
                                <div className="flex flex-col">
                                    <label className="text-sm font-semibold text-gray-500 mb-2">Full Name</label>
                                    <p className="text-lg text-gray-800 p-3 bg-gray-50 rounded-lg">{user.name}</p>
                                </div>
                                 <div className="flex flex-col">
                                    <label className="text-sm font-semibold text-gray-500 mb-2 flex items-center"><FiInfo className="mr-2"/> Gender</label>
                                    <p className="text-lg text-gray-800 p-3 bg-gray-50 rounded-lg">{user.gender || 'Not specified'}</p>
                                </div>
                            </div>
                             <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-500 mb-2 flex items-center"><FiMail className="mr-2"/> Email Address</label>
                                <p className="text-lg text-gray-800 p-3 bg-gray-50 rounded-lg">{user.email}</p>
                            </div>
                             <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-500 mb-2 flex items-center"><FiPhone className="mr-2"/> Phone Number</label>
                                <p className="text-lg text-gray-800 p-3 bg-gray-50 rounded-lg">{user.phoneNumber}</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Profile;

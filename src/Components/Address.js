import React, { useState, useEffect, useCallback } from 'react';
import authService from '../api/authService';
import AddEditAddress from './AddEditAddress'; // The modal component
import { FiPlus, FiMoreVertical } from 'react-icons/fi';

const Addresses = () => {
    const [user, setUser] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addressToEdit, setAddressToEdit] = useState(null);

    // Dropdown menu state
    const [openMenuId, setOpenMenuId] = useState(null);

    // ⭐ UPDATE: Removed userId parameter. Backend now uses JWT Principal.
    const fetchAddresses = useCallback(async () => {
        try {
            const response = await authService.getAddresses();
            setAddresses(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch addresses.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Still verify if a user is technically logged in to trigger fetch
        const token = localStorage.getItem('token');
        const storedUser = JSON.parse(localStorage.getItem('user'));
        
        if (token && storedUser) {
            setUser(storedUser);
            fetchAddresses();
        } else {
            setLoading(false);
            setError('Please login to view your addresses.');
        }
    }, [fetchAddresses]);

    const handleOpenModal = (address = null) => {
        setAddressToEdit(address);
        setIsModalOpen(true);
        setOpenMenuId(null); // Close dropdown when modal opens
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setAddressToEdit(null);
    };

    const handleSaveAddress = () => {
        handleCloseModal();
        fetchAddresses(); // ⭐ UPDATE: No userId needed
    };

    const handleDeleteAddress = async (addressId) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                // ⭐ UPDATE: Removed userId parameter
                await authService.deleteAddress(addressId);
                fetchAddresses(); // Refresh after delete
            } catch (err) {
                setError('Failed to delete address.');
                console.error(err);
            }
        }
        setOpenMenuId(null);
    };

    const toggleMenu = (addressId) => {
        setOpenMenuId(openMenuId === addressId ? null : addressId);
    };

    if (loading) {
        return <div className="text-center p-10">Loading addresses...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-['Poppins','sans-serif']">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Saved Addresses</h1>
                        <p className="text-gray-500 mt-1">Manage your shipping and billing addresses.</p>
                    </div>
                     <button onClick={() => handleOpenModal()} className="bg-black text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200 flex items-center gap-2">
                        <FiPlus />
                    </button>
                </div>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                
                {addresses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {addresses.map((address) => (
                            <div key={address.id} className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="font-bold text-lg text-gray-800">{address.name}</p>
                                            <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{address.addressType}</span>
                                        </div>
                                        <div className="relative">
                                            <button onClick={() => toggleMenu(address.id)} className="p-2 rounded-full hover:bg-gray-100">
                                                <FiMoreVertical />
                                            </button>
                                            {openMenuId === address.id && (
                                                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-xl z-10">
                                                    <button onClick={() => handleOpenModal(address)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</button>
                                                    <button onClick={() => handleDeleteAddress(address.id)} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Delete</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed">
                                        {address.addressLine},<br />
                                        {address.locality},<br />
                                        {address.city}, {address.state} - {address.pinCode}
                                    </p>
                                </div>
                                <p className="text-gray-800 mt-4 pt-4 border-t">
                                    <span className="font-semibold">Mobile:</span> {address.mobileNumber}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center bg-white p-10 rounded-xl shadow-lg">
                        <p className="text-gray-500">You have no saved addresses.</p>
                        <p className="text-gray-500 mt-2">Add a new one to get started!</p>
                    </div>
                )}
            </div>

            {/* Modal for Adding/Editing Address */}
            <AddEditAddress 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveAddress}
                user={user}
                addressToEdit={addressToEdit}
            />
        </div>
    );
};

export default Addresses;

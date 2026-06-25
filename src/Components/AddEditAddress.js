import React, { useState, useEffect } from 'react';
import authService from '../api/authService';
import { FiX } from 'react-icons/fi';

const AddEditAddress = ({ isOpen, onClose, onSave, user, addressToEdit }) => {
    // --- Form state matches the backend AddressDto ---
    const [formData, setFormData] = useState({
        name: '',
        mobileNumber: '',
        pinCode: '',      
        addressLine: '',  
        locality: '',     
        city: '',
        state: '',
        addressType: 'Home' 
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            setErrors({}); 
            if (addressToEdit) {
                // Pre-fill form for editing
                setFormData({
                    name: addressToEdit.name || '',
                    mobileNumber: addressToEdit.mobileNumber || '',
                    pinCode: addressToEdit.pinCode || '',
                    addressLine: addressToEdit.addressLine || '',
                    locality: addressToEdit.locality || '',
                    city: addressToEdit.city || '',
                    state: addressToEdit.state || '',
                    addressType: addressToEdit.addressType || 'Home'
                });
            } else {
                // Reset form for adding a new address
                setFormData({
                    name: '', mobileNumber: '', pinCode: '', addressLine: '', locality: '',
                    city: '', state: '', addressType: 'Home'
                });
            }
        }
    }, [addressToEdit, isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Full name is required.";
        if (!/^\d{10}$/.test(formData.mobileNumber)) newErrors.mobileNumber = "Mobile number must be 10 digits.";
        if (!/^\d{6}$/.test(formData.pinCode)) newErrors.pinCode = "Pincode must be 6 digits.";
        if (!formData.addressLine.trim()) newErrors.addressLine = "Address is required.";
        if (!formData.locality.trim()) newErrors.locality = "Locality/Town is required.";
        if (!formData.city.trim()) newErrors.city = "City is required.";
        if (!formData.state.trim()) newErrors.state = "State is required.";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        
        setLoading(true);
        setErrors({});

        try {
            // ⭐ UPDATE: Removed user.id. Backend identifies user via JWT Principal.
            if (addressToEdit) {
                // Now matching updated signature: updateAddress(addressId, formData)
                await authService.updateAddress(addressToEdit.id, formData);
            } else {
                // Now matching updated signature: addAddress(formData)
                await authService.addAddress(formData);
            }
            onSave();
        } catch (err) {
            setErrors({ api: 'Failed to save address. Please try again.' });
            console.error("Save address error:", err);
        } finally {
            setLoading(false);
        }
    };
    
    if (!isOpen) return null;

    const getInputClass = (fieldName) => 
        `w-full p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-black transition-colors duration-200 ${errors[fieldName] ? 'border-red-500' : 'border-gray-300'}`;

    return (
        <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 font-['Poppins','sans-serif'] animate-fade-in">
            <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[95vh] animate-slide-up">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">
                        {addressToEdit ? 'Edit Shipping Address' : 'Add New Shipping Address'}
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                        <FiX size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-grow contents" noValidate>
                    <div className="p-6 space-y-5 overflow-y-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                               <label className="text-sm font-semibold text-gray-600 mb-1 block">Full Name</label>
                               <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required className={getInputClass('name')} />
                               {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                               <label className="text-sm font-semibold text-gray-600 mb-1 block">Mobile Number</label>
                               <input type="tel" name="mobileNumber" placeholder="10-digit number" value={formData.mobileNumber} onChange={handleChange} required className={getInputClass('mobileNumber')} maxLength="10"/>
                               {errors.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>}
                            </div>
                        </div>

                        <div>
                           <label className="text-sm font-semibold text-gray-600 mb-1 block">Address (House No, Building, Street, Area)</label>
                           <input type="text" name="addressLine" placeholder="e.g. 1-2-3, Sunshine Apartments" value={formData.addressLine} onChange={handleChange} required className={getInputClass('addressLine')} />
                           {errors.addressLine && <p className="text-red-500 text-xs mt-1">{errors.addressLine}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                             <div>
                               <label className="text-sm font-semibold text-gray-600 mb-1 block">Locality / Town</label>
                               <input type="text" name="locality" placeholder="e.g. Banjara Hills" value={formData.locality} onChange={handleChange} required className={getInputClass('locality')} />
                               {errors.locality && <p className="text-red-500 text-xs mt-1">{errors.locality}</p>}
                            </div>
                            <div>
                               <label className="text-sm font-semibold text-gray-600 mb-1 block">Pincode</label>
                               <input type="text" name="pinCode" placeholder="6-digit pincode" value={formData.pinCode} onChange={handleChange} required className={getInputClass('pinCode')} maxLength="6"/>
                               {errors.pinCode && <p className="text-red-500 text-xs mt-1">{errors.pinCode}</p>}
                            </div>
                        </div>
                        
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                               <label className="text-sm font-semibold text-gray-600 mb-1 block">City / District</label>
                               <input type="text" name="city" placeholder="e.g. Hyderabad" value={formData.city} onChange={handleChange} required className={getInputClass('city')} />
                               {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                            </div>
                            <div>
                               <label className="text-sm font-semibold text-gray-600 mb-1 block">State</label>
                               <input type="text" name="state" placeholder="e.g. Telangana" value={formData.state} onChange={handleChange} required className={getInputClass('state')} />
                               {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-600 mb-2 block">Address Type</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer flex-1 justify-center">
                                    <input type="radio" name="addressType" value="Home" checked={formData.addressType === 'Home'} onChange={handleChange} className="accent-black" />
                                    <span>Home</span>
                                </label>
                                <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer flex-1 justify-center">
                                    <input type="radio" name="addressType" value="Work" checked={formData.addressType === 'Work'} onChange={handleChange} className="accent-black" />
                                    <span>Work</span>
                                </label>
                            </div>
                        </div>
                        
                        {errors.api && <p className="text-red-600 text-center text-sm font-medium">{errors.api}</p>}
                    </div>

                    <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                         <button type="submit" disabled={loading} className="w-full bg-black text-white font-bold py-3.5 rounded-lg hover:bg-gray-800 transition-colors duration-300 disabled:bg-gray-400 flex justify-center items-center">
                            {loading ? 'Saving...' : 'SAVE ADDRESS'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEditAddress;
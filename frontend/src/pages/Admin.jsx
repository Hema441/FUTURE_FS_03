import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
    Check, 
    X, 
    Trash2, 
    Search, 
    Calendar, 
    Phone, 
    Mail, 
    DollarSign, 
    Clock, 
    LogOut, 
    ClipboardList,
    AlertCircle,
    Edit
} from 'lucide-react';

const SERVICES = [
    { name: 'Holistic Massage', price: 120 },
    { name: 'Medical Skincare', price: 150 },
    { name: 'Energy Healing', price: 100 },
    { name: 'Deep Aromatherapy', price: 130 },
    { name: 'Acupuncture Session', price: 140 }
];

const TIME_SLOTS = [
    '09:00 AM',
    '10:30 AM',
    '12:00 PM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM'
];

const Admin = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const navigate = useNavigate();

    // Edit modal states
    const [editingBooking, setEditingBooking] = useState(null);
    const [editFormData, setEditFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: '',
        price: 0,
        date: '',
        timeSlot: '',
        message: ''
    });
    const [editBookedSlots, setEditBookedSlots] = useState([]);

    // Fetch all bookings
    const fetchBookings = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/bookings');
            setBookings(res.data);
            setFilteredBookings(res.data);
        } catch (err) {
            console.error("Error fetching bookings", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin');
        if (!isAdmin) {
            navigate('/login');
            return;
        }
        fetchBookings();
    }, [navigate]);

    // Apply filters & search when status or search term changes
    useEffect(() => {
        let result = bookings;

        // Apply Tab Filter
        if (activeTab !== 'all') {
            result = result.filter(b => b.status === activeTab);
        }

        // Apply Search Term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(b => 
                (b.name && b.name.toLowerCase().includes(term)) ||
                (b.email && b.email.toLowerCase().includes(term)) ||
                (b.phone && b.phone.toLowerCase().includes(term)) ||
                (b.service && b.service.toLowerCase().includes(term))
            );
        }

        setFilteredBookings(result);
    }, [bookings, searchTerm, activeTab]);

    // Update status handler
    const handleStatusUpdate = async (id, status) => {
        try {
            const res = await axios.put(`http://localhost:5000/api/bookings/${id}/status`, { status });
            setBookings(prev => prev.map(b => b._id === id ? res.data : b));
        } catch (err) {
            console.error("Error updating booking status", err);
            alert("Failed to update status. Please try again.");
        }
    };

    // Delete handler
    const handleDeleteBooking = async (id) => {
        if (!window.confirm("Are you sure you want to delete this booking request permanently?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/bookings/${id}`);
            setBookings(prev => prev.filter(b => b._id !== id));
        } catch (err) {
            console.error("Error deleting booking", err);
            alert("Failed to delete booking.");
        }
    };

    // Logout handler
    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
        navigate('/login');
    };

    // Fetch booked slots for edit form
    const fetchEditBookedSlots = async (date, currentBookingId = null) => {
        if (!date) return;
        try {
            const res = await axios.get(`http://localhost:5000/api/bookings/booked-slots?date=${date}`);
            // Filter out the slot currently selected by the booking being edited so it remains available
            let slots = res.data;
            if (currentBookingId && editingBooking && editingBooking._id === currentBookingId) {
                const currentFormattedDate = editingBooking.date ? new Date(editingBooking.date).toISOString().split('T')[0] : '';
                if (date === currentFormattedDate) {
                    slots = slots.filter(slot => slot !== editingBooking.timeSlot);
                }
            }
            setEditBookedSlots(slots);
        } catch (err) {
            console.error("Error fetching booked slots for edit", err);
        }
    };

    const handleEditClick = (booking) => {
        const formattedDate = booking.date ? new Date(booking.date).toISOString().split('T')[0] : '';
        setEditingBooking(booking);
        setEditFormData({
            name: booking.name || '',
            email: booking.email || '',
            phone: booking.phone || '',
            service: booking.service || '',
            price: booking.price || 0,
            date: formattedDate,
            timeSlot: booking.timeSlot || '',
            message: booking.message || ''
        });
        setEditBookedSlots([]);
        fetchEditBookedSlots(formattedDate, booking._id);
    };

    const handleEditDateChange = (dateVal) => {
        setEditFormData(prev => ({ ...prev, date: dateVal, timeSlot: '' }));
        fetchEditBookedSlots(dateVal, editingBooking?._id);
    };

    const handleEditServiceChange = (serviceName) => {
        const selected = SERVICES.find(s => s.name === serviceName);
        setEditFormData(prev => ({ 
            ...prev, 
            service: serviceName,
            price: selected ? selected.price : prev.price
        }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`http://localhost:5000/api/bookings/${editingBooking._id}`, editFormData);
            setBookings(prev => prev.map(b => b._id === editingBooking._id ? res.data : b));
            setEditingBooking(null);
        } catch (err) {
            console.error("Error updating booking", err);
            alert("Failed to update booking. Please check details.");
        }
    };

    // Calculate Stats
    const totalCount = bookings.length;
    const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
    const pendingCount = bookings.filter(b => b.status === 'pending').length;
    const cancelledCount = bookings.filter(b => b.status === 'cancelled').length;
    const totalRevenue = bookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + (b.price || 0), 0);

    return (
        <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-4xl font-bold text-[#1b4332] tracking-tight">Admin Dashboard</h1>
                        <p className="text-gray-500 mt-1 text-sm">Manage luxury client requests, update appointment statuses, and track metrics.</p>
                    </div>
                    <button 
                        onClick={handleLogout} 
                        className="flex items-center gap-2 bg-white text-red-600 border border-red-100 hover:bg-red-50 px-5 py-2.5 rounded-full shadow-sm text-xs font-bold uppercase tracking-wider transition-all"
                    >
                        <LogOut size={14} />
                        Logout
                    </button>
                </div>

                {/* Analytical Stats Widgets */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
                        <div className="p-4 rounded-2xl bg-emerald-50 text-[#1b4332]">
                            <ClipboardList size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Total Requests</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">{totalCount}</h3>
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
                        <div className="p-4 rounded-2xl bg-amber-50 text-amber-700">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Pending Care</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">{pendingCount}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
                        <div className="p-4 rounded-2xl bg-blue-50 text-blue-700">
                            <Check size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Confirmed Sessions</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">{confirmedCount}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
                        <div className="p-4 rounded-2xl bg-amber-50 text-[#d4af37]">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Projected Revenue</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">${totalRevenue}</h3>
                        </div>
                    </div>
                </div>

                {/* Search & Filter Controls Card */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    {/* Tabs */}
                    <div className="flex flex-wrap gap-2">
                        {[
                            { id: 'all', label: 'All Requests', count: totalCount },
                            { id: 'pending', label: 'Pending', count: pendingCount },
                            { id: 'confirmed', label: 'Confirmed', count: confirmedCount },
                            { id: 'cancelled', label: 'Cancelled', count: cancelledCount }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                                    activeTab === tab.id 
                                        ? 'bg-[#1b4332] text-white shadow-md' 
                                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                }`}
                            >
                                {tab.label}
                                <span className={`px-2 py-0.5 rounded-full text-[9px] ${
                                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                                }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:max-w-xs">
                        <input
                            type="text"
                            placeholder="Search client, email, service..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-full bg-gray-50 border border-gray-100 outline-none focus:border-[#d4af37] focus:bg-white text-xs text-gray-800 transition-all"
                        />
                        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                {/* Bookings List */}
                {loading ? (
                    <div className="text-center py-20 text-gray-500 font-medium">Loading appointments dashboard...</div>
                ) : (
                    <div className="grid gap-6">
                        {filteredBookings.map((booking) => (
                            <div 
                                key={booking._id} 
                                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
                            >
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-4 flex-wrap">
                                        <h3 className="text-xl font-bold text-[#1b4332] tracking-tight">{booking.name}</h3>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                            booking.status === 'confirmed' 
                                                ? 'bg-green-50 text-green-700 border-green-200' 
                                                : booking.status === 'cancelled'
                                                ? 'bg-red-50 text-red-700 border-red-200'
                                                : 'bg-amber-50 text-amber-700 border-amber-200'
                                        }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs text-gray-600">
                                        <div className="flex items-center gap-2.5">
                                            <Mail size={14} className="text-[#d4af37]" />
                                            <span>{booking.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <Phone size={14} className="text-[#d4af37]" />
                                            <span>{booking.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <Calendar size={14} className="text-[#d4af37]" />
                                            <span>{new Date(booking.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <Clock size={14} className="text-[#d4af37]" />
                                            <span>Preferred Time Slot: <strong className="text-gray-800">{booking.timeSlot || '10:00 AM'}</strong></span>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 items-center flex-wrap pt-2">
                                        <span className="bg-[#fdfaf5] text-[#d4af37] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#f5ead6]">
                                            {booking.service}
                                        </span>
                                        <span className="bg-gray-50 text-gray-600 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-gray-100 flex items-center gap-1">
                                            <DollarSign size={10} />
                                            Session Fee: ${booking.price || 0}
                                        </span>
                                    </div>

                                    {booking.message && (
                                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs text-gray-600 max-w-2xl mt-2">
                                            <span className="font-bold text-gray-700 block text-[10px] uppercase tracking-wider mb-1">Special Requests:</span>
                                            "{booking.message}"
                                        </div>
                                    )}
                                </div>

                                {/* Actions Control */}
                                <div className="flex items-center gap-3 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-4 lg:pt-0">
                                    {booking.status === 'pending' && (
                                        <>
                                            <button 
                                                onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                                                className="flex-1 lg:flex-initial flex items-center justify-center gap-2 bg-[#1b4332] text-white hover:bg-emerald-800 px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-wider shadow-sm transition-all"
                                            >
                                                <Check size={12} />
                                                Confirm
                                            </button>
                                            <button 
                                                onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                                                className="flex-1 lg:flex-initial flex items-center justify-center gap-2 bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all"
                                            >
                                                <X size={12} />
                                                Cancel
                                            </button>
                                        </>
                                    )}

                                    {booking.status === 'confirmed' && (
                                        <button 
                                            onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                                            className="flex-1 lg:flex-initial flex items-center justify-center gap-2 bg-white text-red-600 border border-red-100 hover:bg-red-50 px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all"
                                        >
                                            <X size={12} />
                                            Cancel Session
                                        </button>
                                    )}

                                    {booking.status === 'cancelled' && (
                                        <button 
                                            onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                                            className="flex-1 lg:flex-initial flex items-center justify-center gap-2 bg-white text-green-700 border border-green-100 hover:bg-green-50 px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all"
                                        >
                                            <Check size={12} />
                                            Re-Confirm
                                        </button>
                                    )}

                                    <button 
                                        onClick={() => handleEditClick(booking)}
                                        className="p-3 bg-amber-50 text-[#d4af37] hover:bg-amber-100 hover:text-[#b3922e] rounded-xl transition-all"
                                        title="Edit and Reschedule Booking"
                                    >
                                        <Edit size={14} />
                                    </button>

                                    <button 
                                        onClick={() => handleDeleteBooking(booking._id)}
                                        className="p-3 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-xl transition-all"
                                        title="Delete booking permanently"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {filteredBookings.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400 flex flex-col items-center justify-center p-8">
                                <AlertCircle size={48} className="text-gray-300 mb-4" />
                                <h3 className="text-sm font-bold text-gray-700 mb-1">No bookings match criteria</h3>
                                <p className="text-xs max-w-sm">No client booking records could be found that match your search or filter selection.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Edit Booking Modal */}
            {editingBooking && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 bg-[#1b4332] text-white flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold font-serif">Reschedule & Edit Booking</h3>
                                <p className="text-emerald-200 text-[10px] uppercase tracking-widest font-bold mt-1">Client: {editingBooking.name}</p>
                            </div>
                            <button 
                                onClick={() => setEditingBooking(null)}
                                className="text-white/85 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleEditSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37] mb-1">Client Name</label>
                                    <input 
                                        type="text" required
                                        value={editFormData.name}
                                        onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#d4af37] text-xs text-gray-800"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37] mb-1">Phone Number</label>
                                    <input 
                                        type="tel" required
                                        value={editFormData.phone}
                                        onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                                        className="p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#d4af37] text-xs text-gray-800"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37] mb-1">Email Address</label>
                                <input 
                                    type="email" required
                                    value={editFormData.email}
                                    onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className="p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#d4af37] text-xs text-gray-800"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37] mb-1">Service Care</label>
                                    <select 
                                        value={editFormData.service}
                                        onChange={(e) => handleEditServiceChange(e.target.value)}
                                        className="p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#d4af37] text-xs text-gray-800 cursor-pointer"
                                    >
                                        {SERVICES.map((s, idx) => (
                                            <option key={idx} value={s.name}>{s.name} (${s.price})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37] mb-1">Session Price ($)</label>
                                    <input 
                                        type="number" required min="0"
                                        value={editFormData.price}
                                        onChange={(e) => setEditFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                                        className="p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#d4af37] text-xs text-gray-800"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37] mb-1">Appointment Date</label>
                                    <input 
                                        type="date" required
                                        min={new Date().toISOString().split('T')[0]}
                                        value={editFormData.date}
                                        onChange={(e) => handleEditDateChange(e.target.value)}
                                        className="p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#d4af37] text-xs text-gray-800"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37] mb-1">Time Slot</label>
                                    <select 
                                        required
                                        value={editFormData.timeSlot}
                                        onChange={(e) => setEditFormData(prev => ({ ...prev, timeSlot: e.target.value }))}
                                        className="p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#d4af37] text-xs text-gray-800 cursor-pointer"
                                    >
                                        <option value="" disabled>-- Select Timeslot --</option>
                                        {TIME_SLOTS.map((t, idx) => {
                                            const isBooked = editBookedSlots.includes(t);
                                            return (
                                                <option key={idx} value={t} disabled={isBooked}>
                                                    {t} {isBooked ? '— (Booked)' : ''}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37] mb-1">Special Requests</label>
                                <textarea 
                                    rows="2"
                                    value={editFormData.message}
                                    onChange={(e) => setEditFormData(prev => ({ ...prev, message: e.target.value }))}
                                    className="p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#d4af37] text-xs text-gray-800"
                                ></textarea>
                            </div>

                            <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                                <button 
                                    type="button"
                                    onClick={() => setEditingBooking(null)}
                                    className="px-6 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-500 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-6 py-2.5 rounded-xl bg-[#1b4332] hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider transition-all"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;

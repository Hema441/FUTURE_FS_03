import React, { useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, DollarSign, Search, User, AlertCircle, ShieldAlert, Edit, XCircle, Printer } from 'lucide-react';

const TIME_SLOTS = [
    '09:00 AM',
    '10:30 AM',
    '12:00 PM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM'
];

const MyBookings = () => {
    const [query, setQuery] = useState('');
    const [bookings, setBookings] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Rescheduling state variables
    const [reschedulingId, setReschedulingId] = useState(null);
    const [rescheduleData, setRescheduleData] = useState({ date: '', timeSlot: '' });
    const [rescheduleBookedSlots, setRescheduleBookedSlots] = useState([]);
    const [rescheduleStatus, setRescheduleStatus] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError('');
        setHasSearched(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/bookings/search?query=${encodeURIComponent(query.trim())}`);
            setBookings(res.data);
        } catch (err) {
            console.error("Search error", err);
            setError("Failed to fetch bookings. Please try again.");
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchRescheduleBookedSlots = async (date) => {
        if (!date) return;
        try {
            const res = await axios.get(`http://localhost:5000/api/bookings/booked-slots?date=${date}`);
            setRescheduleBookedSlots(res.data);
        } catch (err) {
            console.error("Error fetching booked slots for reschedule", err);
        }
    };

    const handleRescheduleClick = (booking) => {
        const formattedDate = booking.date ? new Date(booking.date).toISOString().split('T')[0] : '';
        setReschedulingId(booking._id);
        setRescheduleData({
            date: formattedDate,
            timeSlot: booking.timeSlot
        });
        setRescheduleBookedSlots([]);
        setRescheduleStatus('');
        fetchRescheduleBookedSlots(formattedDate);
    };

    const handleRescheduleDateChange = (e) => {
        const newDate = e.target.value;
        setRescheduleData(prev => ({ ...prev, date: newDate, timeSlot: '' }));
        fetchRescheduleBookedSlots(newDate);
    };

    const handleRescheduleSubmit = async (e, bookingId) => {
        e.preventDefault();
        if (!rescheduleData.date || !rescheduleData.timeSlot) {
            setRescheduleStatus('Please select a valid date and timeslot.');
            return;
        }
        setRescheduleStatus('Updating appointment...');
        try {
            const res = await axios.put(`http://localhost:5000/api/bookings/${bookingId}`, {
                date: rescheduleData.date,
                timeSlot: rescheduleData.timeSlot
            });
            setBookings(prev => prev.map(b => b._id === bookingId ? res.data : b));
            setReschedulingId(null);
            setRescheduleStatus('');
        } catch (err) {
            console.error("Error rescheduling booking", err);
            setRescheduleStatus('Failed to reschedule. Please try again.');
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this appointment request?")) return;
        try {
            const res = await axios.put(`http://localhost:5000/api/bookings/${bookingId}/status`, { status: 'cancelled' });
            setBookings(prev => prev.map(b => b._id === bookingId ? res.data : b));
        } catch (err) {
            console.error("Error cancelling booking", err);
            alert("Failed to cancel booking. Please try again.");
        }
    };

    const handlePrintReceipt = (booking) => {
        const printWindow = window.open('', '_blank');
        const formattedDate = new Date(booking.date).toLocaleDateString(undefined, { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        });
        
        printWindow.document.write(`
            <html>
                <head>
                    <title>Aura Wellness Booking Receipt - ${booking.name}</title>
                    <style>
                        body { font-family: 'Montserrat', sans-serif; color: #333; padding: 40px; background: #fff; }
                        .receipt-card { max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; padding: 30px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
                        .header { text-align: center; border-bottom: 2px solid #1b4332; padding-bottom: 20px; margin-bottom: 30px; }
                        .logo { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: bold; color: #1b4332; }
                        .subtitle { font-size: 10px; color: #d4af37; text-transform: uppercase; letter-spacing: 2px; margin-top: 5px; font-weight: bold; }
                        .title { font-size: 20px; font-weight: bold; margin-bottom: 25px; text-align: center; color: #1b4332; font-family: 'Playfair Display', serif; }
                        .row { display: flex; justify-content: space-between; border-bottom: 1px solid #f9f9f9; padding: 12px 0; font-size: 13px; }
                        .label { font-weight: bold; color: #666; }
                        .value { color: #111; text-align: right; }
                        .status { font-weight: bold; text-transform: uppercase; color: ${booking.status === 'confirmed' ? '#2e7d32' : booking.status === 'cancelled' ? '#c62828' : '#ef6c00'}; }
                        .total-section { background-color: #fdfaf5; padding: 15px; border-radius: 12px; margin-top: 25px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #f5ead6; }
                        .total-label { font-weight: bold; color: #1b4332; font-size: 14px; }
                        .total-value { font-size: 22px; font-weight: 900; color: #1b4332; }
                        .footer-text { text-align: center; font-size: 11px; color: #999; margin-top: 40px; line-height: 1.6; }
                        @media print {
                            body { padding: 0; }
                            .receipt-card { box-shadow: none; border: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="receipt-card">
                        <div class="header">
                            <div class="logo">Aura Wellness</div>
                            <div class="subtitle">Premium Holistic Sanctuary</div>
                        </div>
                        <div class="title">Booking Confirmation Receipt</div>
                        
                        <div class="row">
                            <span class="label">Reference ID:</span>
                            <span class="value">${booking._id}</span>
                        </div>
                        <div class="row">
                            <span class="label">Client Name:</span>
                            <span class="value">${booking.name}</span>
                        </div>
                        <div class="row">
                            <span class="label">Email Address:</span>
                            <span class="value">${booking.email}</span>
                        </div>
                        <div class="row">
                            <span class="label">Phone Number:</span>
                            <span class="value">${booking.phone}</span>
                        </div>
                        <div class="row">
                            <span class="label">Selected Service:</span>
                            <span class="value">${booking.service}</span>
                        </div>
                        <div class="row">
                            <span class="label">Appointment Date:</span>
                            <span class="value">${formattedDate}</span>
                        </div>
                        <div class="row">
                            <span class="label">Preferred Timeslot:</span>
                            <span class="value">${booking.timeSlot}</span>
                        </div>
                        <div class="row">
                            <span class="label">Booking Status:</span>
                            <span class="value status">${booking.status}</span>
                        </div>
                        
                        <div class="total-section">
                            <span class="total-label">Total Amount:</span>
                            <span class="total-value">$${booking.price || 0}</span>
                        </div>
                        
                        <div class="footer-text">
                            Thank you for booking with Aura Wellness Pro.<br>
                            Please save this confirmation receipt for your records.<br>
                            123 Wellness Blvd, Sanctuary City, SC 45678 | hello@aurawellness.com | +1 (234) 567-890
                        </div>
                    </div>
                    <script>
                        window.onload = function() {
                            window.print();
                        }
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <div className="pt-32 pb-20 bg-[#fdfaf5] min-h-screen">
            <div className="max-w-4xl mx-auto px-6">
                
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] bg-[#d4af37]/10 px-4 py-1.5 rounded-full inline-block mb-3">Client Portal</span>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#1b4332] tracking-tight mb-4">My Wellness Portal</h1>
                    <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
                        Access your active appointments, track care history, and view professional session details securely using your credentials.
                    </p>
                </div>

                {/* Lookup Card */}
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 mb-10 max-w-2xl mx-auto">
                    <form onSubmit={handleSearch} className="space-y-6">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-[#d4af37] block mb-2">Search Email or Phone Number</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. eleanor@example.com or +1 (555) 0199"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:border-[#d4af37] focus:bg-white text-sm text-gray-800 transition-all shadow-inner"
                                />
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-[#1b4332] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#d4af37] hover:shadow-lg transition-all transform active:scale-95 duration-200 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Retrieving Records...' : 'Retrieve Appointments'}
                        </button>
                    </form>
                </div>

                {/* Results section */}
                {loading && (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1b4332] mx-auto mb-4"></div>
                        <p className="text-sm text-gray-500 font-medium italic">Scanning secure databases...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 text-red-700 border border-red-100 p-6 rounded-2xl text-center max-w-xl mx-auto text-sm font-semibold flex items-center justify-center gap-2">
                        <ShieldAlert size={18} />
                        {error}
                    </div>
                )}

                {!loading && !error && hasSearched && (
                    <div className="space-y-6 max-w-2xl mx-auto">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-6">
                            <h2 className="text-lg font-bold text-[#1b4332]">Appointment Records ({bookings.length})</h2>
                            <span className="text-xs text-gray-400 italic">Sorted by most recent</span>
                        </div>

                        {bookings.map((booking) => (
                            <div 
                                key={booking._id} 
                                className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                            >
                                {reschedulingId === booking._id ? (
                                    <form onSubmit={(e) => handleRescheduleSubmit(e, booking._id)} className="w-full bg-[#fdfaf5] p-6 rounded-3xl border border-[#f5ead6] space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-sm font-bold text-[#1b4332] uppercase tracking-wider">Reschedule Appointment</h4>
                                            <span className="text-[10px] bg-[#d4af37]/10 text-[#d4af37] px-2 py-0.5 rounded-full font-bold">{booking.service}</span>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex flex-col">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37] mb-1">New Date</label>
                                                <input 
                                                    type="date" required 
                                                    min={new Date().toISOString().split('T')[0]}
                                                    value={rescheduleData.date}
                                                    onChange={handleRescheduleDateChange}
                                                    className="p-3 rounded-xl bg-white border border-gray-200 outline-none focus:border-[#d4af37] text-xs text-gray-800"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37] mb-1">New Time Slot</label>
                                                <select 
                                                    required
                                                    value={rescheduleData.timeSlot}
                                                    onChange={(e) => setRescheduleData(prev => ({ ...prev, timeSlot: e.target.value }))}
                                                    className="p-3 rounded-xl bg-white border border-gray-200 outline-none focus:border-[#d4af37] text-xs text-gray-800 cursor-pointer"
                                                >
                                                    <option value="" disabled>-- Select Timeslot --</option>
                                                    {TIME_SLOTS.map((t, idx) => {
                                                        const isBooked = rescheduleBookedSlots.includes(t);
                                                        return (
                                                            <option key={idx} value={t} disabled={isBooked}>
                                                                {t} {isBooked ? '— (Booked)' : ''}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            </div>
                                        </div>

                                        {rescheduleStatus && (
                                            <p className="text-[11px] font-semibold text-amber-700">{rescheduleStatus}</p>
                                        )}

                                        <div className="flex gap-2 justify-end">
                                            <button 
                                                type="button" 
                                                onClick={() => setReschedulingId(null)}
                                                className="bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all"
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                type="submit"
                                                className="bg-[#1b4332] text-white hover:bg-emerald-800 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <div className="space-y-3 flex-1">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <span className="bg-[#fdfaf5] text-[#d4af37] px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#f5ead6]">
                                                    {booking.service}
                                                </span>
                                                <span className={`px-3 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                                                    booking.status === 'confirmed' 
                                                        ? 'bg-green-50 text-green-700 border-green-200' 
                                                        : booking.status === 'cancelled'
                                                        ? 'bg-red-50 text-red-700 border-red-200'
                                                        : 'bg-amber-50 text-amber-700 border-amber-200'
                                                }`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                            
                                            <h3 className="text-lg font-bold text-gray-800 tracking-tight flex items-center gap-2">
                                                <User size={14} className="text-gray-400" />
                                                {booking.name}
                                            </h3>

                                            <div className="space-y-1.5 text-xs text-gray-600">
                                                <p className="flex items-center gap-2">
                                                    <Calendar size={13} className="text-[#d4af37]" />
                                                    <span>Date: <strong>{new Date(booking.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong></span>
                                                </p>
                                                <p className="flex items-center gap-2">
                                                    <Clock size={13} className="text-[#d4af37]" />
                                                    <span>Preferred Slot: <strong>{booking.timeSlot || '10:00 AM'}</strong></span>
                                                </p>
                                                <p className="flex items-center gap-2">
                                                    <DollarSign size={13} className="text-[#d4af37]" />
                                                    <span>Session Fee: <strong>${booking.price || 0}</strong></span>
                                                </p>
                                            </div>

                                            {booking.message && (
                                                <p className="text-xs text-gray-400 italic bg-gray-50 p-3 rounded-xl border border-gray-100 mt-2">
                                                    "{booking.message}"
                                                </p>
                                            )}
                                        </div>

                                        <div className="w-full md:w-auto flex flex-col items-stretch md:items-end gap-4">
                                            <div className="bg-[#fdfaf5] p-4 rounded-2xl border border-gray-100 text-center md:text-right">
                                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Estimated Cost</p>
                                                <p className="text-2xl font-black text-[#1b4332] mt-0.5">${booking.price || 0}</p>
                                            </div>
                                            
                                            {booking.status !== 'cancelled' && (
                                                <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                                                    <button 
                                                        onClick={() => handlePrintReceipt(booking)}
                                                        className="flex items-center justify-center gap-1.5 bg-gray-50 text-[#1b4332] hover:bg-[#1b4332] hover:text-white border border-gray-200 px-3.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all"
                                                        title="Print Receipt"
                                                    >
                                                        <Printer size={12} />
                                                        Receipt
                                                    </button>
                                                    <button 
                                                        onClick={() => handleRescheduleClick(booking)}
                                                        className="flex items-center justify-center gap-1.5 bg-gray-50 text-[#d4af37] hover:bg-[#d4af37] hover:text-white border border-gray-200 px-3.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all"
                                                        title="Reschedule Session"
                                                    >
                                                        <Edit size={12} />
                                                        Reschedule
                                                    </button>
                                                    <button 
                                                        onClick={() => handleCancelBooking(booking._id)}
                                                        className="flex items-center justify-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-100 px-3.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all"
                                                        title="Cancel Booking"
                                                    >
                                                        <XCircle size={12} />
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}

                        {bookings.length === 0 && (
                            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400 flex flex-col items-center justify-center p-8">
                                <AlertCircle size={40} className="text-gray-300 mb-3" />
                                <h3 className="text-sm font-bold text-gray-700 mb-1">No appointment history found</h3>
                                <p className="text-xs max-w-xs leading-relaxed">
                                    We couldn't locate any records associated with <strong className="text-gray-600">"{query}"</strong>. Double-check your contact number or email format.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;

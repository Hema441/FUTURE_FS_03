import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SERVICES = [
    { name: 'Holistic Massage', price: 120, icon: '✨' },
    { name: 'Medical Skincare', price: 150, icon: '🌿' },
    { name: 'Energy Healing', price: 100, icon: '🧘' },
    { name: 'Deep Aromatherapy', price: 130, icon: '🌸' },
    { name: 'Acupuncture Session', price: 140, icon: '☯' }
];

const TIME_SLOTS = [
    '09:00 AM',
    '10:30 AM',
    '12:00 PM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM'
];

const BookingForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: SERVICES[0].name,
        price: SERVICES[0].price,
        date: '',
        timeSlot: TIME_SLOTS[0],
        message: ''
    });
    const [bookedSlots, setBookedSlots] = useState([]);
    const [status, setStatus] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    // Fetch booked slots when date changes
    useEffect(() => {
        if (!formData.date) return;
        
        const fetchBookedSlots = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/bookings/booked-slots?date=${formData.date}`);
                setBookedSlots(res.data);
                
                // If current selected timeslot is already booked, reset/reassign it to the first available slot
                if (res.data.includes(formData.timeSlot)) {
                    const available = TIME_SLOTS.find(t => !res.data.includes(t));
                    setFormData(prev => ({
                        ...prev,
                        timeSlot: available || ''
                    }));
                }
            } catch (err) {
                console.error("Error fetching booked slots", err);
            }
        };

        fetchBookedSlots();
    }, [formData.date]);

    const handleServiceChange = (e) => {
        const selected = SERVICES.find(s => s.name === e.target.value);
        setFormData({
            ...formData,
            service: selected.name,
            price: selected.price
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.timeSlot) {
            setStatus('Please select an available timeslot.');
            setIsSuccess(false);
            return;
        }
        setStatus('Processing secure booking...');
        setIsSuccess(false);
        try {
            await axios.post('http://localhost:5000/api/bookings', formData);
            setIsSuccess(true);
            setStatus('Success! Your appointment is requested. We will contact you shortly.');
            setFormData({
                name: '',
                email: '',
                phone: '',
                service: SERVICES[0].name,
                price: SERVICES[0].price,
                date: '',
                timeSlot: TIME_SLOTS[0],
                message: ''
            });
            setBookedSlots([]);
        } catch (err) {
            setIsSuccess(false);
            setStatus('Unable to process booking. Please check details and try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-2xl font-bold text-[#1b4332] mb-1 tracking-tight">Request an Appointment</h3>
            <p className="text-gray-500 text-xs mb-6">Select from our signature care services. Rates are exclusive and customized.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37] mb-1">Full Name</label>
                    <input 
                        type="text" placeholder="e.g. Eleanor Vance" required 
                        className="p-4 rounded-xl bg-white border border-gray-200 outline-none focus:border-[#d4af37] transition-all text-sm text-gray-800"
                        value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37] mb-1">Email Address</label>
                    <input 
                        type="email" placeholder="e.g. eleanor@example.com" required 
                        className="p-4 rounded-xl bg-white border border-gray-200 outline-none focus:border-[#d4af37] transition-all text-sm text-gray-800"
                        value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37] mb-1">Phone Number</label>
                    <input 
                        type="tel" placeholder="e.g. +1 (555) 0199" required 
                        className="p-4 rounded-xl bg-white border border-gray-200 outline-none focus:border-[#d4af37] transition-all text-sm text-gray-800"
                        value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37] mb-1">Select Service</label>
                    <select 
                        className="p-4 rounded-xl bg-white border border-gray-200 outline-none focus:border-[#d4af37] transition-all text-sm text-gray-800 cursor-pointer"
                        value={formData.service} onChange={handleServiceChange}
                    >
                        {SERVICES.map((s, idx) => (
                            <option key={idx} value={s.name}>
                                {s.icon} {s.name} (${s.price})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37] mb-1">Preferred Date</label>
                    <input 
                        type="date" required 
                        min={new Date().toISOString().split('T')[0]}
                        className="p-4 rounded-xl bg-white border border-gray-200 outline-none focus:border-[#d4af37] transition-all text-sm text-gray-800"
                        value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37] mb-1">Select Time Slot</label>
                    <select 
                        className="p-4 rounded-xl bg-white border border-gray-200 outline-none focus:border-[#d4af37] transition-all text-sm text-gray-800 cursor-pointer"
                        value={formData.timeSlot} onChange={(e) => setFormData({...formData, timeSlot: e.target.value})}
                        disabled={!formData.date}
                    >
                        {!formData.date ? (
                            <option value="">Please select a date first</option>
                        ) : (
                            <>
                                {TIME_SLOTS.map((t, idx) => {
                                    const isBooked = bookedSlots.includes(t);
                                    return (
                                        <option key={idx} value={t} disabled={isBooked}>
                                            {t} {isBooked ? '— (Unavailable / Booked)' : ''}
                                        </option>
                                    );
                                })}
                            </>
                        )}
                    </select>
                </div>
            </div>

            <div className="flex flex-col">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37] mb-1">Special Requests (Optional)</label>
                <textarea 
                    placeholder="Let us know about allergies, special preferences, or physical conditions..." rows="3" 
                    className="w-full p-4 rounded-xl bg-white border border-gray-200 outline-none focus:border-[#d4af37] transition-all text-sm text-gray-800"
                    value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
            </div>
            
            <button type="submit" className="w-full bg-[#1b4332] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#d4af37] hover:shadow-lg transition-all transform active:scale-95 duration-200">
                Confirm Booking Request (${formData.price})
            </button>

            {status && (
                <div className={`p-4 rounded-xl text-center text-xs font-semibold ${isSuccess ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                    {status}
                </div>
            )}
        </form>
    );
};

export default BookingForm;

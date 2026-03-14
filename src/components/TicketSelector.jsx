import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Info, Sofa, Bus, Hotel, TrainFront } from 'lucide-react';

const TicketSelector = ({ product, isOpen, onClose, onConfirm }) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [metroFrom, setMetroFrom] = useState('');
    const [metroTo, setMetroTo] = useState('');
    const category = product?.category?.toLowerCase() || '';

    const metroStations = [
        'Miyapur', 'JNTU College', 'KPHB Colony', 'Kukatpally', 'Balanagar', 
        'Moosapet', 'Bharat Nagar', 'Erragadda', 'ESI Hospital', 'SR Nagar', 
        'Ameerpet', 'Punjagutta', 'Irrum Manzil', 'Khairatabad', 'Lakdikapul', 
        'Assembly', 'Nampally', 'Gandhi Bhavan', 'OMC', 'MGBS', 'Malakpet', 
        'New Market', 'Musarambagh', 'Dilsukhnagar', 'Chaitanyapuri', 'Victoria Memorial', 'LB Nagar'
    ];

    // Generate Mock Seating/Room Data based on category
    const generateLayout = () => {
        if (category === 'movies') {
            const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
            const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            return rows.flatMap(r => cols.map(c => ({ id: `${r}${c}`, label: `${r}${c}`, available: Math.random() > 0.3 })));
        } else if (category === 'bus') {
            const rows = 10;
            const seats = [];
            for (let i = 1; i <= rows; i++) {
                seats.push({ id: `L${i}A`, label: `${i}A`, available: Math.random() > 0.2, side: 'left' });
                seats.push({ id: `L${i}B`, label: `${i}B`, available: Math.random() > 0.2, side: 'left' });
                seats.push({ id: `R${i}A`, label: `${i}C`, available: Math.random() > 0.2, side: 'right' });
                seats.push({ id: `R${i}B`, label: `${i}D`, available: Math.random() > 0.2, side: 'right' });
            }
            return seats;
        } else if (category === 'hotels') {
            const floors = [1, 2, 3];
            const roomsPerFloor = 6;
            return floors.flatMap(f => Array.from({ length: roomsPerFloor }, (_, i) => ({
                id: `${f}0${i + 1}`,
                label: `Room ${f}0${i + 1}`,
                available: Math.random() > 0.4,
                type: i % 3 === 0 ? 'Suite' : (i % 3 === 1 ? 'Deluxe' : 'Standard')
            })));
        }
        return [];
    };

    const [items, setItems] = useState([]);

    useEffect(() => {
        if (isOpen) {
            if (category !== 'metro') {
                setItems(generateLayout());
                setSelectedItems([]);
            } else {
                setMetroFrom('');
                setMetroTo('');
                setSelectedItems([]);
            }
        }
    }, [isOpen, category]);

    const toggleSelection = (id) => {
        const item = items.find(i => i.id === id);
        if (!item || !item.available) return;

        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(i => i !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const handleConfirm = () => {
        if (category === 'metro') {
            if (!metroFrom || !metroTo) {
                alert('Please select both From and To stations');
                return;
            }
            if (metroFrom === metroTo) {
                alert('From and To stations cannot be the same');
                return;
            }
            onConfirm([`${metroFrom} to ${metroTo}`]);
            return;
        }
        if (selectedItems.length === 0) {
            alert('Please select at least one item');
            return;
        }
        onConfirm(selectedItems);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                />
                
                <motion.div 
                    initial={{ scale: 0.9, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 20, opacity: 0 }}
                    className="relative bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="p-6 border-b flex justify-between items-center bg-gray-50/80">
                        <div className="flex items-center gap-4">
                            <div className="bg-purple-600 text-white p-3 rounded-2xl shadow-lg shadow-purple-200">
                                {category === 'movies' && <Sofa size={24} />}
                                {category === 'bus' && <Bus size={24} />}
                                {category === 'hotels' && <Hotel size={24} />}
                                {category === 'metro' && <TrainFront size={24} />}
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-900 leading-tight">
                                    {category === 'metro' ? 'Plan Your Journey' : `Pick Your ${category === 'hotels' ? 'Rooms' : 'Seats'}`}
                                </h2>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{product.productName}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition text-gray-400">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                        {category === 'movies' && (
                            <div className="flex flex-col items-center">
                                <div className="w-full h-2 bg-gray-200 rounded-full mb-12 relative shadow-inner">
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">Cinema Screen</div>
                                </div>
                                <div className="grid grid-cols-10 gap-3">
                                    {items.map(item => (
                                        <button
                                            key={item.id}
                                            disabled={!item.available}
                                            onClick={() => toggleSelection(item.id)}
                                            className={`
                                                w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-[10px] font-bold transition-all duration-300
                                                ${item.available 
                                                    ? (selectedItems.includes(item.id) 
                                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-200 scale-110' 
                                                        : 'bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600') 
                                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                                            `}
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {category === 'bus' && (
                            <div className="flex justify-center bg-gray-50 p-6 rounded-3xl border border-dashed border-gray-300">
                                <div className="grid grid-cols-5 gap-y-4 gap-x-2">
                                    {items.map((item, idx) => {
                                        return (
                                            <React.Fragment key={item.id}>
                                                <button
                                                    disabled={!item.available}
                                                    onClick={() => toggleSelection(item.id)}
                                                    className={`
                                                        w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all
                                                        ${item.available 
                                                            ? (selectedItems.includes(item.id) 
                                                                ? 'bg-purple-600 text-white shadow-lg scale-110' 
                                                                : 'bg-white border text-gray-600 hover:border-purple-300 hover:text-purple-600') 
                                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                                                    `}
                                                >
                                                    {item.label}
                                                </button>
                                                {(idx + 1) % 4 === 2 && <div className="w-10 h-10 flex items-center justify-center text-[10px] text-gray-300 font-bold uppercase tracking-tighter">Aisle</div>}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {category === 'hotels' && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {items.map(item => (
                                    <button
                                        key={item.id}
                                        disabled={!item.available}
                                        onClick={() => toggleSelection(item.id)}
                                        className={`
                                            p-6 rounded-[24px] border-2 text-left transition-all relative overflow-hidden group
                                            ${item.available 
                                                ? (selectedItems.includes(item.id) 
                                                    ? 'border-purple-600 bg-purple-50 shadow-lg' 
                                                    : 'border-gray-100 bg-white hover:border-purple-200') 
                                                : 'border-transparent bg-gray-100 opacity-60 cursor-not-allowed'}
                                        `}
                                    >
                                        <div className={`text-sm font-black mb-1 ${selectedItems.includes(item.id) ? 'text-purple-700' : 'text-gray-900'}`}>{item.label}</div>
                                        <div className={`text-[10px] font-bold uppercase tracking-widest ${selectedItems.includes(item.id) ? 'text-purple-400' : 'text-gray-400'}`}>{item.type}</div>
                                        {!item.available && <div className="absolute top-2 right-2 text-[8px] font-black bg-gray-300 text-white px-2 py-0.5 rounded-full uppercase">Booked</div>}
                                        {selectedItems.includes(item.id) && <CheckCircle size={16} className="absolute bottom-4 right-4 text-purple-600" />}
                                    </button>
                                ))}
                            </div>
                        )}

                        {category === 'metro' && (
                            <div className="flex flex-col gap-8 max-w-sm mx-auto">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">From Station</label>
                                        <select 
                                            value={metroFrom} 
                                            onChange={(e) => setMetroFrom(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-purple-300 transition font-bold text-gray-800"
                                        >
                                            <option value="">Select Origin</option>
                                            {metroStations.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex justify-center">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                                            <ArrowRight size={16} className="rotate-90" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">To Station</label>
                                        <select 
                                            value={metroTo} 
                                            onChange={(e) => setMetroTo(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-purple-300 transition font-bold text-gray-800"
                                        >
                                            <option value="">Select Destination</option>
                                            {metroStations.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                                
                                {metroFrom && metroTo && metroFrom !== metroTo && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-purple-600 p-6 rounded-3xl text-white shadow-xl shadow-purple-200"
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="text-[10px] font-black uppercase tracking-widest opacity-80">Route Confirmed</div>
                                            <TrainFront size={20} />
                                        </div>
                                        <div className="flex justify-between items-center gap-4">
                                            <div className="text-sm font-black truncate">{metroFrom}</div>
                                            <div className="flex-1 border-t border-dashed border-white/50"></div>
                                            <div className="text-sm font-black truncate">{metroTo}</div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
                                            <span className="text-xs font-bold opacity-80">Estimated Fare</span>
                                            <span className="text-lg font-black tracking-tighter">₹{product.price.toLocaleString()}</span>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        )}

                        {/* Legend for non-metro */}
                        {category !== 'metro' && (
                            <div className="mt-12 flex justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gray-100 border rounded-sm"></div> Available
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-purple-600 rounded-sm"></div> Selected
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                    <div className="w-3 h-3 bg-gray-200 rounded-sm"></div> Occupied
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-8 border-t bg-gray-50/50 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                                {category === 'metro' ? 'Selected Journey' : `Total Selected`}
                            </p>
                            <p className="text-2xl font-black text-gray-900">
                                {category === 'metro' 
                                    ? (metroFrom && metroTo ? '1 Ticket' : 'None')
                                    : `${selectedItems.length} ${category === 'hotels' ? 'Rooms' : 'Seats'}`}
                            </p>
                        </div>
                        <button 
                            onClick={handleConfirm}
                            className="bg-primary-gradient text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-purple-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                        >
                            {category === 'metro' ? 'Confirm Journey' : `Proceed with ₹${(product.price * selectedItems.length).toLocaleString()}`} 
                            <CheckCircle size={20} />
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

const ArrowRight = ({ size, className }) => (
    <svg 
        width={size} 
        height={size} 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
    </svg>
);

export default TicketSelector;

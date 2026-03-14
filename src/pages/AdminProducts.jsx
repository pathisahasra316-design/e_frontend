import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Trash2, Edit, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminProducts = () => {
    const { user } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        productName: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        images: ''
    });

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/products');
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`http://localhost:5000/api/products/${id}`, config);
                fetchProducts();
            } catch (error) {
                console.error('Delete error:', error);
                alert('Error deleting product: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                productName: product.productName,
                description: product.description,
                price: product.price,
                category: product.category,
                stock: product.stock,
                images: product.images && product.images.length > 0 ? product.images[0] : ''
            });
        } else {
            setEditingProduct(null);
            setFormData({ productName: '', description: '', price: '', category: '', stock: '', images: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`
                },
            };

            const { data } = await axios.post('http://localhost:5000/api/upload', formDataUpload, config);

            setFormData({ ...formData, images: data });
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
            alert('Image upload failed');
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            // Ensure images is passed as an array
            const payload = { ...formData, images: formData.images ? [formData.images] : [] };

            if (editingProduct) {
                await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, payload, config);
            } else {
                await axios.post('http://localhost:5000/api/products', payload, config);
            }
            closeModal();
            fetchProducts();
        } catch (error) {
            console.error(error);
            alert('Failed to save product');
        }
    };

    return (
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 relative">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manage Products</h1>
                <button 
                    onClick={() => openModal()}
                    className="bg-purple-600 text-white px-5 py-2.5 rounded-full font-bold hover:bg-purple-700 shadow-lg hover:shadow-purple-500/30 transition"
                >
                    + Create Product
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(p => (
                    <div key={p._id} className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition flex flex-col group bg-gray-50/50">
                        <div className="h-48 bg-gray-100 overflow-hidden relative">
                            {p.images?.[0] ? (
                                <img 
                                    src={p.images[0].startsWith('/') ? `http://localhost:5000${p.images[0]}` : p.images[0]} 
                                    alt={p.productName} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                            )}
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="font-bold text-gray-900 truncate">{p.productName}</h3>
                            <p className="text-xs text-purple-600 mt-1 font-bold uppercase tracking-wider">{p.category}</p>
                            <p className="text-sm text-gray-500 line-clamp-2 mt-2 flex-grow">{p.description}</p>
                            
                            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                                <span className="font-black text-xl text-gray-900">₹{p.price.toLocaleString('en-IN')}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => openModal(p)} className="text-gray-500 bg-white shadow-sm border border-gray-200 hover:border-purple-300 hover:text-purple-600 p-2 rounded-xl transition">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => deleteHandler(p._id)} className="text-red-500 bg-red-50 hover:bg-red-100 p-2 rounded-xl transition">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Overlay */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h2 className="text-2xl font-black text-gray-900">{editingProduct ? 'Edit Product' : 'Create New Product'}</h2>
                                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition">
                                    <X size={24} />
                                </button>
                            </div>
                            
                            <form onSubmit={submitHandler} className="p-6 overflow-y-auto space-y-5 flex-1">
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="col-span-2 space-y-1">
                                        <label className="text-sm font-bold text-gray-700">Product Name</label>
                                        <input required type="text" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition" value={formData.productName} onChange={e => setFormData({...formData, productName: e.target.value})} placeholder="e.g. Smart Watch" />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-gray-700">Price (₹)</label>
                                        <input required type="number" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="0.00" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-gray-700">Stock Quantity</label>
                                        <input required type="number" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} placeholder="100" />
                                    </div>

                                    <div className="col-span-2 space-y-1">
                                        <label className="text-sm font-bold text-gray-700">Category</label>
                                        <select required className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition bg-white" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                            <option value="" disabled>Select a Category...</option>
                                            <option value="Men">Men</option>
                                            <option value="Women">Women</option>
                                            <option value="Kids">Kids</option>
                                            <option value="Girls">Girls</option>
                                            <option value="Mobiles">Mobiles</option>
                                            <option value="Electronics">Electronics</option>
                                            <option value="Home Appliances">Home Appliances</option>
                                            <option value="Beauty">Beauty</option>
                                            <option value="Furniture">Furniture</option>
                                            <option value="Toys">Toys</option>
                                            <option value="Books">Books</option>
                                            <option value="Movies">Movies</option>
                                            <option value="Hotels">Hotels</option>
                                            <option value="Metro">Metro</option>
                                            <option value="Bus">Bus</option>
                                            <option value="Jewellery">Jewellery</option>
                                            <option value="Food">Food</option>
                                            <option value="Accessories">Accessories</option>
                                        </select>
                                    </div>

                                    <div className="col-span-2 space-y-1">
                                        <label className="text-sm font-bold text-gray-700">Product Image</label>
                                        <div className="flex gap-4 items-center">
                                            <div className="flex-1">
                                                <input 
                                                    type="text" 
                                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition text-sm bg-gray-50" 
                                                    value={formData.images} 
                                                    onChange={e => setFormData({...formData, images: e.target.value})} 
                                                    placeholder="URL or Upload below..." 
                                                />
                                            </div>
                                            <label className="bg-purple-50 text-purple-600 px-4 py-3 rounded-xl font-bold cursor-pointer hover:bg-purple-100 transition border border-purple-200 text-sm whitespace-nowrap">
                                                {uploading ? 'Uploading...' : 'Choose File'}
                                                <input type="file" className="hidden" onChange={uploadFileHandler} />
                                            </label>
                                        </div>
                                        {formData.images && (
                                            <div className="mt-2 h-20 w-20 rounded-xl border overflow-hidden">
                                                <img src={formData.images.startsWith('/') ? `http://localhost:5000${formData.images}` : formData.images} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-span-2 space-y-1">
                                        <label className="text-sm font-bold text-gray-700">Description</label>
                                        <textarea required rows="4" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Detail everything about your incredible product..."></textarea>
                                    </div>
                                </div>
                                
                                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3 pb-2">
                                    <button type="button" onClick={closeModal} className="px-6 py-3 font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition">Cancel</button>
                                    <button type="submit" className="bg-purple-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-purple-700 shadow-lg shadow-purple-500/30 transition">{editingProduct ? 'Update Product' : 'Publish Product'}</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminProducts;

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api/orderApi';
import pricing from '../utils/pricing';
import { Plus, Trash2, ShoppingBag, User, Phone, IndianRupee, Save, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';

const CreateOrder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    garments: [{ type: 'Shirt', quantity: 1 }]
  });

  const [errors, setErrors] = useState({});

  const billPreview = useMemo(() => {
    let total = 0;
    const items = formData.garments.map(item => {
      const price = pricing[item.type] || pricing.Other;
      const subtotal = price * item.quantity;
      total += subtotal;
      return { ...item, price, subtotal };
    });
    return { items, total };
  }, [formData.garments]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleGarmentChange = (index, field, value) => {
    const updatedGarments = [...formData.garments];
    updatedGarments[index][field] = field === 'quantity' ? parseInt(value) || 0 : value;
    setFormData(prev => ({ ...prev, garments: updatedGarments }));
  };

  const addGarmentRow = () => {
    setFormData(prev => ({
      ...prev,
      garments: [...prev.garments, { type: 'Shirt', quantity: 1 }]
    }));
  };

  const removeGarmentRow = (index) => {
    if (formData.garments.length === 1) return;
    const updatedGarments = formData.garments.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, garments: updatedGarments }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.customerName.trim()) newErrors.customerName = 'Required';
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = '10-digit number required';
    
    formData.garments.forEach((g, i) => {
      if (g.quantity < 1) newErrors[`garment_${i}`] = 'Min 1';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await createOrder(formData);
      setSuccessData(response.data);
    } catch (error) {
      console.error('Failed to create order', error);
      alert(error.message || 'Error creating order');
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="max-w-md mx-auto py-12 text-center animate-in zoom-in duration-300">
        <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Order Created!</h2>
        <p className="text-gray-500 mb-8 font-medium">Order ID: <span className="text-primary-700 font-mono font-bold">{successData.orderId}</span></p>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8 text-left">
           <div className="flex justify-between mb-4 border-b border-gray-50 pb-4">
              <span className="text-gray-500">Total Amount Payable</span>
              <span className="text-xl font-bold text-gray-900">₹{successData.totalAmount}</span>
           </div>
           <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Estimated Delivery</span>
                <span className="text-gray-900 font-semibold">{new Date(successData.estimatedDelivery).toDateString()}</span>
              </div>
           </div>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={() => navigate(`/orders/${successData.orderId}`)} 
            className="btn btn-primary w-full py-3"
          >
            View Order Details
          </button>
          <button 
            onClick={() => navigate('/orders')} 
            className="btn btn-secondary w-full py-3"
          >
            Go to Order List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create New Order</h1>
          <p className="text-gray-500 mt-1">Enter customer details and garments to start a new order.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Details */}
          <div className="card space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-500" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  placeholder="e.g. Aman Kumar"
                  className={`input ${errors.customerName ? 'border-red-500 ring-red-100' : ''}`}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="10-digit number"
                  maxLength={10}
                  className={`input ${errors.phone ? 'border-red-500 ring-red-100' : ''}`}
                />
              </div>
            </div>
          </div>

          {/* Garments List */}
          <div className="card space-y-4">
            <div className="flex justify-between items-center border-b border-gray-50 pb-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary-500" />
                Garments Breakdown
              </h3>
              <button
                type="button"
                onClick={addGarmentRow}
                className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.garments.map((item, index) => (
                <div key={index} className="flex flex-wrap md:flex-nowrap items-end gap-3 p-3 bg-gray-50 rounded-xl group relative">
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Type</label>
                    <select
                      value={item.type}
                      onChange={(e) => handleGarmentChange(index, 'type', e.target.value)}
                      className="input py-1.5"
                    >
                      {Object.keys(pricing).map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Qty</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleGarmentChange(index, 'quantity', e.target.value)}
                      className={`input py-1.5 ${errors[`garment_${index}`] ? 'border-red-500' : ''}`}
                    />
                  </div>
                  <div className="w-24 text-right pr-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Subtotal</label>
                    <div className="h-10 flex items-center justify-end font-bold text-gray-900">
                      ₹{billPreview.items[index]?.subtotal || 0}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeGarmentRow(index)}
                    disabled={formData.garments.length === 1}
                    className="p-2 text-gray-300 hover:text-red-500 disabled:opacity-0 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bill Preview & Submit */}
        <div className="lg:col-start-3">
          <div className="card sticky top-24 bg-primary-950 text-white border-none shadow-xl shadow-primary-900/20">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <IndianRupee className="w-5 h-5" />
              Bill Preview
            </h3>
            
            <div className="space-y-4 mb-8">
              {billPreview.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm text-primary-200">
                  <span>{item.quantity} x {item.type}</span>
                  <span className="text-white font-medium">₹{item.subtotal}</span>
                </div>
              ))}
              {billPreview.items.length === 0 && (
                <p className="text-sm text-primary-400 italic">No garments added yet.</p>
              )}
            </div>

            <div className="border-t border-primary-800 pt-6 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-primary-300 font-medium">Grand Total</span>
                <span className="text-3xl font-black">₹{billPreview.total}</span>
              </div>
              <p className="text-[10px] text-primary-400 mt-2 uppercase tracking-widest font-bold">
                Inclusive of all taxes
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || billPreview.total === 0}
              className="w-full bg-white text-primary-950 hover:bg-primary-50 py-4 rounded-xl font-extrabold text-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Confirm Order
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateOrder;

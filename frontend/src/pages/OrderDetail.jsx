import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById, updateOrderStatus } from '../api/orderApi';
import StatusBadge from '../components/StatusBadge';
import { 
  ArrowLeft, 
  Calendar, 
  Phone, 
  User, 
  ShoppingBag, 
  IndianRupee, 
  Clock, 
  ArrowRightCircle, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrder = async () => {
    try {
      const response = await getOrderById(orderId);
      setOrder(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      await fetchOrder(); // Refresh data
    } catch (err) {
      alert(err.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      <span className="text-gray-500 font-medium">Crunching order data...</span>
    </div>
  );

  if (error) return (
    <div className="max-w-md mx-auto py-20 text-center">
       <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 mb-6">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-xl font-bold">{error}</h2>
       </div>
       <button onClick={() => navigate('/orders')} className="btn btn-primary">
          Back to Orders
       </button>
    </div>
  );

  const statusFlow = ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'];
  const currentIndex = statusFlow.indexOf(order.status);
  const nextStatus = currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">{order.orderId}</h1>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Placed on {format(new Date(order.createdAt), 'PPPP')}
            </p>
          </div>
        </div>
        
        {nextStatus && (
          <button
            onClick={() => handleStatusUpdate(nextStatus)}
            disabled={updating}
            className="w-full md:w-auto btn btn-primary flex items-center justify-center gap-2 px-6 py-3 shadow-lg shadow-primary-500/20"
          >
            {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRightCircle className="w-5 h-5" />}
            Move to {nextStatus}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Delivery Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <User className="w-4 h-4" />
                Customer
              </h3>
              <p className="text-xl font-bold text-gray-900">{order.customerName}</p>
              <p className="text-gray-500 flex items-center gap-2 mt-2">
                <Phone className="w-4 h-4" />
                {order.phone}
              </p>
            </div>
            <div className="card bg-primary-50 border-primary-100">
              <h3 className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Delivery
              </h3>
              <p className="text-xl font-bold text-primary-900">
                {format(new Date(order.estimatedDelivery), 'dd MMM yyyy')}
              </p>
              <p className="text-primary-600 text-sm mt-2 flex items-center gap-2 font-medium">
                <Calendar className="w-4 h-4" />
                Estimated Completion
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="card overflow-hidden !p-0">
            <div className="p-6 border-b border-gray-50">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary-500" />
                  Garments Breakdown
                </h3>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Item Type</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase text-center">Qty</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase text-right">Unit Price</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {order.garments.map((item, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 font-semibold text-gray-900">{item.type}</td>
                    <td className="px-6 py-4 text-center text-gray-700">{item.quantity}</td>
                    <td className="px-6 py-4 text-right text-gray-500">₹{item.pricePerItem}</td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">₹{item.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Summary */}
        <div>
          <div className="card sticky top-24 border-2 border-gray-900 bg-white">
            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
              <IndianRupee className="w-5 h-5" />
              Payment Summary
            </h3>
            <div className="space-y-4">
               <div className="flex justify-between text-gray-500 font-medium">
                 <span>Subtotal</span>
                 <span>₹{order.totalAmount}</span>
               </div>
               <div className="flex justify-between text-gray-500 font-medium">
                 <span>Taxes (0%)</span>
                 <span>₹0</span>
               </div>
               <div className="border-t border-gray-100 pt-6 flex justify-between items-center group">
                  <span className="text-gray-900 font-black text-lg">Total Amount</span>
                  <span className="text-3xl font-black text-primary-600 transition-transform group-hover:scale-110 duration-200">
                    ₹{order.totalAmount}
                  </span>
               </div>
            </div>
            
            <div className="mt-10 p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-4">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <AlertCircle className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                 <p className="text-sm font-bold text-gray-900">Next Action</p>
                 <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                   {nextStatus 
                    ? `Order will move to ${nextStatus} after verification.`
                    : "Order is delivered. No further actions required."
                   }
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

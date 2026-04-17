import React, { useState, useEffect } from 'react';
import { getOrders } from '../api/orderApi';
import FilterBar from '../components/FilterBar';
import OrderCard from '../components/OrderCard';
import { Plus, Loader2, ListFilter } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    name: '',
    phone: '',
    garmentType: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await getOrders(filters);
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchOrders, 300);
    return () => clearTimeout(debounceTimer);
  }, [filters]);

  const clearFilters = () => {
    setFilters({
      status: '',
      name: '',
      phone: '',
      garmentType: ''
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Orders</h1>
          <p className="text-gray-500 mt-1">Manage and track all laundry orders.</p>
        </div>
        <Link 
          to="/orders/new" 
          className="btn btn-primary flex items-center gap-2 shadow-lg shadow-primary-500/20"
        >
          <Plus className="w-5 h-5" />
          Create Order
        </Link>
      </div>

      <FilterBar 
        filters={filters} 
        setFilters={setFilters} 
        onClear={clearFilters} 
      />

      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
             <span className="text-gray-500 font-medium">Loading orders...</span>
          </div>
        ) : orders.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {orders.map(order => (
              <OrderCard key={order.orderId} order={order} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-20 bg-gray-50 border-dashed border-2 border-gray-200">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <ListFilter className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No orders found</h3>
            <p className="text-gray-500 max-w-xs mx-auto mt-1">
              {Object.values(filters).some(v => v !== '') 
                ? "Try adjusting your filters to find what you're looking for." 
                : "Get started by creating your first order!"}
            </p>
            {Object.values(filters).some(v => v !== '') && (
              <button 
                onClick={clearFilters}
                className="mt-4 text-primary-600 font-semibold hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;

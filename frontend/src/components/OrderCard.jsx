import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, User, Phone, IndianRupee } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { format } from 'date-fns';

const OrderCard = ({ order }) => {
  return (
    <Link 
      to={`/orders/${order.orderId}`}
      className="block bg-white hover:bg-gray-50 border border-gray-100 rounded-xl p-4 transition-all duration-200 shadow-sm hover:shadow group"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-mono font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded leading-none">
              {order.orderId}
            </span>
            <StatusBadge status={order.status} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            <div className="flex items-center gap-2 text-gray-700">
              <User className="w-4 h-4 text-gray-400" />
              <span className="font-semibold">{order.customerName}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              <span>{order.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>Est. Delivery: {format(new Date(order.estimatedDelivery), 'dd MMM yyyy')}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-900 font-bold">
              <IndianRupee className="w-4 h-4 text-gray-700" />
              <span>{order.totalAmount}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0">
          <div className="text-xs text-gray-400 md:hidden">
            Created: {format(new Date(order.createdAt), 'dd MMM yyyy')}
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors" />
        </div>
      </div>
    </Link>
  );
};

export default OrderCard;

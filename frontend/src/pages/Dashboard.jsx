import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../api/orderApi';
import { ShoppingBag, TrendingUp, Clock, CheckCircle, IndianRupee, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import { format } from 'date-fns';

const StatCard = ({ title, value, icon: Icon, color, loading }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
    <div className={`p-4 rounded-xl ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin text-gray-300 mt-1" />
      ) : (
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      )}
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats();
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const totalPending = stats ? (stats.ordersByStatus.RECEIVED + stats.ordersByStatus.PROCESSING) : 0;
  const totalDelivered = stats ? stats.ordersByStatus.DELIVERED : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Real-time statistics for your laundry business.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Orders" 
          value={stats?.totalOrders || 0} 
          icon={ShoppingBag} 
          color="bg-primary-600"
          loading={loading}
        />
        <StatCard 
          title="Total Revenue" 
          value={stats ? `₹${stats.totalRevenue.toLocaleString()}` : '₹0'} 
          icon={TrendingUp} 
          color="bg-emerald-600"
          loading={loading}
        />
        <StatCard 
          title="Pending Orders" 
          value={totalPending} 
          icon={Clock} 
          color="bg-amber-500"
          loading={loading}
        />
        <StatCard 
          title="Orders Delivered" 
          value={totalDelivered} 
          icon={CheckCircle} 
          color="bg-indigo-600"
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
            <Link to="/orders" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 group">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4 text-center">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-4 h-16 bg-gray-50/20"></td>
                    </tr>
                  ))
                ) : (
                  stats?.recentOrders.map((order) => (
                    <tr key={order.orderId} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm font-bold text-primary-700">
                        <Link to={`/orders/${order.orderId}`}>{order.orderId}</Link>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{order.customerName}</td>
                      <td className="px-6 py-4 text-center font-bold">₹{order.totalAmount}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-500">
                        {format(new Date(order.createdAt), 'dd MMM')}
                      </td>
                    </tr>
                  ))
                )}
                {!loading && stats?.recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Status Breakdown</h3>
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            {stats && Object.entries(stats.ordersByStatus).map(([status, count]) => {
                const total = stats.totalOrders || 1;
                const percentage = (count / total) * 100;
                
                const colors = {
                  RECEIVED: 'bg-gray-400',
                  PROCESSING: 'bg-blue-500',
                  READY: 'bg-green-500',
                  DELIVERED: 'bg-emerald-600'
                };

                return (
                  <div key={status}>
                    <div className="flex justify-between items-end mb-2">
                       <span className="text-sm font-semibold text-gray-700">{status}</span>
                       <span className="text-sm font-bold text-gray-900">{count}</span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${colors[status]} transition-all duration-1000`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
            })}
          </div>
          <div className="mt-8 p-4 bg-primary-50 rounded-xl border border-primary-100">
            <p className="text-xs text-primary-800 leading-relaxed font-medium">
              💡 Tip: The faster you move orders to READY, the happier your customers are!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

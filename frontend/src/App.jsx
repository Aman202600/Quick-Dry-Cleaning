import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import OrderList from './pages/OrderList';
import CreateOrder from './pages/CreateOrder';
import OrderDetail from './pages/OrderDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/orders/new" element={<CreateOrder />} />
            <Route path="/orders/:orderId" element={<OrderDetail />} />
            <Route path="*" element={<div className="text-center py-20 text-gray-500">404 - Page Not Found</div>} />
          </Routes>
        </main>
        <footer className="py-8 text-center text-gray-400 text-sm border-t border-gray-100 bg-white">
          &copy; {new Date().getFullYear()} QuickDry Laundry Management System. All rights reserved.
        </footer>
      </div>
    </Router>
  );
}

export default App;

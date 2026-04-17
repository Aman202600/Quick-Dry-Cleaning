import React from 'react';
import { Search, Filter, X } from 'lucide-react';

const FilterBar = ({ filters, setFilters, onClear }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end">
      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Customer Name</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            name="name"
            value={filters.name}
            onChange={handleChange}
            placeholder="Search by name..."
            className="input pl-10 pr-4 py-2 outline-none"
          />
        </div>
      </div>

      <div className="w-48">
        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Status</label>
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="input px-4 py-2 outline-none appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:1em_1em]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
        >
          <option value="">All Statuses</option>
          <option value="RECEIVED">RECEIVED</option>
          <option value="PROCESSING">PROCESSING</option>
          <option value="READY">READY</option>
          <option value="DELIVERED">DELIVERED</option>
        </select>
      </div>

      <div className="w-48">
        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Garment Type</label>
        <select
          name="garmentType"
          value={filters.garmentType}
          onChange={handleChange}
          className="input px-4 py-2 outline-none appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:1em_1em]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
        >
          <option value="">All Types</option>
          <option value="Shirt">Shirt</option>
          <option value="Pants">Pants</option>
          <option value="Saree">Saree</option>
          <option value="Jacket">Jacket</option>
          <option value="Kurta">Kurta</option>
          <option value="Bedsheet">Bedsheet</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <button
        onClick={onClear}
        className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
      >
        <X className="w-4 h-4" />
        Clear
      </button>
    </div>
  );
};

export default FilterBar;

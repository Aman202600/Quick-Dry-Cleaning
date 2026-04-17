import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const StatusBadge = ({ status }) => {
  const statusStyles = {
    RECEIVED: 'bg-gray-100 text-gray-700 border-gray-200',
    PROCESSING: 'bg-blue-100 text-blue-700 border-blue-200',
    READY: 'bg-green-100 text-green-700 border-green-200',
    DELIVERED: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  };

  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded-full text-xs font-semibold border",
      statusStyles[status] || statusStyles.RECEIVED
    )}>
      {status}
    </span>
  );
};

export default StatusBadge;

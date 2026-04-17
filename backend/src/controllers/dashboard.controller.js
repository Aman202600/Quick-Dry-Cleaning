const Order = require('../models/Order');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
exports.getDashboardStats = async (req, res) => {
  const totalOrders = await Order.countDocuments();
  
  const revenueResult = await Order.aggregate([
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);
  const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

  const statusCounts = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  const ordersByStatus = {
    RECEIVED: 0,
    PROCESSING: 0,
    READY: 0,
    DELIVERED: 0
  };

  statusCounts.forEach(item => {
    if (ordersByStatus.hasOwnProperty(item._id)) {
      ordersByStatus[item._id] = item.count;
    }
  });

  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    success: true,
    data: {
      totalOrders,
      totalRevenue,
      ordersByStatus,
      recentOrders
    }
  });
};

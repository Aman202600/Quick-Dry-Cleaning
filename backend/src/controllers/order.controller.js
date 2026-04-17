const Order = require('../models/Order');
const pricing = require('../utils/pricing');
const generateOrderId = require('../utils/generateOrderId');

// @desc    Create new order
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  const { customerName, phone, garments } = req.body;

  if (!garments || garments.length === 0) {
    res.status(400);
    throw new Error('Please add at least one garment');
  }

  // Calculate totals and enrich garments with pricing info
  let totalAmount = 0;
  const processedGarments = garments.map(item => {
    const pricePerItem = pricing[item.type] || pricing.Other;
    const subtotal = pricePerItem * item.quantity;
    totalAmount += subtotal;
    return {
      type: item.type,
      quantity: item.quantity,
      pricePerItem,
      subtotal
    };
  });

  const createdAt = new Date();
  const estimatedDelivery = new Date(createdAt);
  estimatedDelivery.setDate(createdAt.getDate() + 3);

  const order = await Order.create({
    orderId: generateOrderId(),
    customerName,
    phone,
    garments: processedGarments,
    totalAmount,
    estimatedDelivery
  });

  res.status(201).json({
    success: true,
    data: order,
    message: 'Order created'
  });
};

// @desc    Get all orders with optional filters
// @route   GET /api/orders
exports.getOrders = async (req, res) => {
  const { status, name, phone, garmentType } = req.query;
  const queryObject = {};

  if (status) queryObject.status = status;
  if (name) queryObject.customerName = { $regex: name, $options: 'i' };
  if (phone) queryObject.phone = phone;
  if (garmentType) queryObject['garments.type'] = garmentType;

  const orders = await Order.find(queryObject).sort({ createdAt: -1 });

  res.json({
    success: true,
    data: orders
  });
};

// @desc    Get single order by orderId
// @route   GET /api/orders/:orderId
exports.getOrderById = async (req, res) => {
  const order = await Order.findOne({ orderId: req.params.orderId });

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  res.json({
    success: true,
    data: order
  });
};

// @desc    Update order status
// @route   PATCH /api/orders/:orderId/status
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const order = await Order.findOne({ orderId: req.params.orderId });

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const statusFlow = ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'];
  const currentIndex = statusFlow.indexOf(order.status);
  const nextIndex = statusFlow.indexOf(status);

  // Validate forward-only transitions
  if (nextIndex === -1) {
    res.status(400);
    throw new Error('Invalid status');
  }

  if (nextIndex <= currentIndex) {
    res.status(400);
    throw new Error(`Cannot transition from ${order.status} to ${status}. Status must move forward.`);
  }

  if (nextIndex !== currentIndex + 1) {
    res.status(400);
    throw new Error(`Cannot skip status steps. Next status should be ${statusFlow[currentIndex + 1]}`);
  }

  order.status = status;
  await order.save();

  res.json({
    success: true,
    data: order,
    message: `Order status updated to ${status}`
  });
};

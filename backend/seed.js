require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./src/models/Order');
const pricing = require('./src/utils/pricing');
const generateOrderId = require('./src/utils/generateOrderId');

const sampleOrders = [
  {
    customerName: 'Aman Kumar',
    phone: '9876543210',
    garments: [
      { type: 'Shirt', quantity: 3 },
      { type: 'Pants', quantity: 2 }
    ]
  },
  {
    customerName: 'Rahul Singh',
    phone: '9876543211',
    garments: [
      { type: 'Saree', quantity: 1 },
      { type: 'Kurta', quantity: 2 }
    ]
  },
  {
    customerName: 'Priya Sharma',
    phone: '9876543212',
    garments: [
      { type: 'Jacket', quantity: 1 },
      { type: 'Bedsheet', quantity: 4 }
    ]
  },
  {
    customerName: 'Vikram Mehta',
    phone: '9876543213',
    garments: [
      { type: 'Shirt', quantity: 5 }
    ]
  },
  {
    customerName: 'Neha Gupta',
    phone: '9876543214',
    garments: [
      { type: 'Other', quantity: 10 }
    ]
  },
  {
    customerName: 'Arjun Das',
    phone: '9876543215',
    garments: [
      { type: 'Pants', quantity: 3 },
      { type: 'Shirt', quantity: 3 }
    ]
  },
  {
    customerName: 'Sneha Rao',
    phone: '9876543216',
    garments: [
      { type: 'Saree', quantity: 5 }
    ]
  },
  {
    customerName: 'Amit Patel',
    phone: '9876543217',
    garments: [
      { type: 'Kurta', quantity: 1 },
      { type: 'Pants', quantity: 1 }
    ]
  },
  {
    customerName: 'Kavita Iyer',
    phone: '9876543218',
    garments: [
      { type: 'Jacket', quantity: 2 }
    ]
  },
  {
    customerName: 'Rohan Joshi',
    phone: '9876543219',
    garments: [
      { type: 'Bedsheet', quantity: 2 },
      { type: 'Other', quantity: 1 }
    ]
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    await Order.deleteMany();
    console.log('Existing orders cleared');

    const statuses = ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'];

    for (const data of sampleOrders) {
      let totalAmount = 0;
      const processedGarments = data.garments.map(item => {
        const pricePerItem = pricing[item.type] || pricing.Other;
        const subtotal = pricePerItem * item.quantity;
        totalAmount += subtotal;
        return { ...item, pricePerItem, subtotal };
      });

      const createdAt = new Date();
      // Randomize createdAt slightly for variety in dashboard
      createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 5));
      
      const estimatedDelivery = new Date(createdAt);
      estimatedDelivery.setDate(createdAt.getDate() + 3);

      await Order.create({
        ...data,
        orderId: generateOrderId(),
        garments: processedGarments,
        totalAmount,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt,
        estimatedDelivery
      });
    }

    console.log('10 Sample orders seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

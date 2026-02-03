
import express from 'express';
import cors from 'cors';
import { itemService } from './services/itemService.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Query:', req.query);
  console.log('Body:', req.body);
  next();
});

import { orderService } from './services/orderService.js';

// ... (keep existing imports)

// Get all items
app.get('/api/items', async (req, res) => {
  try {
    const { category } = req.query;
    const items = await itemService.getAllItems(category);
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Create order
app.post('/api/orders', async (req, res) => {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get orders with filters
app.get('/api/orders', async (req, res) => {
  try {
    const { email, status, driverEmail } = req.query;
    let orders;

    if (driverEmail) {
      // Driver active orders
      const statuses = typeof status === 'string' ? [status] : status; // Handle ?status=a&status=b if needed, or comma separated
      // Simple handling for now: accept comma separated status or single status
      const statusList = req.query.status ? (Array.isArray(req.query.status) ? req.query.status : req.query.status.split(',')) : [];
      orders = await orderService.getOrdersByDriver(driverEmail, statusList);
    } else if (email) {
      // Customer history
      orders = await orderService.getOrdersByCustomer(email);
    } else if (status) {
      // Filter by status (e.g. 'pending')
      orders = await orderService.getOrdersByStatus(status);
    } else {
      // Admin all
      orders = await orderService.getAllOrders();
    }
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order (status or driver assignment)
app.patch('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    let order;

    if (updates.driverEmail && updates.status === 'accepted') {
      // Assign driver
      order = await orderService.assignDriver(id, updates);
    } else {
      // Regular status update
      order = await orderService.updateOrderStatus(id, updates);
    }

    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

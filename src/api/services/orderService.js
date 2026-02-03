import { db } from '../db/index.js';
import { orders } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const orderService = {
  // Create new order
  createOrder: async (data) => {
    const result = await db.insert(orders).values(data).returning();
    return result[0];
  },

  // Get all orders (admin/driver view)
  getAllOrders: async () => {
    return await db.select().from(orders);
  },

  // Get order by ID
  getOrderById: async (id) => {
    const result = await db.select().from(orders).where(eq(orders.id, id));
    return result[0];
  },

  // Get orders by customer email
  getOrdersByCustomer: async (email) => {
    return await db.select().from(orders).where(eq(orders.customerEmail, email));
  },

  // Update order status
  updateOrderStatus: async (id, status) => {
    const result = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return result[0];
  },

  // Assign driver
  assignDriver: async (id, driverData) => {
    const result = await db
      .update(orders)
      .set({
        driverEmail: driverData.email,
        driverName: driverData.name,
        status: 'accepted'
      })
      .where(eq(orders.id, id))
      .returning();
    return result[0];
  }
};

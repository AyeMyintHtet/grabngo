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

  // Get orders by status
  getOrdersByStatus: async (status) => {
    return await db.select().from(orders).where(eq(orders.status, status));
  },

  // Get orders by driver and statuses
  getOrdersByDriver: async (email, statuses) => {
    // In Drizzle ORM, for 'IN' clause we typically use inArray, but for simplicity with this setup
    // we'll fetch by driver and filter in JS if needed, or stick to simple status checks.
    // Let's assume statuses is an array.
    const allDriverOrders = await db.select().from(orders).where(eq(orders.driverEmail, email));

    if (statuses && statuses.length > 0) {
      return allDriverOrders.filter(order => statuses.includes(order.status));
    }
    return allDriverOrders;
  },

  // Update order status with optional location/time updates
  updateOrderStatus: async (id, data) => {
    const updateData = { status: data.status };

    if (data.driverLat) updateData.driverLat = data.driverLat;
    if (data.driverLng) updateData.driverLng = data.driverLng;
    if (data.estimatedTime) updateData.estimatedTime = data.estimatedTime;

    const result = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, id))
      .returning();
    return result[0];
  },

  // Assign driver
  assignDriver: async (id, driverData) => {
    console.log(driverData, 'adsf');
    const result = await db
      .update(orders)
      .set({
        driverEmail: driverData.driverEmail,
        driverName: driverData.driverName,
        driverLat: driverData.driverLat,
        driverLng: driverData.driverLng,
        estimatedTime: driverData.estimatedTime,
        distanceKm: driverData.distanceKm,
        status: 'accepted'
      })
      .where(eq(orders.id, id))
      .returning();
    return result[0];
  }
};

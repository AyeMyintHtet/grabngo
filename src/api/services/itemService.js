import { db } from '../db/index.js';
import { items } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const itemService = {
  // Get all items
  getAllItems: async (category) => {
    if (category && category !== 'all') {
      return await db.select().from(items).where(eq(items.category, category));
    }
    return await db.select().from(items);
  },

  // Get item by ID
  getItemById: async (id) => {
    const result = await db.select().from(items).where(eq(items.id, id));
    return result[0];
  },

  // Create new item
  createItem: async (data) => {
    const result = await db.insert(items).values(data).returning();
    return result[0];
  },

  // Update item
  updateItem: async (id, data) => {
    const result = await db
      .update(items)
      .set(data)
      .where(eq(items.id, id))
      .returning();
    return result[0];
  },

  // Delete item
  deleteItem: async (id) => {
    const result = await db.delete(items).where(eq(items.id, id)).returning();
    return result[0];
  },
};

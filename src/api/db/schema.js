import { pgTable, uuid, text, numeric, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const items = pgTable('items', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: numeric('price').notNull(),
  category: text('category').notNull(), // CHECK constraint handled at DB level
  imageUrl: text('image_url'),
  restaurant: text('restaurant'),
  prepTime: numeric('prep_time'),
  rating: numeric('rating'),
  isAvailable: boolean('is_available').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerEmail: text('customer_email').notNull(),
  customerName: text('customer_name'),
  customerAddress: text('customer_address').notNull(),
  customerLat: numeric('customer_lat'),
  customerLng: numeric('customer_lng'),
  items: jsonb('items').notNull(), // Stores array of item objects
  totalAmount: numeric('total_amount').notNull(),
  status: text('status').default('pending'), // CHECK constraint handled at DB level
  driverEmail: text('driver_email'),
  driverName: text('driver_name'),
  driverLat: numeric('driver_lat'),
  driverLng: numeric('driver_lng'),
  estimatedTime: numeric('estimated_time'),
  distanceKm: numeric('distance_km'),
  restaurantAddress: text('restaurant_address'),
  restaurantLat: numeric('restaurant_lat'),
  restaurantLng: numeric('restaurant_lng'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

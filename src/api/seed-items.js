import { itemService } from './services/itemService.js';
import { db } from './db/index.js';

const itemsData = [
  {
    "prep_time": 12,
    "price": 10.99,
    "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
    "restaurant": "Burger House",
    "name": "Classic Cheeseburger",
    "rating": 4.7,
    "description": "Juicy beef patty with cheese, lettuce, tomato, and special sauce",
    "category": "food",
    "is_available": true
  },
  {
    "prep_time": 5,
    "price": 5.99,
    "image_url": "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80",
    "restaurant": "Fresh Mart",
    "name": "Organic Milk (1 Gallon)",
    "rating": 4.5,
    "description": "Fresh organic whole milk from local farms",
    "category": "grocery",
    "is_available": true
  },
  {
    "prep_time": 5,
    "price": 15.99,
    "image_url": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80",
    "restaurant": "HealthPlus Pharmacy",
    "name": "Vitamin C Supplements",
    "rating": 4.7,
    "description": "High-potency vitamin C tablets, 60 count",
    "category": "pharmacy",
    "is_available": true
  },
  {
    "prep_time": 10,
    "price": 8.99,
    "image_url": "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&q=80",
    "restaurant": "GrabGo Express",
    "name": "Express Package Delivery",
    "rating": 4.5,
    "description": "Same-day package delivery within the city",
    "category": "package",
    "is_available": true
  },
  {
    "prep_time": 8,
    "price": 9.99,
    "image_url": "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&q=80",
    "restaurant": "Green Garden",
    "name": "Caesar Salad",
    "rating": 4.4,
    "description": "Crispy romaine, parmesan, croutons, and Caesar dressing",
    "category": "food",
    "is_available": true
  },
  {
    "prep_time": 5,
    "price": 24.99,
    "image_url": "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&q=80",
    "restaurant": "HealthPlus Pharmacy",
    "name": "First Aid Kit",
    "rating": 4.8,
    "description": "Complete emergency first aid kit for home and travel",
    "category": "pharmacy",
    "is_available": true
  },
  {
    "prep_time": 20,
    "price": 14.99,
    "image_url": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",
    "restaurant": "Mario's Pizzeria",
    "name": "Margherita Pizza",
    "rating": 4.8,
    "description": "Classic Italian pizza with fresh tomatoes, mozzarella, and basil",
    "category": "food",
    "is_available": true
  },
  {
    "prep_time": 15,
    "price": 12.99,
    "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
    "restaurant": "Tokyo Kitchen",
    "name": "Chicken Teriyaki Bowl",
    "rating": 4.6,
    "description": "Grilled chicken with teriyaki sauce, rice, and vegetables",
    "category": "food",
    "is_available": true
  },
  {
    "prep_time": 5,
    "price": 12.99,
    "image_url": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80",
    "restaurant": "Fresh Mart",
    "name": "Fresh Vegetables Pack",
    "rating": 4.6,
    "description": "Assorted fresh vegetables including carrots, broccoli, and peppers",
    "category": "grocery",
    "is_available": true
  },
  {
    "prep_time": 18,
    "price": 18.99,
    "image_url": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&q=80",
    "restaurant": "Sakura Sushi",
    "name": "Fresh Salmon Sushi",
    "rating": 4.9,
    "description": "Premium salmon nigiri and maki rolls combo",
    "category": "food",
    "is_available": true
  }
];

async function seed() {
  console.log('🌱 Starting to seed items...');
  let successCount = 0;

  try {
    for (const item of itemsData) {
      // Map JSON keys (snake_case) to Drizzle Schema (camelCase)
      // Note: DB columns are snake_case, but Drizzle object keys are camelCase define in schema.js
      const mappedItem = {
        name: item.name,
        description: item.description,
        price: item.price.toString(), // Ensure numeric checks
        category: item.category,
        imageUrl: item.image_url,
        restaurant: item.restaurant,
        prepTime: item.prep_time.toString(),
        rating: item.rating.toString(),
        isAvailable: item.is_available,
        // We omit 'id', 'created_date', 'created_by' etc. to let DB handle defaults/new UUIDs
      };

      const created = await itemService.createItem(mappedItem);
      console.log(`✅ Added: ${created.name}`);
      successCount++;
    }
    console.log(`\n🎉 Successfully seeded ${successCount} items!`);
  } catch (error) {
    console.error('❌ Error seeding items:', error);
  }

  process.exit(0);
}

seed();

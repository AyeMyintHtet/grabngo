import { itemService } from './services/itemService.js';
import { orderService } from './services/orderService.js';
import { db } from './db/index.js';

async function main() {
  console.log('🔄 Starting Database CRUD Test...');

  try {
    // --- ITEM TEST ---
    console.log('\n📦 --- ITEMS TESTING ---');

    // 1. Create
    console.log('Creating item...');
    const newItem = await itemService.createItem({
      name: 'Spicy Chicken Burger',
      description: 'Crispy chicken with spicy sauce',
      price: '12.99',
      category: 'food',
      restaurant: 'Burger King',
      isAvailable: true
    });
    console.log('✅ Created Item:', newItem.name, `(ID: ${newItem.id})`);

    // 2. Read All
    const allItems = await itemService.getAllItems();
    console.log(`📋 Total Items in DB: ${allItems.length}`);

    // 3. Delete (Cleanup)
    if (newItem.id) {
      await itemService.deleteItem(newItem.id);
      console.log('🗑️  Deleted Item:', newItem.id);
    }

    // --- ORDER TEST ---
    console.log('\n📝 --- ORDERS TESTING ---');

    // 1. Create Order
    console.log('Creating order...');
    const newOrder = await orderService.createOrder({
      customerEmail: 'test@example.com',
      customerAddress: '123 Test St, Singapore',
      items: [{ itemId: '123', name: 'Burger', price: 12.99, quantity: 2 }],
      totalAmount: '25.98',
      status: 'pending'
    });
    console.log('✅ Created Order:', newOrder.id, `Status: ${newOrder.status}`);

    // 2. Update Status
    console.log('Updating order status...');
    const updatedOrder = await orderService.updateOrderStatus(newOrder.id, 'preparing');
    console.log('✅ Updated Status:', updatedOrder.status);

    console.log('\n🎉 ALL TESTS PASSED!');

  } catch (error) {
    console.error('❌ Error during testing:', error);
  }

  // Exit process
  process.exit(0);
}

main();

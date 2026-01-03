const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  try {
    console.log('\n🔍 Testing MongoDB Connection...\n');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Found ✅' : 'Not Found ❌');
    
    if (!process.env.MONGODB_URI) {
      console.error('\n❌ MONGODB_URI not found in .env.local');
      console.log('Please check your .env.local file.');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully!');
    
    // Test database operations
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(`\n📊 Database: ${mongoose.connection.name}`);
    console.log(`📁 Collections: ${collections.length}`);
    
    await mongoose.connection.close();
    console.log('\n✅ Connection test completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ MongoDB Connection Error:');
    console.error(error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Solution:');
      console.log('1. Make sure MongoDB service is running');
      console.log('2. For local: Run "Start-Service MongoDB"');
      console.log('3. For Atlas: Check your connection string and network access');
    } else if (error.message.includes('authentication')) {
      console.log('\n💡 Solution:');
      console.log('1. Check your MongoDB username and password');
      console.log('2. Verify database user has correct permissions');
    } else if (error.message.includes('network')) {
      console.log('\n💡 Solution:');
      console.log('1. For Atlas: Add your IP address in Network Access');
      console.log('2. Check your internet connection');
    }
    
    process.exit(1);
  }
}

testConnection();


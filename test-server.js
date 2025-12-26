// Server connection test script
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

console.log('\n🔍 SERVER CONNECTION TEST\n' + '='.repeat(50));

// Test 1: Check if .env file is loaded correctly
console.log('\n📋 TEST 1: Environment Variables');
console.log('-'.repeat(50));
console.log('PORT:', PORT ? '✅ Found' : '❌ Missing');
console.log('MONGODB_URI:', MONGODB_URI ? '✅ Found' : '❌ Missing');

if (MONGODB_URI) {
  console.log('MongoDB URI pattern check:', 
    MONGODB_URI.includes('mongodb://') || MONGODB_URI.includes('mongodb+srv://') 
      ? '✅ Valid format' 
      : '❌ Invalid format');
}

// Test 2: Check if server is running
async function checkServerRunning() {
  console.log('\n📋 TEST 2: Server Status');
  console.log('-'.repeat(50));
  
  try {
    const response = await fetch(`http://localhost:${PORT}/health`);
    const data = await response.json();
    
    console.log('Server status:', '✅ Running');
    console.log('Response:', data);
    
    return true;
  } catch (error) {
    console.log('Server status:', '❌ Not running or health endpoint not available');
    console.log('Error:', error.message);
    
    return false;
  }
}

// Test 3: Check MongoDB connection directly
async function checkMongoDBConnection() {
  console.log('\n📋 TEST 3: MongoDB Connection');
  console.log('-'.repeat(50));
  
  if (!MONGODB_URI) {
    console.log('❌ Cannot test MongoDB connection: MONGODB_URI is missing');
    return false;
  }
  
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(MONGODB_URI, { 
      serverSelectionTimeoutMS: 5000 // 5 second timeout
    });
    
    console.log('MongoDB connection:', '✅ Successful');
    
    // Check if we can query the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name).join(', '));
    
    await mongoose.connection.close();
    return true;
  } catch (error) {
    console.log('MongoDB connection:', '❌ Failed');
    console.log('Error:', error.message);
    
    return false;
  }
}

// Test 4: Check API endpoints
async function checkAPIEndpoints() {
  console.log('\n📋 TEST 4: API Endpoints');
  console.log('-'.repeat(50));
  
  const endpoints = [
    { url: `/api/auth/signin`, method: 'POST' },
    { url: `/api/auth/signup`, method: 'POST' },
    { url: `/api/profile`, method: 'GET' },
  ];
  
  let success = 0;
  
  for (const endpoint of endpoints) {
    try {
      // We're just checking if the endpoint exists, not if it works correctly
      const response = await fetch(`http://localhost:${PORT}${endpoint.url}`, {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' },
        body: endpoint.method === 'POST' ? JSON.stringify({}) : undefined
      });
      
      // Even a 400 error means the endpoint exists
      console.log(`${endpoint.method} ${endpoint.url}:`, 
        response.status < 500 ? '✅ Available' : '❌ Server Error');
      
      if (response.status < 500) success++;
    } catch (error) {
      console.log(`${endpoint.method} ${endpoint.url}:`, '❌ Not available');
      console.log('Error:', error.message);
    }
  }
  
  return success > 0;
}

// Run all tests
async function runTests() {
  console.log('\n🧪 Running server connection tests...\n');
  
  const serverRunning = await checkServerRunning();
  const mongoConnected = await checkMongoDBConnection();
  
  // Only check API endpoints if server is running
  let apiWorking = false;
  if (serverRunning) {
    apiWorking = await checkAPIEndpoints();
  }
  
  // Summary
  console.log('\n📊 TEST SUMMARY');
  console.log('-'.repeat(50));
  console.log('Environment Variables:', MONGODB_URI && PORT ? '✅ OK' : '❌ Issues detected');
  console.log('Server Running:', serverRunning ? '✅ OK' : '❌ Not running');
  console.log('MongoDB Connection:', mongoConnected ? '✅ OK' : '❌ Issues detected');
  console.log('API Endpoints:', apiWorking ? '✅ OK' : '❌ Issues detected');
  
  // Recommendations
  console.log('\n🔧 RECOMMENDATIONS');
  console.log('-'.repeat(50));
  
  if (!serverRunning) {
    console.log('• Start the server with: npm run server');
    console.log('• Check for errors in server logs');
  }
  
  if (!mongoConnected) {
    console.log('• Verify your MongoDB connection string in .env file');
    console.log('• Check if MongoDB Atlas whitelist includes your IP address');
    console.log('• Try connecting to MongoDB with MongoDB Compass to test credentials');
  }
  
  if (!apiWorking && serverRunning) {
    console.log('• Check server logs for API route errors');
    console.log('• Verify that all required middleware is properly set up');
  }
  
  console.log('\n');
}

runTests().catch(console.error);

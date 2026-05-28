#!/usr/bin/env node

/**
 * Quick Backend API Testing Script
 * Run: node test-api.js
 */

const http = require('http');

const BASE_URL = 'http://localhost:5000';
let adminToken = null;

// Helper function to make HTTP requests
function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, data: json });
        } catch {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Backend API Tests...\n');

  try {
    // Test 1: Register Admin User
    console.log('1️⃣  Registering Admin User...');
    const registerRes = await makeRequest('POST', '/api/auth/register', {
      name: 'Test Admin',
      email: `admin-${Date.now()}@test.com`,
      password: 'password123',
    });

    if (registerRes.status !== 201) {
      console.error('❌ Registration failed:', registerRes.data);
      return;
    }

    adminToken = registerRes.data.token;
    console.log('✅ Admin registered successfully');
    console.log(`   Role: ${registerRes.data.role}`);
    console.log(`   Token: ${adminToken.substring(0, 30)}...\n`);

    // Test 2: Login User
    console.log('2️⃣  Testing Login...');
    const loginRes = await makeRequest('POST', '/api/auth/login', {
      email: registerRes.data.email,
      password: 'password123',
    });

    if (loginRes.status !== 200) {
      console.error('❌ Login failed:', loginRes.data);
      return;
    }

    console.log('✅ Login successful');
    console.log(`   Token matches: ${loginRes.data.token === adminToken}\n`);

    // Test 3: Add Product
    console.log('3️⃣  Adding Product...');
    const productRes = await makeRequest(
      'POST',
      '/api/products',
      {
        name: 'Test Shirt',
        description: 'High quality test shirt',
        price: 49.99,
        category: 'Clothing',
        brand: 'TestBrand',
        images: ['https://via.placeholder.com/300'],
        sizes: ['S', 'M', 'L'],
        colors: ['Red', 'Blue'],
        stock: 100,
      },
      adminToken
    );

    if (productRes.status !== 201) {
      console.error('❌ Product creation failed:', productRes.data);
      return;
    }

    console.log('✅ Product created successfully');
    console.log(`   Product ID: ${productRes.data._id}`);
    console.log(`   Product Name: ${productRes.data.name}\n`);

    // Test 4: Get All Products
    console.log('4️⃣  Getting All Products...');
    const productsRes = await makeRequest('GET', '/api/products');

    if (productsRes.status !== 200) {
      console.error('❌ Failed to get products:', productsRes.data);
      return;
    }

    console.log('✅ Products retrieved successfully');
    console.log(`   Total products: ${productsRes.data.products.length}\n`);

    // Test 5: Get User Profile
    console.log('5️⃣  Getting User Profile...');
    const profileRes = await makeRequest('GET', '/api/auth/profile', null, adminToken);

    if (profileRes.status !== 200) {
      console.error('❌ Failed to get profile:', profileRes.data);
      return;
    }

    console.log('✅ User profile retrieved successfully');
    console.log(`   Name: ${profileRes.data.name}`);
    console.log(`   Email: ${profileRes.data.email}\n`);

    console.log('🎉 All tests passed successfully!');
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

// Wait a bit for server to be ready
setTimeout(runTests, 1000);

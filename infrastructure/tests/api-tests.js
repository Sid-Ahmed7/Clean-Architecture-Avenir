const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:3000/api';
let accessToken = null;
let clientAccessToken = null;
let directorAccessToken = null;
let adminAccessToken = null;

// Test users
const testClient = {
  email: 'test-client@example.com',
  password: 'Password123!',
  firstName: 'Test',
  lastName: 'Client',
  phoneNumber: '1234567890',
  dateOfBirth: '1990-01-01',
  address: '123 Test St'
};

const testDirector = {
  email: 'test-director@example.com',
  password: 'Password123!',
  firstName: 'Test',
  lastName: 'Director',
  phoneNumber: '0987654321',
  dateOfBirth: '1980-01-01',
  address: '456 Test Ave'
};

const testAdmin = {
  email: 'test-admin@example.com',
  password: 'Password123!',
  firstName: 'Test',
  lastName: 'Admin',
  phoneNumber: '5555555555',
  dateOfBirth: '1970-01-01',
  address: '789 Test Blvd'
};

// Helper functions
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

const setAuthHeader = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Test functions
async function testHealthCheck() {
  try {
    console.log('\n--- Testing Health Check Endpoint ---');
    const response = await api.get('/health');
    console.log('Health check status:', response.status);
    console.log('Health check response:', response.data);
    return true;
  } catch (error) {
    console.error('Health check failed:', error.message);
    return false;
  }
}

async function testRegister(user) {
  try {
    console.log(`\n--- Testing Register for ${user.email} ---`);
    const response = await api.post('/auth/register', user);
    console.log('Register status:', response.status);
    console.log('Register response:', response.data);
    return true;
  } catch (error) {
    console.error('Register failed:', error.response?.data || error.message);
    return false;
  }
}

async function testLogin(user) {
  try {
    console.log(`\n--- Testing Login for ${user.email} ---`);
    const response = await api.post('/auth/login', {
      email: user.email,
      password: user.password
    });
    console.log('Login status:', response.status);
    console.log('Login response:', response.data);
    
    // Store the access token
    const token = response.data.accessToken;
    if (user.email === testClient.email) {
      clientAccessToken = token;
    } else if (user.email === testDirector.email) {
      directorAccessToken = token;
    } else if (user.email === testAdmin.email) {
      adminAccessToken = token;
    }
    
    return token;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    return null;
  }
}

async function testClientProfile(token) {
  try {
    console.log('\n--- Testing Client Profile Endpoint ---');
    setAuthHeader(token);
    const response = await api.get('/client/profile');
    console.log('Client profile status:', response.status);
    console.log('Client profile response:', response.data);
    return true;
  } catch (error) {
    console.error('Client profile access failed:', error.response?.data || error.message);
    return false;
  }
}

async function testDirectorDashboard(token) {
  try {
    console.log('\n--- Testing Director Dashboard Endpoint ---');
    setAuthHeader(token);
    const response = await api.get('/director/dashboard');
    console.log('Director dashboard status:', response.status);
    console.log('Director dashboard response:', response.data);
    return true;
  } catch (error) {
    console.error('Director dashboard access failed:', error.response?.data || error.message);
    return false;
  }
}

async function testManagementUsers(token) {
  try {
    console.log('\n--- Testing Management Users Endpoint ---');
    setAuthHeader(token);
    const response = await api.get('/management/users');
    console.log('Management users status:', response.status);
    console.log('Management users response:', response.data);
    return true;
  } catch (error) {
    console.error('Management users access failed:', error.response?.data || error.message);
    return false;
  }
}

async function testLogout() {
  try {
    console.log('\n--- Testing Logout ---');
    const response = await api.post('/auth/logout');
    console.log('Logout status:', response.status);
    console.log('Logout response:', response.data);
    
    // Clear the auth header
    setAuthHeader(null);
    
    return true;
  } catch (error) {
    console.error('Logout failed:', error.response?.data || error.message);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('Starting API tests...');
  
  // Test health check
  await testHealthCheck();
  
  // Test register and login for client
  await testRegister(testClient);
  const clientToken = await testLogin(testClient);
  
  // Test register and login for director
  await testRegister(testDirector);
  const directorToken = await testLogin(testDirector);
  
  // Test register and login for admin
  await testRegister(testAdmin);
  const adminToken = await testLogin(testAdmin);
  
  // Test protected routes with client token
  if (clientToken) {
    console.log('\n=== Testing with Client Token ===');
    await testClientProfile(clientToken);
    await testDirectorDashboard(clientToken); // Should fail
    await testManagementUsers(clientToken); // Should fail
  }
  
  // Test protected routes with director token
  if (directorToken) {
    console.log('\n=== Testing with Director Token ===');
    await testClientProfile(directorToken); // Should fail
    await testDirectorDashboard(directorToken);
    await testManagementUsers(directorToken);
  }
  
  // Test protected routes with admin token
  if (adminToken) {
    console.log('\n=== Testing with Admin Token ===');
    await testClientProfile(adminToken); // Should fail
    await testDirectorDashboard(adminToken); // Should fail
    await testManagementUsers(adminToken);
  }
  
  // Test logout
  await testLogout();
  
  // Test accessing protected route after logout (should fail)
  console.log('\n--- Testing Protected Route After Logout ---');
  await testClientProfile(clientToken);
  
  console.log('\nAPI tests completed!');
}

// Run the tests
runTests().catch(error => {
  console.error('Test execution failed:', error);
});
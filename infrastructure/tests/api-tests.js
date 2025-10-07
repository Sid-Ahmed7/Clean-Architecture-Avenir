const axios = require('axios');

const API_URL = 'http://localhost:3000/api';
let accessToken = null;
let clientAccessToken = null;
let directorAccessToken = null;
let adminAccessToken = null;

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
    
    setAuthHeader(null);
    
    return true;
  } catch (error) {
    console.error('Logout failed:', error.response?.data || error.message);
    return false;
  }
}

async function runTests() {
  console.log('Starting API tests...');
  
  await testHealthCheck();
  
  await testRegister(testClient);
  const clientToken = await testLogin(testClient);
  
  await testRegister(testDirector);
  const directorToken = await testLogin(testDirector);
  
  await testRegister(testAdmin);
  const adminToken = await testLogin(testAdmin);
  
  if (clientToken) {
    console.log('\n=== Testing with Client Token ===');
    await testClientProfile(clientToken);
    await testDirectorDashboard(clientToken); 
    await testManagementUsers(clientToken); 
  }
  
  if (directorToken) {
    console.log('\n=== Testing with Director Token ===');
    await testClientProfile(directorToken); 
    await testDirectorDashboard(directorToken);
    await testManagementUsers(directorToken);
  }
  
  if (adminToken) {
    console.log('\n=== Testing with Admin Token ===');
    await testClientProfile(adminToken);
    await testDirectorDashboard(adminToken); 
    await testManagementUsers(adminToken);
  }
  
  await testLogout();
  
  console.log('\n--- Testing Protected Route After Logout ---');
  await testClientProfile(clientToken);
  
  console.log('\nAPI tests completed!');
}

runTests().catch(error => {
  console.error('Test execution failed:', error);
});
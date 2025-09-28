# API Testing Guide

This guide explains how to test the API endpoints to verify that the authentication and authorization mechanisms work correctly.

## Prerequisites

Before running the tests, make sure:

1. The server is running on `http://localhost:3000`
2. Node.js is installed on your system
3. Required dependencies are installed:
   ```
   npm install axios
   ```

## Running the Tests

There are two ways to run the tests:

### Option 1: Run the tests with the server already running

If you already have the server running on http://localhost:3000:

```bash
node infrastructure/tests/api-tests.js
```

### Option 2: Automatically start the server and run tests

To automatically start the server, run the tests, and then shut down the server:

```bash
node infrastructure/tests/run-tests.js
```

This script will:
1. Start the server using ts-node
2. Wait for the server to initialize
3. Run the API tests
4. Shut down the server when tests are complete

## What the Tests Cover

The test script performs the following checks:

1. **Health Check**: Verifies the API is up and running
2. **User Registration**: Tests registration for three different user types:
   - Client
   - Director (Bank Manager)
   - Admin
3. **User Login**: Tests login functionality for each user type
4. **Protected Routes**: Tests access to protected endpoints with different user roles:
   - `/api/client/profile` - Should only be accessible by users with the CLIENT role
   - `/api/director/dashboard` - Should only be accessible by users with the BANK_MANAGER role
   - `/api/management/users` - Should be accessible by users with either BANK_MANAGER or ADMIN roles
5. **Logout**: Tests the logout functionality
6. **Post-Logout Access**: Verifies that protected routes cannot be accessed after logout

## Expected Results

- **Client User**: Should be able to access the client profile endpoint but not the director dashboard or management users endpoints
- **Director User**: Should be able to access the director dashboard and management users endpoints but not the client profile endpoint
- **Admin User**: Should be able to access the management users endpoint but not the client profile or director dashboard endpoints
- **After Logout**: No protected endpoints should be accessible

## Troubleshooting

If the tests fail, check:

1. The server is running and accessible
2. The database is properly set up (if applicable)
3. The JWT secret key matches between the server and the test script
4. The role names match the expected values in the RoleEnum

## Manual Testing

You can also test the API manually using tools like Postman or curl:

### Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"Password123!","firstName":"Test","lastName":"User"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"Password123!"}'
```

### Access Protected Route
```bash
curl -X GET http://localhost:3000/api/client/profile -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Logout
```bash
curl -X POST http://localhost:3000/api/auth/logout -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

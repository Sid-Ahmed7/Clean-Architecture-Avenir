# Clean-Architecture-Avenir

## Authentication System

This project implements a clean architecture-based authentication system for a banking application. The system allows clients to register and directors (bank managers) to login.

### Features

- **User Registration**: Clients can register with email, password, and personal information
- **User Login**: Both clients and directors can login with email and password
- **Role-Based Authorization**: Different routes are protected based on user roles
- **JWT Authentication**: Uses JWT tokens for secure authentication
- **Refresh Tokens**: Implements refresh tokens for extended sessions

### Architecture

The authentication system follows clean architecture principles:

- **Domain Layer**: Contains entities, value objects, and business rules
- **Application Layer**: Contains use cases that orchestrate the business logic
- **Infrastructure Layer**: Contains implementations of repositories, controllers, and external services

### API Endpoints

#### Public Endpoints

- `POST /api/auth/register` - Register a new client
- `POST /api/auth/login` - Login as a client or director
- `POST /api/auth/logout` - Logout and invalidate tokens
- `GET /api/health` - Health check endpoint

#### Protected Endpoints

- `GET /api/client/profile` - Access client profile (client only)
- `GET /api/director/dashboard` - Access director dashboard (director only)
- `GET /api/management/users` - Access user management (directors and admins)

### Authentication Flow

1. **Registration**:
   - Client submits registration form with email, password, and personal information
   - System validates the input and creates a new user with CLIENT role
   - System returns a success message

2. **Login**:
   - User submits email and password
   - System validates credentials and checks user status
   - System generates access token and refresh token
   - System returns tokens and user information

3. **Accessing Protected Routes**:
   - Client includes access token in Authorization header
   - System validates token and checks user roles
   - System grants or denies access based on roles

### Development

To run the server in development mode:

```bash
# Navigate to the project root directory
cd C:\Users\arthu\WebstormProjects\Clean-Architecture-Avenir

# Install dependencies at the root level (this will install dependencies for all workspaces)
npm install

# Navigate to the server directory
cd infrastructure\server

# Run the development server
npm run dev
```

If you encounter any issues:

1. Make sure you have Node.js installed (version 14 or higher recommended)
2. Try installing dependencies directly in the server directory:
   ```bash
   cd infrastructure\server
   npm install
   npm run dev
   ```
3. This project uses Express 5.1.0 (beta) with proper TypeScript typing:
   ```bash
   cd infrastructure\server
   npm install express@5.1.0 @types/express@5.0.3 --save
   ```
4. Check for any error messages in the console and resolve them accordingly

### Recent Fixes

The following improvements have been made in the latest update:

1. Added proper TypeScript typing to all Express route handlers to ensure type safety with Express 5.1.0 (beta)
2. Updated the corresponding @types/express package to version 5.0.3 to match Express 5.1.0
3. Fixed the empty index.ts file in the server directory to properly export from src/index.ts
4. Ensured all request and response objects are properly typed in the codebase
5. Enabled 'esModuleInterop' in tsconfig.json to resolve import issues with CommonJS modules

These changes should resolve the issues with running the project while maintaining clean code practices and proper TypeScript typing.

### Technologies Used

- TypeScript
- Express.js
- JWT (JSON Web Tokens)
- Clean Architecture

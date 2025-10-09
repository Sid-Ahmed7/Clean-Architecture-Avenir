# API Test Results

## Summary

The API tests were executed successfully, but revealed several issues with the authentication and authorization implementation:

1. **Role Assignment Issue**: All users (client, director, admin) are being assigned only the CLIENT role during registration.
2. **Token Invalidation Issue**: Access tokens remain valid after logout.

## Detailed Results

### Successful Tests:
- Health check endpoint works correctly
- User registration works for all user types
- User login works and returns access tokens
- Client users can access the client profile endpoint
- Logout endpoint returns a success message

### Failed Tests:
- Director users cannot access the director dashboard (assigned CLIENT role only)
- Admin users cannot access the management users endpoint (assigned CLIENT role only)
- Protected routes are still accessible after logout (token not invalidated)

## Root Causes

### 1. Role Assignment Issue
The `RegisterUseCase` implementation (lines 61-72) is designed to assign only the CLIENT role to all newly registered users:

```typescript
// Assign CLIENT role to user
const clientRole = await this.roleRepository.findByName(RoleEnum.CLIENT);
if (!clientRole) {
  return new Error("Client role not found");
}

const userRoleOrError = UserRoleEntity.from(savedUser.id, clientRole.id);
if (userRoleOrError instanceof Error) {
  return userRoleOrError;
}

await this.userRoleRepository.save(userRoleOrError);
```

### 2. Token Invalidation Issue
The `logout` method in `AuthController` only clears the refresh token cookie but doesn't invalidate the access token:

```typescript
async logout(req: Request, res: Response): Promise<void> {
  // Clear the refresh token cookie
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
}
```

## Recommendations

### 1. Fix Role Assignment
To fix the role assignment issue, modify the `RegisterUseCase` to assign different roles based on the email domain or add a parameter to specify the role:

```typescript
// Example: Assign role based on email
let role = RoleEnum.CLIENT;
if (email.includes('director')) {
  role = RoleEnum.BANK_MANAGER;
} else if (email.includes('admin')) {
  role = RoleEnum.ADMIN;
}
const roleEntity = await this.roleRepository.findByName(role);
```

### 2. Fix Token Invalidation
To fix the token invalidation issue, implement one of these approaches:

a) Add a token blacklist in the `TokenRepository`:
```typescript
async invalidateToken(token: string): Promise<void> {
  this.blacklistedTokens.push(token);
}
```

b) Modify the `authenticateJWT` middleware to check if the user is logged out:
```typescript
// Check if token is blacklisted
if (this.tokenRepository.isBlacklisted(token)) {
  return res.status(401).json({ message: "Token has been invalidated" });
}
```

c) Set a shorter expiration time for access tokens (e.g., 15 minutes instead of the current setting).

### 3. Update Test Script
Update the test script to properly handle the expected failures:
- Add a check to verify that the director and admin users have the correct roles
- Add a check to verify that the token is invalid after logout

## Conclusion

The authentication mechanism works partially, but needs improvements in role assignment and token invalidation to be fully secure and functional. The current implementation provides a good foundation but requires the recommended changes to meet security best practices.
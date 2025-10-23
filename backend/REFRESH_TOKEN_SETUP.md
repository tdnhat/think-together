# Refresh Token Implementation Guide

## Overview
This implementation adds refresh token support to the authentication system. Users can now get new access tokens by using their refresh tokens without re-authenticating.

## Changes Made

### 1. Domain Layer

#### RefreshToken Entity (`Domain/Aggregates/UserAggregate/Entities/RefreshToken.cs`)
- New entity to store refresh tokens
- Factory method: `RefreshToken.Create(userId, token, lifetime)`
- Business logic methods:
  - `IsExpired()` - Check if token has expired
  - `IsRevoked()` - Check if token has been revoked
  - `IsValid()` - Check if token is both not expired and not revoked
  - `Revoke()` - Revoke the token (for token rotation)

#### User Entity Update
- Added `RefreshTokens` collection (one-to-many relationship)
- Added method: `AddRefreshToken(RefreshToken)` - Add refresh token to user

### 2. Infrastructure Layer

#### RefreshTokenConfiguration (`Infrastructure/Persistence/Configurations/RefreshTokenConfiguration.cs`)
- EF Core configuration with Vietnamese column names:
  - Table: `MaLamMoi` (Refresh Token)
  - Primary key: `idMaLamMoi`
  - Foreign key: `idNguoiDung` (User ID)
  - Token: `maToken`
  - Expiration: `hetHanLuc`
  - Revocation: `thuHoiLuc`
  - Created: `taoLuc`
  - Updated: `capNhatLuc`
- Unique index on `Token`
- Foreign key with cascade delete

### 3. Application Layer

#### RefreshTokenResponseDto
Response structure:
```csharp
public record RefreshTokenResponseDto(
    string AccessToken,
    string RefreshToken,
    long ExpiresAt,
    string TokenType = "Bearer",
    int ExpiresIn = 900);
```

#### RefreshTokenCommand
- Takes a refresh token string as input
- Returns `RefreshTokenResponseDto`

#### RefreshTokenCommandValidator
- Validates token is not empty and has valid format

#### RefreshTokenCommandHandler
- Validates the refresh token exists and is valid
- Revokes the old token (token rotation)
- Generates new access and refresh tokens
- Saves new token to database
- Returns the new token response

### 4. Presentation Layer

#### AuthenticationController Update
- New endpoint: `POST /api/auth/refresh-token`
- Extracts refresh token from cookies (name: `refreshToken`)
- Returns error if no refresh token found
- Sends command to handler via MediatR
- Returns new tokens

### 5. Handler Updates

#### RegisterUserCommandHandler & LoginUserCommandHandler
- Now save refresh token to database after user creation/login
- Use lifetime configuration from `IJwtTokensGenerator.GetRefreshTokenLifetime()`

## Database Migration Steps

Run these commands in Package Manager Console (set default project to `ThinkTogether.Infrastructure`):

```powershell
Add-Migration AddRefreshTokenEntity
Update-Database
```

## API Endpoint

### Refresh Token
```http
POST /api/auth/refresh-token
Cookie: refreshToken=<base64_encoded_token>
```

**Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "new_refresh_token_base64...",
  "expiresAt": 1729600000,
  "tokenType": "Bearer",
  "expiresIn": 900
}
```

**Error Response (401):**
```json
{
  "type": "https://tools.ietf.org/html/rfc7235#section-3.1",
  "title": "Unauthorized",
  "status": 401,
  "detail": "Refresh token is missing.",
  "instance": "/api/auth/refresh-token"
}
```

## Configuration

Edit `appsettings.json`:
```json
{
  "JwtSettings": {
    "AccessTokenExpirationMinutes": 15,
    "RefreshTokenExpirationDays": 7,
    "RefreshTokenExpirationDaysRememberMe": 30
  }
}
```

## Token Rotation Strategy

When a refresh token is used:
1. Validate the token exists and is valid
2. Generate new access token and refresh token
3. Revoke the old refresh token (mark as revoked)
4. Save new token to database
5. Return new tokens to client

This prevents token replay attacks.

## Security Considerations

✅ **Token Expiration** - Refresh tokens expire after configured days
✅ **Token Revocation** - Old tokens are marked as revoked (soft delete)
✅ **Token Rotation** - New refresh token issued on each refresh
✅ **Secure Storage** - Stored in HTTP-only cookies (via client)
✅ **Unique Constraint** - Each token is unique in the database
✅ **User Validation** - Token must belong to the authenticated user

## Testing

### Test Refresh Token Flow
```csharp
// 1. Register/Login to get tokens
POST /api/auth/register
// Response contains refreshToken

// 2. Wait for access token to expire
// 3. Call refresh endpoint
POST /api/auth/refresh-token
Cookie: refreshToken={token_from_login}

// 4. Verify new tokens are returned
```

## Notes

- Refresh tokens are database-backed for security
- Old tokens are not deleted but marked as revoked
- This allows for token audit trails
- Refresh token lifetime is configurable per environment
- Token cookie name: `refreshToken` (HTTP-only recommended)

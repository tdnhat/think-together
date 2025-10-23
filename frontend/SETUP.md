# ThinkTogether Frontend Setup Guide

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API server running (default: `http://localhost:5000`)

## Installation

1. **Clone the repository and navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Create a `.env.local` file in the frontend root directory:
   ```env
   # API Configuration (Required)
   NEXT_PUBLIC_API_URL=http://localhost:5000
   
   # Socket.io for real-time features (Optional)
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   
   # Azure Storage for media uploads (Optional - for production)
   AZURE_STORAGE_CONNECTION_STRING=your_connection_string
   AZURE_STORAGE_CONTAINER_NAME=thinktogether-media
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

### Required Variables

- `NEXT_PUBLIC_API_URL`: Backend API base URL
  - Development: `http://localhost:5000`
  - Production: Your deployed backend URL

### Optional Variables

- `NEXT_PUBLIC_SOCKET_URL`: Socket.io server URL for real-time features
- `AZURE_STORAGE_CONNECTION_STRING`: Azure Storage connection string for media uploads
- `AZURE_STORAGE_CONTAINER_NAME`: Azure Storage container name

### Important Notes

- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Never commit `.env.local` to version control
- Update the API URL when deploying to production

## API Integration

### Authentication Flow

1. User enters credentials in login/signup form
2. Frontend sends request to `/api/auth/login` or `/api/auth/register`
3. Backend returns access token and sets refresh token in HTTP-only cookie
4. Access token is stored in localStorage
5. All subsequent API requests include `Authorization: Bearer {token}` header

### Automatic Token Refresh

The API client automatically handles token refresh:

1. When a request receives 401 Unauthorized:
   - Client calls `/api/auth/refresh-token` endpoint
   - Backend validates refresh token from cookie
   - Returns new access token
   - Original request is retried with new token

2. If refresh fails:
   - User is redirected to login page
   - Tokens are cleared from storage

### Error Handling

All backend errors follow RFC 7807 ProblemDetails format:

```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "Validation Error",
  "status": 400,
  "detail": "Vui lòng kiểm tra lại các trường đã nhập.",
  "errors": {
    "Email": ["Email là bắt buộc"],
    "Password": ["Mật khẩu phải có ít nhất 8 ký tự"]
  }
}
```

Validation errors are automatically mapped to form fields using the `mapApiErrorsToForm` helper.

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # Reusable UI components
│   ├── features/               # Feature-specific components
│   │   └── auth/               # Authentication features
│   ├── lib/                    # Core utilities
│   │   ├── api.ts              # Axios client with token refresh
│   │   ├── services/           # API service layer
│   │   │   └── auth.service.ts # Authentication API calls
│   │   ├── form-errors.ts      # Form error mapping helper
│   │   ├── utils.ts            # Utility functions
│   │   └── validators.ts       # Zod validation schemas
│   ├── hooks/                  # Custom React hooks
│   │   └── use-auth.ts         # Authentication hook
│   ├── stores/                 # Zustand state management
│   │   └── user-store.ts       # User state store
│   └── types/                  # TypeScript types
│       ├── index.ts            # General types
│       └── api.ts              # API-specific types
├── .env.local                  # Environment variables (create this)
├── next.config.mjs             # Next.js configuration
└── package.json                # Dependencies
```

## Key Files

### API Client (`src/lib/api.ts`)
- Axios instance with interceptors
- Automatic token refresh logic
- Request/response error handling
- Token management (get, set, clear)

### Auth Service (`src/lib/services/auth.service.ts`)
- `login(email, password)` - User login
- `register(data)` - User registration
- `logout()` - User logout
- `getCurrentUser()` - Get current user info
- `refreshToken()` - Refresh access token

### Auth Hook (`src/hooks/use-auth.ts`)
- Wraps auth service with state management
- Handles user state updates
- Maps DTOs between frontend and backend
- Provides auth functions to components

### Form Error Helper (`src/lib/form-errors.ts`)
- `mapApiErrorsToForm()` - Maps backend validation errors to react-hook-form
- Converts PascalCase field names to camelCase
- Extracts first error message from arrays

## Common Issues

### CORS Errors

If you see CORS errors, ensure your backend has CORS configured:

```csharp
// Backend: Program.cs
app.UseCors(policy => policy
    .WithOrigins("http://localhost:3000")
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials());
```

### Token Refresh Loop

If you see infinite token refresh requests:
- Check that refresh token cookie is being set properly
- Verify cookie settings match (HttpOnly, Secure, SameSite)
- Ensure backend returns proper 401 status for expired tokens

### Environment Variables Not Loading

- Restart the dev server after changing `.env.local`
- Verify variable names start with `NEXT_PUBLIC_`
- Check for typos in variable names

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type check
npm run type-check
```

## Testing the Integration

1. Start the backend server (port 5000)
2. Start the frontend server (port 3000)
3. Navigate to http://localhost:3000/signup
4. Create a new account
5. Verify you're redirected to `/my-quizzes` after successful signup
6. Check browser DevTools Network tab to see API calls
7. Verify tokens are stored in localStorage
8. Test logout functionality

## Production Deployment

1. Update `NEXT_PUBLIC_API_URL` to your production backend URL
2. Build the application: `npm run build`
3. Deploy to your hosting platform (Vercel, Netlify, etc.)
4. Ensure backend CORS allows your frontend domain
5. Test authentication flow in production

## Support

For issues or questions:
1. Check the Network tab in browser DevTools
2. Review backend logs for errors
3. Verify environment variables are correct
4. Check that backend is running and accessible


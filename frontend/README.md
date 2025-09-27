# ThinkTogether Frontend

A modern Next.js frontend for the ThinkTogether interactive quiz platform.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth route group
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (dashboard)/       # Dashboard route group
│   │   │   └── my-quizzes/
│   │   ├── challenge/[id]/    # Challenge pages
│   │   ├── play/[pin]/        # Live game pages
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/            # Reusable UI components
│   │   └── ui/               # shadcn/ui components
│   ├── features/             # Feature-specific components
│   │   ├── auth/             # Authentication features
│   │   ├── quiz-builder/     # Quiz creation features
│   │   ├── game-host/        # Host interface features
│   │   └── game-player/      # Player interface features
│   ├── lib/                  # Core utilities
│   │   ├── api.ts            # API client
│   │   ├── utils.ts          # Utility functions
│   │   └── validators.ts     # Form validation schemas
│   ├── hooks/                # Custom React hooks
│   ├── stores/               # Zustand state management
│   ├── providers/            # React context providers
│   ├── styles/               # Global styles
│   └── types/                # TypeScript type definitions
├── next.config.mjs           # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Real-time:** Socket.io Client
- **UI Components:** shadcn/ui (planned)
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

## 🎯 Key Features

### Authentication
- User registration and login
- Persistent authentication state
- Protected routes

### Quiz Management
- Create and edit quiz sets
- Multiple question types (text, multiple choice, true/false, video)
- Media upload support
- Question ordering and validation

### Live Games
- Real-time game hosting
- PIN-based player joining
- Live score tracking
- Socket.io integration

### Video Questions
- Video upload and preview
- Timestamp-based question display
- 15-second loop functionality
- Progress tracking

## 🔧 Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## 📦 Package Management

### Core Dependencies
- `next` - React framework
- `react` & `react-dom` - React library
- `typescript` - Type safety
- `tailwindcss` - Utility-first CSS

### State & Data
- `zustand` - State management
- `axios` - HTTP client
- `socket.io-client` - Real-time communication

### Forms & Validation
- `react-hook-form` - Form handling
- `@hookform/resolvers` - Form validation resolvers
- `zod` - Schema validation

### UI & UX
- `react-hot-toast` - Notifications
- `lucide-react` - Icons
- `framer-motion` - Animations
- `react-player` - Video playback

## 🔌 API Integration

The frontend communicates with the .NET backend through:
- RESTful API endpoints (`/api/*`)
- WebSocket connections for real-time features
- File upload endpoints for media handling

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
AZURE_STORAGE_CONNECTION_STRING=your_connection_string
AZURE_STORAGE_CONTAINER_NAME=thinktogether-media
```

## 🎨 Styling Guidelines

- Use Tailwind CSS utility classes
- Follow the design system defined in `tailwind.config.js`
- Use CSS variables for theming
- Maintain consistent spacing and typography

## 🔒 Security Considerations

- JWT tokens stored in localStorage
- Automatic token refresh
- Protected API routes
- Input validation on all forms
- XSS protection through React's built-in escaping

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1400px)
- Touch-friendly interfaces
- Progressive enhancement

## 🚀 Deployment

The application is ready for deployment on:
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Any Node.js hosting platform

Build command: `npm run build`
Output directory: `.next/`

## 🔄 Next Steps

1. Install shadcn/ui components
2. Implement remaining features
3. Add comprehensive testing
4. Set up CI/CD pipeline
5. Deploy to production

## 📞 Support

For questions or issues, please refer to the project documentation or create an issue in the repository.

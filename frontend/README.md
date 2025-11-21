# ThinkTogether Frontend

Production-ready Next.js application for collaborative learning through quizzes and games.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Documentation

**New to the project?** Start here:

1. **[Getting Started Guide](./docs/GETTING_STARTED.md)** ⭐ - Complete setup and onboarding guide
2. **[Development Guide](./docs/DEVELOPMENT.md)** - Coding standards and patterns
3. **[Architecture](./docs/ARCHITECTURE.md)** - System design and structure
4. **[Design System](./docs/DESIGN_SYSTEM.md)** - UI components and styling
5. **[Style Guide](./docs/STYLE_GUIDE.md)** - Quick styling reference

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + Shadcn UI
- **State**: Zustand
- **Forms**: React Hook Form + Zod
- **API**: Axios
- **Real-time**: SignalR

## 📁 Project Structure

```
src/
├── app/           # Next.js routes (pages)
├── config/        # Configuration & constants
├── lib/           # Core utilities (API, errors, utils)
├── features/      # Feature modules (auth, quiz, game)
├── shared/        # Reusable components & hooks
├── stores/        # Global state (Zustand)
├── widgets/       # Composite UI components
└── types/         # Global TypeScript types
```

## 🎯 Core Principles

1. **No Magic Strings** - Use `@/config/constants`
2. **Proper Error Handling** - Use `@/lib/errors/error-handler`
3. **Type Safety** - Strict TypeScript throughout
4. **Vietnamese Localization** - All user-facing text
5. **Centralized API** - Use `@/lib/api/services`
6. **Global State** - Zustand for auth, UI, quiz state

## 🚦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

## ⚙️ Environment Variables

See `env.example` for all required environment variables.

**Required:**
- `NEXT_PUBLIC_API_URL` - Backend API URL

**Optional:**
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry error tracking
- `NEXT_PUBLIC_GA_TRACKING_ID` - Google Analytics

## 🏗️ Architecture Highlights

✅ **Configuration** - No magic strings, type-safe env  
✅ **Error Handling** - Comprehensive error system  
✅ **API Layer** - Type-safe client with auto-retry  
✅ **State Management** - Zustand with persistence  
✅ **Custom Hooks** - Reusable utilities  
✅ **Vietnamese** - Full localization

## 📖 Quick Links

- **[Getting Started](./docs/GETTING_STARTED.md)** - Setup and onboarding
- **[Development Guide](./docs/DEVELOPMENT.md)** - Coding standards
- **[Architecture](./docs/ARCHITECTURE.md)** - System design
- **[Design System](./docs/DESIGN_SYSTEM.md)** - UI components
- **[Style Guide](./docs/STYLE_GUIDE.md)** - Styling reference

## 🤝 Contributing

1. Read the [Getting Started Guide](./docs/GETTING_STARTED.md)
2. Follow the [Development Guide](./docs/DEVELOPMENT.md)
3. Use the checklist for new features
4. Ensure all user text is in Vietnamese

---

**Last Updated**: December 2024

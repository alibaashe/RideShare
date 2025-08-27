# Overview

Sombeder Service is a mobile-first web application for booking various transportation and delivery services. The platform provides a user-friendly interface for customers to book rides, deliveries, and other services while managing their points-based loyalty system. Built as a single-page application with a clean, modern design optimized for mobile devices.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with CSS variables for theming, shadcn/ui component library for consistent UI
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Forms**: React Hook Form with Zod validation for type-safe form handling

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Development**: TSX for TypeScript execution in development
- **Build Process**: ESBuild for production bundling with ES modules
- **API Design**: RESTful JSON API with structured error handling and logging middleware
- **Session Management**: Connect-pg-simple for PostgreSQL session storage

## Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Validation**: Zod schemas shared between client and server for consistent data validation
- **Development Storage**: In-memory storage implementation for development/demo purposes

## Authentication and Authorization
- **Session-based Authentication**: Express sessions with PostgreSQL storage
- **User Management**: Basic user system with verification status and profile management
- **Demo Mode**: Hardcoded demo user for development and testing

## External Dependencies
- **Database Hosting**: Neon serverless PostgreSQL for production database
- **UI Components**: Radix UI primitives for accessible component foundation
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date formatting and manipulation
- **Development Tools**: Replit-specific plugins for development environment integration
- **Image Assets**: Unsplash for service images and visual content

## Key Design Patterns
- **Component Architecture**: Modular React components with consistent props interfaces
- **Shared Schema**: Type definitions shared between client and server for data consistency
- **Service Layer**: Abstract storage interface with multiple implementations (memory, database)
- **Error Boundaries**: Structured error handling with user-friendly messages
- **Mobile-First Design**: Responsive design optimized for mobile devices with bottom navigation
- **Loading States**: Skeleton components for better user experience during data loading

## API Structure
- **User Management**: `/api/user` - Get current user profile and points balance
- **Services**: `/api/services` - List available transportation and delivery services
- **Bookings**: `/api/bookings` - Create and manage service bookings
- **Rides**: `/api/rides` - Historical ride data and tracking
- **Points System**: Integrated points balance and usage tracking
# Sombeder Service - Transportation Platform

A comprehensive multi-service transportation platform web application built with React, TypeScript, and Node.js. Features booking functionality, points system, and real-time tracking for various transportation services including Bajaj, Taxi, Bus, Delivery, and Food services.

## 🚀 Features

### Frontend
- **Mobile-first responsive design** optimized for all devices
- **Modern React 18** with TypeScript for type safety
- **Real-time updates** with WebSocket integration
- **Interactive booking system** with service selection
- **Points-based loyalty system** with balance tracking
- **User authentication** with session management
- **Service history** and ride tracking
- **Clean UI** with Tailwind CSS and shadcn/ui components

### Backend
- **RESTful API** with Express.js and TypeScript
- **PostgreSQL database** with Drizzle ORM
- **Session-based authentication** with Passport.js
- **Real-time capabilities** via WebSocket
- **Comprehensive validation** with Zod schemas
- **Security middleware** (CORS, rate limiting, helmet)
- **Payment processing** integration ready
- **Admin features** for service management

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite for build tooling
- Tailwind CSS + shadcn/ui
- TanStack Query for state management
- Wouter for routing
- React Hook Form + Zod validation

### Backend
- Node.js + Express.js
- TypeScript with TSX
- PostgreSQL + Drizzle ORM
- WebSocket (ws) for real-time features
- Passport.js for authentication
- bcrypt for password hashing

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or use in-memory storage for development)

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd sombeder-service
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# Copy and configure your environment
cp .env.example .env
```

Required environment variables:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/sombeder
SESSION_SECRET=your-session-secret-key
NODE_ENV=development
```

4. Push database schema
```bash
npm run db:push
```

5. Start the application
```bash
npm run dev
```

The app will be available at `http://localhost:5000`

## 📱 Services Available

- **🛺 Bajaj** - Quick rides for short distances
- **🚗 Taxi** - Comfortable rides for longer trips  
- **🚌 Bus** - Affordable public transportation
- **📦 Delivery** - Package and document delivery
- **🍔 Food** - Food delivery from local restaurants
- **🚚 Truck** - Heavy item transportation
- **🏍️ Motorcycle** - Fast delivery service
- **🚐 Van** - Group transportation

## 🔐 Authentication

The app supports both:
- **Demo mode** - Test with pre-loaded data
- **Full registration** - Create account with email/username

## 💳 Points System

- Earn points with each completed ride
- Use points for discounts on future bookings
- Real-time balance updates
- Transaction history tracking

## 🌐 Real-time Features

- Live ride tracking and updates
- Real-time notifications
- Driver location sharing
- Status change notifications via WebSocket

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### User Management
- `GET /api/user` - Get user profile
- `POST /api/user/points` - Add/subtract points

### Services & Booking
- `GET /api/services` - Get all services
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get user bookings
- `PATCH /api/bookings/:id` - Update booking status

### Rides & History
- `GET /api/rides` - Get user ride history
- `POST /api/rides` - Create new ride record

## 🔧 Development

### Database Management
```bash
# Push schema changes
npm run db:push

# Force push (if needed)
npm run db:push --force
```

### Project Structure
```
├── client/src/          # React frontend
│   ├── components/      # Reusable UI components
│   ├── pages/          # Route pages
│   └── lib/            # Utilities and configurations
├── server/             # Express backend
│   ├── routes.ts       # API route definitions
│   ├── storage.ts      # Database abstraction layer
│   ├── websocket.ts    # WebSocket management
│   └── middleware/     # Custom middleware
└── shared/             # Shared types and schemas
    └── schema.ts       # Database schema definitions
```

## 🚀 Deployment

The application is ready for production deployment with:
- Environment-based configuration
- Database connection pooling
- Security middleware configured
- Error handling and logging
- WebSocket support for real-time features

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

Built with ❤️ for modern transportation needs
# Verde Luxe Plant Store

## Overview

Verde Luxe is a premium e-commerce platform for luxury plants featuring 3D visualization capabilities. The application allows users to browse plants, visualize them in their spaces using 3D technology, manage a shopping cart, and complete purchases. It includes an admin panel for managing inventory and orders.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite for development and build tooling
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: React Context for authentication and cart state
- **Data Fetching**: TanStack Query for server state management
- **3D Visualization**: Three.js for plant visualization and AR/room placement features
- **Animation**: Framer Motion for smooth animations and transitions
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Authentication**: Firebase Authentication for user management
- **File Storage**: Firebase Storage for plant images and 3D models
- **Session Management**: PostgreSQL sessions with connect-pg-simple

### Tech Stack
- **Development**: Vite with HMR, TSX for server execution
- **Build**: ESBuild for production server bundling
- **Database Migrations**: Drizzle Kit for schema management
- **Deployment**: Configured for Replit autoscale deployment

## Key Components

### Authentication System
- Firebase Authentication integration with Google sign-in
- User profile management with admin role support
- Protected routes and conditional UI rendering
- Automatic user document creation in PostgreSQL

### E-commerce Features
- Product catalog with categories, filtering, and search
- Shopping cart with persistent storage
- Wishlist functionality
- Order management system with status tracking
- Checkout process with form validation

### 3D Visualization Engine
- Three.js-based plant visualization
- Room background upload and AR placement
- Interactive controls for scaling, rotation, and positioning
- Mobile-optimized viewing experience

### Admin Dashboard
- Plant inventory management (CRUD operations)
- Order processing and status updates
- User management and analytics
- Admin-only access control

### Database Schema
- **users**: Firebase UID integration, admin flags, profile data
- **categories**: Plant categories with slugs and descriptions
- **plants**: Comprehensive plant data including 3D model URLs, care instructions, and inventory
- **cart_items**: User shopping cart persistence
- **orders**: Order tracking with shipping and payment information

## Data Flow

1. **User Authentication**: Firebase handles authentication, user data syncs to PostgreSQL
2. **Product Browsing**: Plants fetched from PostgreSQL, filtered and sorted on frontend
3. **3D Visualization**: Three.js loads plant models, renders in user's space
4. **Cart Management**: Cart state managed in React Context, persisted to PostgreSQL
5. **Order Processing**: Checkout form validation, order creation, status tracking
6. **Admin Operations**: CRUD operations for plants and orders with role-based access

## External Dependencies

### Required Services
- **Neon Database**: PostgreSQL hosting with connection pooling
- **Firebase**: Authentication, Firestore (optional), and Storage
- **Replit**: Development and deployment platform

### Key Libraries
- **UI/UX**: Radix UI, Tailwind CSS, Framer Motion, Lucide React icons
- **3D Graphics**: Three.js for WebGL rendering
- **Forms & Validation**: React Hook Form, Zod schema validation
- **Database**: Drizzle ORM, @neondatabase/serverless
- **State Management**: TanStack Query, React Context

## Deployment Strategy

### Development Environment
- Replit with Node.js 20, PostgreSQL 16, and web modules
- Vite dev server with HMR on port 5000
- Automatic Cartographer integration for Replit

### Production Build
- Vite builds React frontend to `dist/public`
- ESBuild bundles Express server to `dist/index.js`
- Static file serving from built frontend
- Database migrations via Drizzle Kit

### Environment Configuration
- Database URL from Replit environment variables
- Firebase configuration via environment variables
- Production optimizations for both frontend and backend

## Changelog
- June 19, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.
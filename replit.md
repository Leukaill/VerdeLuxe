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
- July 9, 2025. Enhanced hero section with orbital slideshow featuring 3D-like transitions, floating elements, and dynamic content
- July 9, 2025. Implemented dynamic island-style mobile navbar with smooth animations, spring transitions, and comprehensive mobile menu
- July 9, 2025. Implemented secure admin panel with hidden access (3-second logo press), complete admin authentication, plant management, user administration, newsletter subscriber management, and content management for About/Contact sections
- July 9, 2025. Firebase Authentication setup - waiting for new Firebase project configuration to resolve auth/configuration-not-found error
- July 9, 2025. **Migration Complete**: Successfully migrated project from Replit Agent to Replit environment with PostgreSQL database, proper admin authentication system, and seeded sample data
- July 9, 2025. **Firebase Authentication**: Configured Firebase authentication with user credentials, enabling email/password and Google sign-in
- July 9, 2025. **Standalone Admin System**: Implemented independent admin authentication that doesn't require regular user login - admin creation and login work separately from Firebase user auth
- July 9, 2025. Successfully migrated project from Replit Agent to Replit environment with PostgreSQL database setup, seeded sample data including admin user, categories, plants, and site content
- July 9, 2025. **Firebase Admin System**: Migrated admin authentication from PostgreSQL admin_credentials table to Firebase users table with isAdmin flag. Admin system now uses Firebase users for storage while maintaining independent authentication flow
- July 9, 2025. **Firestore Admin Credentials**: Implemented complete Firestore-based admin credential system using admin_credentials collection. Removed all hardcoded admin credentials and PostgreSQL admin dependencies. Admin authentication now fully managed through Firestore with proper security rules.
- July 9, 2025. **Firestore-Based Admin Credentials**: Completely migrated admin authentication to Firestore collection 'admin_credentials'. Removed all hardcoded admin credentials from PostgreSQL and server-side routes. Admin creation, verification, and management now handled entirely through Firestore with client-side Firebase integration

## User Preferences

Preferred communication style: Simple, everyday language.
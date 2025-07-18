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

## Database Configuration

### PostgreSQL Database (Neon)
- **Host:** ep-round-dawn-a2u068xy.eu-central-1.aws.neon.tech
- **Database:** neondb
- **Username:** neondb_owner
- **Password:** npg_9zsuHtE3NGjI
- **Port:** 5432
- **SSL Mode:** require
- **Connection String:** `postgresql://neondb_owner:npg_9zsuHtE3NGjI@ep-round-dawn-a2u068xy.eu-central-1.aws.neon.tech/neondb?sslmode=require`

### Firebase Configuration
- **Project ID:** mvp-db-21c9b
- **Authentication:** Email/Password and Google Sign-in enabled
- **Firestore:** Used for plant data storage (free tier)
- **Storage:** Not used (cost optimization)

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
- July 9, 2025. **Migration Complete**: Successfully migrated project from Replit Agent to Replit environment. PostgreSQL database created and connected, server running on port 5000, Firebase integration verified and working with project ID mvp-db-21c9b
- July 9, 2025. **Database Status Monitoring**: Added comprehensive database connection status indicators to admin panel showing real-time PostgreSQL and Firestore connection status with refresh capability
- July 9, 2025. **Database Status Indicator**: Added comprehensive database connection status monitoring in admin panel showing both PostgreSQL and Firestore connection status with real-time refresh capability
- July 9, 2025. **Plant Display Issue Fixed**: Resolved issue where plants saved to Firestore weren't appearing on website. Updated FeaturedProducts component to fetch from database instead of static data. Modified plant queries to use client-side filtering instead of complex Firestore queries to avoid index requirements
- July 9, 2025. **Hybrid Storage Architecture**: Implemented cost-effective hybrid storage system where plant data is stored in Firestore (free tier) and photos are stored in PostgreSQL with local file system to avoid Firebase Storage costs. Created plant_photos table, photo upload API endpoints, and admin photo management interface
- July 9, 2025. **Hybrid Storage System Complete**: Successfully implemented and tested hybrid storage architecture. Plant data stored in Firestore (free tier), photos stored in PostgreSQL + local file system (no storage costs). Fixed plant creation and photo display issues. System now fully operational with cost-effective photo management, unified image display combining Firestore imageUrls with PostgreSQL photos, and working admin panel for plant management
- July 9, 2025. **Seed Database Security**: Removed seed database button from main website and restricted it to admin panel only for security. Created comprehensive academic documentation following exact structure provided
- July 9, 2025. **Database URL Configuration**: Added fallback database URL configuration to prevent deployment errors when DATABASE_URL environment variable is missing. Created deployment setup guide with complete database credentials

## User Preferences

Preferred communication style: Simple, everyday language.
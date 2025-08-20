# Wedding Website Project

## Overview

This is a Turkish wedding website application built for Mihbiran & Çağatay's wedding celebration. The site serves as a digital invitation and information hub, featuring wedding details, photo sharing capabilities, and guest interaction features. Built with a modern full-stack architecture using React for the frontend and Express.js for the backend, the application provides a beautiful, responsive interface for wedding guests to access event information and share memories.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side is built with **React 18** and **TypeScript**, using **Vite** as the build tool for fast development and optimized production builds. The UI is constructed using **shadcn/ui** components built on top of **Radix UI primitives**, providing accessible and customizable interface elements. Styling is handled with **Tailwind CSS** using a custom design system with wedding-themed colors and typography.

**State Management**: The application uses **TanStack Query (React Query)** for server state management, providing efficient data fetching, caching, and synchronization. Form handling is managed by **React Hook Form** with **Zod** for validation.

**Routing**: Client-side routing is implemented using **Wouter**, a lightweight routing library that provides navigation between pages like Home, About, Photos, and Contact.

**Component Structure**: The application follows a component-based architecture with reusable UI components, custom hooks, and page-level components organized in a clear directory structure.

### Backend Architecture
The server is built with **Express.js** and **TypeScript**, following a RESTful API design pattern. The application uses an in-memory storage system (`MemStorage`) that implements a defined storage interface (`IStorage`), making it easy to swap out for database implementations later.

**API Design**: RESTful endpoints handle photo management operations (GET /api/photos, POST /api/photos, GET /api/photos/:id), with proper error handling and validation using Zod schemas.

**Development Setup**: The server integrates with Vite in development mode for hot module replacement and serves static files in production. Custom logging middleware tracks API request performance and responses.

### Data Storage Solutions
The application is configured for **PostgreSQL** using **Drizzle ORM** with **Neon Database** serverless driver. The database schema includes tables for users and photos, with proper relationships and constraints defined.

**Schema Design**: Uses a shared schema definition between client and server, ensuring type safety across the full stack. Photo entities include metadata like filename, description, guest name, and upload timestamp.

**Migration Strategy**: Database migrations are managed through Drizzle Kit with a dedicated configuration file, allowing for version-controlled schema changes.

### Authentication and Authorization
The current implementation includes basic user schema definitions but authentication is not yet fully implemented. The architecture supports session-based authentication with PostgreSQL session storage using `connect-pg-simple`.

### Development and Build Pipeline
**Development**: Uses Vite's development server with HMR, TypeScript checking, and custom error overlays for a smooth development experience.

**Production Build**: Separate build processes for client (Vite) and server (esbuild), with optimized outputs for deployment.

**Type Safety**: Full TypeScript implementation across the stack with shared type definitions and strict type checking enabled.

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL database provider (@neondatabase/serverless)
- **Drizzle ORM**: Type-safe database toolkit for schema definition and queries
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### UI and Styling
- **Radix UI**: Comprehensive collection of accessible, unstyled UI primitives
- **shadcn/ui**: Pre-styled component library built on Radix UI
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Icon library providing consistent iconography

### State Management and Data Fetching
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: TypeScript-first schema validation library

### Development Tools
- **Vite**: Fast build tool with HMR and optimized production builds
- **TypeScript**: Static type checking across the entire application
- **ESBuild**: Fast JavaScript bundler for server-side builds

### Routing and Navigation
- **Wouter**: Minimalist client-side routing library

### Utilities and Helpers
- **date-fns**: Modern JavaScript date utility library
- **clsx**: Utility for constructing className strings conditionally
- **class-variance-authority**: Tool for creating type-safe CSS class variants

The architecture prioritizes developer experience, type safety, and performance while maintaining the flexibility to scale and add features as needed for the wedding website.
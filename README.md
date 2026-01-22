# 🥋 Kigali Shaolin Temple Management System

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.2.3-61DAFB.svg)

**A comprehensive full-stack management system for promoting Shaolin culture in Rwanda**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Documentation](#-documentation) • [API](#-api-reference)

</div>

---

## 📖 Overview

The **Kigali Shaolin Temple Management System** is a modern, production-ready web application designed to promote Shaolin martial arts and culture in Rwanda. The system provides a complete digital ecosystem with three integrated layers:

- 🌐 **Public Website**: Engaging frontend showcasing Shaolin culture, programs, and events
- 🎛️ **Admin CMS**: Secure content management portal for administrators
- ⚡ **REST API Backend**: Robust Node.js API with PostgreSQL database

### Mission

To create an accessible digital platform that connects Shaolin culture with the Rwandan community through professional training programs, educational content, and club management.

---

## ✨ Features

### 🔐 Security & Authentication
- **JWT-based Authentication** with role-based access control (RBAC)
- **ID Obfuscation**: Base64URL encryption of UUIDs to prevent enumeration attacks
- **Audit Logging**: Complete activity tracking with IP address recording
- **Password Reset Flow**: Secure token-based password recovery
- **Role Management**: Super Admin, Content Manager, and Editor roles

### 📝 Content Management
- **Hero Slides Manager**: Dynamic homepage carousel with CMS control
- **Blog System**: Full CRUD operations with categories and publishing workflow
- **Programs Manager**: Training programs (Online, In-Person, Global Retreats)
- **Club Management**: Multi-location club tracking with tutorials
- **Gallery**: Photo and video media library with event categorization
- **About Section**: Dynamic about page content management

### 🗄️ Data Management
- **Soft Delete with Restore**: Paranoid mode for data recovery
- **Image Upload**: Cloudinary integration for cloud storage
- **Contact Messages**: Inbox system for user inquiries
- **Dashboard Analytics**: System statistics and overview metrics
- **Pagination**: Efficient data loading with configurable page sizes

### 🛠️ Developer Features
- **Swagger Documentation**: Interactive API documentation
- **Database Migrations**: Sequelize ORM with auto-sync
- **Email Service**: Nodemailer integration for notifications
- **Error Handling**: Global error middleware with proper HTTP status codes
- **CORS Configuration**: Secure cross-origin resource sharing

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────┐
│  Frontend (Next.js + Tailwind)      │
│  - Public Shaolin Temple Website    │
│  - Responsive Design                │
│  - Multi-language (RW/EN/FR)        │
└──────────────┬──────────────────────┘
               │ REST API (HTTPS)
┌──────────────▼──────────────────────┐
│  Backend API (Node.js + Express)    │
│  - Authentication & Authorization   │
│  - Business Logic                   │
│  - File Upload (Cloudinary)         │
│  - Email Service (Nodemailer)       │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  Admin Portal (React + Vite)        │
│  - CMS Dashboard                    │
│  - Content CRUD Operations          │
│  - User Management                  │
│  - Audit Log Viewer                 │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  Database (PostgreSQL + Sequelize)  │
│  - 11 Core Entities                 │
│  - Soft Deletes (Paranoid)          │
│  - Audit Trail                      │
└─────────────────────────────────────┘
```

---

## 🚀 Tech Stack

### Backend (`kst-backend`)
- **Runtime**: Node.js 18+
- **Framework**: Express 5.2.1
- **Database**: PostgreSQL with Sequelize ORM 6.37.7
- **Authentication**: JWT (jsonwebtoken 9.0.3) + bcrypt 6.0.0
- **File Upload**: Multer 2.0.2 + Cloudinary 1.41.3 + Sharp 0.34.5
- **Email**: Nodemailer 7.0.12
- **Validation**: Joi 18.0.2
- **Documentation**: Swagger (swagger-jsdoc 6.2.8 + swagger-ui-express 5.0.1)
- **Utilities**: uuid 13.0.0, qrcode 1.5.4

### Admin Portal (`admin-kst`)
- **Framework**: React 19.2.3
- **Build Tool**: Vite 7.2.4
- **Routing**: React Router 7.11.0
- **State Management**: Redux Toolkit 2.11.2
- **Styling**: Tailwind CSS 4.1.18
- **Forms**: React Hook Form 7.69.0 + Zod 4.2.1
- **HTTP Client**: Axios 1.13.2
- **UI Components**: Lucide React 0.546.0, React Icons 5.5.0
- **Notifications**: React Toastify 11.0.5
- **Charts**: Recharts 3.6.0

### Frontend Website (Planned)
- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS
- **Internationalization**: next-i18next (RW/EN/FR support)

### Database Schema
- **Users**: Admin accounts with role-based permissions
- **HeroSlides**: Homepage carousel content
- **About**: About section content
- **Programs**: Training programs
- **Blogs**: Blog posts and articles
- **Clubs**: Shaolin club locations
- **ClubTutorials**: Video tutorials
- **Gallery**: Photo and video media
- **ContactMessages**: User inquiries
- **AuditLogs**: System activity tracking

---

## 📦 Installation

### Prerequisites

- Node.js 18.x or higher
- PostgreSQL 13.x or higher
- npm or yarn package manager
- Cloudinary account (for image uploads)
- SMTP server credentials (for emails)

### 1. Clone the Repository

```bash
git clone https://github.com/andremugabo/Kigali_Shaolin_Temple.git
cd Kigali_Shaolin_Temple
```

### 2. Backend Setup

```bash
cd kst.rw/kst-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables (see Configuration section)
nano .env

# Sync database and seed initial data
npm run db:reset

# Start development server
npm run dev
```

The backend will run on `http://localhost:3005`

### 3. Admin Portal Setup

```bash
cd kst.rw/admin-kst

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure API URL
echo "VITE_API_URL=http://localhost:3005" > .env

# Start development server
npm run dev
```

The admin portal will run on `http://localhost:5173`

---

## ⚙️ Configuration

### Backend Environment Variables (`.env`)

```env
# Server
PORT=3005
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kst_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
JWT_EXPIRES_IN=1d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Frontend URL (for password reset links)
FRONTEND_URL=http://localhost:5173

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend Environment Variables (`.env`)

```env
VITE_API_URL=http://localhost:3005
```

---

## 🎯 Usage

### Starting the Application

#### Development Mode

```bash
# Terminal 1: Start Backend
cd kst.rw/kst-backend
npm run dev

# Terminal 2: Start Admin Portal
cd kst.rw/admin-kst
npm run dev
```

#### Production Mode

```bash
# Backend
cd kst.rw/kst-backend
npm start

# Admin Portal
cd kst.rw/admin-kst
npm run build
npm run preview
```

### Default Admin Credentials

After running `npm run db:reset`, you can login with:
- **Email**: As configured in `seed.js`
- **Password**: As configured in `seed.js`

> ⚠️ **Important**: Change default credentials immediately in production!

---

## 🔌 API Reference

### Base URL
```
http://localhost:3005/api
```

### Interactive Documentation
Access Swagger UI at: `http://localhost:3005/api-docs`

### Authentication

All protected routes require a JWT token in the Authorization header:

```bash
Authorization: Bearer <your_jwt_token>
```

### Core Endpoints

#### Authentication
- `POST /api/users/login` - User login
- `POST /api/users/reset-password/:token` - Reset password

#### Users (Admin only)
- `GET /api/users` - List all users (paginated)
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Soft delete user
- `PUT /api/users/:id/restore` - Restore deleted user
- `DELETE /api/users/:id/force` - Permanently delete user

#### Hero Slides
- `GET /api/hero-slides` - List all slides
- `POST /api/hero-slides` - Create slide
- `PUT /api/hero-slides/:id` - Update slide
- `DELETE /api/hero-slides/:id` - Delete slide

#### Blogs
- `GET /api/blogs` - List blogs (paginated, with filters)
- `POST /api/blogs` - Create blog post
- `GET /api/blogs/:id` - Get blog by ID
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Soft delete blog
- `PUT /api/blogs/:id/restore` - Restore blog

#### Programs
- `GET /api/programs` - List programs
- `POST /api/programs` - Create program
- `PUT /api/programs/:id` - Update program
- `DELETE /api/programs/:id` - Delete program

#### Clubs
- `GET /api/clubs` - List clubs
- `POST /api/clubs` - Create club
- `GET /api/clubs/:id` - Get club with tutorials
- `PUT /api/clubs/:id` - Update club
- `DELETE /api/clubs/:id` - Delete club

#### Gallery
- `GET /api/gallery` - List media (paginated, filterable)
- `POST /api/gallery` - Upload media
- `DELETE /api/gallery/:id` - Delete media

#### Contact Messages
- `GET /api/contact-messages` - List messages
- `POST /api/contact-messages` - Submit message
- `PATCH /api/contact-messages/:id/read` - Mark as read
- `DELETE /api/contact-messages/:id` - Delete message

#### Audit Logs
- `GET /api/audit-logs` - View audit trail

### Example Request

```bash
# Login
curl -X POST http://localhost:3005/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@kst.rw",
    "password": "your_password"
  }'

# Get all blogs
curl -X GET http://localhost:3005/api/blogs \
  -H "Authorization: Bearer <token>"
```

---

## 📂 Project Structure

```
Kigali_Shaolin_Temple/
├── DOC/
│   ├── kigali_shaolin_temple_management_system.tex
│   └── kigali_shaolin_temple_management_system.pdf
├── kst.rw/
│   ├── kst-backend/
│   │   ├── src/
│   │   │   ├── controllers/      # Request handlers
│   │   │   ├── middleware/       # Auth, logging, upload
│   │   │   ├── models/           # Sequelize models
│   │   │   ├── routes/           # API routes
│   │   │   ├── services/         # Business logic
│   │   │   └── utils/            # Helper functions
│   │   ├── uploads/              # Local file storage
│   │   ├── .env                  # Environment variables
│   │   ├── server.js             # Entry point
│   │   ├── swagger.js            # API documentation
│   │   ├── seed.js               # Database seeding
│   │   └── package.json
│   ├── admin-kst/
│   │   ├── src/
│   │   │   ├── api/              # API client
│   │   │   ├── components/       # Reusable components
│   │   │   ├── layouts/          # Layout components
│   │   │   ├── pages/            # Page components
│   │   │   ├── routes/           # Route definitions
│   │   │   ├── services/         # API services
│   │   │   ├── store/            # Redux store
│   │   │   └── utils/            # Utilities
│   │   ├── public/               # Static assets
│   │   ├── index.html
│   │   ├── vite.config.js
│   │   └── package.json
│   └── kst-frontend/             # [Future] Public website
└── README.md
```

---

## 🎨 Design System

### Color Palette

| Role      | Color Code | Usage                    |
|-----------|------------|--------------------------|
| Primary   | `#7B1E1E`  | Shaolin Red - Main brand |
| Dark      | `#111111`  | Backgrounds              |
| Gold      | `#C9A24D`  | Heritage Gold - Accents  |
| Text      | `#FFFFFF`  | Primary text             |
| Muted     | `#9CA3AF`  | Secondary text           |

### Typography

- **Headings**: Playfair Display (Serif)
- **Body**: Inter / Poppins (Sans-serif)

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#7B1E1E',
        dark: '#111111',
        gold: '#C9A24D',
      }
    }
  }
}
```

---

## 🧪 Testing

### Backend Tests

```bash
cd kst.rw/kst-backend
npm test
```

### Frontend Tests

```bash
cd kst.rw/admin-kst
npm test
```

---

## 🚢 Deployment

### Backend Deployment (Example: Heroku)

```bash
# Login to Heroku
heroku login

# Create app
heroku create kst-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set CLOUDINARY_CLOUD_NAME=your_cloud_name
# ... other env vars

# Deploy
git push heroku main
```

### Frontend Deployment (Example: Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd kst.rw/admin-kst
vercel
```

---

## 🔒 Security Features

### Implemented
- ✅ JWT-based authentication with expiration
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ UUID ID obfuscation (Base64URL encoding)
- ✅ Role-based access control (RBAC)
- ✅ Audit logging with IP tracking
- ✅ Secure password reset flow with tokens
- ✅ CORS policy enforcement
- ✅ Input validation (Joi backend, Zod frontend)
- ✅ SQL injection protection (Sequelize ORM)

### Recommended Additions
- ⚠️ Rate limiting on API endpoints
- ⚠️ CSRF token protection
- ⚠️ Security headers (Helmet.js)
- ⚠️ Request throttling
- ⚠️ 2FA for admin accounts

---

## 📊 Database Schema

### Entity Relationship Diagram

```
User (1) ----< (N) AuditLog
Club (1) ----< (N) ClubTutorial

Standalone Entities:
- HeroSlide
- About
- Program
- Blog
- Gallery
- ContactMessage
```

### Migration Commands

```bash
# Sync database (development)
npm run db:sync

# Reset and seed
npm run db:reset
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Coding Standards

- Use ESLint configuration provided
- Follow MVC architecture pattern
- Write descriptive commit messages
- Add comments for complex logic
- Update documentation for API changes

---

## 🐛 Known Issues

### Resolved
- ✅ LaTeX documentation compilation errors
- ✅ Database schema standardization
- ✅ Frontend pagination crashes
- ✅ Double-slash in API URLs

### Open Issues
- None currently

Report issues at: [GitHub Issues](https://github.com/andremugabo/Kigali_Shaolin_Temple/issues)

---

## 📝 Documentation

- **Technical Blueprint**: See `DOC/kigali_shaolin_temple_management_system.pdf`
- **API Documentation**: `http://localhost:3005/api-docs` (Swagger)
- **Codebase Analysis**: Comprehensive analysis available in project artifacts

---

## 📜 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 Kigali Shaolin Temple

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👥 Team

- **Project Lead**: Mugabo Andre
- **Development**: Kigali Shaolin Temple Development Team
- **Repository**: [@andremugabo](https://github.com/andremugabo)

---

## 📞 Support

For support and inquiries:

- **Email**: info@kigalishaolin.rw
- **Website**: [kst.rw](https://kst.rw) (coming soon)
- **GitHub Issues**: [Report Issues](https://github.com/andremugabo/Kigali_Shaolin_Temple/issues)

---

## 🙏 Acknowledgments

- Shaolin Temple in China for inspiration
- Rwanda tech community
- All contributors and supporters
- Open source community for amazing tools

---

<div align="center">

**Made with ❤️ for the Shaolin community in Rwanda**

[⬆ Back to Top](#-kigali-shaolin-temple-management-system)

</div>

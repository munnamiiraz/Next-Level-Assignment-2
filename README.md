# 🚗 Vehicle Rental System API

A robust RESTful API for managing vehicle rentals with role-based access control, built with Node.js, Express, TypeScript, and PostgreSQL.

## 🌐 Live Deployment

**Live URL:** [https://assignment-2-alpha-eosin.vercel.app/](https://assignment-2-alpha-eosin.vercel.app/)

## ✨ Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin & Customer)
  - Secure password hashing with bcrypt

- **Vehicle Management**
  - CRUD operations for vehicles
  - Real-time availability tracking
  - Public vehicle browsing

- **Booking System**
  - Automatic price calculation based on rental duration
  - Vehicle availability management
  - Role-based booking views
  - Booking status management (active, cancelled, returned)

- **Business Logic**
  - Prevent deletion of users/vehicles with active bookings
  - Automatic vehicle status updates on booking actions
  - Customer profile management with role restrictions

## 🛠️ Technology Stack

- **Backend:** Node.js, Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **Authentication:** JWT (jsonwebtoken)
- **Password Security:** bcryptjs
- **Development:** tsx (TypeScript execution)

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-github-repo-link>
cd Assignment\ 2
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=vehicle_rental
DB_PASSWORD=your_db_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

### 4. Database Setup

Create the PostgreSQL database and tables:

```sql
CREATE DATABASE vehicle_rental;

-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(50) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehicles Table
CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  vehicle_name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  registration_number VARCHAR(50) UNIQUE NOT NULL,
  daily_rent_price DECIMAL(10, 2) NOT NULL,
  availability_status VARCHAR(50) DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings Table
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES users(id),
  vehicle_id INTEGER REFERENCES vehicles(id),
  rent_start_date DATE NOT NULL,
  rent_end_date DATE NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Run the Application

**Development Mode:**
```bash
npm run dev
```

**Production Build:**
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/signin` - User login

### User Endpoints

- `GET /api/v1/users` - Get all users (Admin only)
- `PUT /api/v1/users/:userId` - Update user (Admin or own profile)
- `DELETE /api/v1/users/:userId` - Delete user (Admin only)

### Vehicle Endpoints

- `GET /api/v1/vehicles` - Get all vehicles (Public)
- `GET /api/v1/vehicles/:vehicleId` - Get vehicle by ID (Public)
- `POST /api/v1/vehicles` - Create vehicle (Admin only)
- `PUT /api/v1/vehicles/:vehicleId` - Update vehicle (Admin only)
- `DELETE /api/v1/vehicles/:vehicleId` - Delete vehicle (Admin only)

### Booking Endpoints

- `GET /api/v1/bookings` - Get bookings (Role-based)
- `POST /api/v1/bookings` - Create booking (Customer/Admin)
- `PUT /api/v1/bookings/:bookingId` - Update booking status (Role-based)

## 🔐 Authentication

Protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📝 Example API Usage

### Register User
```bash
POST /api/v1/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phone": "01712345678",
  "role": "customer"
}
```

### Create Booking
```bash
POST /api/v1/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "customer_id": 1,
  "vehicle_id": 2,
  "rent_start_date": "2024-01-15",
  "rent_end_date": "2024-01-20"
}
```

## 👨‍💻 Author

Developed as part of Next Level Web Development Assignment 2
Developed by Md. Mahedi Hassan

## 📄 License

ISC

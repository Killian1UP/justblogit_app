# Just Blog It 📝

## 📌 Overview
**Just Blog It** is a backend-powered blogging platform that allows users to create, manage, and interact with blog content. The system supports authentication, authorization, role-based access (admin vs user), and a full comment system.

This project demonstrates a real-world RESTful API built with Node.js, Express, and MongoDB.

---

## 🚀 Features

### 👤 User Management
- User registration with email and password
- Email verification using OTP (One-Time Password)
- Secure login using JWT (JSON Web Tokens)
- Password reset via email token
- Update and delete user accounts
- Role-based system (Admin & Regular Users)

---

### 🔐 Authentication & Security
- Password hashing using bcrypt
- JWT-based authentication
- HTTP-only cookies for secure sessions
- Middleware for:
  - Authentication (logged-in users)
  - Authorization (admin access)

---

### 📝 Blog Posts
- Create blog posts
- Retrieve all posts (with pagination)
- Retrieve a single post by ID
- Update your own posts
- Delete:
  - Your own posts
  - Any post (admin only)

---

### 💬 Comments System
- Add comments to posts
- View comments
- Update your own comments
- Delete:
  - Your own comments
  - Any comment (admin only)

---

### 📄 Pagination
- Posts and comments support pagination:
  - page
  - limit

---

## 🧱 Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose

---

## 📦 Dependencies

The following dependencies are used in this project:

### Core Dependencies
- **express** → Web framework for building APIs
- **mongoose** → MongoDB ODM for schema and database interaction
- **bcrypt** → Password hashing
- **jsonwebtoken (jwt)** → Authentication using tokens
- **cookie-parser** → Parse cookies for authentication
- **dotenv** → Manage environment variables

### Utility / Features
- **crypto (built-in)** → Generate OTPs and secure tokens
- **nodemailer** → Send emails (OTP & password reset)

---

## 🔑 API Structure

### User Routes
- POST `/api/register`
- GET `/api/users` (admin only)
- GET `/api/user/:id`
- PUT `/api/user/:id`
- DELETE `/api/user/:id` (admin only)

---

### Auth Routes
- POST `/api/user/login`
- POST `/api/password/resetRequest`
- POST `/api/password/validate`
- POST `/api/password/reset`

---

### OTP Routes
- POST `/api/otp/verify`
- POST `/api/otp/resend`

---

### Post Routes
- POST `/api/post`
- GET `/api/posts`
- GET `/api/post/:id`
- PUT `/api/post/:id`
- DELETE `/api/post/:id`

---

### Comment Routes
- POST `/api/posts/:postId/comments`
- GET `/api/posts/comments`
- GET `/api/posts/:postId/comments/:id`
- PUT `/api/posts/:postId/comments/:id`
- DELETE `/api/posts/:postId/comments/:id`

---

## 🛡️ Authorization Rules

| Action | User | Admin |
|------|------|------|
| Create Post | ✅ | ✅ |
| Update Own Post | ✅ | ✅ |
| Delete Own Post | ✅ | ✅ |
| Delete Any Post | ❌ | ✅ |
| Manage Users | ❌ | ✅ |

---

## ⚙️ Installation

1. Clone the repository
```bash
git clone <your-repo-url>
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file
```env
PORT=4000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
KITS_EMAIL=your_email
```

4. Run the server
```bash
npm run dev
```

---

## 🧪 Testing

Use Postman to test all endpoints:
- Ensure correct request body format
- Use cookies for authenticated routes
- Test role-based access

---

## 🎯 Project Goal

This project was built to:
- Practice backend development
- Understand authentication & authorization
- Build a real-world REST API
- Implement clean architecture

---

## 📌 Future Improvements

- Image upload support (Cloudinary)
- Likes & reactions
- Follow system
- Soft delete & audit logs
- Rate limiting & security enhancements

---

## 👨‍💻 Author

**Ikaelelo Motlhako**

Backend Developer 

---

## 📜 License
This project is for educational purposes.

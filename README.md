# 🛍️ Online React Shop

## 📌 Project Description
Modern, intuitive online store that allows users to browse products, manage their cart, place orders, add opinions and comments about products. The application was developed as part of an academic project and utilizes popular frontend and backend technologies. Data is fetched from local SQLite database. Main site has been tweaked with unusual js animation.

## 🎯 Key Features
✅ **Homepage** with product list and search functionality  
✅ **Product List** (search, category filtering)  
✅ **Product Details** (description, availability, reviews)  
✅ **Product comments and rates**   
✅ **Shopping Cart** (add/remove products, checkout)  
✅ **Order History**  
✅ **User Registration & Login** (JWT authentication, session management)  
✅ **Admin Panel** (moderating product reviews)  
✅ **User Roles & Permissions** (admin, authenticated user) 


---

## 🛠️ Technologies Used
### 🖥️ Frontend
- ⚛️ React
- 🏗️ React Router DOM
- 📡 Axios
- 🎨 Material UI

### 💾 Backend
- 🚀 Express.js
- 🗄️ SQLite
- 🔐 JSON Web Token (JWT)
- 🔑 Bcrypt
- 🔄 CORS
- 🛡️ Authentication Middleware

---

## 📂 Project Structure
### 📦 Backend
```bash
/server
  ├── controllers
  │   ├── authControllers.js      # Login management
  │   ├── productControllers.js   # Product handling
  │   ├── reviewsControllers.js   # Fetching product reviews
  │   ├── userControllers.js      # User management
  ├── middleware
  │   ├── authMiddleware.js       # Authentication handling
  ├── routes
  │   ├── authRoutes.js
  │   ├── orderRoutes.js
  │   ├── productRoutes.js
  │   ├── reviewsRoutes.js
  │   ├── userRoutes.js
  ├── database.db                 # SQLite database
  ├── db.js                       # Database initialization
  ├── server.js                   # Main server file
```

### 🎨 Frontend
```bash
/src
  ├── App.tsx                     # Main component
  ├── main.tsx                    # Application entry point
  ├── components
  │   ├── AdminReviews.tsx        # Admin review moderation
  │   ├── Cart.tsx                # Shopping cart
  │   ├── ErrorBoundary.tsx       # Error handling
  │   ├── History.tsx             # Order history
  │   ├── Login.tsx               # Login page
  │   ├── ProductDetails.tsx      # Product details
  │   ├── ProductList.tsx         # Product list
  │   ├── Register.tsx            # User registration
  ├── index.html                   # Main HTML page
```

---

## 🚀 Installation & Setup
1. **Clone the repository**
   ```sh
   git clone https://github.com/mcwsn/React-Shop.git
   cd React-Shop
   ```
2. **Install dependencies**
   ```sh
   cd server
   npm install
   cd ../frontend
   npm install
   ```
3. **Start the backend**
   ```sh
   cd server
   npm start
   ```
4. **Start the frontend**
   ```sh
   cd frontend
   npm start
   ```
5. **Open your browser:** `http://localhost:3000`

---

## 🔌 API (Postman Documentation)
### 👤 Users
- `POST /api/users` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/users/` - Retrieve users

### 🛍️ Products
- `GET /api/products` - Fetch all products
- `POST /api/products` - Add a new product
- `PUT /api/products/:id` - Edit a product
- `DELETE /api/products/:id` - Delete a product

### 🛒 Shopping Cart
- `POST /api/orders` - Create an order
- `GET /api/orders` - Retrieve all orders

### ⭐ Reviews
- `GET /api/products/:id/reviews` - Fetch product reviews
- `POST /api/products/:id/reviews` - Add a review
- `DELETE /api/reviews/:id` - Delete a review

---

## 👨‍💻 Authors
- **Maciej Wiśniewski** - Backend, Frontend, Graphics  
📌 Project developed for AGH WDAI course 🎓


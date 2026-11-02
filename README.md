# 🌾 AgriConnect – Farmer Marketplace

## 📌 Project Overview

AgriConnect is a digital agricultural marketplace that connects farmers directly with buyers. It provides a platform where buyers can explore agricultural products, purchase fresh produce, and track orders, while farmers can list products and manage customer orders.

The application is developed using **React and Vite**, with Local Storage for browser-based data management.

## 🎯 Objectives

- Connect farmers directly with buyers.
- Provide an online agricultural marketplace.
- Allow farmers to add and manage products.
- Enable buyers to search and filter products.
- Provide shopping cart and checkout functionality.
- Support separate Buyer, Farmer, and Admin modules.
- Manage orders and track their status.

## ✨ Features

### 1. User Authentication
- User registration and login.
- Separate Buyer and Farmer accounts.
- Admin login.
- Logout functionality.
- User information stored in Local Storage.

### 2. Buyer Module
- Browse agricultural products.
- Search products by name.
- Filter products by category.
- Add products to shopping cart.
- Increase or decrease product quantities.
- View cart subtotal and total.
- Place orders.
- View order history and status.

### 3. Farmer Module
- Farmer registration and login.
- Add agricultural products.
- Select product categories.
- Set product prices.
- View listed products.
- View customer orders.
- Update order status.

### 4. Admin Module
- Admin login.
- View registered users.
- View total products.
- View total orders.
- View user information.
- Manage order status.

### 5. Shopping Cart
- Add products.
- Update quantities.
- Remove products by decreasing quantity to zero.
- Calculate subtotal.
- Calculate delivery charges.
- Calculate total amount.
- Place orders.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| React.js | Frontend development |
| Vite | Development and build tool |
| JavaScript | Application functionality |
| HTML5 | Website structure |
| CSS3 | Styling and responsive design |
| Local Storage | Browser-based data storage |
| GitHub | Source code management |
| Vercel | Project deployment |

## 📂 Project Structure

```text
AgriConnect-React/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## 🚀 Installation and Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/Vighnesh-2007/AgriConnect-React.git
```

### Step 2: Open the Project Folder

```bash
cd AgriConnect-React
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Run the Development Server

```bash
npm run dev
```

### Step 5: Open in Browser

```text
http://localhost:5173/
```

## 🔐 Demo Admin Login

- Email: admin@agriconnect.com
- Password: admin123
- Role: Admin

## 💾 Data Storage

The application uses browser Local Storage to store:

- Registered user accounts.
- Current logged-in user.
- Agricultural products.
- Shopping cart.
- Customer orders.

Data is stored in the browser and is not synchronized between different users or devices.

## ⚠️ Current Limitations

- The application is a frontend academic prototype.
- Local Storage is used instead of a centralized database.
- Authentication is prototype-level and passwords are not securely stored.
- Admin demo credentials are present in frontend code.
- Online payment integration is not implemented.
- Product information is initially populated with sample data.
- No centralized backend server is implemented.

## 🔮 Future Enhancements

- Backend integration using Node.js or ASP.NET Core.
- Secure authentication.
- Database integration.
- Online payment gateway.
- Real-time agricultural market prices.
- Product image uploads.
- Delivery tracking.
- Weather information and crop recommendations.
- Multilingual support.

## 🌐 Project Links

**GitHub Repository:**

https://github.com/Vighnesh-2007/AgriConnect-React

**Live Demo:**

https://agri-connect-react.vercel.app/

## 🎓 Project Information

- **Project Name:** AgriConnect – Farmer Marketplace
- **Project Type:** Frontend Web Application
- **Domain:** Agriculture / E-Commerce
- **Frontend:** React + Vite
- **Storage:** Browser Local Storage
- **Deployment:** Vercel
- **Purpose:** Connecting farmers and buyers through a digital agricultural marketplace.

## 📄 License

This project is developed for academic and educational purposes.

# UrbanWear – Full Stack E-commerce Website

## Project Overview

UrbanWear is a full-stack e-commerce website developed using HTML, CSS, JavaScript, Node.js, Express, and MongoDB. The system allows users to browse products, view details, add items to cart, and place orders while managing user authentication and sessions.



##  Features

###  User Authentication

 User registration and login
 Session handling using JWT
 Logout functionality
 Display logged-in username in navbar

###  Product Management

 Products stored in MongoDB database
 Dynamic product listing (fetched from backend)
 Product details page (dynamic based on selected product)

###  Cart System

 Add to cart with size and quantity
 Update quantity
 Remove items
 Cart stored in database

###  Checkout System

 Place order from cart
 Automatically reduces product stock in database
 Clears cart after checkout

###  Protected Pages

 Products and Cart pages accessible only after login



##  Technologies Used

### Frontend

 HTML5
 CSS3
 JavaScript (Vanilla)

### Backend

 Node.js
 Express.js

### Database

 MongoDB (Mongoose)



##  Project Structure

```
UrbanWear/
│
├── frontend/
│   ├── index.html
│   ├── products.html
│   ├── product-details.html
│   ├── cart.html
│   ├── login.html
│   ├── register.html
│   ├── aboutus.html
│   ├── css/
│   ├── js/
│   └── images/
│
├── backend/
│   ├── server.js
│   ├── models/
│   ├── routes/
│   └── package.json
```



##  Installation & Setup (Run Locally)

### 🔹 Step 1: Extract Project

Unzip the provided project folder.



### 🔹 Step 2: Setup Backend

1. Open terminal inside the backend folder
2. Install dependencies:

```
npm install
```

3. Start server:

```
node server.js
```

 Backend will run on:

```
http://localhost:5000
```



### 🔹 Step 3: Setup Frontend

1. Open the frontend folder
2. Run using Live Server OR open `index.html`

 Recommended:

 Use VS Code Live Server extension

Frontend runs on:

```
http://localhost:5500
```



### 🔹 Step 4: Database Setup

 Ensure MongoDB is installed and running
 Default connection:

```
mongodb://127.0.0.1:27017/urbanwear
```



##  Default Flow to Test

1. Register a new user
2. Login
3. Browse products
4. View product details
5. Add items to cart
6. Go to cart page
7. Click checkout
8. Verify product quantity is reduced in database



##  Notes

 Images are stored in frontend `/images` folder
 Product data is automatically inserted (if database is empty)
 Session is handled using localStorage + JWT



##  Developer

Developed by: Anwar007



##  Conclusion

This project demonstrates a complete full-stack implementation including database integration, session handling, and dynamic data flow between frontend and backend.

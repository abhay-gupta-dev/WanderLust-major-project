# 🌍 WanderLust – Full Stack Travel & Stay Booking Platform

## 🔗 Live Demo

**Website:** https://wanderlust-major-project-jzv9.onrender.com

---

# 📖 About The Project

WanderLust is a full-stack web application inspired by Airbnb that allows users to explore, create, manage, and review travel accommodations from around the world.

The platform provides an intuitive user experience where travelers can discover unique stays while property owners can showcase their accommodations with images, descriptions, pricing, and location details.

The project follows modern web development practices using the MERN-style stack (MongoDB, Express.js, Node.js) with EJS templating and RESTful architecture.

---

# ✨ Key Features

## 👤 User Authentication

* User Registration
* Secure Login
* Logout Functionality
* Session Management
* Password Hashing using Passport Local Mongoose
* Protected Routes
* Authentication-Based Navigation

---

## 🏡 Listing Management

Users can:

* Create new listings
* View all listings
* View individual listing details
* Edit their own listings
* Delete their own listings
* Upload listing images
* Add property descriptions
* Add pricing information
* Add location and country details

---

## ⭐ Review System

Registered users can:

* Add reviews
* Rate properties
* Delete their own reviews
* View reviews posted by other users

---

## 🖼️ Image Uploads

Integrated with Cloudinary for:

* Image Storage
* Image Optimization
* Image Transformation
* Secure Hosting

Features:

* Automatic cloud storage
* Optimized image delivery
* Fast loading experience

---

## 🗺️ Geolocation Support

The application automatically:

* Converts location names into coordinates
* Stores latitude and longitude
* Generates map-compatible data
* Supports location-based visualization

---

## 🔍 Search Functionality

Users can search listings using:

* Property title
* Location
* Country
* Description

Search is implemented using MongoDB regex queries.

---


# 🛠️ Tech Stack

## Frontend

* HTML5
* CSS3
* Bootstrap 5
* JavaScript
* EJS
* EJS Mate

---

## Backend

* Node.js
* Express.js

---

## Database

* MongoDB Atlas
* Mongoose ODM

---

## Authentication

* Passport.js
* Passport Local
* Passport Local Mongoose

---

## Session Management

* Express Session
* Connect Mongo

---

## Image Storage

* Cloudinary
* Multer
* Multer Storage Cloudinary

---

## Validation

* Joi

---

## Deployment

* Render
* MongoDB Atlas
* Cloudinary

---



---

# 🗃️ Database Models

## User Model

```javascript
{
    username,
    email,
    password
}
```

### Features

* Registration
* Login
* Authentication
* Session Persistence

---


# 🔐 Authentication Flow

### Registration

1. User fills signup form
2. Password gets hashed
3. User saved to database
4. User automatically logged in
5. Session created

---

### Login

1. User enters credentials
2. Passport authenticates
3. Session stored in MongoDB
4. User redirected to requested page

---

### Logout

1. Session destroyed
2. User logged out
3. Redirected to listings page

---

# 🛡️ Security Features

## Password Security

Passwords are hashed using:

```javascript
passport-local-mongoose
```

---

## Session Security

Sessions stored in MongoDB:

```javascript
connect-mongo
```

Benefits:

* Persistent sessions
* Production-ready authentication
* Improved scalability

---

## Route Protection

Protected Routes:

* Create Listing
* Edit Listing
* Delete Listing
* Add Reviews
* Delete Reviews

---

# 📸 Image Upload Workflow

1. User uploads image
2. Multer processes file
3. Cloudinary stores image
4. URL saved in MongoDB
5. Listing displays uploaded image

---


# 🎯 Middleware Used

## isLoggedIn

Ensures only authenticated users can access protected routes.

---

## isOwner

Allows only listing owner to edit/delete listing.

---

## isAuthor

Allows only review author to delete review.

---

## validateListing

Validates listing data using Joi.

---

## validateReview

Validates review data using Joi.

---

# 📱 Responsive Design

The application is fully responsive and works on:

* Desktop
* Laptop
* Tablet
* Mobile Devices

---

# 🌐 Deployment Details

## Backend Hosting

Render

---

## Database Hosting

MongoDB Atlas

---

## Image Hosting

Cloudinary

---

# ⚙️ Environment Variables

Create a `.env` file:

```env
ATLASDB_URL=your_mongodb_connection_string

SESSION_SECRET=your_session_secret

CLOUD_NAME=your_cloudinary_name

CLOUD_API_KEY=your_cloudinary_api_key

CLOUD_API_SECRET=your_cloudinary_api_secret

MAP_TOKEN=your_mapbox_token
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/abhay-gupta-dev/WanderLust-major-project.git
```

---

## Navigate

```bash
cd WanderLust-major-project
```

---

## Install Dependencies

```bash
npm install
```

---

## Start Development Server

```bash
nodemon app.js
```

or

```bash
node app.js
```

---

# 📦 Major NPM Packages Used

```bash
express
mongoose
ejs
ejs-mate
passport
passport-local
passport-local-mongoose
express-session
connect-mongo
connect-flash
cloudinary
multer
multer-storage-cloudinary
joi
dotenv
method-override
node-geocoder
```

---

# 🎓 Learning Outcomes

This project helped in understanding:

* MVC Architecture
* RESTful Routing
* Authentication & Authorization
* Session Management
* Cloud Storage Integration
* MongoDB Atlas
* Deployment on Render
* Express Middleware
* Database Relationships
* CRUD Operations
* Error Handling
* Full Stack Development

---

# 🔮 Future Enhancements

* Booking System
* Wishlist Feature
* User Profiles
* Payment Gateway Integration
* Advanced Search Filters
* Real-Time Notifications
* Messaging System
* Property Availability Calendar
* Admin Dashboard
* Recommendation Engine

---

# 👨‍💻 Developer

### Abhay Gupta

Computer Science Engineering Student

GitHub:
https://github.com/abhay-gupta-dev

---

# 🌟 Live Project

https://wanderlust-major-project-jzv9.onrender.com

---

# 📜 License

This project is developed for educational and learning purposes.

---

## Thank You

Thank you for visiting WanderLust.

Explore. Travel. Discover. 🌍✈️🏡

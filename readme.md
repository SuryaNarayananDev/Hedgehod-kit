# 🦔 Hedgehod Kit - JWT Authentication Starter Kit

**Hedgehod-Kit** is a configurable backend authentication module for Node.js & Express.  
It provides signup, email verification, login, profile update, and password reset via OTP — all ready to plug into your project.  

<p align="center">
  <img src="https://github.com/SuryaNarayananDev/Hedgehod-jwt/blob/main/spiky(hedegehod).png" width="250" />
</p>


## Features

- Customizable **signup fields** (required & optional)
- in signup - required name , mail id, pass , optionaly you can add extra field gender , phone number , address
- Email verification using **short-lived JWTs**  
- Login with **auth JWTs**  
- **Profile update** for verified users  
- **Reset password** via OTP  
- Middleware for **protected routes**  

---

## 📦 Installation

```bash
npm install hedgehod-kit
(or)
npm install hedgehog-kit
```

## 🚀 Usage

```js
require('dotenv').config();
const express = require('express');
const { init } = require('hedgehog-kit');

const app = express();
app.use(express.json());

// Initialize hedgehog-kit
init({
  app,
  signupFields: { 
    required: ['name', 'email', 'password'], 
    optional: ['phone'] 
  },
  allowProfileUpdate: ['name', 'phone']
});

app.listen(5000, () => console.log('Server running on port 5000'));
```


##  Environment Setup

Create a `.env` file in your root project with variables like:

```
# MongoDB connection string (local or Atlas)
MONGODB_URI=mongodb://localhost:27017/hedgehog-db

# JWT secrets and expiry
JWT_SECRET=supersecret
VERIFICATION_TOKEN_EXPIRY=15m
AUTH_TOKEN_EXPIRY=1d
RESET_OTP_EXPIRY=15m

# Email configuration (Gmail example)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Base URL of your backend
BASE_URL=http://localhost:5000

...
⚠️ Make sure EMAIL_PASS is an app-specific password if using Gmail.
```


## 🧪 Test Your Integration

Use tools like Postman to test these routes:

- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me` (with JWT)
- `post /auth/request-reset`
- `POST /auth/reset-password`

## 📜 License

MIT

---

🔗 [GitHub](https://github.com/SuryaNarayananDev/hedgehod-kit) | 🧰 Maintained by Suryanarayanan

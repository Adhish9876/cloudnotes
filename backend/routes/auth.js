const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');
const JWT_SECRET = "WOMMALA";
const fetchuser=require('../middleware/fetchuser');
const admin = require('firebase-admin');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Initialize Firebase Admin SDK
let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  serviceAccount = require('../firebaseServiceAccount.json');
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Replace with your actual User model path
const User = require('../models/User');

// Helper: send verification email
async function sendVerificationEmail(user, req) {
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
  const verifyUrl = `${req.protocol}://${req.get('host')}/api/auth/verify?token=${token}`;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Verify your CloudNotes account',
    html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email address for CloudNotes.</p>`
  });
}

// Remove classic /createuser and /login routes

// Add a route to verify Firebase ID token and return user info
router.post('/verify-token', async (req, res) => {
  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).send({ error: 'No token, authorization denied' });
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    if (!decodedToken.email_verified) {
      return res.status(403).send({ error: 'Email not verified' });
    }
    // Optionally, you can fetch more user info from Firebase
    const userRecord = await admin.auth().getUser(decodedToken.uid);
    res.json({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      emailVerified: userRecord.emailVerified,
      providerData: userRecord.providerData
    });
  } catch (err) {
    return res.status(401).send({ error: 'Token is not valid' });
  }
});

router.post('/login', async (req, res) => {
  const token = req.header('auth-token');
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    // Only allow Google provider
    if (!decoded.firebase || !decoded.firebase.sign_in_provider || decoded.firebase.sign_in_provider !== 'google.com') {
      return res.status(403).json({ error: 'Only Google login is allowed' });
    }
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(404).json({ error: 'User not found in DB' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

router.post('/createuser', [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('username').notEmpty().withMessage('Username is required').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  body('password').notEmpty().withMessage('Password is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, username, password } = req.body;
  let firebaseUser = null;
  try {
    // 1. Create user in Firebase Auth
    try {
      firebaseUser = await admin.auth().createUser({
        email,
        password,
        displayName: username
      });
    } catch (e) {
      return res.status(400).json({ error: 'Firebase Auth error: ' + e.message });
    }

    // 2. Create user in MongoDB
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(password, salt);
    let user;
    try {
      user = await User.create({
        name: username,
        email,
        password: secPass
      });
    } catch (err) {
      // Rollback Firebase user if MongoDB creation fails
      if (firebaseUser) {
        await admin.auth().deleteUser(firebaseUser.uid);
      }
      return res.status(400).json({ error: 'MongoDB error: ' + err.message });
    }

    res.json({ success: true, firebaseUid: firebaseUser.uid, userId: user.id });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

    //get users details;
    router.get('/getuser', fetchuser, async (req, res) => {
    try {
        const userID = req.user.id;
        const user = await User.findById(userID).select("-password");
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

    // Add Google Login Route

   
       





        


module.exports = router;

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

router.post('/createuser',
    [
        body('email')
            .isEmail()
            .withMessage('Enter a valid email'),

        body('username')
            .notEmpty()
            .withMessage('Username is required')
            .bail() // stop if empty
            .isLength({ min: 3 })
            .withMessage('Username must be at least 3 characters long'),

        body('password')
            .notEmpty()
            .withMessage('Password is required')
            .bail()
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Check if email already exists
            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser) {
                return res.status(400).json({ error: "Email already exists" });
            }
            const salt=await bcrypt.genSalt(10);
            const secPass=await bcrypt.hash(req.body.password,salt);

            // Create new user (no verification)
            const user = await User.create({
                name: req.body.username,
                email: req.body.email,
                password: secPass
            });
            const data={
                user:{
                    id:user.id
                }
            }
            const authtoken=jwt.sign(data,JWT_SECRET);
            res.json({authtoken});
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

// Remove /verify endpoint


router.post('/login',
    [
        body('email')
            .isEmail()
            .withMessage('Enter a valid email'),

        body('password')
            .notEmpty()
            .withMessage('Password is required')
            .bail()
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long')

      
    ],
    async (req, res) => {
          const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {email,password}=req.body;
        try {
            const user = await User.findOne({email});
            if(!user){
                return res.status(400).json({error:"Please try to login with correct credentials"});
            }
            const passwordCompare = await bcrypt.compare(password, user.password);
            if(!passwordCompare){
                return res.status(400).json({error:"Please try to login with correct credentials"});
            }
            const payload={
                user:{
                    id:user.id
            }
            }
            const authtoken=jwt.sign(payload,JWT_SECRET);
            res.json({authtoken});
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
            
        }
        }
    );

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

    // Google Login Route
router.post('/google-login', async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ error: 'No idToken provided' });
  }
  try {
    // Verify Firebase ID token
    const decoded = await admin.auth().verifyIdToken(idToken);
    if (!decoded.email_verified) {
      return res.status(403).json({ error: 'Email not verified' });
    }
    // Find or create user in MongoDB
    let user = await User.findOne({ email: decoded.email });
    if (!user) {
      // Create a random password for Google users
      const randomPassword = crypto.randomBytes(32).toString('hex');
      user = await User.create({
        name: decoded.name || decoded.email.split('@')[0],
        email: decoded.email,
        password: randomPassword,
      });
    }
    const payload = { user: { id: user.id } };
    const authtoken = jwt.sign(payload, JWT_SECRET);
    res.json({ authtoken });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Invalid or expired idToken' });
  }
});

   
       





        


module.exports = router;

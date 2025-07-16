const admin = require('firebase-admin');
let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Parse and fix private_key newlines for Firebase Admin
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }
} else {
  serviceAccount = require('../firebaseServiceAccount.json');
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const User = require('../models/User'); // add this import

const fetchuser = async (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).send({ error: 'No token, authorization denied' });
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    if (!decodedToken.email_verified) {
      return res.status(403).send({ error: 'Email not verified' });
    }
    // Find the user in your MongoDB by email
    let user = await User.findOne({ email: decodedToken.email });
    if (!user) {
      // Auto-create user if not found (for Google sign-in or first login)
      user = await User.create({
        name: decodedToken.name || decodedToken.email,
        email: decodedToken.email,
        password: 'google-oauth' // placeholder, not used for Google users
      });
    }
    req.user = { id: user._id }; // Set id for downstream routes
    return next();
  } catch (err) {
    return res.status(401).send({ error: 'Token is not valid' });
  }
};

module.exports = fetchuser;
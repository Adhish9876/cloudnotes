const admin = require('firebase-admin');
const serviceAccount = require('../firebaseServiceAccount.json');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "WOMMALA";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const fetchuser = async (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).send({ error: 'No token, authorization denied' });
  }
  // Try JWT verification first
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    return next();
  } catch (jwtErr) {
    // If JWT fails, try Firebase
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      if (!decodedToken.email_verified) {
        return res.status(403).send({ error: 'Email not verified' });
      }
      req.user = { id: decodedToken.uid, email: decodedToken.email };
      return next();
    } catch (firebaseErr) {
      return res.status(401).send({ error: 'Token is not valid' });
    }
  }
};

module.exports = fetchuser;
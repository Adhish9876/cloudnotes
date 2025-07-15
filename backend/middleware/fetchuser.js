const admin = require('firebase-admin');
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
    req.user = decodedToken;
    return next();
  } catch (err) {
    return res.status(401).send({ error: 'Token is not valid' });
  }
};

module.exports = fetchuser;
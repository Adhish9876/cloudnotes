const admin = require('firebase-admin');
let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Replace escaped newlines with real newlines for private_key
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT.replace(/\\n/g, '\n').replace(/\n/g, '\n'));
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n');
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n');
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n').replace(/\n/g, '\n');
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
const admin = require('firebase-admin');
const serviceAccount = require('../firebaseServiceAccount.json');

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
    next();
  } catch (err) {
    return res.status(401).send({ error: 'Token is not valid' });
  }
};

module.exports = fetchuser;
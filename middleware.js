import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).send('Acceso denegado, token no autorizado');
  }

  jwt.verify(token, 'secretkey', (err, user) => {
    if (err) {
      return res.status(403).send('Token invalido');
    }
    req.user = user;
    next();
  });
};

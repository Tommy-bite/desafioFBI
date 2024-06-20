import express from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import agents from './data/agentes.js';
import { authenticateToken } from './middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const agent = agents.find(a => a.email === email && a.password === password);

  if (!agent) return res.status(401).send('Email o contraseña incorrectos');

  const token = jwt.sign({ email: agent.email, id: agent.id }, 'secretkey', { expiresIn: '2m' });

  const redirectUrl = `/autenticado.html?email=${encodeURIComponent(email)}&token=${token}`;
  res.redirect(redirectUrl);
});

app.get('/restringido', authenticateToken, (req, res) => {
  const welcomeUrl = `/bienvenido.html?email=${encodeURIComponent(req.user.email)}`;
  res.redirect(welcomeUrl);
});

app.use(express.static(__dirname));

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.redirect('/error.html');
  } else {
    next(err);
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

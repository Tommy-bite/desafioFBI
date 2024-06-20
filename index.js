import express from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import agents from './data/agentes.js';
import { authenticateToken } from './middleware.js';

// Definir __dirname manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Ruta de autenticación
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const agent = agents.find(a => a.email === email && a.password === password);

  if (!agent) return res.status(401).send('Email or Password incorrect');

  const token = jwt.sign({ email: agent.email, id: agent.id }, 'secretkey', { expiresIn: '2m' });
  res.json({ token });
});

// Ruta restringida
app.get('/restricted', authenticateToken, (req, res) => {
  res.send(`Bienvenido ${req.user.email}`);
});

// Servir la interfaz HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

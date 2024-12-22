const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRouter = require('./routes/userRoutes');

// Configuración del archivo .env
dotenv.config();

// Inicialización de la aplicación
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Conexión a la base de datos MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:admin@localhost:27017/userOAuth?authSource=admin';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conexión a MongoDB exitosa con url:', MONGODB_URI))
  .catch(err => console.error('Error al conectar con MongoDB:', err));

// Rutas
app.use('/api/users', userRouter);

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal. Intenta nuevamente.' });
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

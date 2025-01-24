require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./src/apps/userApp')


// Conexión a la base de datos MongoDB
const PORT = process.env.PORT || 5000;
console.log('PORT:', PORT);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:admin@mongodb:27017/userOAuth?authSource=admin';
console.log('Connecting to MONGODB_URI:', MONGODB_URI);

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log('Server running at http://localhost:' + PORT);
        });
    }).catch((error) => {
        console.log(error);
    });

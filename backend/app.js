//import packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user')
const path = require('path');

// connection avec la base de données
mongoose.connect('mongodb+srv://PremierUtilisateur:lm57u6kdOaNznVjA@cluster0.cjxvii3.mongodb.net/myDataBase?retryWrites=true&w=majority',
{ useNewUrlParser: true,
   useUnifiedTopology: true })
 .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


 //création et configuration express app
const app = express();
app.use(express.json());
app.use(bodyParser.json());

//autorisations 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
  });

//routes
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;


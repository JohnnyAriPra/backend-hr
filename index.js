const express = require('express');
const cors = require('cors');
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Cors
app.use(cors());

//routes
app.use(require('./routes/actores'));
app.use(require('./routes/peliculas'));


app.listen(3000);
console.log('Server on port', 3000);
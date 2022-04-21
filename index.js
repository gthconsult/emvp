require('dotenv').config();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const cors = require('cors');
const methodOverride = require('method-override');
const routerInspecteur = require('./routes/inspecteur');
const mongoose = require('mongoose');
const { PORT, NODE_ENV, DB_USER, DB_PASSWORD, DB_NAME } = require('./config');


// connection 
const connectionStr = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.gtvlx.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
mongoose.Promise = global.Promise
mongoose.connect(connectionStr, {useNewUrlParser : true, useUnifiedTopology : true})
.then(()=> {
    console.log('Database connected');
})
.catch((err) => {
    console.log(err.message);
})


 //configure the app to use bodyParser() and cros and method request
 app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cors());
app.use(methodOverride('_method'));



// pour les route
app.use('/api/inspecteur', routerInspecteur);


// pour afficher les erreur
app.use((err, req, res, next) => {
    console.log(err.stack);
    console.log(err.name);
    console.log(err.code);
    res.status(500).json({
        message : 'warnning'
    })
})




// pour declanche le serveur
app.listen(PORT, () => {
  console.log("server running")
});
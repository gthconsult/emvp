require('dotenv').config();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const cors = require('cors');
const { PORT } = require('./config');
const methodOverride = require('method-override');
const routerInspecteur = require('./routes/inspecteur');



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
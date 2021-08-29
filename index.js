const express = require('express')
const path = require("path")
const Sequelize = require("sequelize-cockroachdb");
const fs = require('fs');
require('dotenv').config()

const app = express()
const port = 3000;

var sequelize = new Sequelize({
    dialect: "postgres",
    username: "darkin424",
    password: "process.env.PSWD",
    host: "process.env.HOST",
    port: 26257,
    database: "process.env.DB",
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync('certs/.postgresql/root.crt')
                .toString()
      },
    },
    logging: false, 
  });
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

const People = sequelize.define("people", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true, 
        primaryKey: true,
    },
    name: {
        type: Sequelize.TEXT,
    },
    score: {
        type: Sequelize.INTEGER,
    },
});

app.use(express.static(path.join(__dirname,'./static' )))

app.get('/', (request,response)=>{
    response.sendFile(path.join(__dirname,'./static/index.html'))
})
app.get('/play', (request,response)=>{
    response.sendFile(path.join(__dirname,'./static/play.html'))
})

app.post('/submit', function (req, res) {
 
    //Get our values submitted from the form
    var fromName = req.body.name;
    var fromScore = req.body.score;
 
    //Add our POST data to CockroachDB via Sequelize
    People.sync({
        force: false,
    })
        .then(function () {
        // Insert new data into People table
        return People.bulkCreate([
            {
            name: fromName,
            score: fromScore,
            },
        ]);
        })
 
    	  //Error handling for database errors
        .catch(function (err) {
        console.error("error: " + err.message);
        });    
        
        //Tell them it was a success
        res.send('Submitted Successfully!<br /> Name:  ' + fromName + '<br />Score:  ' + fromScore);
});

app.listen(port,()=>{
    console.log(`Listening to localhost:${port}`)
})
const express = require('express');
const morgan = require('morgan');
const bp = require('body-parser');
const cp = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require("fs")

require('dotenv').config(); 

// app
const app = express();

// const admin = require("firebase-admin");
// const credentials = require("./key.json");
// db

// admin.initializeApp({
    // credential: admin.credential.cert(credentials)
// })
// const db = admin.firestore();
mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true}).then(() => console.log('DB connected'));

// middlewares
app.use(morgan("dev"))
app.use(express.json())
app.use(cp())

//cors
app.use(cors());    



// call the routes
fs.readdirSync('./routes').map((r) => app.use('/', require(`./routes/${r}`)));     // localhost:5005/


app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError'){
        res.status(401).json({
            error: "Unauthorized!"
        });
    }
});
// middlewares



app.get('/', (req,res) => {
    fs.readFile('apiDocs/docs.json', (err, data) => {
        if (err) {
            res.status(400).json({
                error: err
            })
        }

        const docs = JSON.parse(data);
        res.json(docs);
    })
})


// handle port
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
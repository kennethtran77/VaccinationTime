const express = require('express');
const app = express();

const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db/database.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
});

app.get('/', (req, res) => {
   res.send('Hello world'); 
});

app.post('/addReview', (req, res) => {
    let query = req.query;
});

app.listen(8080);
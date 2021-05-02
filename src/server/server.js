const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const sqlite3 = require('sqlite3').verbose();

const PORT = 3001;

const openDb = () => {
    return new sqlite3.Database('./database.db', (err) => {
        if (err) {
            return console.error(err.message);
        }
    });
};

// Create a new review
app.post('/review', (req, res) => {
    const { email, address, waittime, comments } = req.body;
    
    let db = openDb();

    db.run(`INSERT INTO Reviews VALUES (?, ?, ?, ?)`, [email, address, waittime, comments], (err) => {
        if (err) {
            console.log(err);
            res.status(400).send();
            return;
        }
    });

    db.close();
    res.status(202).send(`Succesfully left review`);
});

// Fetch review information for an address
app.get('/review', (req, res) => {
    let address = req.query['address'];

    let sql = `SELECT * FROM Reviews WHERE Address = '${address}'`;

    let db = openDb();

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.log(err);
            res.status(400).send();
        } else {
            res.send(rows);
        }
    });

    db.close();
});

// Fetch waiting time info for an address
app.get('/waittime', (req, res) => {
    let address = req.query['address'];
    let sql =  `SELECT AVG(WaitTime) AS avg, MIN(WaitTime) AS min, MAX(WaitTime) AS max
                FROM Reviews
                WHERE Address = '${address}'
                GROUP BY Address`;
    let db = openDb();

    db.get(sql, [], (err, rows) => {
        if (err) {
            console.log(err);
            res.status(400).send();
        } else {
            res.send(rows);
        }
    });

    db.close();
});

// Start listening
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
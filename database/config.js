import sqlite3 from 'sqlite3';

const Database = new sqlite3.Database('./database/database.db', (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Database Connected");
    }
});

export default Database;
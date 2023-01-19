const mysql = require('mysql');

//connect
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ukk_hotel"
});

module.exports = db;
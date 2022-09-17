const mysql = require("mysql2");
module.exports.mysql = mysql.createConnection({
    host: "",
    user: "",
    password: "",
    database: "",
});
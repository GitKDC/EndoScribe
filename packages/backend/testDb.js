const db = require("./db/db");

console.log("DB connected");

const templates = db.prepare("SELECT * FROM templates").all();

console.log("Templates:", templates);
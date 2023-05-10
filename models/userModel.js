"use strict"

const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');

exports.loginBuddy = (email,password) => {
    let id = db.prepare("SELECT id FROM Users WHERE email = ? AND password = ? ").get([email,password]);
    if (id == null) return -1;
    return id;
}

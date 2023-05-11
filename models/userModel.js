"use strict"

const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');

exports.loginBuddy = (email,password) => {
    let id = db.prepare("SELECT id FROM Users WHERE email = ? AND password = ? ").get([email,password]);
    if (id == null) return -1;
    return id;
}

exports.nameExist = (name) => {
    let id = db.prepare("SELECT id FROM Users WHERE name = ? ").get([name]);
    if (id == null) return -1;
    return id;
}

exports.emailExist = (email) => {
    let id = db.prepare("SELECT id FROM Users WHERE email = ? ").get([email]);
    if (id == null) return -1;
    return id;
}

exports.insertUser = (name,email,password) => {
    let user = db.prepare('INSERT INTO Users (name, email, password) VALUES (?, ?, ?)').run([name,email,password]).lastInsertRowid;
}


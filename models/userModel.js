"use strict"

const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');

exports.loginBuddy = (email, password) => {
  let id = db.prepare("SELECT accountId FROM Account WHERE email = ? AND password = ? ").get([email, password]);
  if (id == null) return -1;
  return id;
}


exports.nameExist = (username) => {
  let id = db.prepare("SELECT accountId FROM Account WHERE username = ? ").get([username]);
  if (id == null) return -1;
  return id;
}

exports.emailExist = (email) => {
  let id = db.prepare("SELECT accountId FROM Account WHERE email = ? ").get([email]);
  if (id == null) return -1;
  return id;
}

exports.insertUser = (username, email, password) => {
  let accountId = db.prepare('INSERT INTO Account (username, email, password) VALUES (?, ?, ?)').run([username, email, password]).lastInsertRowid;
  return accountId;
}


exports.updateAccount = (user, email, username, password) => {
  db.prepare('UPDATE Account SET email = ?,  username = ?, password = ? WHERE accountId = ?').run(email, username, password, user);
}


exports.getUsernameFromId = (user) => {
  let username = db.prepare('SELECT username FROM Account WHERE accountId = ?').get([user]);
  return username;
}



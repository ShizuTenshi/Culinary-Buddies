"use strict";

const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');

// Checks if an account with the provided email and password exists.
// Returns the account ID if found, otherwise returns -1.
exports.loginBuddy = (email, password) => {
  let id = db.prepare("SELECT accountId FROM Account WHERE email = ? AND password = ? ").get([email, password]);
  if (id == null) return -1;
  return id;
};

// Checks if an account with the provided username exists.
// Returns the account ID if found, otherwise returns -1.
exports.nameExist = (username) => {
  let id = db.prepare("SELECT accountId FROM Account WHERE username = ? ").get([username]);
  if (id == null) return -1;
  return id;
};

// Checks if an account with the provided email exists.
// Returns the account ID if found, otherwise returns -1.
exports.emailExist = (email) => {
  let id = db.prepare("SELECT accountId FROM Account WHERE email = ? ").get([email]);
  if (id == null) return -1;
  return id;
};

// Inserts a new user account with the provided username, email, and password into the database.
// Returns the account ID of the newly inserted user.
exports.insertUser = (username, email, password) => {
  let accountId = db.prepare('INSERT INTO Account (username, email, password) VALUES (?, ?, ?)').run([username, email, password]).lastInsertRowid;
  return accountId;
};

// Updates the email, username, and password of an existing account with the provided account ID.
exports.updateAccount = (user, email, username, password) => {
  db.prepare('UPDATE Account SET email = ?,  username = ?, password = ? WHERE accountId = ?').run(email, username, password, user);
};

// Retrieves the username associated with the provided account ID.
exports.getUsernameFromId = (user) => {
  let username = db.prepare('SELECT username FROM Account WHERE accountId = ?').get([user]);
  return username;
};

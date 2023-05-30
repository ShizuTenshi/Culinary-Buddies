"use strict"

const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');

exports.loginBuddy = (email,password) => {
    let id = db.prepare("SELECT accountId FROM Account WHERE email = ? AND password = ? ").get([email,password]);
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

exports.insertUser = (username,email,password) => {
    let user = db.prepare('INSERT INTO Account (username, email, password) VALUES (?, ?, ?)').run([username,email,password]).lastInsertRowid;
}

  // Update a user's account information based on their ID
  exports.updateUser = (accountId, updatedData) => {
    const query = `
      UPDATE Account SET
        email = ?,
        username = ?,
        password = ?,
        authPost = ?,
        healthConcernId = ?,
        dietaryPreferenceId = ?
      WHERE accountId = ?
    `;
    db.prepare(query).run(
      updatedData.email,
      updatedData.username,
      updatedData.password,
      updatedData.authPost,
      updatedData.healthConcernId,
      updatedData.dietaryPreferenceId,
      accountId
    );
  };
  
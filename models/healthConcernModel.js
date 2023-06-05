"use strict"

const Sqlite = require('better-sqlite3');
let db = new Sqlite('db.sqlite');

exports.getHealthConcernList = (user) => {
    let list = db.prepare("SELECT concern FROM HealthConcern WHERE accountId = ? ").all([user]);
    return list;
}


exports.updateHealthConcerns = (user, healthConcerns) => {
    for (let i = 0; i < healthConcerns.length; i++) {
        db.prepare('INSERT INTO HealthConcern (accountId, concern) VALUES (?, ?)').run([user, healthConcerns[i]]);
    }
}


exports.deleteOldHealthOptions = (user) => {
    db.prepare('DELETE FROM HealthConcern WHERE accountId = ?').run(user);
}

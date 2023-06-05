"use strict"

const Sqlite = require('better-sqlite3');
let db = new Sqlite('db.sqlite');

exports.getDietaryPreferenceList = (user) => {
    let list = db.prepare("SELECT preference FROM DietaryPreference WHERE accountId = ? ").all([user]);
    return list;
}


exports.updateDietaryOptions = (user, dietaryOptions) => {
    for (let i = 0; i < dietaryOptions.length; i++) {
        db.prepare('INSERT INTO DietaryPreference (accountId, preference) VALUES (?, ?)').run([user, dietaryOptions[i]]);
    }
}

exports.deleteOldDietaryOptions = (user) => {
    db.prepare('DELETE FROM DietaryPreference WHERE accountId = ?').run(user);
}
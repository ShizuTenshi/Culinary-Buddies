const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');

var createTables = function() {

    db.prepare('DROP TABLE IF EXISTS Users').run();
    db.prepare('CREATE TABLE Users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT)').run();
    db.prepare('INSERT INTO USers (email, password) VALUES (@email, @password)').run(  {email: "Emory@culinaryBuddies", password: "password"});
}

createTables(); 
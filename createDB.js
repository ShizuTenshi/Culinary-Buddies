const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');

var createTables = function() {

    db.prepare('DROP TABLE IF EXISTS Users').run();
    db.prepare('CREATE TABLE Users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, password TEXT)').run();
    db.prepare('INSERT INTO USers (name, email, password) VALUES (@name, @email, @password)').run(  {name: "Emory" , email: "Emory@culinaryBuddies", password: "password"});
}

createTables(); 
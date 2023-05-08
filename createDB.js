const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');

var load = function() {

    db.prepare('DROP TABLE IF EXISTS test').run();
    db.prepare('CREATE TABLE test (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, password TEXT)').run();
    db.prepare('INSERT INTO test (name, password) VALUES (@name, @password)').run(  {name: "Emory", password: "password"});
    var test = db.prepare('SELECT * FROM test').run();
    console.log(test);
}
load();

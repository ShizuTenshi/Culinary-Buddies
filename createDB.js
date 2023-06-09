const Sqlite = require('better-sqlite3');

// Open a database connection
let db = new Sqlite('db.sqlite');

// Create the Account table
db.prepare(`
  CREATE TABLE IF NOT EXISTS Account (
    accountId INTEGER PRIMARY KEY,
    email TEXT,
    username TEXT,
    password TEXT,
    authPost INTEGER,
    healthConcernId INTEGER,
    dietaryPreferenceId INTEGER,
    FOREIGN KEY (healthConcernId) REFERENCES HealthConcern(healthConcernId),
    FOREIGN KEY (dietaryPreferenceId) REFERENCES DietaryPreference(dietaryPreferenceId)
  )
`).run();

// Create the HealthConcern table
db.prepare(`
  CREATE TABLE IF NOT EXISTS HealthConcern (
    healthConcernId INTEGER PRIMARY KEY,
    accountId INTEGER,
    concern TEXT,
    FOREIGN KEY (accountId) REFERENCES Account(accountId)
  )
`).run();

// Create the DietaryPreference table
db.prepare(`
  CREATE TABLE IF NOT EXISTS DietaryPreference (
    dietaryPreferenceId INTEGER PRIMARY KEY,
    accountId INTEGER,
    preference TEXT,
    FOREIGN KEY (accountId) REFERENCES Account(accountId)
  )
`).run();

// Create the Friend table
db.prepare(`
  CREATE TABLE IF NOT EXISTS Friend (
    friendId INTEGER PRIMARY KEY,
    accountId INTEGER,
    friendAccountId INTEGER,
    FOREIGN KEY (accountId) REFERENCES Account(accountId),
    FOREIGN KEY (friendAccountId) REFERENCES Account(accountId)
  )
`).run();


// Create the Recipe table

db.prepare(`
  CREATE TABLE IF NOT EXISTS Recipe (
    recipeId INTEGER PRIMARY KEY,
    name TEXT,
    description TEXT,
    photo TEXT,
    preparationTime REAL,
    instructions TEXT,
    cookTime REAL,
    accountId INTEGER,
    FOREIGN KEY (accountId) REFERENCES Account(accountId)
  )
`).run();


// Create the Ingredient table
db.prepare(`
  CREATE TABLE IF NOT EXISTS Ingredient (
    ingredientId INTEGER PRIMARY KEY,
    recipeId INTEGER,
    name TEXT,
    quantity REAL,
    unit TEXT,
    FOREIGN KEY (recipeId) REFERENCES Recipe(recipeId)
  )
`).run();

// Create the Unit table
/*
db.prepare(`
  CREATE TABLE IF NOT EXISTS Unit (
    unitId INTEGER PRIMARY KEY,
    name TEXT
  )
`).run();
*/

/*
// Create the Instruction table
db.prepare(`
  CREATE TABLE IF NOT EXISTS Instruction (
    instructionId INTEGER PRIMARY KEY,
    recipeId INTEGER,
    instruction TEXT,
    FOREIGN KEY (recipeId) REFERENCES Recipe(recipeId)
  )
`).run();
*/

// Create the Category table

db.prepare(`
  CREATE TABLE IF NOT EXISTS Category (
    categoryId INTEGER PRIMARY KEY,
    recipeId INTEGER,
    categoryName TEXT,
    FOREIGN KEY (recipeId) REFERENCES Recipe(recipeId)
  )
`).run();


// Create the Tag table
db.prepare(`
  CREATE TABLE IF NOT EXISTS Tag (
    tagId INTEGER PRIMARY KEY,
    recipeId INTEGER,
    name TEXT,
    FOREIGN KEY (recipeId) REFERENCES Recipe(recipeId)
  )
`).run();


// Create the FavoriteRecipe table 
db.prepare(`
  CREATE TABLE IF NOT EXISTS FavoriteRecipe (
    accountId INTEGER,
    recipeId INTEGER,
    FOREIGN KEY (accountId) REFERENCES Account(accountId),
    FOREIGN KEY (recipeId) REFERENCES Recipe(recipeId)
  )
`).run();

// insert data into the tables

    // insert into Account
    db.prepare(`
    INSERT INTO Account (email, username, password, authPost) 
    VALUES (?, ?, ?, ?)
  `).run('john@example.com', 'johndoe', 'password', 1);

  // insert into HealthConcern
  db.prepare(`
    INSERT INTO HealthConcern (accountId, concern) 
    VALUES (?, ?)
  `).run(1, 'Diabetes');

  // insert into DietaryPreference
  db.prepare(`
    INSERT INTO DietaryPreference (accountId, preference) 
    VALUES (?, ?)
  `).run(1, 'Vegetarian');

// insert into Recipe
db.prepare(`
INSERT INTO Recipe (name, description, photo, preparationTime, cookTime, accountId) 
VALUES (?, ?, ?, ?, ?, ?)
`).run(
'Spaghetti Carbonara',
'Classic Italian pasta dish with eggs, pancetta, and cheese',
'https://example.com/spaghetti_carbonara.jpg',
10.0,
20.0,
1
);

// insert into Unit
/*
db.prepare(`
INSERT INTO Unit (name) 
VALUES (?)
`).run('Cup');
*/

// insert into Ingredient
db.prepare(`
INSERT INTO Ingredient (recipeId, name, quantity, unit) 
VALUES (?, ?, ?, ?)
`).run(1, 'Spaghetti', 8, "CM" );


// Close database 

db.close();

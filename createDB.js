const Sqlite = require('better-sqlite3');


/** var createTables = function() {

    db.prepare('DROP TABLE IF EXISTS Users').run();
    db.prepare('CREATE TABLE Users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, password TEXT)').run();
    db.prepare('INSERT INTO USers (name, email, password) VALUES (@name, @email, @password)').run(  {name: "Emory" , email: "Emory@culinaryBuddies", password: "password"});
}

createTables(); **/

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

// Create the Recipe table
db.prepare(`
  CREATE TABLE IF NOT EXISTS Recipe (
    recipeId INTEGER PRIMARY KEY,
    name TEXT,
    description TEXT,
    photo TEXT,
    preparationTime REAL,
    cookTime REAL,
    dishCategory TEXT
  )
`).run();

// Create the Ingredient table
db.prepare(`
  CREATE TABLE IF NOT EXISTS Ingredient (
    ingredientId INTEGER PRIMARY KEY,
    recipeId INTEGER,
    name TEXT,
    quantity REAL,
    unitId INTEGER,
    FOREIGN KEY (recipeId) REFERENCES Recipe(recipeId),
    FOREIGN KEY (unitId) REFERENCES Unit(unitId)
  )
`).run();

// Create the Unit table
db.prepare(`
  CREATE TABLE IF NOT EXISTS Unit (
    unitId INTEGER PRIMARY KEY,
    name TEXT
  )
`).run();

// Create the Instruction table
db.prepare(`
  CREATE TABLE IF NOT EXISTS Instruction (
    instructionId INTEGER PRIMARY KEY,
    recipeId INTEGER,
    instruction TEXT,
    FOREIGN KEY (recipeId) REFERENCES Recipe(recipeId)
  )
`).run();

// Create the Tag table
db.prepare(`
  CREATE TABLE IF NOT EXISTS Tag (
    tagId INTEGER PRIMARY KEY,
    name TEXT
  )
`).run();

// Create the RecipeTag table
db.prepare(`
  CREATE TABLE IF NOT EXISTS RecipeTag (
    recipeId INTEGER,
    tagId INTEGER,
    FOREIGN KEY (recipeId) REFERENCES Recipe(recipeId),
    FOREIGN KEY (tagId) REFERENCES Tag(tagId)
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
INSERT INTO Recipe (name, description, photo, preparationTime, cookTime, dishCategory) 
VALUES (?, ?, ?, ?, ?, ?)
`).run(
'Spaghetti Carbonara',
'Classic Italian pasta dish with eggs, pancetta, and cheese',
'https://example.com/spaghetti_carbonara.jpg',
10.0,
20.0,
'Pasta'
);

// insert into Unit
db.prepare(`
INSERT INTO Unit (name) 
VALUES (?)
`).run('Cup');

// insert into Ingredient
db.prepare(`
INSERT INTO Ingredient (recipeId, name, quantity, unitId) 
VALUES (?, ?, ?, ?)
`).run(1, 'Spaghetti', 8, 1);

// Insert into Instruction
db.prepare(`
  INSERT INTO Instruction (recipeId, instruction)
  VALUES (?, ?)
`).run(
  1,
  'Preheat the oven to 375 degrees F (190 degrees C).'
);

db.prepare(`
  INSERT INTO Instruction (recipeId, instruction)
  VALUES (?, ?)
`).run(
  1,
  'In a large bowl, cream together butter and sugar until smooth.'
);

db.prepare(`
  INSERT INTO Instruction (recipeId, instruction)
  VALUES (?, ?)
`).run(
  1,
  'Beat in the eggs one at a time, then stir in the vanilla.'
);

db.prepare(`
  INSERT INTO Instruction (recipeId, instruction)
  VALUES (?, ?)
`).run(
  1,
  'Combine flour, baking powder, and salt; gradually stir into the creamed mixture.'
);

db.prepare(`
  INSERT INTO Instruction (recipeId, instruction)
  VALUES (?, ?)
`).run(
  1,
  'Stir in the chocolate chips.'
);

db.prepare(`
  INSERT INTO Instruction (recipeId, instruction)
  VALUES (?, ?)
`).run(
  1,
  'Drop by rounded tablespoonfuls onto ungreased cookie sheets.'
);

db.prepare(`
  INSERT INTO Instruction (recipeId, instruction)
  VALUES (?, ?)
`).run(
  1,
  'Bake for 8 to 10 minutes in the preheated oven.'
);

db.prepare(`
  INSERT INTO Instruction (recipeId, instruction)
  VALUES (?, ?)
`).run(
  1,
  'Allow cookies to cool on baking sheet for 5 minutes before removing to a wire rack to cool completely.'
);

db.prepare(`
  INSERT INTO Instruction (recipeId, instruction)
  VALUES (?, ?)
`).run(
  2,
  'Bring a large pot of salted water to a boil.'
);

db.prepare(`
  INSERT INTO Instruction (recipeId, instruction)
  VALUES (?, ?)
`).run(
  2,
  'Add pasta and cook for 8 to 10 minutes or until al dente; drain.'
);


// Close database 

db.close();

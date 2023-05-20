const Sqlite = require('better-sqlite3');


/** var createTables = function() {

    db.prepare('DROP TABLE IF EXISTS Users').run();
    db.prepare('CREATE TABLE Users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, password TEXT)').run();
    db.prepare('INSERT INTO USers (name, email, password) VALUES (@name, @email, @password)').run(  {name: "Emory" , email: "Emory@culinaryBuddies", password: "password"});
}

createTables(); **/

// Open a database connection
let db = new sqlite3.Database('example.db');

// Create the Account table
db.run(`
  CREATE TABLE Account (
    accountId INTEGER PRIMARY KEY,
    email TEXT,
    username TEXT,
    password TEXT,
    authPost INTEGER,
    FOREIGN KEY (healthConcernId) REFERENCES HealthConcern(healthConcernId),
    FOREIGN KEY (dietaryPreferenceId) REFERENCES DietaryPreference(dietaryPreferenceId)
  )
`);

// Create the HealthConcern table
db.run(`
  CREATE TABLE HealthConcern (
    healthConcernId INTEGER PRIMARY KEY,
    accountId INTEGER,
    concern TEXT,
    FOREIGN KEY (accountId) REFERENCES Account(accountId)
  )
`);

// Create the DietaryPreference table
db.run(`
  CREATE TABLE DietaryPreference (
    dietaryPreferenceId INTEGER PRIMARY KEY,
    accountId INTEGER,
    preference TEXT,
    FOREIGN KEY (accountId) REFERENCES Account(accountId)
  )
`);

// Create the Recipe table
db.run(`
  CREATE TABLE Recipe (
    recipeId INTEGER PRIMARY KEY,
    name TEXT,
    description TEXT,
    photo TEXT,
    preparationTime REAL,
    cookTime REAL,
    dishCategory TEXT
  )
`);

// Create the Ingredient table
db.run(`
  CREATE TABLE Ingredient (
    ingredientId INTEGER PRIMARY KEY,
    recipeId INTEGER,
    name TEXT,
    quantity REAL,
    unitId INTEGER,
    FOREIGN KEY (recipeId) REFERENCES Recipe(recipeId),
    FOREIGN KEY (unitId) REFERENCES Unit(unitId)
  )
`);

// Create the Unit table
db.run(`
  CREATE TABLE Unit (
    unitId INTEGER PRIMARY KEY,
    name TEXT
  )
`);

// Create the Instruction table
db.run(`
  CREATE TABLE Instruction (
    instructionId INTEGER PRIMARY KEY,
    recipeId INTEGER,
    instruction TEXT,
    FOREIGN KEY (recipeId) REFERENCES Recipe(recipeId)
  )
`);

// Create the Tag table
db.run(`
  CREATE TABLE Tag (
    tagId INTEGER PRIMARY KEY,
    name TEXT
  )
`);

// Create the RecipeTag table
db.run(`
  CREATE TABLE RecipeTag (
    recipeId INTEGER,
    tagId INTEGER,
    FOREIGN KEY (recipeId) REFERENCES Recipe(recipeId),
    FOREIGN KEY (tagId) REFERENCES Tag(tagId)
  )
`);

// Create the FavoritreRecipe table 
db.run(`
  CREATE TABLE FavoriteRecipe (
    accountId INTEGER,
    recipeId INTEGER,
    FOREIGN KEY (accountId) REFERENCES Account(accountId),
    FOREIGN KEY (recipeId) REFERENCES Recipe(recipeId)
  )
`);


// insert data into the tables
db.serialize(() => {
    // insert into Account
    db.run(`
      INSERT INTO Account (email, username, password, authPost) 
      VALUES ('john@example.com', 'johndoe', 'password', 1)
    `);
  
    // insert into HealthConcern
    db.run(`
      INSERT INTO HealthConcern (accountId, concern) 
      VALUES (1, 'Diabetes')
    `);
  
    // insert into DietaryPreference
    db.run(`
      INSERT INTO DietaryPreference (accountId, preference) 
      VALUES (1, 'Vegetarian')
    `);
  
    // insert into Recipe
    db.run(`
      INSERT INTO Recipe (name, description, photo, preparationTime, cookTime, dishCategory) 
      VALUES ('Spaghetti Carbonara', 'Classic Italian pasta dish with eggs, pancetta, and cheese', 'https://example.com/spaghetti_carbonara.jpg', 10.0, 20.0, 'Pasta')
    `);
  
    // insert into Unit
    db.run(`
      INSERT INTO Unit (name) 
      VALUES ('Cup')
    `);
  
    // insert into Ingredient
    db.run(`
      INSERT INTO Ingredient (recipeId, name, quantity, unitId) 
      VALUES (1, 'Spaghetti', 8, 1)
    `);


    // Insert into Instruction
db.run(`
INSERT INTO Instruction (recipeId, instruction)
VALUES 
  (1, 'Preheat the oven to 375 degrees F (190 degrees C).'),
  (1, 'In a large bowl, cream together butter and sugar until smooth.'),
  (1, 'Beat in the eggs one at a time, then stir in the vanilla.'),
  (1, 'Combine flour, baking powder, and salt; gradually stir into the creamed mixture.'),
  (1, 'Stir in the chocolate chips.'),
  (1, 'Drop by rounded tablespoonfuls onto ungreased cookie sheets.'),
  (1, 'Bake for 8 to 10 minutes in the preheated oven.'),
  (1, 'Allow cookies to cool on baking sheet for 5 minutes before removing to a wire rack to cool completely.');
`);

// Insert into Instruction
db.run(`
INSERT INTO Instruction (recipeId, instruction)
VALUES 
  (2, 'Bring a large pot of salted water to a boil.'),
  (2, 'Add pasta and cook for 8 to 10 minutes or until al dente; drain.'),
  (2, 'In a large skillet, cook and stir bacon over medium heat until crisp.'),
  (2, 'Remove bacon with a slotted spoon and drain on paper towels, leaving the grease in the skillet.'),
  (2, 'Add garlic and onion to the bacon grease and cook until onion is tender.'),
  (2, 'Add tomatoes, cream, salt, and pepper.'),
  (2, 'Reduce heat to low and add Parmesan cheese.'),
  (2, 'Cook over low heat until the cheese is melted.'),
  (2, 'Add cooked pasta and toss to coat with sauce.'),
  (2, 'Crumble bacon over the top and serve.');
`);

// Insert into Instruction
db.run(`
INSERT INTO Instruction (recipeId, instruction)
VALUES 
  (3, 'Heat oven to 350°F.'),
  (3, 'Mix flour, granulated sugar, baking powder and salt in large bowl.'),
  (3, 'Cut in butter until mixture resembles coarse crumbs.'),
  (3, 'Add milk and egg; stir just until moistened.'),
  (3, 'Stir in 1 cup chocolate chips.'),
  (3, 'Spread into greased 8-inch square baking pan.'),
  (3, 'Sprinkle with remaining 1/2 cup chocolate chips.'),
  (3, 'Bake 25 to 30 min. or until golden brown.'),
  (3, 'Cool completely in pan on wire rack.'),
  (3, 'Cut into squares.');
`);
})


// Close the database connection
db.close();

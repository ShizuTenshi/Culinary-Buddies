"use strict"

const Sqlite = require('better-sqlite3');
let db = new Sqlite('db.sqlite');

exports.addNewRecipe = (name, description, photo, preparationTime, cookTime, instructions) => {
    let recipeId = db.prepare('INSERT INTO Recipe (name, description, photo, preparationTime, cookTime, instructions) VALUES (?, ?, ?,?,?, ?)').run([name, description, photo, preparationTime, cookTime, instructions]);
    return recipeId.lastInsertRowid;
}

exports.addNewCategory = (recipeId, categoryName) => {
    db.prepare('INSERT INTO Category (recipeId, categoryName) VALUES (?, ?)').run([recipeId, categoryName]);
}

exports.addNewTags = (recipeId, nameList) => {
    for (let i = 0; i < nameList.length; i++) {
        db.prepare('INSERT INTO Tag (recipeId, name) VALUES (?, ?)').run([recipeId, nameList[i]]);
    }
}

exports.addNewIngredients = (recipeId, combinedIngredients) => {
    for (let i = 0; i < combinedIngredients.length; i++) {
        console.log(recipeId, combinedIngredients[i].ingredient, combinedIngredients[i].quantity, combinedIngredients[i].unit);
        db.prepare('INSERT INTO Ingredient (recipeId, name, quantity, unit) VALUES (?, ?, ?, ?)').run([recipeId, combinedIngredients[i].ingredient, combinedIngredients[i].quantity, combinedIngredients[i].unit]);
    }
}

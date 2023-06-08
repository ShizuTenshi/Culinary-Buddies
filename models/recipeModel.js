"use strict"

const Sqlite = require('better-sqlite3');
let db = new Sqlite('db.sqlite');

exports.addNewRecipe = (name, description, photo, preparationTime, cookTime, instructions, accountId) => {
    console.log("account id = ", accountId);
    let recipeId = db.prepare('INSERT INTO Recipe (name, description, photo, preparationTime, cookTime, instructions, accountId) VALUES (?, ?, ?,?,?, ?, ?)').run([name, description, photo, preparationTime, cookTime, instructions, accountId]);
    return recipeId.lastInsertRowid;
}

exports.addNewCategory = (recipeId, categoryName) => {
    db.prepare('INSERT INTO Category (recipeId, categoryName) VALUES (?, ?)').run([recipeId, categoryName]);
}

exports.addMultipleTags = (recipeId, nameList) => {
    console.log(nameList)
    for (let i = 0; i < nameList.length; i++) {
        db.prepare('INSERT INTO Tag (recipeId, name) VALUES (?, ?)').run([recipeId, nameList[i]]);
    }
}

exports.addNewTag = (recipeId, nameList) => {
    db.prepare('INSERT INTO Tag (recipeId, name) VALUES (?, ?)').run([recipeId, nameList]);
}

exports.addNewIngredients = (recipeId, combinedIngredients) => {
    for (let i = 0; i < combinedIngredients.length; i++) {
        console.log(recipeId, combinedIngredients[i].ingredient, combinedIngredients[i].quantity, combinedIngredients[i].unit);
        db.prepare('INSERT INTO Ingredient (recipeId, name, quantity, unit) VALUES (?, ?, ?, ?)').run([recipeId, combinedIngredients[i].ingredient, combinedIngredients[i].quantity, combinedIngredients[i].unit]);
    }
}

exports.getRecipeById = (recipeId) => {
    let list = db.prepare("SELECT * FROM Recipe WHERE recipeId = ?").get([recipeId]);
    return list;
}

exports.getTagByRecipeId = (recipeId) => {
    let list = db.prepare("SELECT * FROM Tag WHERE recipeId = ?").all([recipeId]);
    return list;
}

exports.getIngredientsByRecipeId = (recipeId) => {
    let list = db.prepare("SELECT * FROM Ingredient WHERE recipeId = ?").all([recipeId]);
    return list;
}

exports.getAllRecipesByAccountId = (accountId) => {
    let list = db.prepare("SELECT * FROM Recipe WHERE accountId = ?").all([accountId]);
    return list;
}

exports.getAllRecipes = () => {
    let list = db.prepare("SELECT * FROM Recipe").all([]);
    for (let x = 0; x < list.length; x++) {
        //let tags = db.prepare("SELECT name FROM Tag").all([]);
        let account = db.prepare("SELECT username FROM Account WHERE accountId=?").get([list[x].accountId]);
        let category = db.prepare("SELECT categoryName FROM Category WHERE recipeId=?").get([list[x].recipeId]);
        list[x].account = account;
        list[x].category = category;

    }
    return list;
}
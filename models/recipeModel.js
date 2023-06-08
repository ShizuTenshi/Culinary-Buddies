"use strict"

const Sqlite = require('better-sqlite3');
let db = new Sqlite('db.sqlite');

exports.addNewRecipe = (name, description, photo, preparationTime, cookTime, instructions, accountId) => {
    let recipeId = db.prepare('INSERT INTO Recipe (name, description, photo, preparationTime, cookTime, instructions, accountId) VALUES (?, ?, ?,?,?, ?, ?)').run([name, description, photo, preparationTime, cookTime, instructions, accountId]);
    return recipeId.lastInsertRowid;
}

exports.addNewCategory = (recipeId, categoryName) => {
    db.prepare('INSERT INTO Category (recipeId, categoryName) VALUES (?, ?)').run([recipeId, categoryName]);
}

exports.addMultipleTags = (recipeId, nameList) => {
    for (let i = 0; i < nameList.length; i++) {
        db.prepare('INSERT INTO Tag (recipeId, name) VALUES (?, ?)').run([recipeId, nameList[i]]);
    }
}

exports.addNewTag = (recipeId, nameList) => {
    db.prepare('INSERT INTO Tag (recipeId, name) VALUES (?, ?)').run([recipeId, nameList]);
}

exports.addNewIngredients = (recipeId, combinedIngredients) => {
    for (let i = 0; i < combinedIngredients.length; i++) {
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

exports.getCategoryByRecipeId = (recipeId) => {
    let list = db.prepare("SELECT * FROM Category WHERE recipeId = ?").get([recipeId]);
    return list;
}



exports.getAllRecipes = () => {
    let list = db.prepare("SELECT * FROM Recipe").all([]);
    let resultList = [];
    
    for (let x = 0; x < list.length; x++) {
        let account = db.prepare("SELECT username FROM Account WHERE accountId=?").get([list[x].accountId]);
        let category = db.prepare("SELECT categoryName FROM Category WHERE recipeId=?").get([list[x].recipeId]);
        list[x].account = account;
        list[x].category = category;
        resultList.push({
            recipeId: list[x].recipeId,
            name: list[x].name,
            description: list[x].description,
            photo: list[x].photo,
            preparationTime: list[x].preparationTime,
            instructions: list[x].instructions,
            cookTime: list[x].cookTime,
            accountId: list[x].accountId,
            username: account ? account.username : undefined,
            categoryName: category ? category.categoryName : undefined
        });
    }
    
    return resultList;
    
}

exports.getRecipeByCategory = (category) => {
    let list = db.prepare("SELECT * FROM Recipe r, Category c, Account a WHERE r.accountId = a.accountId AND r.recipeId = c.recipeId AND c.categoryName = ?").all([category]);
    return list;
}

exports.getRecipeByTags = (tags) => {
    let list = db.prepare("SELECT * FROM Recipe r, Tag t, Account a WHERE r.accountId = a.accountId AND r.recipeId = t.recipeId AND t.name = ?").all([tags]);
    return list;
}

exports.getRecipeByCategoryAndTags = (category, tags) => {
    let list = db.prepare("SELECT * FROM Recipe r, Tag t, Category c, Account a WHERE r.accountId = a.accountId AND r.recipeId = c.recipeId AND r.recipeId = t.recipeId AND t.name = ? AND c.categoryName = ?").all([tags, category]);
    return list;
}



exports.deleteRecipe = (recipeId) => {
    // Delete the recipe from the Recipe table
    db.prepare("DELETE FROM Recipe WHERE recipeId = ?").run([recipeId]);
  }
  
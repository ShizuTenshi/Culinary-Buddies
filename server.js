var express = require('express');
var mustache = require('mustache-express');
const cookieSession = require('cookie-session');

const app = express();
const bodyParser = require('body-parser');
let flash = require('express-flash');

app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.static('public'));

app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', './views');
app.use(flash());

app.use(cookieSession({
  secret: 'mot-de-passe-du-cookie'
}));

let userModel = require('./models/userModel');
let dietaryPreferenceModel = require('./models/dietaryPreferenceModel');
let healthConcernModel = require('./models/healthConcernModel');
let recipeModel = require('./models/recipeModel');



// ----------------------------------------------------------------------------------

// Display the home page for unauthenticated users 
app.get('/', function (req, res) {
  const recipeList = recipeModel.getAllRecipes();
  res.render('index', { recipeList: recipeList });
})

// Display the sign in form page
app.get('/signInPage', function (req, res) {
  res.render('signInPage');
})

// Sign in functionality
app.post('/signInPage', function (req, res) {
  let email = req.body.email;
  let password = req.body.password;
  let verifyId = userModel.loginBuddy(email, password);
  if (verifyId === -1) {
    req.flash('logError', 'email or password incorrect');
    res.redirect('/signInPage');
  }

  req.session.sessionId = verifyId.accountId;
  res.redirect('/profilePage/' + verifyId.accountId); // Add accountId as a parameter
});

// Sign out functionality 
app.get('/signOut', function (req, res) {
  req.session = null;
  res.redirect('/');
})

// Display the sign up form page
app.get('/signUpPage', function (req, res) {
  res.render('signUpPage');
})

// Sign up functionality 
app.post('/signUpPage', function (req, res) {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let confirmPassword = req.body.confirmPassword;


  if (password !== confirmPassword) {
    req.flash('regError', "passwords don't match");
    res.redirect('/signUpPage');
  }

  else if (userModel.nameExist(username) !== -1) {
    req.flash('regError', "name is already taken");
    res.redirect('/signUpPage');
  }

  else if (userModel.emailExist(email) !== -1) {
    req.flash('regError', "another account used this email");
    res.redirect('/signUpPage');
  }
  else {
    let accountId = userModel.insertUser(username, email, password);
    req.session.sessionId = accountId;
    req.flash('reg', "account was successfully created you can now add your information  !");
    res.redirect('/editAccount');
  }
})

// Display recipe page of each recipe for unauthenticated users 
app.get('/recipePage/:id', function (req, res) {
  const recipe = recipeModel.getRecipeById(req.params.id);
  const tag = recipeModel.getTagByRecipeId(req.params.id);
  const ingredients = recipeModel.getIngredientsByRecipeId(req.params.id);
  const category = recipeModel.getCategoryByRecipeId(req.params.id);

  let postedBy;
  if (recipe) postedBy = userModel.getUsernameFromId(recipe.accountId);
  res.render('recipePage', { recipe: recipe, tag: tag, ingredients: ingredients, postedBy: postedBy, category: category });
})


// User needs to be connected for everything beyond this point 
app.use(isAuthenticated);


// Display the home page
app.get('/homePage', function (req, res) {
  const recipeList = recipeModel.getAllRecipes();
  res.render('homePage', { recipeList: recipeList });
})

// Display the profile page of any account based on id
app.get('/profilePage/:accountId', isOwnAccount, function (req, res) {
  let accountId = req.params.accountId;
  let dietaryList = dietaryPreferenceModel.getDietaryPreferenceList(accountId);
  let healthConcern = healthConcernModel.getHealthConcernList(accountId);
  let username = userModel.getUsernameFromId(accountId);
  let recipeList = recipeModel.getAllRecipesByAccountId(accountId);

  res.render('profilePage', { dietary: dietaryList, health: healthConcern, username: username.username, recipeList: recipeList, isOwnAccount: res.locals.isOwnAccount });
});

// My profile button functionality
app.get('/myProfile', function (req, res) {
  let loggedInUserId = req.session.sessionId;
  res.redirect('/profilePage/' + loggedInUserId);
});


// Display the edit account form 
app.get('/editAccount', function (req, res) {
  res.render('editAccount');
})

// Edit account button functionality
app.post('/editAccount', function (req, res) {
  let userId = req.session.sessionId; // Get the user ID from the session

  // Retrieve the form data from the request body
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;

  let vegan = req.body.vegan;
  let vegetarian = req.body.vegetarian;
  let halal = req.body.halal;
  let kosher = req.body.kosher;
  let otherDietary = req.body.other_dietary;

  let dietaryOptions = [];
  if (vegan != undefined) dietaryOptions.push(vegan);
  if (vegetarian != undefined) dietaryOptions.push(vegetarian);
  if (halal != undefined) dietaryOptions.push(halal);
  if (kosher != undefined) dietaryOptions.push(kosher);
  if (otherDietary) dietaryOptions.push(otherDietary);

  let diabetes = req.body.diabetes;
  let cardiovascular_disease = req.body.cardiovascular_disease;
  let celiac_disease = req.body.celiac_disease;
  let inflammatory_bowel_disease = req.body.inflammatory_bowel_disease;
  let chronic_kidney_disease = req.body.chronic_kidney_disease;
  let otherHealthConcerns = req.body.other_health_concerns;

  let healthConcerns = [];
  if (diabetes != undefined) healthConcerns.push(diabetes);
  if (cardiovascular_disease != undefined) healthConcerns.push(cardiovascular_disease);
  if (celiac_disease != undefined) healthConcerns.push(celiac_disease);
  if (inflammatory_bowel_disease != undefined) healthConcerns.push(inflammatory_bowel_disease);
  if (chronic_kidney_disease) healthConcerns.push(chronic_kidney_disease);
  if (otherHealthConcerns) healthConcerns.push(otherHealthConcerns);

  // Update Account
  userModel.updateAccount(userId, email, username, password);

  // Delete Old Dietary Options
  dietaryPreferenceModel.deleteOldDietaryOptions(userId);

  // Delete Old Dietary Options
  healthConcernModel.deleteOldHealthOptions(userId);

  // Update Dietary Options
  dietaryPreferenceModel.updateDietaryOptions(userId, dietaryOptions);

  // Update Health Concerns
  healthConcernModel.updateHealthConcerns(userId, healthConcerns);

  req.flash('reg', "Account information was successfully updated !");
  res.redirect('/editAccount');
})


// Display create Recipe form
app.get('/createRecipe', function (req, res) {
  res.render('createRecipe');
})

// Create recipe button functionality 
app.post('/createRecipe', function (req, res) {
  const userId = req.session.sessionId;
  const name = req.body.name;
  const description = req.body.description;
  const photo = req.body.photo;
  const preparationTime = req.body.preparationTime;
  const cookTime = req.body.cookTime;
  const dishCategory = req.body.dishCategory;
  const instructions = req.body.instructions;
  const ingredients = req.body['ingredient[]'];
  const quantities = req.body['quantity[]'];
  const units = req.body['unit[]'];
  const tags = req.body['tag[]'];

  let combinedIngredients;

  if (Array.isArray(ingredients)) {
    combinedIngredients = ingredients.map((ingredient, index) => {
      const quantity = quantities[index];
      const unit = units[index];
      return { ingredient, quantity, unit };
    })
  }
  const recipeId = recipeModel.addNewRecipe(name, description, photo, preparationTime, cookTime, instructions, userId);

  if (Array.isArray(tags)) {
    recipeModel.addMultipleTags(recipeId, tags);
  }
  else {
    recipeModel.addNewTag(recipeId, tags);
  }
  recipeModel.addNewCategory(recipeId, dishCategory);
  recipeModel.addNewIngredients(recipeId, combinedIngredients);

  req.flash('reg', "Recipe was successfully created !");
  res.redirect('/profilePage/' + req.session.sessionId);
})


// Apply filters button functionality
app.post('/applyFilters', function (req, res) {
  let category = req.body.dishCategory;
  let tags = req.body['tags[]'];

  let recipeList;

  if (category === "All" && tags === "") {
    recipeList = recipeModel.getAllRecipes();
  }

  else if (category === "All" && tags !== "") {
    recipeList = recipeModel.getRecipeByTags(tags);
  }

  else if (tags === "" && category !== "All") {
    recipeList = recipeModel.getRecipeByCategory(category);
  }

  else if (category !== "All" && tags !== "") {
    recipeList = recipeModel.getRecipeByCategoryAndTags(category, tags);
  }

  else {
    console.error("You need to choose a filter");
  }
  res.render('homePage', { recipeList: recipeList });
})

app.post('/deleteRecipe/:id', function (req, res) {
  recipeModel.deleteRecipe(req.params.id)
  req.flash('reg', "Recipe was successfully Removed !");
  res.redirect('/profilePage/' + req.session.sessionId);
})

// Display recipe page for each page for connected users 
app.get('/recipePageConnected/:id', isOwner, function (req, res) {
  const recipeId = req.params.id;
  const loggedInUserId = req.session.sessionId;

  // Retrieve the recipe
  const recipe = recipeModel.getRecipeById(recipeId);

  // Check if the recipe exists and if the logged-in user is the owner
  if (recipe && recipe.accountId === loggedInUserId) {
    res.locals.isOwner = true;
  } else {
    res.locals.isOwner = false;
  }

  const tag = recipeModel.getTagByRecipeId(recipeId);
  const ingredients = recipeModel.getIngredientsByRecipeId(recipeId);
  const category = recipeModel.getCategoryByRecipeId(req.params.id);

  let postedBy;
  if (recipe) postedBy = userModel.getUsernameFromId(recipe.accountId);
  res.render('recipePage', { recipe: recipe, tag: tag, ingredients: ingredients, postedBy: postedBy, category: category });
});



/*
* This is a middleware function that tests if the user is connected when he wants to
* access pages that require an authentification.
*/

function isAuthenticated(req, res, next) {
  // checks if a session is open
  if (req.session.sessionId !== undefined) {
    res.locals.isConnected = true;
    return next();
  }

  res.status(401).send("Please sign in before you proceed");
}

// Middleware function to check if the current user is the owner of the recipe they're currently viewing 
function isOwner(req, res, next) {
  const recipeId = req.params.id;
  const loggedInUserId = req.session.sessionId;

  // Retrieve the recipe
  const recipe = recipeModel.getRecipeById(recipeId);

  // Check if the recipe exists and if the logged-in user is the owner
  if (recipe && recipe.accountId === loggedInUserId) {
    res.locals.isOwner = true;
  } else {
    res.locals.isOwner = false;
  }

  next();
}

// checks if the profile being viewed is the connected user's account or not 

function isOwnAccount(req, res, next) {
  const profileAccountId = req.params.accountId;
  const loggedInUserId = req.session.sessionId;

  // Compare the profileAccountId with the logged-in user's accountId
  if (profileAccountId === loggedInUserId) {
    res.locals.isOwnAccount = true;
  } else {
    res.locals.isOwnAccount = false;
  }

  next();
}

// Middleware function to check if the displayed account is in the connected user's friend list
function isFriend(req, res, next) {
  const displayedAccountId = req.params.accountId;
  const loggedInUserId = req.session.sessionId;

  if (friendModel.areFriends(loggedInUserId, displayedAccountId)) {
    res.locals.isFriend = true;
  } else {
    res.locals.isFriend = false;
  }

  next();
}



app.listen(5000, () => console.log('listening on http://localhost:5000'));

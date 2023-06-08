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
app.get('/', function (req, res) {
  const recipeList = recipeModel.getAllRecipes();
  console.log(req.session.sessionId)
  res.render('index', {recipeList: recipeList});
})

app.get('/signInPage', function (req, res) {
  res.render('signInPage');
})

app.get('/signUpPage', function (req, res) {
  res.render('signUpPage');
})

app.get('/signOut', function (req, res) {
  req.session = null;
  res.redirect('/');
})

app.get('/recipePage/:id', function (req, res) {
  const recipe = recipeModel.getRecipeById(req.params.id);
  const tag = recipeModel.getTagByRecipeId(req.params.id);
  const ingredients = recipeModel.getIngredientsByRecipeId(req.params.id);
  let postedBy;
  if (recipe) postedBy = userModel.getUsernameFromId(recipe.accountId);
  res.render('recipePage', { recipe: recipe, tag: tag, ingredients: ingredients, postedBy: postedBy });
})


app.post('/signInPage', function (req, res) {
  let email = req.body.email;
  let password = req.body.password;
  let verifyId = userModel.loginBuddy(email, password);
  if (verifyId === -1) {
    req.flash('logError', 'email or password incorrect');
    res.redirect('/signInPage');
  }

  req.session.sessionId = verifyId.accountId;
  res.redirect('/profilePage');
})


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

// User needs to be connected for everything beyond this point 
app.use(isAuthenticated);


app.get('/homePage', function (req, res) {
  const recipeList = recipeModel.getAllRecipes();
  console.log(req.session.sessionId)
  res.render('homePage', {recipeList: recipeList});
})


app.get('/profilePage', function (req, res) {
  let dietaryList = dietaryPreferenceModel.getDietaryPreferenceList(req.session.sessionId);
  let healthConcern = healthConcernModel.getHealthConcernList(req.session.sessionId);
  let username = userModel.getUsernameFromId(req.session.sessionId);
  let recipeList = recipeModel.getAllRecipesByAccountId(req.session.sessionId);

  res.render('profilePage', { dietary: dietaryList, health: healthConcern, username: username.username, recipeList: recipeList });
})

app.get('/editAccount', function (req, res) {
  res.render('editAccount');
})

app.get('/myProfile', function (req, res) {
  res.redirect('/profilePage');
})

app.get('/createRecipe', function (req, res) {
  res.render('createRecipe');
})


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
  res.redirect('/createRecipe');
})

app.post('/applyFilters', function (req, res) {
  let category = req.body.dishCategory;
  let tags = req.body['tags[]'];

  console.log(category, tags);



  res.render('homePage', { category: category, tags: tags });
})


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




app.listen(5000, () => console.log('listening on http://localhost:5000'));

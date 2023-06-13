# Culinary-Buddies

“Culinary Buddies” is a recipe sharing website where users can share their own recipes or save recipes shared by
other users, categorize their recipes based on budget, culture or medical needs, and even add other users to their
friends list to be able to chat with them privately.

## Disclaimer: development in progress

## Table of Contents

- [Models](#models)
- [Views](#views)
- [Setup](#setup)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Models

- dietaryPreferenceModel.js
- healthConcernModel.js
- recipeModel.js
- userModel.js

## Views

- createRecipe.html
- editAccount.html
- header.html
- homePage.html
- index.html
- profilePage.html
- recipePage.html
- signInPage.html
- signUpPage.html

## Files

- .gitignore
- README.md
- createDB.js
- package-lock.json
- package.json
- server.js

## Setup

1. Clone the repository.
2. Install the dependencies using the following command: $npm install
3. Set up the database using `createDB.js`.
4. Start the server using the following command: $node server.js


## Usage

- Access the application by visiting `http://localhost:5000` in your browser.
- Follow the on-screen instructions to navigate and use the features.

## Routes

The server implements the following routes:

- `/`: Displays the home page for unauthenticated users.
- `/signInPage`: Displays the sign-in form page.
- `/signInPage (POST)`: Handles sign-in functionality.
- `/signOut`: Handles sign-out functionality.
- `/signUpPage`: Displays the sign-up form page.
- `/signUpPage (POST)`: Handles sign-up functionality.
- `/recipePage/:id`: Displays the recipe page of a specific recipe for unauthenticated users.
- `/homePage`: Displays the home page for authenticated users.
- `/profilePage/:accountId`: Displays the profile page of an account based on the account ID.
- `/myProfile`: Redirects to the profile page of the logged-in user.
- `/editAccount`: Displays the edit account form.
- `/editAccount (POST)`: Handles account editing functionality.
- `/createRecipe`: Displays the create recipe form.
- `/createRecipe (POST)`: Handles recipe creation functionality.
- `/applyFilters (POST)`: Handles filter application functionality.
- `/recipePageConnected/:id`: Displays the recipe page of a specific recipe for authenticated users.

## Middleware Functions

The server uses the following middleware functions:

- `isAuthenticated`: Checks if a user is authenticated before accessing protected routes.
- `isOwner`: Checks if the logged-in user is the owner of a recipe.
- `isOwnAccount`: Checks if the displayed profile belongs to the logged-in user.
- `isFriend`: Checks if the displayed account is in the logged-in user's friend list.

Please refer to the code in `server.js` for more details on the implementation of each route and middleware function.






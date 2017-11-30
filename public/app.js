const STATE_DATA = {}; // data from database stored here


function editStressor() {
  /* From the Dashboard, Click on a stressor
  1. Edit Stressor data (PUT)
  2. After PUT request modifies data entry in DB,
    refresh to return to Dashboard.
  */
}

function deleteStressor() {
  /* From the Dashboard, Click on a stressor
  1. Delete Stressor data (DELETE)
  2. After DELETE request modifies data entry in DB,
    refresh to return to Dashboard.
  */
}

function createNavBarDashboard() {
  /* will create Navigation Bar on the Dashboard
  1. logout
  2. POST new stressor */

  let navBarHtml =
    `<nav class="navBarDash" role="navigation">
      <a href="#" class="create-stressor-btn">Create new Stressor</a>
      <a href="#" class="logout-btn">Logout</a>
    </nav>`;

  return navBarHtml;
}

function createNavBarNotDashboard() {
  /* Will create Navigation Bar on the "page" that's NOT the Dashboard
  1. Return to dashboard
  2. logout (probably) */

}

function displayCreateNewStressor() {
  /* Will create a page with a form to Create a new Stressor
  1. The form page HTML appears to Create a new Stressor.
  2. Input fields for stressor data.
  3. When click Submit, make a POST request to database
  4. A new page (eventually new Chart) will appear with the entered data.
  5. A button needs to appear to return to user's Dashboard.
  */

  console.log("displayCreateNewStressor() was called");
}

function displayDashBoard() {
  /* Dashboard is the home page of a logged in user.
  This page is where all user data from the GET request is displayed. */

  let htmlString = "";
  let stressorsData = STATE_DATA.data;

  // The nav bar HTML appears at the top of the user's home page.
  htmlString = createNavBarDashboard();

  for (let i = 0; i < stressorsData.length; i++) {
    console.log(i);

    htmlString +=
      `<div class="js-single-result">
        <p class="stressor-name">${stressorsData[i].stress}</p>
        <p>${stressorsData[i].activity}</p>
        <p>${stressorsData[i].id}</p>
        <p>${stressorsData[i].duration}</p>
        <p>${stressorsData[i].preHeartRate}</p>
        <p>${stressorsData[i].postHeartRate}</p>
      </div>`;
  }

  // Render the Dashboard page
  $(".js-results").html(htmlString);


  // Listen for button click to Create new Stressor
  $(".create-stressor-btn").on("click", function () {
    console.log("Clicked to Create new Stressor");

    // When click create New Stressor, a form page will appear
    displayCreateNewStressor();
  });

  // Listen for button click to Log out user
  $(".logout-btn").on("click", function () {
    console.log("Clicked to log out user");

    // Upon logging out, call displayHomeScreen()
    displayHomeScreen();
  });
}

function getAllStressors() {
  let baseUrl = "http://localhost:8080";

  $("button").on("click", function (event) {
    // event.preventDefault();
    console.log("button clicked!");

    $.ajax({
      method: "GET",
      url: baseUrl + "/stressors",
      dataType: "json",
      success: function (data) {
        console.log("[[CLIENT SIDE]]", data);

        /* The data retrieved from a successful GET request
        will be stored in a global constant on the client side */
        STATE_DATA.data = data;

        // After the GET request, render HTML with data.
        displayDashBoard();
      }
    });

  });
}

function displayHomeScreen() {
  let htmlString =
    `<p>Hello World rendered by displayHomeScreen()</p>
    <p>This page shows the Login and/or Create new user page</p>
    <button>Login/Create user => GET all stressors => display Dashboard</button>`;

  /* This is the first page loaded to the client.
  Will see a form to login with username and password.

  Will also see a button to go to another page to create
  new user account. Add another <section> for create User account? */

  /* Listen for the button click to display the Dashboard.
  Right now the button click will act as Authentication,
  logging in or creating a new user. */

  // target .js-results to render HomeScreen (login page)
  $(".js-results").html(htmlString);

  $("button").on("click", function (event) {
    // event.preventDefault();
    getAllStressors();
  });
}


/* 
The final Node app will have function calls in roughly this order:

Note: the homeScreen() will either create a new user, or login user

handler() => homeScreen() => getAllStressors() => 1. getOneStressorById()
                                               => 2. postNewStressor()
*/

$(displayHomeScreen);


/////////////////////////////

/*

Note, these steps occur after the user has logged into their Dashboard

1. press button (or load dashboard), get all stressors and de-stressing activities for user. GET request

2. press button or link, get single unique stressor and de-stressing activity for user. GET requesty by id

2b. Also POST data with a form, then display

3. render the results

9. Do this later, will make modular later

Eventually move HTTP routes into a separate router module
use express.Router

example:
var express = require('express')
var router = express.Router()

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

U1, Lesson 4, Section 6, First Glitch recipesRouter.js and 
shoppingListRouter.js

*/
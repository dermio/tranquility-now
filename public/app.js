const STATE_DATA = {}; // data from database stored here


function deleteStressor() {
  /* From the Dashboard, Click on a stressor
  1. Delete Stressor data (DELETE)
  2. After DELETE request modifies data entry in DB,
    refresh to return to Dashboard. */

}

function editStressor(uniqueId) {
  /* From the Dashboard, Click on a stressor
  1. Edit Stressor data (PUT)
  2. After PUT request modifies data entry in DB,
    refresh to return to Dashboard. */
  console.log("editStressor() was called");
  console.log(uniqueId);
}

function displayStressorChart(oneStressor) {
  /* Will display one stressor as chart, for GET by id or POST.
  1. Need nav bar to go back to user Dashboard
  2. Dashboard will include NEW entry for created Stressor */
  console.log("displayStressorChart() was called, for GET by id or POST");
  console.log(STATE_DATA);
  console.log(oneStressor);

  let stressorId = oneStressor.id;
  console.log(stressorId);

  let htmlString =
    `<nav class="navBarStressor" role="navigation">
      <a href="#" class="return-dashboard-btn">Return to Dashboard</a>
      <a href="#" class="edit-stressor-btn">Edit this Stressor</a>
      <a href="#" class="delete-stressor-btn">Delete this Stressor</a>
    </nav>

    <div class="js-single-result" id="${oneStressor.id}">
      <p class="stressor-name">${oneStressor.stress}</p>
      <p>${oneStressor.activity}</p>
      <p>${oneStressor.id}</p>
      <p>${oneStressor.duration}</p>
      <p>${oneStressor.preHeartRate}</p>
      <p>${oneStressor.postHeartRate}</p>
    </div>`;


  $(".js-results").html(htmlString);

  /* Need event listeners for navigation bar
  1. return to dashboard, call displayDashBoard()
  2. Edit stressor
  3. Delete stressor */

  $(".return-dashboard-btn").on("click", function (event) {
    event.preventDefault();
    displayDashBoard();
  });

  $(".edit-stressor-btn").on("click", function (event) {
    event.preventDefault();

    // Call editStressor() for PUT request.
    editStressor(stressorId);
  });

}

function getStressorById(uniqueId) {
  /*
  1. Using the stressor's id, perform GET request by id.
  2. On success, call displayStressorChart(resData) with res data
  */
  console.log("getStressorById() was called");
  console.log(uniqueId);

  $.ajax({
    method: "GET",
    url: "/stressors/" + uniqueId,
    dataType: "json",
    success: function (resData) {
      console.log("[[RESPONSE FROM SERVER, GET BY ID SUCCESSFUL]]", resData);

      displayStressorChart(resData);
    }
  });
}

function createNewStressor(dataFromForm) {
  console.log("createNewStressor() was called, making POST request");
  /* Create Stressor
  1. POST request
  2. display newly created stressor as a CHART (display as data for now)
  */

  /*
  1. data needs to be JS object,
  2. Keys must be the same as in Model, values come from the form
  3. use jQuery to grab the data from form and put in JS object
  4. JSON.stringify(Javascript data object)
  */

  /* When createNewStressor() is called, the argument referenced
  by dataFromForm has already been JSON.stringified.
  Pass dataFromForm to $.ajax() to make POST request. */
  $.ajax({
    method: "POST",
    url: "/stressors",
    data: dataFromForm, // Value already stringified.
    dataType: "json",
    contentType: "application/json",
    success: function (resData) {
      console.log("[[RESPONSE FROM SERVER, POST SUCCESSFUL]]", resData);
      console.log("STATE_DATA docs length: ", STATE_DATA.data.length);

      // Push the response data from the server to const STATE_DATA.data
      STATE_DATA.data.push(resData);
      console.log("STATE_DATA docs length: ", STATE_DATA.data.length);

      let resDataId = resData.id;
      console.log(resDataId);

      displayStressorChart(resData);

      // Marius Banea says after POST request make a GET request??
    }
  });

}

function displayCreateNewStressorForm() {
  console.log("displayCreateNewStressorForm() was called");

  /* Will create a page with a form to Create a new Stressor
  1. The form page HTML appears to Create a new Stressor.
  2. Input fields for stressor data.
  3. When click Submit, make a POST request to database
  4. A new page (eventually new Chart) will appear with the entered data.
  5. A button needs to appear to return to user's Dashboard.
  */

  let htmlString =
    `<form action="/stressor" method="post" role="form" class="stressor-form">
      <fieldset>
        <legend>Enter Stressor and Relaxation activity</legend>

        <label for="stress">Stress</label>
        <input type="text" name="stress" id="stress" required>

        <label for="activity">Relaxation Activity</label>
        <input type="text" name="activity" id="activity" required>

        <label for="duration">Duration in min</label>
        <input type="number" name="duration" id="duration" required>

        <label for="preHR">Pre Heart Rate</label>
        <input type="number" name="preHR" id="preHR" required>

        <label for="postHR">Post Heart Rate</label>
        <input type="number" name="postHR" id="postHR" required>

        <button type="submit" class="submit-stressor-btn">
          Submit new Stressor
        </button>
      </fieldset>
    </form>`;

  // Render the form to POST stressor
  $(".js-results").html(htmlString);

  // Listen for submission on Form to create new stressor, POST request
  $(".stressor-form").on("submit", function (event) {
    event.preventDefault();
    console.log("submit new stressor, next Function call for Post request");

    /* Grab user data from Form fields, pass as argument
    to createNewStressor to make POST request
    The form user data should be a JS object.
    Use JSON.stringify() */

    /* Explain later Ryan solution
    let formUserDataRLynch = {
      stress: this.stress.value,
      activity: this.activity.value,
      duration: this.duration.value,
      preHeartRate: this.preHR.value,
      postHeartRate: this.postHR.value
    };

    let jsonStringRLynch = JSON.stringify(formUserDataRLynch);
    */

    let formUserData = {
      stress: $(this).find("#stress").val(),
      activity: $(this).find("#activity").val(),
      duration: $(this).find("#duration").val(),
      preHeartRate: $(this).find("#preHR").val(),
      postHeartRate: $(this).find("#postHR").val()
    };

    let jsonStringifiedFormUserData = JSON.stringify(formUserData);

    // console.log(jsonStringRLynch);
    console.log(jsonStringifiedFormUserData);

    // console.log(this);
    // console.log($(this));

    /* Next need to make POST request to database.
    If successful, the data sent to DB will be displayed as a chart.
    For now, return the data from the DB and give the message link
    to return to the Dashboard. */

    createNewStressor(jsonStringifiedFormUserData);

  });
}

function displayDashBoard() {
  /* Dashboard is the home page of a logged in user.
  This page is where all user data from the GET request is displayed. */

  /* First populate the htmlString with the navigation bar HTML
  that appears at the top of the user's dashboard */
  let htmlString =
    `<nav class="navBarDash" role="navigation">
      <a href="#" class="create-stressor-btn">Create new Stressor</a>
      <a href="#" class="logout-btn">Logout</a>
    </nav>`;

  let stressorsData = STATE_DATA.data;

  for (let i = 0; i < stressorsData.length; i++) {
    // Next populate the htmlString with stressor data
    htmlString +=
      `<div class="js-single-result" id="${stressorsData[i].id}">
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
  $(".create-stressor-btn").on("click", function (event) {
    event.preventDefault();
    console.log("Clicked to Create new Stressor");

    // When click create New Stressor, a form page will appear
    displayCreateNewStressorForm();
  });

  // Listen for button click to Log out user
  $(".logout-btn").on("click", function (event) {
    event.preventDefault();
    console.log("Clicked to log out user");

    /* Upon logging out, call displayHomeScreen()
    NOTE: this is NOT the correct way to LOG-OUT!
    Later on will use real JWT to properly log out the user */
    displayHomeScreen();
  });

  /* Listen for button or stressor name click to grab Id
  of single stressor. */
  $(".stressor-name").on("click", function (event) {
    event.preventDefault();
    let stressorId = $(this).parent().attr("id");

    // Call getStressorById() with Id argument.
    getStressorById(stressorId);
  });

}

function getAllStressors() {
  // GET request to the database for the user's data
  // let baseUrl = "http://localhost:8080";

  $.ajax({
    method: "GET",
    url: "/stressors",
    dataType: "json",
    success: function (resData) {
      console.log("[[RESPONSE FROM SERVER, GET SUCCESSFUL]]", resData);

      /* The data retrieved from a successful GET request
      will be stored in a global constant on the client side */
      STATE_DATA.data = resData;

      // After the GET request, render HTML with data.
      displayDashBoard();
    }
  });

}

function displayHomeScreen() {
  let htmlString =
    `<p>Hello World rendered by displayHomeScreen()</p>
    <p>This page shows the Login and/or Create new user page</p>
    <button class="home-screen-btn">Login/Create user => GET all stressors => display Dashboard</button>`;

  /* This is the first page loaded to the client.
  Will see a form to login with username and password.

  Will also see a button to go to another page to create
  new user account. Add another <section> for create User account? */

  /* Listen for the button click to display the Dashboard.
  Right now the button click will act as Authentication,
  logging in or creating a new user. */

  // target .js-results to render HomeScreen (login page)
  $(".js-results").html(htmlString);

  $(".home-screen-btn").on("click", function (event) {
    event.preventDefault();
    getAllStressors();
  });
}


/* 
The final Node app will have function calls in roughly this order:

Note: the homeScreen() will either create a new user, or login user

handler() => homeScreen() => getAllStressors() => 1. getOneStressorById()
                                               => 2. postNewStressor()
*/

function startApp() {
  displayHomeScreen();
}

$(startApp);


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
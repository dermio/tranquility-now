const STATE_DATA = {}; // data from database stored here


function deleteStressor(oneStressor) {
  /*
  1. Make DELETE request to server.
  2. Delete the stressor data on the client side.
  3. Return to the dashboard
  */
  console.log("oneStressor was called", oneStressor);

  $.ajax({
    method: "DELETE",
    url: "/stressors/" + oneStressor.id,
    success: function (resData) {
      console.log("[[RESPONSE FROM SERVER, DELETE SUCCESSFUL]]");
      console.log(resData);
      /* resData is `undefined` because the server does NOT send data
      back to the client */

      // Show the user a message the DELETE request was successful
      let htmlString =
      `<div class="delete-message">
        <p>Successfully deleted Stress:
          <span class="delete-stress-val">${oneStressor.stress}</span>
        </p>
        <button class="return-dashboard-btn my-btn">All Stressors</button>
      </div>`;

    // Render the page to inform stressor was deleted.
    $(".js-results").html(htmlString);
    }
  });

  // Event listener click button to return to Dashboard
  $(".js-results").on("click", ".return-dashboard-btn", function (event) {
    event.preventDefault();
    console.log("[[CLICKED BUTTON, RETURN TO DASHBOARD FROM DELETE]]");

    // Call getAllStressors(), which calls displayDashBoard();
    getAllStressors();
  });

}

function confirmDeleteStressor(oneStressor) {
  /* Using the SweetAlert2 popup function will determine if
  deleteStressor() is called */

  swal({
    showConfirmButton: false,
    html:
    `<p class="delete-message">
      Delete stressor: <span class="current-val">${oneStressor.stress}</span>?
    </p>
    <button class="submit-stressor-btn my-btn">Yes</button>
    <button class="cancel-create-stressor-btn my-btn">No</button>`
  });
}

function editStressor(updatedFormData) {
  /* The updatedStressor object from the edit stressor form
  is passed as an argument. 
  1. JSON.stringify the updatedStressor object
  2. Make the PUT request
  3. After PUT request, show the updated Data or Chart
  4. Create navbar to return to dashboard */
  console.log("editStressor() was called");
  console.log(updatedFormData);

  /* dataType: "json" is not needed because the server is NOT
  sending back data to the client. Check server.js, line 91.
  The only response from the server is a status code 204. */
  $.ajax({
    method: "PUT",
    url: "/stressors/" + updatedFormData.id,
    data: JSON.stringify(updatedFormData),
    contentType: "application/json",
    success: function (resData) {
      console.log("[[RESPONSE FROM SERVER, PUT SUCCESSFUL]]", resData);
      /* resData is `undefined` because the server does NOT send data
      back to the client */

      /* Need to update the STATE_DATA on the client side,
      because the PUT request does NOT return data. */
      console.log("[[CLIENT-SIDE DATA]]", STATE_DATA.data);
      STATE_DATA.data.forEach(function (stressor, index) {
        if (stressor.id === updatedFormData.id) {
          console.log("[[MATCHING-IDS]]", updatedFormData.id);
          STATE_DATA.data[index] = updatedFormData;
        }
      });

      // call displayStressorChart() with updatedFormData stressor
      displayStressorChart(updatedFormData);
    }
  });

}

function displayEditStressorForm(oneStressor) {
  /*
  1. Display a form to allow the user to change desired field values.
  2. Keep track of the field values the user changes (in an object)?
  3. On form submission call editStressor() with:
      a. stressor id
      b. changed field values
  4. Only the changed field values will be part of the PUT request.
  */
  console.log("displayEditStressorForm() was called");
  console.log(oneStressor);

  let htmlString =
    `<form action="/stressor/${oneStressor.id}" method="put" role="form" class="edit-stressor-form">
      <fieldset>
        <legend>Update Desired Stressor fields</legend>

        <label for="stress">Stress:</label>
        <span class="current-val">${oneStressor.stress}</span>
        <input type="text" name="stress" id="stress">

        <label for="activity">Relaxation Activity:</label>
        <span class="current-val">${oneStressor.activity}</span>
        <input type="text" name="activity" id="activity">

        <label for="duration">Duration in min:</label>
        <span class="current-val">${oneStressor.duration}</span>
        <input type="number" name="duration" id="duration" min="1" max="10">

        <label for="preHR">Pre Heart Rate:</label>
        <span class="current-val">${oneStressor.preHeartRate}</span>
        <input type="number" name="preHR" id="preHR" min="20" max="200">

        <label for="postHR">Post Heart Rate:</label>
        <span class="current-val">${oneStressor.postHeartRate}</span>
        <input type="number" name="postHR" id="postHR" min="20" max="200">

        <button type="submit" class="submit-stressor-btn my-btn">
          Update Stressor
        </button>

        <button type="button" class="cancel-edit-stressor-btn my-btn">
          Cancel
        </button>
      </fieldset>
    </form>`;

  // Render the form to edit (PUT) stressor
  $(".js-results").html(htmlString);

  // Listen for submission on Form to edit stressor, PUT request
  $(".edit-stressor-form").on("submit", function (event) {
    event.preventDefault();
    console.log("Edit existing stressor, next Function call for Put request");

    let updatedData = {};
    let formUserData = {
      id: oneStressor.id, // id is needed for PUT request
      stress: $(this).find("#stress").val(),
      activity: $(this).find("#activity").val(),
      duration: $(this).find("#duration").val(),
      preHeartRate: $(this).find("#preHR").val(),
      postHeartRate: $(this).find("#postHR").val()
    };

    /* I removed the `required` attribute for input fields to give
    the user the choice of what parts of the stressor to update.
    PROBLEM: What if the user wants an empty field?
    Only the Key-Value pairs in request.body should be submitted
    for a PUT request */

    /* The user has the option to update none, all, or some
    of the fields values in the stressor. The current stressor
    object is passed to the edit stressor function. An updatedData
    object will be used in the PUT request.

    /* If the user did NOT enter a new value in the form, the value
    of the form is an empty string "", which is a `falsy` value.
    Add the the current field from the stressor object to updatedData.
    If the user entered a new value, use that value in updatedData. */
    for (key in formUserData) {
      if (!formUserData[key]) { // Empty value, use current stressor value
        updatedData[key] = oneStressor[key];
      } else { // Entered new value, use this value
        updatedData[key] = formUserData[key];
      }
    }

    console.log("[[FORM-USER-DATA]]", formUserData);
    console.log("[[UPDATED-DATA]]",  updatedData);

    // Call editStressor with updatedData obj to make PUT request
    editStressor(updatedData);
  });

  // Cancel edit stressor, return to Dashboard
  $(".cancel-edit-stressor-btn").on("click", function (event) {
    event.preventDefault();
    displayDashBoard();
  });
}

function displayStressorChart(oneStressor) {
  /* Will display one stressor as chart, for GET by id, POST, and PUT.
  1. Need nav bar to go back to user Dashboard
  2. Dashboard will include NEW entry for created Stressor */
  console.log("displayStressorChart() was called, for GET by id or POST");
  console.log(STATE_DATA);
  console.log(oneStressor);

  let stressorId = oneStressor.id;
  console.log(stressorId);

  let htmlString =
    `<nav class="navbar-stressor-chart" role="navigation">
      <a href="#" class="all-stressors-btn">All Stressors</a>
      <a href="#" class="edit-stressor-btn">Update Stressor</a>
      <a href="#" class="delete-stressor-btn">Delete Stressor</a>
      <a href="#" class="display-chart-btn">Display Chart</a>
    </nav>

    <div class="js-single-result" id="${oneStressor.id}">
      <p class="stressor-name chart-para">
        <span class="dash-chart dash-chart-stressor">Stress:</span>
        ${oneStressor.stress}
      </p>

      <div class="dash-chart-container">
        <p class="chart-para">
          <span class="dash-chart">Relaxation Activity:</span>
          ${oneStressor.activity}
        </p>
        <p class="chart-para">
          <span class="dash-chart">Duration in min:</span>
          ${oneStressor.duration}
        </p>
        <p class="chart-para">
          <span class="dash-chart">Pre Heart Rate:</span>
          ${oneStressor.preHeartRate}
        </p>
        <p class="chart-para">
          <span class="dash-chart">Post Heart Rate:</span>
          ${oneStressor.postHeartRate}
        </p>
      </div>
      <div class="modal hideModal" id="myModal">
        <svg class="chart">Modal for svg chart</svg>
      </div>
    </div>`;


  $(".js-results").html(htmlString);

  /* Need event listeners for navigation bar
  1. return to dashboard, call displayDashBoard()
  2. Edit stressor
  3. Delete stressor */

  $(".all-stressors-btn").on("click", function (event) {
    event.preventDefault();
    displayDashBoard();
  });

  $(".edit-stressor-btn").on("click", function (event) {
    event.preventDefault();

    /* Call displayEditStressorForm() to display a form and
    allow the user to change field values */
    displayEditStressorForm(oneStressor);
  });

  $(".delete-stressor-btn").on("click", function (event) {
    event.preventDefault();
    console.log("clicked delete stressor button");

    // Call deleteStressor() to delete this stressor
    // deleteStressor(oneStressor);

    // Call confirmDeleteStressor(), which handles calling deleteStressor()
    confirmDeleteStressor(oneStressor);
  });

  $(".display-chart-btn").on("click", function (event) {
    event.preventDefault();
    console.log("clicked display chart button");
    // Call renderChart() to display D3 chart
    renderChart(oneStressor);
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

  The JSON.stringify() method converts a JS value (in this case
  the dataFromForm object) to a JSON string.
  */

  $.ajax({
    method: "POST",
    url: "/stressors",
    data: JSON.stringify(dataFromForm), // Need to stringify object
    dataType: "json",
    contentType: "application/json",
    success: function (resData) {
      console.log("[[RESPONSE FROM SERVER, POST SUCCESSFUL]]", resData);
      console.log("STATE_DATA docs length: ", STATE_DATA.data.length);

      // Push the response data from the server to const STATE_DATA.data
      STATE_DATA.data.push(resData);
      console.log("STATE_DATA docs length: ", STATE_DATA.data.length);

      displayStressorChart(resData);

      // Mentor says after POST request make a GET request??
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
    `<form action="/stressor" method="post" role="form" class="create-stressor-form">
      <fieldset>
        <legend>Enter Stressor and Relaxation activity</legend>

        <label for="stress">Stress</label>
        <input type="text" name="stress" id="stress" required>

        <label for="activity">Relaxation Activity</label>
        <input type="text" name="activity" id="activity" required>

        <label for="duration">Duration in min</label>
        <input type="number" name="duration" id="duration" min="1" max="10" required>

        <label for="preHR">Pre Heart Rate</label>
        <input type="number" name="preHR" id="preHR" min="20" max="200" required>

        <label for="postHR">Post Heart Rate</label>
        <input type="number" name="postHR" id="postHR" min="20" max="200" required>

        <button type="submit" class="submit-stressor-btn my-btn">
          Create Stressor
        </button>

        <button type="button" class="cancel-create-stressor-btn my-btn">
          Cancel
        </button>
      </fieldset>
    </form>`;

  // Render the form to POST stressor
  $(".js-results").html(htmlString);

  // Listen for submission on Form to create new stressor, POST request
  $(".create-stressor-form").on("submit", function (event) {
    event.preventDefault();
    //console.log("submit new stressor, next Function call for Post request");

    /* Grab user data from Form fields, pass as argument
    to createNewStressor to make POST request
    The form user data should be a JS object.
    Use JSON.stringify() */

    let formUserData = {
      stress: $(this).find("#stress").val(),
      activity: $(this).find("#activity").val(),
      duration: $(this).find("#duration").val(),
      preHeartRate: $(this).find("#preHR").val(),
      postHeartRate: $(this).find("#postHR").val()
    };

    // console.log(this);
    // `this` is the <form> element when the submit button is clicked

    /* Next need to make POST request to database.
    If successful, the data sent to DB will be displayed as a chart.
    For now, return the data from the DB and give the message link
    to return to the Dashboard. */

    createNewStressor(formUserData);

  });

  // Cancel create new stressor, return to Dashboard
  $(".cancel-create-stressor-btn").on("click", function (event) {
    event.preventDefault();
    displayDashBoard();
  });
}

function displayDashBoard() {
  /* Dashboard is the home page of a logged in user.
  This page is where all user data from the GET request is displayed. */

  /* First populate the htmlString with the navigation bar HTML
  that appears at the top of the user's dashboard */
  let htmlString =
    `<nav class="navbar-dashboard" role="navigation">
      <a href="#" class="create-stressor-btn">Create Stressor</a>
      <a href="#" class="logout-btn">Logout</a>
    </nav>`;

  let stressorsData = STATE_DATA.data;

  for (let i = 0; i < stressorsData.length; i++) {
    // Next populate the htmlString with stressor data
    htmlString +=
      `<div class="js-single-result" id="${stressorsData[i].id}">
        <p class="stressor-name dash-para">
          <span class="dash-span dash-span-stressor">Stress:</span>
          ${stressorsData[i].stress}
        </p>

        <div class="dash-para-container">
          <p class="dash-para">
            <span class="dash-span">Relaxation Activity:</span>
            ${stressorsData[i].activity}
          </p>
          <p class="dash-para">
            <span class="dash-span">Duration in min:</span>
            ${stressorsData[i].duration}
          </p>
          <p class="dash-para">
            <span class="dash-span">Pre Heart Rate:</span>
            ${stressorsData[i].preHeartRate}
          </p>
          <p class="dash-para">
            <span class="dash-span">Post Heart Rate:</span>
            ${stressorsData[i].postHeartRate}
          </p>
        </div>
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
  /* This is the first page loaded to the client.
  Will see a form to login with username and password.

  Will also see a button to go to another page to create
  new user account. Add another <section> for create User account? */

  /* Listen for the button click to display the Dashboard.
  Right now the button click will act as Authentication,
  logging in or creating a new user. */

  let htmlString =
    `<div class="login-div">
      <h2 class="app-name">Tranquility Now</h2>
      <p class="app-desc">Everyone experiences stress. Some stress is normal and useful, while stress that occurs chronically or for too long is unhealthy. Tranquility Now keeps track of the activities that relax you and shows you what's most effective.</p>
      <button class="home-screen-btn my-btn">Show all entries</button>
    </div>`;


    /*
    `<div class="col-6 login-div">
      <h2 class="app-name">Tranquility Now</h2>
      <p class="app-desc">Everyone experiences stress. Some stress is normal and useful, while stress that occurs chronically or for too long is unhealthy. Tranquility Now keeps track of the activities that relax you and shows you what's most effective.</p>
    </div>
    <div class="col-6 login-div">
      <form action="/login" method="post" role="form" class="login-form">
        <fieldset>
          <legend>Mock Login</legend>

          <label for="username">Username</label>
          <input type="text" name="username" id="username">
          <label for="password">Password</label>
          <input type="password" name="password" id="password">

          <button class="home-screen-btn">Continue to Dashboard</button>
        </fieldset>
      </form>
    </div>`; */


  $(".js-results").html(htmlString);

  $(".home-screen-btn").on("click", function (event) {
    event.preventDefault();
    getAllStressors();
  });
}

function startApp() {
  displayHomeScreen();
}

$(startApp);



/***** function to render chart in D3 *****/
function renderChart(oneStressor) {
  console.log("renderChart() was called");
  console.log(oneStressor);

  $(this)
}



/* Styling for Login Screen
1 put max width on container div (~420px)
2 center vertically between boats and top of page
3 semi parent white background on the div
  - re-arrange structure

  <div>
    <h2>Tranquility<h2>
    <p>...</p>
  </div>
*/
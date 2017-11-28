const MY_DATA = {}; // data from database stored here


function displaySearchResults() {
  let htmlString = "";
  let stressorsData = MY_DATA.data;

  for (let i = 0; i < stressorsData.length; i++) {
    console.log(i);

    htmlString +=
      `<div class="js-single-result">
        <p>${stressorsData[i].id}</p>
        <p>${stressorsData[i].activity}</p>
        <p>${stressorsData[i].duration}</p>
        <p>${stressorsData[i].preHeartRate}</p>
        <p>${stressorsData[i].postHeartRate}</p>
      </div>`;
  }

  $(".js-results-stressors").html(htmlString);
}

function handler() {
  let baseUrl = "http://localhost:8080";

  $("button").on("click", function (event) {
    event.preventDefault();
    console.log("button clicked!");

    $.ajax({
      method: "GET",
      url: baseUrl + "/stressors",
      dataType: "json",
      success: function (data) {
        console.log("[[CLIENT SIDE]]", data);
        MY_DATA.data = data;

        // render HTML with data
        displaySearchResults();
      }
    });

  });
}

$(handler);


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
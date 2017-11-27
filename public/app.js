const MY_DATA = {}; // data from database stored here


function displaySearchResults() {

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

3. render the results
*/
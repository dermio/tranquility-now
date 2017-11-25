const MY_DATA = {}; // data from database stored here

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
      }
    });

  });
}

$(handler);

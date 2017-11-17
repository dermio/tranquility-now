function handler() {
  let myUrl = "http://localhost:8080";

  $("button").on("click", function (event) {
    event.preventDefault();
    console.log("button clicked!");

    $.ajax({
      method: "GET",
      url: myUrl + "/all-stressors",
      dataType: "json",
      success: function (data) {
        console.log("[[CLIENT SIDE]]", data);
      }
    });

  });
}

$(handler);
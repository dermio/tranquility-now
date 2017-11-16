function handler() {
  let myUrl = "/";
  
  $.ajax({
    type: "GET",
    url: myUrl,
    dataType: "json"
  });

  $("button").on("click", function (event) {
    event.preventDefault();
    console.log("button clicked!");
  });
}

$(handler);
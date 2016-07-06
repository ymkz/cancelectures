$(function() {

  var array = ["culture", "medic", "law", "education", "engineering", "biology"];
  var id = ["#culture", "#medic", "#law", "#education", "#engineering", "#biology"];

  // get localStorage
  for (var i = 0; i < array.length; i++) {
    if (localStorage.getItem(array[i]) == "true") {
      $(id[i]).prop("checked", true);
    }
  }

  // set localStorage
  $("#save").click(function () {    
    for (var i = 0; i < array.length; i++) {
      if ($(id[i]).prop("checked")) {
        localStorage.setItem(array[i], "true");
      } else {
        localStorage.setItem(array[i], "false");
      }
    }
  });

});

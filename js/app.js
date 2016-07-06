var lastpage = 0, counter = 0, hidden = 0, display = 0;

var getCancels = function() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var res = xhr.response;
      var datafield = res.getElementsByClassName("DataField");
      checkLastPage(res);
      makeView(collection2array(datafield));

      for (var i = 2; i <= lastpage; i++) {
        changePage(i);
      }
    } else if (xhr.readyState == 4 && xhr.status != 200) {
      makeErrorView();
    }
  }
  xhr.open("GET", "http://www.kougi.shimane-u.ac.jp/selectweb/conduct_list.asp", true);
  xhr.responseType = "document";
  xhr.send();
};

var checkLastPage = function(response) {
  var pages = response.getElementsByClassName("pagenum");
  lastpage  = pages[pages.length-1].innerText;
  console.log(lastpage);
  return lastpage; 
}

var changePage = function(nextpage) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var res = xhr.response;
      var datafield = res.getElementsByClassName("DataField");
      checkLastPage(res);
      makeView(collection2array(datafield));
    }
  }
  xhr.open("POST", "http://www.kougi.shimane-u.ac.jp/selectweb/conduct_list.asp", true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.responseType = "document";
  xhr.send("abspage=" + nextpage);
};

var collection2array = function(collection) {
  var array = [];
  for (var i = 0; i < collection.length; i++) {
    array[i] = collection[i].innerText;
    if (array[i] == "") array[i] = 'N/A';
  }
  return array;
};

var makeView = function(array) {
  for (var i = 0; i < array.length; i += 8) {
    var field = document.getElementById("field");
    var label = document.createElement("label");
    var input = document.createElement("input");
    var ul    = document.createElement("ul");
    label.innerText = array[i+4];
    label.htmlFor   = 'list_'+counter;
    input.id        = 'list_'+counter;
    input.type      = 'checkbox';
    input.className = 'on-off';

    for (var j = 0; j < 8; j++) {
      var prefix = "";
      var li = document.createElement('li');

      switch (j) {
        case 0:
          prefix = "日付 : "; break;
        case 1:
          prefix = "分類 : "; break;
        case 2:
          prefix = "時限 : "; break;
        case 3:
          prefix = "所属 : "; break;
        case 4:
          prefix = "講義 : "; break;
        case 5:
          prefix = "講師 : "; break;
        case 6:
          prefix = "教室 : "; break;
        case 7:
          prefix = "備考 : "; break;
      }

      li.style.borderBottomColor = selectBorderColor(array[i+3]);
      li.innerHTML = prefix.concat(array[i+j]);
      ul.appendChild(li);
    }

    label.style.borderBottomColor = selectBorderColor(array[i+3]);
    label.style.borderLeftColor = selectBorderColor(array[i+3]);
    field.appendChild(label);
    field.appendChild(input);
    field.appendChild(ul);

    // 非表示を指定された学部の情報を表示しない
    if (checkCache(array[i+3]) == "false") {
      label.style.display = "none";
      hidden++;
    }

    counter++;
  }

  display = counter - hidden;
  var height = 34 * display;
  var html   = document.getElementsByTagName("html");
  var body   = document.getElementsByTagName("body");
  var field  = document.getElementById("field");
  html[0].style.height = height + "px"; 
  body[0].style.height = height + "px"; 
  field.style.height   = height + "px"; 
};

var checkCache = function(subject) {
  var cache = "";
  switch (subject) {
    case '教養':
      cache = localStorage.getItem('culture'); break;
    case '法文学部':
      cache = localStorage.getItem('law'); break;
    case '教育学部':
      cache = localStorage.getItem('education'); break;
    case '総合理工学部':
      cache = localStorage.getItem('engineering'); break;
    case '生物資源科学部':
      cache = localStorage.getItem('biology'); break;
    case '医学部':
      cache = localStorage.getItem('medic'); break;
  }

  return cache;
};

var selectBorderColor = function(subject) {
  var color = "";
  switch (subject) {
    case '教養':
      color = "#8BC34A"; break;
    case '法文学部':
      color = "#F44336"; break;
    case '教育学部':
      color = "#2196F3"; break;
    case '総合理工学部':
      color = "#9C27B0"; break;
    case '生物資源科学部':
      color = "#FF9800"; break;
    case '医学部':
      color = "#607D8B"; break;
  }

  return color;
};

var makeErrorView = function() {
  var field = document.getElementById("field");
  var error = document.createElement("div");
  error.className = 'error';
  error.innerHTML = "Error :(";

  field.style.display = "flex";
  field.style.justifyContent = "center";
  field.appendChild(error);
};

getCancels();

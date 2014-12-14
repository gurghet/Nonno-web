var secondi = 80;
var url = "http://gurghet.com/static/iss.html";
var request = new XMLHttpRequest();

// Make the actual CORS request.
function makeCorsRequest() {
  // All HTML5 Rocks properties support CORS.
  var url = "http://gurghet.com/static/iss.html";

  var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);

  // Response handlers.
  xhr.onload = function() {
    if (xhr.status != 0) {
        window.location.replace(url);
    }
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };

  xhr.send();
}

setInterval(function () {
    var s = document.getElementById('secondi');
    
    s.innerHTML = secondi -= 1;
    request = new XMLHttpRequest();
    request.open("GET", url);
    request.onreadystatechange = makeCorsRequest();
    request.send();
}, 1000);
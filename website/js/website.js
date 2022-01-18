// DEVELOPMENT IP
// var ip = "http://127.0.0.1:8000";

// LIVE IP
var ip = "https://smartschoolhub.net/backend/website";

function saveVisitor() {
  var IP = "";
  // GET IP
  $.get("https://www.cloudflare.com/cdn-cgi/trace", function (data) {
    data = data
      .trim()
      .split("\n")
      .reduce(function (obj, pair) {
        pair = pair.split("=");
        return (obj[pair[0]] = pair[1]), obj;
      }, {});
    console.log(data.ip);
    IP = data.ip;

    // SAVE
    fetch(ip + "/api/website/save-visitor", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        IP: IP,
        date: Date(),
      }),
    })
      .then(function (res) {
        return res.json();
      })

      .then((data) => {
        successtoast("<b>" + data.message + "</b>");
      })
      .catch((err) => console.log(err));
  });
}

function createMarketer() {
  var data_error = false;

  var gender = "";
  for (var i = 0; i < document.getElementsByName("gender").length; i++) {
    if (document.getElementsByName("gender")[i].checked == true) {
      gender = document.getElementsByName("gender")[i].value;
    }
  }


  warningtoast("Processing...", 600000);
  fetch(ip + "/api/website/create-affilate", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      first_name: document.getElementById("first_name").value,
      last_name: document.getElementById("last_name").value,
      gender: gender,
      phone: document.getElementById("telephone").value,
      ppa_name: document.getElementById("ppa_name").value,
      // ppa_address: document.getElementById("ppa_address").value,
      ppa_state: document.getElementById("ppa_state").value,
    }),
  })
    .then(function (res) {
      if (res.status == 422) {
        data_error = true;
      }
      return res.json();
    })
    .then((data) => {
      toastr.remove();
      // GET DATA ERRORS
      data_key = [];
      if (data_error) {
        for (i = 0; i < Object.keys(data.errors).length; i++) {
          data_key[i] = Object.keys(data.errors)[i];
        }

        error_encountered = "";
        data_key.forEach((key) => {
          data.errors[key].forEach((error) => {
            error_encountered = error_encountered + error + "<br>";
          });
        });

        errortoast("<b>" + error_encountered + "</b>");
        return 0;
      }

      if (data.success) {
        successtoast("<b>" + data.message + "</b>");
        setTimeout(function () {
          window.location.href = "index.html";
        }, 2000);
      } else {
        errortoast("<b>" + data.message + "</b>");
      }
    })
    .catch((err) => console.log(err));
}

function successtoast(message, time) {
  toastr.success(message, "", {
    timeOut: 5000,
    closeButton: true,
    debug: false,
    newestOnTop: true,
    progressBar: true,
    positionClass: "toast-top-center",
    preventDuplicates: true,
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
    tapToDismiss: false,
  });
}
function warningtoast(message, time) {
  toastr.warning(message, "", {
    positionClass: "toast-top-center",
    timeOut: time,
    closeButton: true,
    debug: false,
    newestOnTop: true,
    progressBar: true,
    preventDuplicates: true,
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
    tapToDismiss: false,
  });
}
function errortoast(message, time) {
  toastr.error(message, "", {
    positionClass: "toast-top-center",
    timeOut: time,
    closeButton: true,
    debug: false,
    newestOnTop: true,
    progressBar: true,
    preventDuplicates: true,
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
    tapToDismiss: false,
  });
}

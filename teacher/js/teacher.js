// DEVELOPMENT IP
var ip = "http://127.0.0.1:8000";

window.addEventListener("online", () =>
  successtoast("<b>INTERNET CONNECTED</b>")
);
window.addEventListener("offline", () =>
  errortoast("<b>INTERNET DISCONNECTED</b>")
);

function changeLogo() {
    document.getElementById("logo").innerHTML =
      document.getElementById("logo").innerHTML != ""
        ? ""
        : `<h1 style="font-weight: bold; font-family: Rowdies; color:white;">
        <i style="color: white; " class="fas fa-graduation-cap fa-xs"></i> SSHUB </h1>`;
}

function formatNumber(number){
    console.log("NUMBER: "+number)
    return  (number).toLocaleString(
        undefined, // leave undefined to use the visitor's browser 
                   // locale or a string like 'en-US' to override it.
        { minimumFractionDigits: 0 }
      );
  }

function getCurrentSession() {
  fetch(ip + "/api/general/current-session", {
    method: "GET",
    headers: {
      Accept: "application/json",
       "Content-type": "application/json",
       "Authorization": "Bearer " + localStorage["token"],
    }
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        window.location.href = "index.html";
      }
      return res.json();
    })

    .then((data) => {
      document.getElementById(
        "session_term"
      ).innerHTML = `<div id="" class="item-number"><span class="counter"
        >${data.session}</span></div>
        <div class="item-title">${data.term}</div>`;

        localStorage.setItem('session') = data.session;
        localStorage.setItem('term') = data.term;
    })
    .catch((err) => console.log(err));
}

function loadDashBoardInformation(){
    document.getElementById("user_name").innerHTML = `<b>${JSON.parse(localStorage['user_data']).data.first_name +" " +JSON.parse(localStorage['user_data']).data.last_name}</b>`;
document.getElementById("user_name1").innerHTML = `<b>${JSON.parse(localStorage['user_data']).data.first_name +" " +JSON.parse(localStorage['user_data']).data.last_name}</b>`;
    document.getElementById("male").innerHTML = formatNumber(JSON.parse(localStorage['user_data']).dashboard_information.male);
    document.getElementById("female").innerHTML = formatNumber(JSON.parse(localStorage['user_data']).dashboard_information.female);

    document.getElementById("no_of_student").innerHTML =`<span class="counter" data-num="${parseInt(formatNumber(JSON.parse(localStorage['user_data']).dashboard_information.no_of_student))}">${formatNumber(JSON.parse(localStorage['user_data']).dashboard_information.no_of_student)}</span>
    </div>`; 

    document.getElementById("no_of_assigned_subject").innerHTML = `<span class="counter" data-num="${parseInt(formatNumber(JSON.parse(localStorage['user_data']).dashboard_information.no_of_assigned_subject))}">${formatNumber(JSON.parse(localStorage['user_data']).dashboard_information.no_of_assigned_subject)}</span>
    </div>`;

}

function getProfileData(){
    data_key = [];
    user_data = JSON.parse(localStorage["user_data"]).data;
    
 
    for(i=0; i<Object.keys(user_data).length; i++){
        data_key[i] =  Object.keys(user_data)[i];
    }


    for(i=0; i<data_key.length; i++){
        document.getElementById('profile_data').innerHTML += 
        ` 
        <tr>
                <td>${data_key[i].toUpperCase().replace("_"," ")}:</td>
                <td id="${data_key[i]}" name="profile_data" class="font-medium text-dark-medium">${user_data[data_key[i]]}</td>
        </tr>
        
        `;
    }
    
   
   
}



function loadSideNav(page) {
  document.getElementById("side_nav").innerHTML = `
    <ul class="nav nav-sidebar-menu sidebar-toggle-view">
    <li class="nav-item">
        <a id="dashboard" href="dashboard.html" class="nav-link"><i
                class="flaticon-dashboard"></i><span>Dashboard</span></a>
    </li>

    <li class="nav-item">
        <a   id="my-profile" href="my-profile.html" class="nav-link"><i class="far fa-address-card"></i><span>My profile</span></a>
    </li>

    <li class="nav-item">
        <a  id="my-student" href="my-student.html" class="nav-link"> <i class="fas fa-users"></i>
        <span>My Students</span></a>
    </li>

    <li class="nav-item">
        <a  id="learning-hub" href="learning-hub.html" class="nav-link"><i
                class="flaticon-open-book"></i><span>Learning Hub Materials</span></a>
    </li>

    
    <li class="nav-item">
    <a  id="subject-registration" href="subject-registration.html" class="nav-link"><i class="fas fa-plus"></i><span>Subject Registration</span></a>
    </li>


    <li class="nav-item">
        <a  id="timetable" href="timetable.html" class="nav-link"><i
                class="flaticon-calendar"></i><span>My Timetable</span></a>
    </li>

    <li class="nav-item">
        <a  id="attendance" href="attendance.html" class="nav-link"><i class="fas fa-chart-line"></i>
        <span>Mark Attendance</span></a>
    </li>

    <li class="nav-item">
        <a   id="cbt" href="cbt.html" class="nav-link"><i class="fas fa-desktop"></i><span>CBT</span></a>
    </li>

    <li class="nav-item">
        <a  id="result" href="upload-result.html" class="nav-link"><i class="fas fa-file-upload"></i></i><span>Upload Result</span></a>
    </li>

    <li class="nav-item">
        <a  id="change-password" href="change-password.html" class="nav-link"><i
                class="flaticon-settings"></i><span>Change Password</span></a>
    </li>
    <li class="nav-item">
        <a href="../index.html" class="nav-link"><i class="flaticon-turn-off"></i><span>Log
                Out</span></a>
    </li>
    <a href="" class="nav-link"><i class=""></i><span></span></a>
    <a href="" class="nav-link"><i class=""></i><span></span></a>
    <a href="" class="nav-link"><i class=""></i><span></span></a>
    <a href="" class="nav-link"><i class=""></i><span></span></a>
    <a href="" class="nav-link"><i class=""></i><span></span></a>
    <a href="" class="nav-link"><i class=""></i><span></span></a>
    <a href="" class="nav-link"><i class=""></i><span></span></a>
    <a href="" class="nav-link"><i class=""></i><span></span></a>
    <a href="" class="nav-link"><i class=""></i><span></span></a>
    <a href="" class="nav-link"><i class=""></i><span></span></a>
    <a href="" class="nav-link"><i class=""></i><span></span></a>
    <a href="" class="nav-link"><i class=""></i><span></span></a>
    <a href="" class="nav-link"><i class=""></i><span></span></a>
    <a href="" class="nav-link"><i class=""></i><span></span></a>
    <a href="" class="nav-link"><i class=""></i><span></span></a>
    <a href="" class="nav-link"><i class=""></i><span></span></a>
    <a href="" class="nav-link"><i class=""></i><span></span></a>
    <a href="" class="nav-link"><i class=""></i><span></span></a>
    <!-- <li class="nav-item">
        <a href="" class="nav-link"><i class=""></i><span></span></a>
    </li>
    <li class="nav-item">
        <a href="" class="nav-link"><i class=""></i><span></span></a>
    </li> -->


</ul>
    
    
    
    `;

  document.getElementById(page).className += " menu-active";
}

function signIn() {
    var id = document.getElementById("id").value;
    var password = document.getElementById("password").value;
    if (id != "" && password != "") {
      // PUSH TO API
      document.getElementById("signin").innerHTML = `<i
      class="fa fa-spinner fa-spin"></i> Processing ...`;
      fetch(ip + "/api/teacher/signin", {
        method: "POST",
        headers: {
          Accept: "application/json",
           "Content-type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          password: password,
        }),
      })
        .then(function (res) {
          console.log(res.status);
          if (res.status == 401) {
            window.location.href = "index.html";
          }
          return res.json();
        })
  
        .then((data) => {
          toastr.remove();
          if (data.success) {
            successtoast("<b>" + data.message + "</b>");
            localStorage.setItem('user_data',JSON.stringify(data));
            localStorage.setItem('token',data.token);
            setTimeout(function () {
              window.location.href = "dashboard.html";
            }, 1000);
          } else {
            errortoast("<b>" + data.message + "</b>");
          }
  
          document.getElementById("signin").innerHTML = `Sign In`;
        })
        .catch((err) => console.log(err));
    } else {
      warningtoast("<b>Please check that no field is empty.</b>");
    }
  }

// TOAST
function successtoast(message, time) {
  toastr.success(message, "", {
    timeOut: time,
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

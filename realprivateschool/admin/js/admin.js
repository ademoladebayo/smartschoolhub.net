// import Config from '../../utils/js/config.js';

// SOUND VARIABLES
var successSound = new Audio("../asset/sound/verified.mp3");
var warningSound = new Audio("../asset/sound/warning.mp3");
var errorSound = new Audio("../asset/sound/error1.mp3");

//const config = new Config();

var ip = localStorage["ip"];
var domain = localStorage["domain"];

// REMOTE ACCESS
// var ip = "http://192.168.42.168/smartschoolhub.net/SSHUB_BACKEND/server.php";
// var domain = "http://192.168.42.168/smartschoolhub.net";

window.addEventListener("online", () =>
  successtoast("<b>INTERNET CONNECTED</b>")
);
window.addEventListener("offline", () =>
  errortoast("<b>INTERNET DISCONNECTED</b>")
);

//STARTERS
collapseSidebar();
getCurrentSession();
getSchoolDetails();
loadSchoolColor();
if (
  !window.location.href.includes("portal-subscription") &&
  localStorage["token"] != null
) {
  checkPortalSubscription();
}

// VAR
var result_list = {};

// if(!window.location.href.includes("portal-subcription")){
//   checkPortalSubscription();
// }

function changeLogo() {
  document.getElementById("logo").innerHTML =
    document.getElementById("logo").innerHTML != ""
      ? ""
      : `<h1 style="font-weight: bold; font-family: Rowdies; color:white;">
      <i style="color: white; " class="fas fa-graduation-cap fa-xs"></i> SSHUB </h1>`;
}

function formatNumber(number) {
  console.log("NUMBER: " + number);
  return number.toLocaleString(
    undefined, // leave undefined to use the visitor's browser
    // locale or a string like 'en-US' to override it.
    { minimumFractionDigits: 0 }
  );
}

function signIn() {
  var id = document.getElementById("id").value;
  var password = document.getElementById("password").value;
  if (id != "" && password != "") {
    // PUSH TO API
    document.getElementById("signin").innerHTML = `<i
    class="fa fa-spinner fa-spin"></i> Processing ...`;
    fetch(ip + "/api/admin/signin", {
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
          openAuthenticationModal();
        }
        return res.json();
      })

      .then((data) => {
        toastr.remove();
        if (data.success) {
          successtoast("<b>" + data.message + "</b>");
          localStorage.setItem("user_data", JSON.stringify(data));
          localStorage.setItem("token", data.token);
          parent.getStoredCredential();
          username = JSON.parse(localStorage["user_data"]).data.username;
          localStorage.setItem("username", username);
          localStorage.setItem("user_id", username);

          if (username.includes("SECURITY")) {
            setTimeout(function () {
              window.location.href = "student-attendance.html";
            }, 1000);
          } else {
            setTimeout(function () {
              window.location.href = "dashboard.html";
            }, 1000);
          }
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

function reAuth() {
  var id = localStorage["user_id"];
  var password = document.getElementById("password").value;
  if (id != "" && password != "") {
    // PUSH TO API
    document.getElementById("signin").innerHTML = `<i
    class="fa fa-spinner fa-spin"></i> Processing ...`;
    fetch(ip + "/api/admin/signin", {
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
          openAuthenticationModal();
        }
        return res.json();
      })

      .then((data) => {
        toastr.remove();
        if (data.success) {
          successtoast("<b>Welcome back, </b>" + localStorage["username"]);
          localStorage.setItem("user_data", JSON.stringify(data));
          localStorage.setItem("token", data.token);
          parent.getStoredCredential();
          username = JSON.parse(localStorage["user_data"]).data.username;
          localStorage.setItem("username", username);
          localStorage.setItem("user_id", username);
          setTimeout(function () {
            parent.$("#authenticationModal").modal("hide");
            parent.document.getElementById("authenticationModal").remove();
          }, 1000);
        } else {
          errortoast(data.message);
        }
        document.getElementById("signin").innerHTML = `Sign In`;
      })
      .catch((err) => console.log(err));
  } else {
    warningtoast("<b>Please check that no field is empty.</b>");
  }
}

function loadDashBoardInformation() {
  document.getElementById("user_name").innerHTML = `<b>${
    JSON.parse(localStorage["user_data"]).data.username
  }</b>`;
  document.getElementById("user_name1").innerHTML = `<b>${
    JSON.parse(localStorage["user_data"]).data.username
  }</b>`;
}

function getCurrentSession() {
  fetch(ip + "/api/general/current-session", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      if (data.success) {
        localStorage.setItem("current_session", data["session"].session);
        localStorage.setItem("current_term", data["session"].term);
        document.getElementById(
          "session_term"
        ).innerHTML = `<div id="" class="item-number"><span class="counter"
            >${data["session"].session} - ${data["session"].term}</span></div>`;
      } else {
        document.getElementById(
          "session_term"
        ).innerHTML = `<div id="" class="item-number"><span class="counter"
            >Session not set !</span></div>`;

        alert(data.message);
      }
    })
    .catch((err) => console.log(err));
}

function loadSideNav(page) {
  username = JSON.parse(localStorage["user_data"]).data.username;

  if (username.includes("SECURITY")) {
    document.getElementById("side_nav").innerHTML = `
    <ul class="nav nav-sidebar-menu sidebar-toggle-view">
  
    <li class="nav-item">
        <a   id="student-attendance" href="student-attendance.html" class="nav-link"> <i class="fas fa-chart-line"></i></i>
        <span>Student Attendance</span></a>
    </li>

    <li class="nav-item">
        <a   id="teacher-attendance" href="teacher-attendance.html" class="nav-link"> <i class="fas fa-chart-line"></i></i>
        <span>Staff Attendance</span></a>
    </li>

    <li class="nav-item">
        <a  onclick="goTo('')" href="#" class="nav-link"><i class="flaticon-turn-off"></i><span>Log
                Out</span></a>
    </li>

    
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <!-- <li class="nav-item">
        <a  href="" class="nav-link"><i class=""></i><span></span></a>
    </li>
    <li class="nav-item">
        <a  href="" class="nav-link"><i class=""></i><span></span></a>
    </li> -->


</ul>
    
    
    
    `;
  } else if (username.includes("PRINCIPAL")) {
    document.getElementById("side_nav").innerHTML = `
    <ul class="nav nav-sidebar-menu sidebar-toggle-view">
    <li class="nav-item">
        <a  id="dashboard" href="dashboard.html" class="nav-link"><i
                class="flaticon-dashboard"></i><span>Dashboard</span></a>
    </li>

    <li class="nav-item">
        <a    id="students" href="students.html" class="nav-link"><i class="flaticon-classmates"></i><span>Student Management</span></a>
    </li>

    <li class="nav-item">
        <a   id="teachers" href="teachers.html" class="nav-link"> <i class="flaticon-multiple-users-silhouette"></i>
        <span>Staff Management</span></a>
    </li>

    <li class="nav-item">
          <a   id="class" href="class.html" class="nav-link"> <i class="fas fa-plus"></i>
          <span>Class Management</span></a>
    </li>

    <li class="nav-item">
          <a   id="subject" href="subject.html" class="nav-link"> <i class="fas fa-plus"></i>
          <span>Subject Management</span></a>
    </li>

    <li class="nav-item">
        <a    id="subject-registration" href="subject-registration.html" class="nav-link"><i class="fas fa-clipboard-list"></i><span>Subject Registration</span></a>
    </li>

    <li class="nav-item">
          <a   id="lesson-plan" href="lesson-plan-management.html" class="nav-link"> <i class="fas fa-plus"></i>
          <span>Lesson Management</span></a>
    </li>

    <li class="nav-item">
        <a   id="student-attendance" href="student-attendance.html" class="nav-link"> <i class="fas fa-chart-line"></i></i>
        <span>Student Attendance</span></a>
    </li>

    <li class="nav-item">
        <a   id="teacher-attendance" href="teacher-attendance.html" class="nav-link"> <i class="fas fa-chart-line"></i></i>
        <span>Staff Attendance</span></a>
    </li>

  
    <li class="nav-item">
        <a   id="grade-settings" href="grade-settings.html" class="nav-link"> <i class="fas fa-tools"></i></i>
        <span>Grade Settings</span></a>
    </li>

    <li class="nav-item">
        <a   id="transcript" href="student-transcript.html" class="nav-link"> <i class="fas fa-poll"></i></i>
        <span>Student Transcript</span></a>
    </li>

    <li class="nav-item">
        <a  onclick="goTo('upload-result.html')"  id="result" href="#" class="nav-link"><i class="fas fa-file-upload"></i></i><span>Upload Result</span></a>
    </li>


    
    <li class="nav-item">
        <a   id="change-password" href="#?change-password.html" class="nav-link"><i
                class="flaticon-settings"></i><span>Change Password</span></a>
    </li>

    <li class="nav-item">
        <a  onclick="goTo('')" href="#" class="nav-link"><i class="flaticon-turn-off"></i><span>Log
                Out</span></a>
    </li>

    <!-- <li class="nav-item">
      <a  style="cursor: pointer; color:white" id="" onclick="window.parent.location.assign('${
        domain + "/bursary/dashboard.html"
      }')" class="nav-link"><span><b>GOTO BURSARY</b></span></a>
    </li> !-->
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <!-- <li class="nav-item">
        <a  href="" class="nav-link"><i class=""></i><span></span></a>
    </li>
    <li class="nav-item">
        <a  href="" class="nav-link"><i class=""></i><span></span></a>
    </li> -->


</ul>
    
    
    
    `;
  } else {
    document.getElementById("side_nav").innerHTML = `
    <ul class="nav nav-sidebar-menu sidebar-toggle-view">
    <li class="nav-item">
        <a  id="dashboard" href="dashboard.html" class="nav-link"><i
                class="flaticon-dashboard"></i><span>Dashboard</span></a>
    </li>

    <li class="nav-item">
        <a    id="students" href="students.html" class="nav-link"><i class="flaticon-classmates"></i><span>Student Management</span></a>
    </li>

    <li class="nav-item">
        <a   id="teachers" href="teachers.html" class="nav-link"> <i class="flaticon-multiple-users-silhouette"></i>
        <span>Staff Management</span></a>
    </li>

    <li class="nav-item">
          <a   id="class" href="class.html" class="nav-link"> <i class="fas fa-plus"></i>
          <span>Class Management</span></a>
    </li>

    <li class="nav-item">
          <a   id="subject" href="subject.html" class="nav-link"> <i class="fas fa-plus"></i>
          <span>Subject Management</span></a>
    </li>

    <li class="nav-item">
        <a    id="subject-registration" href="subject-registration.html" class="nav-link"><i class="fas fa-clipboard-list"></i><span>Subject Registration</span></a>
    </li>

    <li class="nav-item">
          <a   id="lesson-plan" href="lesson-plan-management.html" class="nav-link"> <i class="fas fa-plus"></i>
          <span>Lesson Management</span></a>
    </li>

    <li class="nav-item">
          <a   id="session-management" href="session-management.html" class="nav-link"> <i class="fas fa-tasks"></i>
          <span>Session Management</span></a>
    </li>

    <li class="nav-item">
        <a   id="card-generator" href="card-generator.html" class="nav-link"> <i
        class="fas fa-id-card"></i>
        <span>ID Card Generator</span></a>
    </li>

    <li class="nav-item">
        <a   id="student-attendance" href="student-attendance.html" class="nav-link"> <i class="fas fa-chart-line"></i></i>
        <span>Student Attendance</span></a>
    </li>

    <li class="nav-item">
        <a   id="teacher-attendance" href="teacher-attendance.html" class="nav-link"> <i class="fas fa-chart-line"></i></i>
        <span>Staff Attendance</span></a>
    </li>

  
    <li class="nav-item">
        <a   id="grade-settings" href="grade-settings.html" class="nav-link"> <i class="fas fa-tools"></i></i>
        <span>Grade Settings</span></a>
    </li>

    <li class="nav-item">
        <a   id="transcript" href="student-transcript.html" class="nav-link"> <i class="fas fa-poll"></i></i>
        <span>Student Transcript</span></a>
    </li>

    <li class="nav-item">
        <a  onclick="goTo('upload-result.html')"  id="result" href="#" class="nav-link"><i class="fas fa-file-upload"></i></i><span>Upload Result</span></a>
    </li>


    <li class="nav-item">
        <a   id="control-panel" href="control-panel.html" class="nav-link"> <i class="flaticon-settings-work-tool"></i></i>
        <span>Control Panel</span></a>
    </li>

    <li class="nav-item">
        <a   id="inventory" href="inventory.html" class="nav-link"><i class="fas fa-box-open"></i>
        <span>Inventory <small><sup><span style="color:white" class="badge bg-success"><b>NEW</b></span></sup></small></span></a>
    </li>

    <li class="nav-item">
        <a  id="portal-subscription" href="portal-subscription.html" class="nav-link"><i class="fa fa-wrench" aria-hidden="true"></i><span>Portal Subscription</span></a>
    </li>

    <li class="nav-item">
        <a   id="events-timetable" href="#?events.html" class="nav-link"><i
                class="flaticon-calendar"></i><span>Events <sup><small>Coming Soon ...</small></sup></span></a>
    </li>

    <li class="nav-item">
        <a   id="create-notification" href="#?create-notification.html" class="nav-link"><i class="far fa-bell"></i>
        <span>Notification <sup><small>Coming Soon ...</small></sup></span></a>
    </li>

    <li class="nav-item">
        <a   id="change-password" href="#?change-password.html" class="nav-link"><i
                class="flaticon-settings"></i><span>Change Password</span></a>
    </li>

    <li class="nav-item">
        <a  onclick="goTo('')" href="#" class="nav-link"><i class="flaticon-turn-off"></i><span>Log
                Out</span></a>
    </li>

    <!-- <li class="nav-item">
      <a  style="cursor: pointer; color:white" id="" onclick="window.parent.location.assign('${
        domain + "/bursary/dashboard.html"
      }')" class="nav-link"><span><b>GOTO BURSARY</b></span></a>
    </li> !-->
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <a  href="" class="nav-link"><i class=""></i><span></span></a>
    <!-- <li class="nav-item">
        <a  href="" class="nav-link"><i class=""></i><span></span></a>
    </li>
    <li class="nav-item">
        <a  href="" class="nav-link"><i class=""></i><span></span></a>
    </li> -->


</ul>
    
    
    
    `;
  }

  document.getElementById(page).className += " menu-active";
}

function goTo(page) {
  if (page == "") {
    localStorage.clear();
    window.parent.location.assign(domain);
    return 0;
  }
  window.parent.location.assign(domain + "/admin/" + page);
}

function reloadEditFrame() {
  var iframe = document.getElementById("edit_frame");
  temp = iframe.src;
  iframe.src = "";
  iframe.src = temp;
}

// TEACHER
function getAllTeacherForClass() {
  fetch(ip + "/api/admin/all-teacher", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      for (i in data) {
        if (data[i].profile_status == "DISABLED") {
          continue;
        }
        if (data[i].assigned_class == null) {
          document.getElementById(
            "class_teacher"
          ).innerHTML += `<option value="${data[i].id}">${
            data[i].title + " " + data[i].first_name + " " + data[i].last_name
          }</option>`;
        } else {
          document.getElementById(
            "class_teacher"
          ).innerHTML += `<option value="${data[i].id}">${
            data[i].title + " " + data[i].first_name + " " + data[i].last_name
          }<p style='color:green'> (${data[i].assigned_class.class_name}
            Already Assigned)</p></option>`;
        }
      }
    })
    .catch((err) => console.log(err));
}

function getAllTeacherForDropDown() {
  fetch(ip + "/api/admin/all-teacher", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      for (i in data) {
        if (data[i].profile_status == "DISABLED") {
          continue;
        }
        document.getElementById("teacher").innerHTML += `<option value="${
          data[i].id
        }">${
          data[i].title + " " + data[i].first_name + " " + data[i].last_name
        }</option>`;
      }
    })
    .catch((err) => console.log(err));
}

function getAllTeacherForTable() {
  fetch(ip + "/api/admin/all-teacher", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      console.log(data);
      document.getElementById("teacher_table").innerHTML = ``;
      var c = 1;
      for (i in data) {
        document.getElementById("teacher_table").innerHTML += `
        <tr class='${c % 2 == 0 ? "even" : "odd"}'>
    
        <td>${c}.</td>
        <td>${data[i].teacher_id}</td>
        <td>${
          data[i].title + " " + data[i].first_name + " " + data[i].last_name
        }</td>
        <td>${data[i].gender}</td>
        <td class="text-white">${
          data[i].profile_status == "ENABLED"
            ? `<span class="badge bg-success"><b>ENABLED</b></span>`
            : `<span class="badge bg-danger"><b>DISABLED</b></span>`
        }</td>
        <td>
        <a  onmouseover="viewTeacher(${JSON.stringify(data[i])
          .replace(/'/g, "")
          .replace(
            /"/g,
            "'"
          )})" class="btn btn-primary text-white" data-bs-toggle="modal"
                                                data-bs-target="#viewModal"><i class="fas fa-eye"></i> </a>
        <a  onmouseover="reloadEditFrame(); editTeacher(${JSON.stringify(
          data[i]
        ).replace(/"/g, "'")})" class="btn btn-warning" data-bs-toggle="modal"
        data-bs-target="#editModal"><i class="fas fa-edit"></i></a>
    
        
        <a  onclick="updateTeacherProfileStatus(${
          data[i].id
        })" class="btn gradient-orange-peel"><i
            class='${
              data[i].profile_status == "ENABLED"
                ? "fas fa-lock"
                : "fas fa-unlock-alt"
            }'></i></a>  
            
        <a  onclick="viewStaffIDCard(${JSON.stringify(data[i])
          .replace(/'/g, "")
          .replace(/"/g, "'")})" class="btn btn-secondary text-white">
          <i class="fas fa-id-card"></i>
               </a> 
        
        <a  onclick="resetAccount('STAFF','${
          data[i].teacher_id
        }')" class="btn btn-success text-white">
        <i class="fas fa-sync-alt"></i>
                </a>
        </td>
    
    </tr>`;
        c = c + 1;
      }
      paginateTable();
    })
    .catch((err) => console.log(err));
}

function getAllStaff() {
  return fetch(ip + "/api/admin/all-teacher", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      return data;
    })
    .catch((err) => console.log(err));
}

function viewTeacher(json) {
  // IMAGE URL
  url =
    domain +
    "/backend/storage/app/public/fileupload/staff/" +
    json.teacher_id +
    ".png";
  document.getElementById("imagePreview").style.backgroundImage = `url(${url})`;

  document.getElementById("title").value = json.title;
  document.getElementById("first_name").value = json.first_name;
  document.getElementById("middle_name").value = json.middle_name;
  document.getElementById("last_name").value = json.last_name;
  document.getElementById("gender").value = json.gender;
  document.getElementById("teacher_phone").value = json.phone;
  document.getElementById("teacher_email").value = json.email;
  document.getElementById("religion").value = json.religion;
  document.getElementById("dob").value = json.dob;
  document.getElementById("joining_date").value = json.joining_date;
  document.getElementById("assigned_class").value =
    json.assigned_class != null
      ? json.assigned_class.class_name
      : "NO CLASS ASSIGNED";
  document.getElementById("home_address").value = json.home_address;
  document.getElementById("state").value = json.state;
}

function getTeacherDetails() {
  json = JSON.parse(localStorage["editTeacher"]);
  console.log(json);

  // IMAGE URL
  url =
    domain +
    "/backend/storage/app/public/fileupload/staff/" +
    json.teacher_id +
    ".png";
  document.getElementById("imagePreview").style.backgroundImage = `url(${url})`;

  document.getElementById("title").innerHTML =
    `<option value="${json.title}">${json.title}</option>` +
    document.getElementById("title").innerHTML;

  document.getElementById("first_name").value = json.first_name;
  document.getElementById("middle_name").value = json.middle_name;
  document.getElementById("last_name").value = json.last_name;

  document.getElementById("gender").innerHTML =
    `<option value="${json.gender}">${json.gender}</option>` +
    document.getElementById("gender").innerHTML;

  document.getElementById("teacher_phone").value = json.phone;
  document.getElementById("teacher_email").value = json.email;

  document.getElementById("religion").innerHTML =
    `<option value="${json.religion}">${json.religion}</option>` +
    document.getElementById("religion").innerHTML;

  document.getElementById("dob").value = json.dob;
  document.getElementById("joining_date").value = json.joining_date;
  document.getElementById("home_address").value = json.home_address;

  document.getElementById("state").innerHTML =
    `<option value="${json.state}">${json.state}</option>` +
    document.getElementById("state").innerHTML;
}

function editTeacher(json) {
  localStorage.setItem("editTeacher", JSON.stringify(json));
}

function createTeacher() {
  var title = document.getElementById("title").value;
  var first_name = document.getElementById("first_name").value;
  var middle_name = document.getElementById("middle_name").value;
  var last_name = document.getElementById("last_name").value;
  var gender = document.getElementById("gender").value;
  var teacher_phone = document.getElementById("teacher_phone").value;
  var teacher_email = document.getElementById("teacher_email").value;
  var dob = document.getElementById("dob").value;
  var religion = document.getElementById("religion").value;
  var joining_date = document.getElementById("joining_date").value;
  var home_address = document.getElementById("home_address").value;
  var state = document.getElementById("state").value.toUpperCase();

  if (
    title != "" &&
    first_name != "" &&
    last_name != "" &&
    gender != "" &&
    teacher_phone != "" &&
    dob != "" &&
    religion != "" &&
    joining_date != "" &&
    home_address != "" &&
    state != ""
  ) {
    // PUSH TO API
    warningtoast("<b>Processing ... Please wait</b>");
    fetch(ip + "/api/admin/create-teacher", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage["token"],
      },
      body: JSON.stringify({
        title: title,
        first_name: first_name,
        last_name: last_name,
        middle_name: middle_name,
        gender: gender,
        teacher_email: teacher_email,
        teacher_phone: teacher_phone,
        dob: dob,
        religion: religion,
        joining_date: joining_date,
        home_address: home_address,
        state: state,
      }),
    })
      .then(function (res) {
        console.log(res.status);
        if (res.status == 401) {
          openAuthenticationModal();
        }
        return res.json();
      })

      .then((data) => {
        toastr.remove();
        if (data.success) {
          successtoast("<b>" + data.message + "</b>");
          setTimeout(function () {
            parent.getAllTeacherForTable();
            parent.$("#modalYT").modal("hide");
          }, 1000);
        } else {
          errortoast("<b>" + data.message + "</b>");
        }
      })
      .catch((err) => console.log(err));
  } else {
    warningtoast("<b>Please check that no field is empty.</b>");
  }
}

function updateTeacher() {
  var title = document.getElementById("title").value;
  var first_name = document.getElementById("first_name").value;
  var middle_name = document.getElementById("middle_name").value;
  var last_name = document.getElementById("last_name").value;
  var gender = document.getElementById("gender").value;
  var teacher_phone = document.getElementById("teacher_phone").value;
  var teacher_email = document.getElementById("teacher_email").value;
  var dob = document.getElementById("dob").value;
  var religion = document.getElementById("religion").value;
  var joining_date = document.getElementById("joining_date").value;
  var home_address = document.getElementById("home_address").value;
  var state = document.getElementById("state").value.toUpperCase();

  if (
    title != "" &&
    first_name != "" &&
    last_name != "" &&
    gender != "" &&
    teacher_phone != "" &&
    dob != "" &&
    religion != "" &&
    joining_date != "" &&
    home_address != "" &&
    state != ""
  ) {
    // PUSH TO API
    warningtoast("<b>Processing ... Please wait</b>");
    fetch(ip + "/api/admin/edit-teacher", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage["token"],
      },
      body: JSON.stringify({
        teacher_id: JSON.parse(localStorage["editTeacher"]).id,
        title: title,
        first_name: first_name,
        last_name: last_name,
        middle_name: middle_name,
        gender: gender,
        teacher_email: teacher_email,
        teacher_phone: teacher_phone,
        dob: dob,
        religion: religion,
        joining_date: joining_date,
        home_address: home_address,
        state: state,
      }),
    })
      .then(function (res) {
        console.log(res.status);
        if (res.status == 401) {
          openAuthenticationModal();
        }
        return res.json();
      })

      .then((data) => {
        toastr.remove();
        if (data.success) {
          successtoast("<b>" + data.message + "</b>");
          setTimeout(function () {
            parent.getAllTeacherForTable();
            parent.$("#editModal").modal("hide");
          }, 1000);
        } else {
          errortoast("<b>" + data.message + "</b>");
        }
      })
      .catch((err) => console.log(err));
  } else {
    warningtoast("<b>Please check that no field is empty.</b>");
  }
}

function updateTeacherProfileStatus(id) {
  if (!confirm("You are about to change this Staff's profile status?")) {
    return 0;
  }
  // PUSH TO API
  warningtoast("<b>Processing ... Please wait</b>");
  fetch(ip + "/api/admin/update-teacher-profilestatus/" + id, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      toastr.remove();
      if (data.success) {
        successtoast("<b>" + data.message + "</b>");
        // setTimeout(function () {
        getAllTeacherForTable();
        // }, 1000);
      } else {
        errortoast("<b>" + data.message + "</b>");
      }
    })
    .catch((err) => console.log(err));
}

function deleteTeacher(id) {
  if (!confirm("You are about to delete this Staff ?")) {
    return 0;
  }

  warningtoast("<b>Processing ... Please wait</b>");
  fetch(ip + "/api/admin/delete-teacher/" + id, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      toastr.remove();
      if (data.success) {
        successtoast("<b>" + data.message + "</b>");
        // setTimeout(function () {
        getAllTeacherForTable();
        // }, 1000);
      } else {
        errortoast("<b>" + data.message + "</b>");
      }
    })
    .catch((err) => console.log(err));
}

function searchTeacher(search_data) {
  fetch(ip + "/api/admin/search-teacher/" + search_data, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      console.log(data);

      var c = 1;

      if (data.length > 0) {
        document.getElementById("teacher_table").innerHTML = ``;
        var c = 1;
        for (i in data) {
          if (c % 2 == 0) {
            if (data[i].profile_status == "ENABLED") {
              document.getElementById("teacher_table").innerHTML += `
              <tr class="even">
    
              <td>${c}.</td>
              <td>${data[i].teacher_id}</td>
              <td>${
                data[i].title +
                " " +
                data[i].first_name +
                " " +
                data[i].last_name
              }</td>
              <td>${data[i].gender}</td>
              <td class="text-white"><span class="badge bg-success"><b>ENABLED</b></span></td>
             
              <td>
              <a  onmouseover="viewTeacher(${JSON.stringify(data[i])
                .replace(/'/g, "")
                .replace(
                  /"/g,
                  "'"
                )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                      data-bs-target="#viewModal"><i class="fas fa-eye"></i> View</a>
              <a  onmouseover="reloadEditFrame(); editTeacher(${JSON.stringify(
                data[i]
              )
                .replace(/'/g, "")
                .replace(
                  /"/g,
                  "'"
                )})" class="btn btn-warning" data-bs-toggle="modal"
              data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
  
              
              <a  onclick="updateTeacherProfileStatus(${
                data[i].id
              })" class="btn gradient-orange-peel"><i
                  class="fas fa-lock"></i> Disable</a>  
  
              <a  onclick="viewStaffIDCard(${JSON.stringify(data[i])
                .replace(/'/g, "")
                .replace(/"/g, "'")})" class="btn btn-secondary text-white"><i
                          class="fas fa-id-card"></i>
                      ID Card</a> 
              
              <a  onclick="deleteTeacher(${
                data[i].id
              })" class="btn btn-danger text-white"><i
                          class="fas fa-trash"></i>
                      Delete</a>
              </td>
    
          <tr>`;
            } else {
              document.getElementById("teacher_table").innerHTML += `
              <tr class="even">
    
              <td>${c}.</td>
              <td>${data[i].teacher_id}</td>
              <td>${
                data[i].title +
                " " +
                data[i].first_name +
                " " +
                data[i].last_name
              }</td>
              <td>${data[i].gender}</td>
              <td class="text-white"><span class="badge bg-danger"><b>DISABLED</b></span></td>
              
              <td>
              <a  onmouseover="viewTeacher(${JSON.stringify(data[i])
                .replace(/'/g, "")
                .replace(
                  /"/g,
                  "'"
                )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                      data-bs-target="#viewModal"><i class="fas fa-eye"></i> View</a>
              <a  onmouseover="reloadEditFrame(); editTeacher(${JSON.stringify(
                data[i]
              )
                .replace(/'/g, "")
                .replace(
                  /"/g,
                  "'"
                )})" class="btn btn-warning" data-bs-toggle="modal"
              data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
  
              
              <a  onclick="updateTeacherProfileStatus(${
                data[i].id
              })" href="#" class="btn gradient-orange-peel"><i class="fas fa-unlock-alt"></i> Enable</a>  
  
              <a  onclick="viewStaffIDCard(${JSON.stringify(data[i])
                .replace(/'/g, "")
                .replace(/"/g, "'")})" class="btn btn-secondary text-white"><i
                          class="fas fa-id-card"></i>
                      ID Card</a>
              
              <a  onclick="deleteTeacher(${
                data[i].id
              })" class="btn btn-danger text-white"><i
                          class="fas fa-trash"></i>
                      Delete</a>
              </td>
    
          <tr>`;
            }
          } else {
            if (data[i].profile_status == "ENABLED") {
              document.getElementById("teacher_table").innerHTML += `
              <tr class="odd">
    
              <td>${c}.</td>
              <td>${data[i].teacher_id}</td>
              <td>${
                data[i].title +
                " " +
                data[i].first_name +
                " " +
                data[i].last_name
              }</td>
              <td>${data[i].gender}</td>
              <td class="text-white"><span class="badge bg-success"><b>ENABLED</b></span></td>
              
              <td>
              <a  onmouseover="viewTeacher(${JSON.stringify(data[i])
                .replace(/'/g, "")
                .replace(
                  /"/g,
                  "'"
                )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                      data-bs-target="#viewModal"><i class="fas fa-eye"></i> View</a>
              <a  onmouseover="reloadEditFrame(); editTeacher(${JSON.stringify(
                data[i]
              )
                .replace(/'/g, "")
                .replace(
                  /"/g,
                  "'"
                )})" class="btn btn-warning" data-bs-toggle="modal"
              data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
  
              
              <a  onclick="updateTeacherProfileStatus(${
                data[i].id
              })" href="#" class="btn gradient-orange-peel"><i
                  class="fas fa-lock"></i> Disable</a>  
              
              <a  onclick="viewStaffIDCard(${JSON.stringify(data[i])
                .replace(/'/g, "")
                .replace(/"/g, "'")})" class="btn btn-secondary text-white"><i
                          class="fas fa-id-card"></i>
                      ID Card</a>    
              
              <a  onclick="deleteTeacher(${
                data[i].id
              })" class="btn btn-danger text-white"><i
                          class="fas fa-trash"></i>
                      Delete</a>
              </td>
    
          <tr>`;
            } else {
              document.getElementById("teacher_table").innerHTML += `
              <tr class="odd">
    
              <td>${c}.</td>
              <td>${data[i].teacher_id}</td>
              <td>${
                data[i].title +
                " " +
                data[i].first_name +
                " " +
                data[i].last_name
              }</td>
              <td>${data[i].gender}</td>
              <td class="text-white"><span class="badge bg-danger"><b>DISABLED</b></span></td>
              
              <td>
              <a  onmouseover="viewTeacher(${JSON.stringify(data[i])
                .replace(/'/g, "")
                .replace(
                  /"/g,
                  "'"
                )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                      data-bs-target="#viewModal"><i class="fas fa-eye"></i> View</a>
              <a  onmouseover="reloadEditFrame(); editTeacher(${JSON.stringify(
                data[i]
              )
                .replace(/'/g, "")
                .replace(
                  /"/g,
                  "'"
                )})" class="btn btn-warning" data-bs-toggle="modal"
              data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
  
              
              <a  onclick="updateTeacherProfileStatus(${
                data[i].id
              })" href="#" class="btn gradient-orange-peel"><i class="fas fa-unlock-alt"></i> Enable</a>  
  
              <a  onclick="viewStaffIDCard(${JSON.stringify(data[i])
                .replace(/'/g, "")
                .replace(/"/g, "'")})" class="btn btn-secondary text-white"><i
                          class="fas fa-id-card"></i>
                      ID Card</a>
              
              <a  onclick="deleteTeacher(${
                data[i].id
              })" class="btn btn-danger text-white"><i
                          class="fas fa-trash"></i>
                      Delete</a>
              </td>
    
          <tr>`;
            }
          }

          c = c + 1;
        }
      } else {
        errortoast("<b>Teacher not found</b>");
      }
    })
    .catch((err) => console.log(err));
}

// EXPORT LIST
function exportStaffList() {
  // PUSH TO API
  warningtoast("<b>Processing ... Please wait</b>");
  fetch(ip + "/api/admin/staff/export-list", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.blob();
    })

    .then((blob) => {
      var url = window.URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "staff-list.xlsx";
      document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
      a.click();
      a.remove(); //afterwards we remove the element again
    })
    .catch((err) => console.log(err));
}

// STUDENT
function getAllStudentForTable() {
  fetch(ip + "/api/admin/all-student", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })
    .then((data) => {
      document.getElementById("student_table").innerHTML = ``;
      var c = 1;
      if (data.length > 0) {
        for (i in data) {
          document.getElementById("student_table").innerHTML += `
          <tr class='${c % 2 == 0 ? "even" : "odd"}'>
      
          <td>${c}.</td>
          <td>${data[i].student_id}</td>
          <td>${data[i].first_name + " " + data[i].last_name}</td>
          <td>${data[i].gender}</td>
          <td class="text-white">${
            data[i].profile_status == "ENABLED"
              ? `<span class="badge bg-success"><b>ENABLED</b></span>`
              : `<span class="badge bg-danger"><b>DISABLED</b></span>`
          }</td>
          <td>${
            data[i].class == null ? `GRADUATED` : data[i].class.class_name
          }</td>
          <td>
          <a  onmouseover="viewStudent(${JSON.stringify(data[i])
            .replace(/'/g, "")
            .replace(
              /"/g,
              "'"
            )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                  data-bs-target="#viewModal"><i class="fas fa-eye"></i> </a>
          <a  onclick ="reloadEditFrame(); editStudent(${JSON.stringify(data[i])
            .replace(/'/g, "")
            .replace(
              /"/g,
              "'"
            )})" class="btn btn-warning" data-bs-toggle="modal"
          data-bs-target="#editModal"><i class="fas fa-edit"></i></a>
      
          
          <a   onclick="updateStudentProfileStatus(${
            data[i].id
          })" class="btn gradient-orange-peel"><i
              class='${
                data[i].profile_status == "ENABLED"
                  ? "fas fa-lock"
                  : "fas fa-unlock-alt"
              }'></i></a>  
              
          <a  onclick="viewStudentIDCard(${JSON.stringify(data[i])
            .replace(/'/g, "")
            .replace(/"/g, "'")})" class="btn btn-secondary text-white">
            <i class="fas fa-id-card"></i>
                 </a> 
          
          <a  onclick="resetAccount('STUDENT','${
            data[i].student_id
          }')" class="btn btn-success text-white">
          <i class="fas fa-sync-alt"></i>
                  </a>
          </td>
      
      </tr>`;

          c = c + 1;
        }
      } else {
        document.getElementById(
          "student_table"
        ).innerHTML = `<h4 style="text-align:center;">NO RECORD FOUND</h4>`;
      }
      paginateTable();
    })
    .catch((err) => console.log(err));
}

function getAllStudent() {
  return fetch(ip + "/api/admin/all-student", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => console.log(err));
}

function getAllStudentForDropDown(class_id) {
  openSpinnerModal("Fetch student ");
  fetch(ip + "/api/admin/all-student", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })
    .then((data) => {
      removeSpinnerModal();
      console.log(data);
      document.getElementById("student").innerHTML = ``;
      if (data.length > 0) {
        document.getElementById(
          "student"
        ).innerHTML = `<option value="">Select student for registration </option>`;
        for (i in data) {
          student_class =
            data[i].class == null ? `GRADUATED` : data[i].class.id;
          if (student_class != class_id) {
            continue;
          }
          document.getElementById("student").innerHTML += `<option value="${
            data[i].id
          }">${data[i].first_name + " " + data[i].last_name}</option>`;
        }
      } else {
        document.getElementById(
          "student"
        ).innerHTML = ` <option value="">NO STUDENT FOUND IN THE SELECTED CLASS</option>`;
      }
    })
    .catch((err) => console.log(err));
}

function viewStudent(json) {
  // IMAGE URL
  url =
    domain +
    "/backend/storage/app/public/fileupload/student/" +
    json.student_id +
    ".png";
  document.getElementById("imagePreview").style.backgroundImage = `url(${url})`;

  document.getElementById("first_name").value = json.first_name;
  document.getElementById("middle_name").value = json.middle_name;
  document.getElementById("last_name").value = json.last_name;
  document.getElementById("gender").value = json.gender;
  document.getElementById("religion").value = json.religion;
  document.getElementById("dob").value = json.dob;
  document.getElementById("joining_date").value = json.joining_date;
  document.getElementById("home_address").value = json.home_address;
  document.getElementById("state").value = json.state;
  document.getElementById("student_class").value = json.class.class_name;

  document.getElementById("guardian_name").value = json.guardian_name;
  document.getElementById("guardian_phone").value = json.guardian_phone;
  document.getElementById("guardian_email").value = json.guardian_email;
  document.getElementById("guardian_address").value = json.guardian_address;
}

function getStudentDetails() {
  json = JSON.parse(localStorage["editStudent"]);
  console.log(json);

  // IMAGE URL
  url =
    domain +
    "/backend/storage/app/public/fileupload/student/" +
    json.student_id +
    ".png";
  document.getElementById("imagePreview").style.backgroundImage = `url(${url})`;

  document.getElementById("first_name").value = json.first_name;
  document.getElementById("middle_name").value = json.middle_name;
  document.getElementById("last_name").value = json.last_name;

  document.getElementById("gender").innerHTML =
    `<option value="${json.gender}">${json.gender}</option>` +
    document.getElementById("gender").innerHTML;

  document.getElementById("religion").innerHTML =
    `<option value="${json.religion}">${json.religion}</option>` +
    document.getElementById("religion").innerHTML;

  document.getElementById("dob").value = json.dob;

  document.getElementById("joining_date").value = json.joining_date;

  // document.getElementById("joining_session").innerHTML =
  //   `<option value="${json.joining_session}">${json.joining_session}</option>` +
  //   document.getElementById("joining_session").innerHTML;

  document.getElementById("home_address").value = json.home_address;

  document.getElementById("state").innerHTML =
    `<option value="${json.state}">${json.state}</option>` +
    document.getElementById("state").innerHTML;

  document.getElementById("classes").innerHTML =
    `<option value="${json.class.id}">${json.class.class_name}</option>` +
    document.getElementById("classes").innerHTML;

  document.getElementById("guardian_name").value = json.guardian_name;
  document.getElementById("guardian_phone").value = json.guardian_phone;
  document.getElementById("guardian_email").value = json.guardian_email;
  document.getElementById("guardian_address").value = json.guardian_address;
}

function editStudent(json) {
  localStorage.setItem("editStudent", JSON.stringify(json));
}

function createStudent() {
  // CHECK IMAGE
  const input = document.getElementById("imageUpload");
  console.log(input.files);
  image = input.files;
  if (image.length < 1) {
    return alert("Please upload student picture !");
  }

  var first_name = document.getElementById("first_name").value;
  var middle_name = document.getElementById("middle_name").value;
  var last_name = document.getElementById("last_name").value;
  var gender = document.getElementById("gender").value;
  var dob = document.getElementById("dob").value;
  var religion = document.getElementById("religion").value;
  var joining_date = document.getElementById("joining_date").value;
  var home_address = document.getElementById("home_address").value;
  var state = document.getElementById("state").value.toUpperCase();
  var student_class = document.getElementById("classes").value;

  var guardian_name = document.getElementById("guardian_name").value;
  var guardian_phone = document.getElementById("guardian_phone").value;
  var guardian_email = document.getElementById("guardian_email").value;
  var guardian_address = document.getElementById("guardian_address").value;

  if (
    first_name != "" &&
    last_name != "" &&
    gender != "" &&
    dob != "" &&
    religion != "" &&
    home_address != "" &&
    state != "" &&
    student_class != "" &&
    guardian_name != "" &&
    guardian_phone != "" &&
    guardian_address != ""
  ) {
    // PUSH TO API
    warningtoast("<b>Processing ... Please wait</b>");
    fetch(ip + "/api/admin/create-student", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage["token"],
      },
      body: JSON.stringify({
        first_name: first_name,
        last_name: last_name,
        middle_name: middle_name,
        gender: gender,
        dob: dob,
        religion: religion,
        joining_date: joining_date,
        home_address: home_address,
        state: state,
        student_class: student_class,
        guardian_name: guardian_name,
        guardian_phone: guardian_phone,
        guardian_email: guardian_email,
        guardian_address: guardian_address,
      }),
    })
      .then(function (res) {
        console.log(res.status);
        if (res.status == 401) {
          openAuthenticationModal();
        }
        return res.json();
      })

      .then((data) => {
        if (data.success) {
          //UPLOAD IMAGE WITH STUDENT ID RESPONSE
          uploadImage1(image[0], data.student_id);
        } else {
          toastr.remove();
          errortoast("<b>" + data.message + "</b>");
        }
      })
      .catch((err) => console.log(err));
  } else {
    warningtoast("<b>Please check that no field is empty.</b>");
  }
}

// STUDENT RESULT
function viewStudentResult(data) {
  localStorage.setItem("student_result", JSON.stringify(data));
  window.parent.location.assign(domain + "/admin/transcript.html");
}

function getAllStudentForTranscript() {
  fetch(ip + "/api/admin/all-student", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })
    .then((data) => {
      document.getElementById("student_table").innerHTML = ``;
      var c = 1;
      if (data.length > 0) {
        for (i in data) {
          student_class =
            data[i].class == null ? `GRADUATED` : data[i].class.id;
          // if (
          //   student_class !=
          //   JSON.parse(localStorage["user_data"]).data.assigned_class.id
          // ) {
          //   continue;
          // }
          document.getElementById("student_table").innerHTML += `
          <tr class='${c % 2 == 0 ? "even" : "odd"}'>
      
          <td>${c}.</td>
          <td>${data[i].student_id}</td>
          <td>${data[i].first_name + " " + data[i].last_name}</td>
          <td>${data[i].gender}</td>
          <td class="text-white">${
            data[i].can_access_transcript == "YES"
              ? `<span class="badge bg-success"><b>YES</b></span>`
              : `<span class="badge bg-danger"><b>NO</b></span>`
          }</td>
          <td>${
            data[i].class == null ? `GRADUATED` : data[i].class.class_name
          }</td>
          <td>
          <a  onmouseover="viewStudent(${JSON.stringify(data[i])
            .replace(/'/g, "")
            .replace(
              /"/g,
              "'"
            )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                  data-bs-target="#viewModal"><i class="fas fa-eye"></i> </a>

          <a   onclick="updateTranscriptAccess(${data[i].id})" class='${
            data[i].can_access_transcript == "YES"
              ? "btn btn-danger"
              : "btn btn-success"
          }'><i
              class='${
                data[i].can_access_transcript == "YES"
                  ? "fas fa-lock"
                  : "fas fa-unlock-alt"
              }'></i></a> 

          <a  onclick="viewStudentResult(${JSON.stringify(data[i])
            .replace(/'/g, "")
            .replace(
              /"/g,
              "'"
            )})" class="btn gradient-orange-peel text-black"><i
                      class="fas fa-poll"></i></a>
      </tr>`;

          c = c + 1;
        }
      } else {
        document.getElementById(
          "student_table"
        ).innerHTML = `<h4 style="text-align:center;">NO RECORD FOUND</h4>`;
      }
      paginateTable();
    })
    .catch((err) => console.log(err));
}

function getTranscript() {
  openSpinnerModal("Transcript");
  user_data = JSON.parse(localStorage["student_result"]);

  // IMAGE URL
  url =
    domain +
    "/backend/storage/app/public/fileupload/student/" +
    user_data.student_id +
    ".png";

  // SCHOOL LOGO URL
  school_logo_url =
    domain + "/backend/storage/app/public/fileupload/school_logo.png";

  // SCHOOL_LOGO
  document.getElementById("school_logo").src = school_logo_url;

  // STUDENT_IMAGE
  document.getElementById("student_image").src = url;

  // POPULATE STUDENTS INFORMATION
  document.getElementById("full_name").innerHTML =
    "<b>" +
    user_data.last_name +
    "</b>" +
    " " +
    user_data.first_name +
    " " +
    user_data.middle_name;

  document.getElementById("student_id").innerHTML = user_data.student_id;
  document.getElementById("class_sector").innerHTML =
    user_data.class != null ? user_data.class.class_sector : `GRADUATED`;
  document.getElementById("school_details").innerHTML =
    localStorage["SCHOOL_NAME"] + "<br> " + localStorage["SCHOOL_ADDRESS"];

  // QR Generator
  var qrcode = new QRCode("verificationQR", {
    text: "STUDENT NUMBER",
    width: 128,
    height: 128,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });

  var sessions = [];
  var terms = [];

  // CALL API THAT GET ALL SESSION
  fetch(ip + "/api/general/all-session/STD-" + user_data.id, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      // STORE IN SESSIONS ARRAY
      data.forEach((data) => {
        if (!sessions.includes(data.session)) {
          sessions.push(data.session);
        }

        if (!terms.includes(data.term)) {
          terms.push(data.term);
        }
      });

      // CREATE RESULT TEMPLATE
      if (sessions.length > 0) {
        document.getElementById("result_div").innerHTML = ``;
        // LOOP THROUGH EACH SESSION AND TERM
        sessions.forEach((session) => {
          terms.forEach((term) => {
            // CREATE RESULT TEMPLATE
            document.getElementById("result_div").innerHTML += `
        <div id="result_${session}_${term}" name="result_${session}_${term}" class="container result_container" style="margin-bottom: 30px;">
        <div style="border:1px solid black; padding-bottom: 15px;" class="row">

            <div class="col-md-4">
                <div style="text-align: left;margin-top: 30px;margin-left: 50px;">
                    <h6 style="font-size: 15px;">CLASS: <strong id="class_${session}_${term}"></strong></h6>
                </div>
            </div>
            <div class="col-md-4">
                <div style="text-align: left;margin-top: 30px;margin-left: 50px;">
                    <h6 style="font-size: 15px;">SESSION: <strong>${session}</strong></h6>
                </div>
            </div>
            <div class="col-md-4">
                <div style="text-align: left;margin-top: 30px;margin-left: 50px;">
                    <h6 style="font-size: 15px;">TERM: <strong>${term}</strong></h6>
                </div>
            </div>

            <!-- ATTTENDANCE -->
            <div style="margin-top: 15px;" class="container">
                <p><b>(A) ATTTENDANCE</b></p>
                <div class="row">
                    <div class="col-md-12 table-responsive">
                        <table style="padding: 0%;" class="table table-sm">
                            <tbody>
                                <tr>
                                    <td
                                        style="width:60%; padding:3px; size: 5px; font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold;">
                                        No of times school
                                        opened
                                    </td>
                                    <td  id="opened_${session}_${term}"
                                        style="width:60%; padding:3px; size: 5px; font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold;">
                                        </td>

                                </tr>
                                <tr>
                                    <td
                                        style="width:60%; padding:3px; size: 5px; font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold;">
                                        No of times present
                                    </td>
                                    <td id="present_${session}_${term}"
                                        style="width:60%; padding:3px; size: 5px; font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold;">
                                        </td>

                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>

            <!-- ACADEMIC PERFORMANCE -->
            <div style="margin-top: 15px;" class="col-md-12 col-lg-12 col-xl-12">
                <p><b>(B) ACADEMIC PERFORMANCE</b></p>
                <div style="margin-top: 0px;">
                    <div class="card">
                        <div class="card-body">
                            <!-- SCORE TABLE -->
                            <div class="table-responsive">
                                <table style="padding: 0%;" class="table table-sm">
                                    <thead>
                                        <tr>
                                            <th style="font-size: 14px;">S/No</th>
                                            <th style="font-size: 14px;">Subject</th>
                                            <th style="font-size: 14px;">1<sup>st</sup> CA</th>
                                            <th style="font-size: 14px;">2<sup>nd</sup> CA</th>
                                            <th style="font-size: 14px;">Exam</th>
                                            <th style="font-size: 14px;">Total</th>
                                            <th style="font-size: 14px;">Class Average</th>
                                            <th style="font-size: 14px;">Class Lowest</th>
                                            <th style="font-size: 14px;">Class Highest</th>
                                            <th style="font-size: 14px;">Position</th>
                                            <th style="font-size: 14px;">Grade</th>
                                            <th style="font-size: 14px;">Remark</th>
                                        </tr>
                                    </thead>
                                    <tbody id="scores_${session}_${term}">

                                    
                                    
                                    </tbody>
                                </table>
                            </div>
                            <!-- POSITION AND PERCENTAGE -->
                            <div class="table-responsive">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th style="font-size: 13px;font-style: italic;">NO IN CLASS :
                                                <span id="no_student_${session}_${term}"></span>
                                            </th>
                                            <th style="font-size: 13px;font-style: italic;">GRADE POSITION :
                                                <span id="grade_position_${session}_${term}"></span>
                                            </th>
                                            <th style="font-size: 13px;font-style: italic;">PERCENTAGE :
                                                <span id="percentage_${session}_${term}"></span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody style="font-size: 13px;">

                                        <tr style="font-size: 13px;">
                                            <td style="font-size: 13px;font-family: Open Sans, sans-serif;"
                                                colspan="6">
                                                <span style="font-weight: bold;">Class Teacher's
                                                    Comment :
                                                </span>
                                                <font color="black"><b id="teacher_comment_${session}_${term}" oninput="uploadCommentAndRatingDebouncer('COMMENT',this.innerHTML,'')" contenteditable="true"></b></font>
                                            </td>
                                        </tr>

                                        

                                    </tbody>

                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- AFFECTIVE & PSYCHO MOTOR REPORT -->
            <div style="margin-top: 5px;" class="container">
                <p><b>(C) AFFECTIVE & PSYCHO MOTOR REPORT</b></p>
                <div class="row">
                    <div class="col-md-6 table-responsive">
                        <table class="table table-sm">
                            <tbody>
                                <tr>
                                    <td
                                        style="width:60%; padding:3px; size: 5px; font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold;">
                                        Hand Writing
                                    </td>
                                    <td id="handwriting_${session}_${term}" oninput="uploadCommentAndRatingDebouncer('RATING',this.innerHTML,'handwriting')" contenteditable="true"
                                        style="width:60%; padding:3px; size: 5px; font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold;">
                                        </td>

                                </tr>
                                
                                <tr>
                                    <td 
                                        style="width:60%; padding:3px; size: 5px; font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold;">
                                        Games
                                    </td>
                                    <td id="games_${session}_${term}"  oninput="uploadCommentAndRatingDebouncer('RATING',this.innerHTML,'games')" contenteditable="true"
                                        style="width:60%; padding:3px; size: 5px; font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold;">
                                        </td>

                                </tr>
                                
                                <tr>
                                    <td
                                        style="width:60%; padding:3px; size: 5px; font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold;">
                                        Handing Tools
                                    </td>
                                    <td id="handing_tools_${session}_${term}"  oninput="uploadCommentAndRatingDebouncer('RATING',this.innerHTML,'handling_tools')" contenteditable="true"
                                        style="width:60%; padding:3px; size: 5px; font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold;">
                                        </td>

                                </tr>
                                <tr>
                                    <td
                                        style="width:60%; padding:3px; size: 5px; font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold;">
                                        Drawing and Painting
                                    </td>
                                    <td id="drawing_painting_${session}_${term}"  oninput="uploadCommentAndRatingDebouncer('RATING',this.innerHTML,'drawing_painting')" contenteditable="true"
                                        style="width:60%; padding:3px; size: 5px; font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold;">
                                        </td>

                                </tr>
                               
                            </tbody>
                        </table>
                    </div>
                    <div class="col-md-6 table-responsive">
                        <table class="table table-sm">
                            <tbody>

                                <tr>
                                    <td
                                        style="width:60%; padding:3px; size: 5px; font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold;">
                                        Neatness
                                    </td>
                                    <td id="neatness_${session}_${term}" oninput="uploadCommentAndRatingDebouncer('RATING',this.innerHTML,'neatness')" contenteditable="true"
                                        style="width:60%; padding:3px; size: 5px; font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold;">
                                        </td>

                                </tr>
                                <tr>
                                    <td
                                        style="width:60%; padding:3px; size: 5px; font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold;">
                                        Politeness
                                    </td>
                                    <td id="politeness_${session}_${term}" oninput="uploadCommentAndRatingDebouncer('RATING',this.innerHTML,'politeness')" contenteditable="true"
                                        style="width:60%; padding:3px; size: 5px; font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold;">
                                        </td>

                                </tr>
                               
                                <tr>
                                    <td
                                        style="width:60%; padding:3px; size: 5px; font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold;">
                                        Co-operation with others
                                    </td>
                                    <td id="cooperation_${session}_${term}" oninput="uploadCommentAndRatingDebouncer('RATING',this.innerHTML,'cooperation')" contenteditable="true"
                                        style="width:60%; padding:3px; size: 5px; font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold;">
                                        </td>

                                </tr>
                                
                          
                                <tr>
                                    <td
                                        style="width:60%; padding:3px; size: 5px; font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold;">
                                        Health
                                    </td>
                                    <td id="health_${session}_${term}" oninput="uploadCommentAndRatingDebouncer('RATING',this.innerHTML,'health')" contenteditable="true"
                                        style="width:60%; padding:3px; size: 5px; font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold;">
                                        </td>

                                </tr>

                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>

        </div>

`;
          });
        });
      } else {
        document.getElementById(
          "result_div"
        ).innerHTML = `<hr style="color: black; border: 1px solid black">
  <h3 style="text-align: center;">NO RESULT AVAILABLE</h3>
  <hr style="color: black; border: 1px solid black">`;
      }

      // LOOP THROUGH THE CREATED TEMPLATE AND POPULATE ATTENDANCE , ACADEMIC PERFORMANCE COMMENTS AND PSYCHO MOTOR REPORTS
      result_containers = document.getElementsByClassName("result_container");

      for (i = 0; i < result_containers.length; i++) {
        container_name = result_containers[i].attributes[0].nodeValue;
        // ATTENDANCE
        getAttendanceSummary(container_name);
        //ACADEMIC PERFORMANCE
        getResult(container_name);
        // COMMENTS AND PSYCHO MOTOR REPORTS
        getCommentsAndPsycho(container_name);
      }

      main_content = parent.body.innerHTML;
      parent.body.innerHTML = "";
      // parent.body.innerHTML = main_content.trim();
    })
    .catch((err) => console.log(err));

  setTimeout(function () {
    removeSpinnerModal();
  }, 10000);
}

function getResult(value) {
  // GET ACADEMIC PERFORMANCE
  return fetch(ip + "/api/student/result", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      user_type: "TEACHER",
      student_id: JSON.parse(localStorage["student_result"]).id,
      class_id:
        JSON.parse(localStorage["student_result"]).class != null
          ? JSON.parse(localStorage["student_result"]).class.id
          : "",
      session: value.split("_")[1],
      term: value.split("_")[2],
    }),
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      c = 1;
      if (data.result.length > 0) {
        data.result.forEach((result) => {
          // ATTACH CLASS TO THAT RESULT TERM AND SESSION
          document.getElementById(
            "class_" + value.split("_")[1] + "_" + value.split("_")[2]
          ).innerHTML = result.class.class_name;

          // ATTACH NO OF STUDENT , GRADE POSITION AND PERCENTAGE
          document.getElementById(
            "no_student_" + value.split("_")[1] + "_" + value.split("_")[2]
          ).innerHTML = data.no_student;

          document.getElementById(
            "grade_position_" + value.split("_")[1] + "_" + value.split("_")[2]
          ).innerHTML = data.grade_position;

          document.getElementById(
            "percentage_" + value.split("_")[1] + "_" + value.split("_")[2]
          ).innerHTML = data.percentage;

          // SCORE TABLE
          document.getElementById(
            "scores_" + value.split("_")[1] + "_" + value.split("_")[2]
          ).innerHTML += `
            <tr>
              <td style="font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold; padding: 0px; text-align:center;">
                ${c}.
              </td>
              <td style="font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold; padding: 0px; text-align:center;">
                ${result.subject.subject_name}
              </td>
              <td style="font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold; padding: 0px; text-align:center;">
              ${result.first_ca}
              </td>
              <td style="font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold; padding: 0px; text-align:center;">
              ${result.second_ca}
              </td>
              <td style="font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold; padding: 0px; text-align:center;">
              ${result.examination}
              </td>
              <td style="font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold; padding: 0px; text-align:center;">
              ${result.total}
              </td>
              <td style="font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold; padding: 0px; text-align:center;">
              
              ${parseFloat(result.class_average).toFixed(0)}
              </td>
              <td style="font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold; padding: 0px; text-align:center;">
              ${result.class_lowest}
              </td>
              <td style="font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold; padding: 0px; text-align:center;">
              ${result.class_highest}
              </td>
              <td style="font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold; padding: 0px; text-align:center;">
              <b>${result.position}</b>
              </td>
              <td style="color: ${
                result.grade.includes("F")
                  ? "red"
                  : result.grade.includes("A")
                  ? "blue"
                  : "black"
              } ; font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold; text-align:center;">
              ${result.grade}
              </td>
              <td style="color: ${
                result.grade.includes("F")
                  ? "red"
                  : result.grade.includes("A")
                  ? "blue"
                  : "black"
              } ;  font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold; padding: 0px; text-align:center;">
              ${result.remark}
              </td>
            </tr>`;

          c = c + 1;
        });
      } else {
        // DELETE RESULT CONTAINER
        console.log("DELETE THIS VALUE " + value);
        document.getElementById(value).remove();
      }
    })
    .catch((err) => console.log(err));
}

function getCommentsAndPsycho(value) {
  // GET ACADEMIC PERFORMANCE
  return fetch(ip + "/api/student/comments-psycho", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      student_id: JSON.parse(localStorage["student_result"]).id,
      session: value.split("_")[1],
      term: value.split("_")[2],
    }),
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      // POPULATE COMMENT
      document.getElementById(
        "teacher_comment_" + value.split("_")[1] + "_" + value.split("_")[2]
      ).innerHTML = "<b><i>" + data.teacher_comment + "</b></i>";

      // POPULATE RATINGS
      document.getElementById(
        "handwriting_" + value.split("_")[1] + "_" + value.split("_")[2]
      ).innerHTML = data.student_rating.handwriting;
      document.getElementById(
        "games_" + value.split("_")[1] + "_" + value.split("_")[2]
      ).innerHTML = data.student_rating.games;
      document.getElementById(
        "handing_tools_" + value.split("_")[1] + "_" + value.split("_")[2]
      ).innerHTML = data.student_rating.handling_tools;
      document.getElementById(
        "drawing_painting_" + value.split("_")[1] + "_" + value.split("_")[2]
      ).innerHTML = data.student_rating.drawing_painting;
      document.getElementById(
        "neatness_" + value.split("_")[1] + "_" + value.split("_")[2]
      ).innerHTML = data.student_rating.neatness;
      document.getElementById(
        "politeness_" + value.split("_")[1] + "_" + value.split("_")[2]
      ).innerHTML = data.student_rating.politeness;
      document.getElementById(
        "cooperation_" + value.split("_")[1] + "_" + value.split("_")[2]
      ).innerHTML = data.student_rating.cooperation;
      document.getElementById(
        "health_" + value.split("_")[1] + "_" + value.split("_")[2]
      ).innerHTML = data.student_rating.health;
    })
    .catch((err) => console.log(err));
}

function uploadCommentAndRating(type, value, rating_type) {
  document.getElementById("result_upload_style").innerHTML = `
    [contenteditable] {

      outline-color: #fc8c03;
    }`;

  fetch(ip + "/api/teacher/upload-comment-rating", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      student_id: JSON.parse(localStorage["student_result"]).id,
      type: type,
      value: value,
      rating_type: rating_type,
      session: localStorage["current_session"],
      term: localStorage["current_term"],
    }),
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })
    .then((data) => {
      if (data.success) {
        document.getElementById("result_upload_style").innerHTML = `
          [contenteditable] {
          
            outline-color: #105c05;
          }`;
        setTimeout(function () {
          // window.parent.location.reload();
        }, 1000);
      }
    })
    .catch((err) => console.log(err));
}

// STUDENT ATTENDANCE
function getAttendanceSummary(value) {
  // GET ACADEMIC PERFORMANCE
  return fetch(ip + "/api/student/attendance-summary", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      student_id: JSON.parse(localStorage["student_result"]).id,
      session: value.split("_")[1],
      term: value.split("_")[2],
    }),
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      document.getElementById(
        "opened_" + value.split("_")[1] + "_" + value.split("_")[2]
      ).innerHTML = data.opened;
      document.getElementById(
        "present_" + value.split("_")[1] + "_" + value.split("_")[2]
      ).innerHTML = data.present;
    })
    .catch((err) => console.log(err));
}

// EXPORT LIST
function exportStudentList() {
  // PUSH TO API
  warningtoast("<b>Processing ... Please wait</b>");
  fetch(ip + "/api/admin/student/export-list", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.blob();
    })

    .then((blob) => {
      var url = window.URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "student-list.xlsx";
      document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
      a.click();
      a.remove(); //afterwards we remove the element again
    })
    .catch((err) => console.log(err));
}

//STUDENT UPLOAD IMAGE
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $("#imagePreview").css(
        "background-image",
        "url(" + e.target.result + ")"
      );
      $("#imagePreview").hide();
      $("#imagePreview").fadeIn(650);
    };
    reader.readAsDataURL(input.files[0]);
  }
}
$("#imageUpload").change(function () {
  readURL(this);
});

function updateStudent() {
  var first_name = document.getElementById("first_name").value;
  var middle_name = document.getElementById("middle_name").value;
  var last_name = document.getElementById("last_name").value;
  var gender = document.getElementById("gender").value;
  var dob = document.getElementById("dob").value;
  var religion = document.getElementById("religion").value;
  var joining_date = document.getElementById("joining_date").value;
  var home_address = document.getElementById("home_address").value;
  var state = document.getElementById("state").value.toUpperCase();
  var student_class = document.getElementById("classes").value;

  var guardian_name = document.getElementById("guardian_name").value;
  var guardian_phone = document.getElementById("guardian_phone").value;
  var guardian_email = document.getElementById("guardian_email").value;
  var guardian_address = document.getElementById("guardian_address").value;

  if (
    first_name != "" &&
    last_name != "" &&
    gender != "" &&
    dob != "" &&
    religion != "" &&
    home_address != "" &&
    state != "" &&
    student_class != "" &&
    guardian_name != "" &&
    guardian_phone != "" &&
    guardian_address != ""
  ) {
    // PUSH TO API
    warningtoast("<b>Processing ... Please wait</b>");
    fetch(ip + "/api/admin/edit-student", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage["token"],
      },
      body: JSON.stringify({
        student_id: JSON.parse(localStorage["editStudent"]).id,
        first_name: first_name,
        last_name: last_name,
        middle_name: middle_name,
        gender: gender,
        dob: dob,
        religion: religion,
        joining_date: joining_date,
        home_address: home_address,
        state: state,
        student_class: student_class,
        guardian_name: guardian_name,
        guardian_phone: guardian_phone,
        guardian_email: guardian_email,
        guardian_address: guardian_address,
      }),
    })
      .then(function (res) {
        console.log(res.status);
        if (res.status == 401) {
          openAuthenticationModal();
        }
        return res.json();
      })

      .then((data) => {
        toastr.remove();
        if (data.success) {
          successtoast("<b>" + data.message + "</b>");
          setTimeout(function () {
            parent.getAllStudentForTable();
            parent.$("#editModal").modal("hide");
          }, 1000);
        } else {
          errortoast("<b>" + data.message + "</b>");
        }
      })
      .catch((err) => console.log(err));
  } else {
    warningtoast("<b>Please check that no field is empty.</b>");
  }
}

function updateStudentProfileStatus(id) {
  if (!confirm("You are about to change this Student's profile status?")) {
    return 0;
  }
  // PUSH TO API
  warningtoast("<b>Processing ... Please wait</b>");
  fetch(ip + "/api/admin/update-student-profilestatus/" + id, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      toastr.remove();
      if (data.success) {
        successtoast("<b>" + data.message + "</b>");
        // setTimeout(function () {
        getAllStudentForTable();
        // }, 1000);
      } else {
        errortoast("<b>" + data.message + "</b>");
      }
    })
    .catch((err) => console.log(err));
}

function updateTranscriptAccess(id) {
  if (!confirm("You are about to change this Student's Transcript Access ?")) {
    return 0;
  }
  // PUSH TO API
  warningtoast("<b>Processing ... Please wait</b>");
  fetch(ip + "/api/admin/update-student-transcript-access/" + id, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      toastr.remove();
      if (data.success) {
        successtoast("<b>" + data.message + "</b>");
        // setTimeout(function () {
        getAllStudentForTranscript();
        // }, 1000);
      } else {
        errortoast("<b>" + data.message + "</b>");
      }
    })
    .catch((err) => console.log(err));
}

function deleteStudent(id) {
  if (!confirm("You are about to delete this Student ?")) {
    return 0;
  }
  warningtoast("<b>Processing ... Please wait</b>");
  fetch(ip + "/api/admin/delete-student/" + id, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      toastr.remove();
      if (data.success) {
        successtoast("<b>" + data.message + "</b>");
        // setTimeout(function () {
        getAllStudentForTable();
        // }, 1000);
      } else {
        errortoast("<b>" + data.message + "</b>");
      }
    })
    .catch((err) => console.log(err));
}

function searchStudent(search_data) {
  fetch(ip + "/api/admin/search-student/" + search_data, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      console.log(data);

      var c = 1;

      if (data.length > 0) {
        document.getElementById("student_table").innerHTML = ``;
        for (i in data) {
          if (c % 2 == 0) {
            if (data[i].profile_status == "ENABLED") {
              document.getElementById("student_table").innerHTML += `
            <tr class="even">
  
            <td>${c}.</td>
            <td>${data[i].student_id}</td>
            <td>${data[i].first_name + " " + data[i].last_name}</td>
            <td>${data[i].gender}</td>
            <td class="text-white"><span class="badge bg-success"><b>ENABLED</b></span></td>
             <td>${
               data[i].class == null ? `GRADUATED` : data[i].class.class_name
             }</td>
            <td>
            <a  onmouseover="viewStudent(${JSON.stringify(data[i])
              .replace(/'/g, "")
              .replace(
                /"/g,
                "'"
              )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                    data-bs-target="#viewModal"><i class="fas fa-eye"></i> View</a>
            <a  onmouseover="reloadEditFrame(); editStudent(${JSON.stringify(
              data[i]
            ).replace(
              /"/g,
              "'"
            )})" class="btn btn-warning" data-bs-toggle="modal"
            data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>

            
            <a  onclick="updateStudentProfileStatus(${
              data[i].id
            })" class="btn gradient-orange-peel"><i
                class="fas fa-lock"></i> Disable</a>  

            <a  onclick="viewStudentIDCard(${JSON.stringify(data[i])
              .replace(/'/g, "")
              .replace(/"/g, "'")})" class="btn btn-secondary text-white"><i
                        class="fas fa-id-card"></i>
                    ID Card</a> 
            
            <a  onclick="deleteStudent(${
              data[i].id
            })" class="btn btn-danger text-white"><i
                        class="fas fa-trash"></i>
                    Delete</a>
            </td>
  
        <tr>`;
            } else {
              document.getElementById("student_table").innerHTML += `
            <tr class="even">
  
            <td>${c}.</td>
            <td>${data[i].student_id}</td>
            <td>${data[i].first_name + " " + data[i].last_name}</td>
            <td>${data[i].gender}</td>
            <td class="text-white"><span class="badge bg-danger"><b>DISABLED</b></span></td>
             <td>${
               data[i].class == null ? `GRADUATED` : data[i].class.class_name
             }</td>
            <td>
            <a  onmouseover="viewStudent(${JSON.stringify(data[i])
              .replace(/'/g, "")
              .replace(
                /"/g,
                "'"
              )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                    data-bs-target="#viewModal"><i class="fas fa-eye"></i> View</a>
            <a  onmouseover="reloadEditFrame(); editStudent(${JSON.stringify(
              data[i]
            ).replace(
              /"/g,
              "'"
            )})" class="btn btn-warning" data-bs-toggle="modal"
            data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>

            
            <a  onclick="updateStudentProfileStatus(${
              data[i].id
            })" href="#" class="btn gradient-orange-peel"><i class="fas fa-unlock-alt"></i> Enable</a>  

            <a  onclick="viewStudentIDCard(${JSON.stringify(data[i])
              .replace(/'/g, "")
              .replace(/"/g, "'")})" class="btn btn-secondary text-white"><i
                        class="fas fa-id-card"></i>
                    ID Card</a> 
            
            <a  onclick="deleteStudent(${
              data[i].id
            })" class="btn btn-danger text-white"><i
                        class="fas fa-trash"></i>
                    Delete</a>
            </td>
  
        <tr>`;
            }
          } else {
            if (data[i].profile_status == "ENABLED") {
              document.getElementById("student_table").innerHTML += `
            <tr class="odd">
  
            <td>${c}.</td>
            <td>${data[i].student_id}</td>
            <td>${data[i].first_name + " " + data[i].last_name}</td>
            <td>${data[i].gender}</td>
            <td class="text-white"><span class="badge bg-success"><b>ENABLED</b></span></td>
             <td>${
               data[i].class == null ? `GRADUATED` : data[i].class.class_name
             }</td>
            <td>
            <a  onmouseover="viewStudent(${JSON.stringify(data[i])
              .replace(/'/g, "")
              .replace(
                /"/g,
                "'"
              )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                    data-bs-target="#viewModal"><i class="fas fa-eye"></i> View</a>
            <a  onmouseover="reloadEditFrame(); editStudent(${JSON.stringify(
              data[i]
            ).replace(
              /"/g,
              "'"
            )})" class="btn btn-warning" data-bs-toggle="modal"
            data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>

            
            <a  onclick="updateStudentProfileStatus(${
              data[i].id
            })" href="#" class="btn gradient-orange-peel"><i
                class="fas fa-lock"></i> Disable</a>  

            <a  onclick="viewStudentIDCard(${JSON.stringify(data[i])
              .replace(/'/g, "")
              .replace(/"/g, "'")})" class="btn btn-secondary text-white"><i
                        class="fas fa-id-card"></i>
                    ID Card</a> 
            
            <a  onclick="deleteStudent(${
              data[i].id
            })" class="btn btn-danger text-white"><i
                        class="fas fa-trash"></i>
                    Delete</a>
            </td>
  
        <tr>`;
            } else {
              document.getElementById("student_table").innerHTML += `
            <tr class="odd">
  
            <td>${c}.</td>
            <td>${data[i].student_id}</td>
            <td>${data[i].first_name + " " + data[i].last_name}</td>
            <td>${data[i].gender}</td>
            <td class="text-white"><span class="badge bg-danger"><b>DISABLED</b></span></td>
             <td>${
               data[i].class == null ? `GRADUATED` : data[i].class.class_name
             }</td>
            <td>
            <a  onmouseover="viewStudent(${JSON.stringify(data[i])
              .replace(/'/g, "")
              .replace(
                /"/g,
                "'"
              )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                    data-bs-target="#viewModal"><i class="fas fa-eye"></i> View</a>
            <a  onmouseover="reloadEditFrame(); editStudent(${JSON.stringify(
              data[i]
            ).replace(
              /"/g,
              "'"
            )})" class="btn btn-warning" data-bs-toggle="modal"
            data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>

            
            <a  onclick="updateStudentProfileStatus(${
              data[i].id
            })" href="#" class="btn gradient-orange-peel"><i class="fas fa-unlock-alt"></i> Enable</a>  

            <a  onclick="viewStudentIDCard(${JSON.stringify(data[i])
              .replace(/'/g, "")
              .replace(/"/g, "'")})" class="btn btn-secondary text-white"><i
                        class="fas fa-id-card"></i>
                    ID Card</a> 
            
            <a  onclick="deleteStudent(${
              data[i].id
            })" class="btn btn-danger text-white"><i
                        class="fas fa-trash"></i>
                    Delete</a>
            </td>
  
        <tr>`;
            }
          }

          c = c + 1;
        }
      } else {
        errortoast("<b>Student not found</b>");
      }
    })
    .catch((err) => console.log(err));
}

function viewStudentIDCard(data) {
  localStorage.setItem("student_id_card", JSON.stringify(data));
  window.parent.location.assign(domain + "/admin/student-id-card.html");
}

function viewStaffIDCard(data) {
  localStorage.setItem("staff_id_card", JSON.stringify(data));
  window.parent.location.assign(domain + "/admin/staff-id-card.html");
}

function uploadImage1(image, student_id) {
  const formData = new FormData();

  formData.append("file", image);
  formData.append("id", student_id);
  formData.append("type", "STUDENT");

  // Select your input type file and store it in a variable

  // This will upload the file after having read it
  return fetch(ip + "/api/admin/upload-image", {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: formData,
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      toastr.remove();
      if (data.success) {
        toastr.remove();
        successtoast("<b>" + student_id + " was created successfully. </b>");
        setTimeout(function () {
          parent.getAllStudentForTable();
          parent.$("#modalYT").modal("hide");
        }, 1000);
      } else {
        errortoast("<b>" + data.message + "</b>");
      }
    })
    .catch((err) => console.log(err));
  // // Event handler executed when a file is selected
  // const onSelectFile = () => upload(input.files[0]);

  // // Add a listener on your input
  // // It will be triggered when a file will be selected
  // input.addEventListener("change", onSelectFile, false);
}

// DUAL TYPE UPLOAD (MAIN)
function uploadImage(type) {
  console.log("TYPE : " + type);
  // CHECK IMAGE
  const input = document.getElementById("imageUpload");
  console.log(input.files);
  image = input.files;

  if (image.length < 1) {
    return alert("Please select image !");
  }

  warningtoast("Uploading ... Please wait");
  const formData = new FormData();

  var id = "";

  if (type == "STUDENT") {
    id = JSON.parse(localStorage["editStudent"]).student_id;
  } else {
    id = JSON.parse(localStorage["editTeacher"]).teacher_id;
  }

  formData.append("file", image[0]);
  formData.append("id", id);
  formData.append("type", type);

  // This will upload the file after having read it
  return fetch(ip + "/api/admin/upload-image", {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: formData,
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      toastr.remove();
      if (data.success) {
        toastr.remove();
        successtoast("<b>" + data.message + "</b>");
        setTimeout(function () {
          if (type == "STUDENT") {
            parent.getAllStudentForTable();
          } else {
            parent.getAllTeacherForTable();
          }
          parent.$("#modalYT").modal("hide");
        }, 1000);
      } else {
        errortoast("<b>" + data.message + "</b>");
      }
    })
    .catch((err) => console.log(err));
}

// STUDENT ID CARD
async function getStudentIDCard() {
  await getSchoolDetails();
  student_id = localStorage["student_id_card"];

  // GET SCHOOL NAME
  document.getElementById("school_name").innerHTML =
    localStorage["SCHOOL_NAME"];

  // IMAGE URL
  url =
    domain +
    "/backend/storage/app/public/fileupload/student/" +
    JSON.parse(student_id).student_id +
    ".png";

  // STUDENT_IMAGE
  document.getElementById("user_image").src = url;

  document.getElementById("type").innerHTML = "STUDENT";

  // MINI SCHOOL LOGO
  school_logo_mini =
    domain + "/backend/storage/app/public/fileupload/school_logo_mini.png";
  document.getElementById("school_logo_mini").src = school_logo_mini;

  // FILL CARD DETAILS
  document.getElementById("full_name").innerHTML =
    JSON.parse(student_id).first_name + " " + JSON.parse(student_id).last_name;

  document.getElementById("id").innerHTML = JSON.parse(student_id).student_id;

  document.getElementById("gender").innerHTML = JSON.parse(student_id).gender;

  document.getElementById("school_address").innerHTML =
    localStorage["SCHOOL_ADDRESS"];

  //StudentATDCard~id~class_id~first_name
  var qrcode = new QRCode("IDQR", {
    text:
      "StudentATDCard~" +
      JSON.parse(student_id).id +
      "~" +
      JSON.parse(student_id).class.id +
      "~" +
      JSON.parse(student_id).first_name,
    width: 128,
    height: 128,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });
}

// STAFF ID CARD
async function getStaffIDCard() {
  await getSchoolDetails();
  staff_id = localStorage["staff_id_card"];

  // GET SCHOOL NAME
  document.getElementById("school_name").innerHTML =
    localStorage["SCHOOL_NAME"];

  // IMAGE URL
  url =
    domain +
    "/backend/storage/app/public/fileupload/staff/" +
    JSON.parse(staff_id).teacher_id +
    ".png";

  // staff_IMAGE
  document.getElementById("user_image").src = url;

  document.getElementById("type").innerHTML = "STAFF";

  // MINI SCHOOL LOGO
  school_logo_mini =
    domain + "/backend/storage/app/public/fileupload/school_logo_mini.png";
  document.getElementById("school_logo_mini").src = school_logo_mini;

  // FILL CARD DETAILS
  document.getElementById("full_name").innerHTML =
    JSON.parse(staff_id).first_name + " " + JSON.parse(staff_id).last_name;

  document.getElementById("id").innerHTML = JSON.parse(staff_id).teacher_id;

  document.getElementById("gender").innerHTML = JSON.parse(staff_id).gender;

  document.getElementById("school_address").innerHTML =
    localStorage["SCHOOL_ADDRESS"];

  //TeacherATDCard~id~first_name
  var qrcode = new QRCode("IDQR", {
    text:
      "TeacherATDCard~" +
      JSON.parse(staff_id).id +
      "~" +
      JSON.parse(staff_id).first_name,
    width: 128,
    height: 128,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });
}

// CLASS
function getAllClassForTable() {
  fetch(ip + "/api/admin/all-class", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    // body: JSON.stringify({
    //   // organisation_email: email,
    //   // password: pass,
    // }),
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      console.log(data);
      document.getElementById("class_table").innerHTML = ``;
      var c = 1;
      for (i in data) {
        if (data[i].class_teacher != null) {
          document.getElementById("class_table").innerHTML += `
            <tr class='${c % 2 == 0 ? "even" : "odd"}'>
            <td>${c}.</td>
            <td>${data[i].class_name}</td>
            <td>${data[i].class_sector}</td>
            <td>${
              data[i].class_teacher.title +
              " " +
              data[i].class_teacher.first_name +
              " " +
              data[i].class_teacher.last_name
            }</td>
            <td>${data[i].student_no}</td>
            <td>
            <a  onmouseover="reloadEditFrame();localStorage.setItem('editClass','${
              data[i].id
            }~${data[i].class_name}~${
            data[i].class_teacher.title +
            " " +
            data[i].class_teacher.first_name +
            " " +
            data[i].class_teacher.last_name
          }~${data[i].class_teacher.id}~${
            data[i].class_sector
          }')" class="btn btn-warning" data-bs-toggle="modal"
            data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
               <!-- <a  onclick="deleteClass(${
                 data[i].id
               })" class="btn btn-danger text-white"><i
                        class="fas fa-trash"></i>
                    Delete</a> -->
            </td>
  
        </tr>`;
        } else {
          document.getElementById("class_table").innerHTML += `
            <tr class='${c % 2 == 0 ? "even" : "odd"}'>
            <td>${c}.</td>
            <td>${data[i].class_name}</td>
            <td>${data[i].class_sector}</td>
            <td class="text-white"><span class="badge bg-danger"><b>TEACHER NOT ASSIGNED</b></span></td>
            <td>${data[i].student_no}</td>
            <td>
            <a  onmouseover="reloadEditFrame();localStorage.setItem('editClass','${
              data[i].id
            }~${data[i].class_name}~~~${
            data[i].class_sector
          }')" class="btn btn-warning" data-bs-toggle="modal"
            data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
                <!-- <a  onclick="deleteClass(${
                  data[i].id
                })" class="btn btn-danger text-white"><i
                        class="fas fa-trash"></i>
                    Delete</a> -->
            </td>
  
        </tr>`;
        }

        c = c + 1;
      }
      paginateTable();
    })
    .catch((err) => console.log(err));
}

function getAllClassForDropDown() {
  openSpinnerModal("Fetch class");
  fetch(ip + "/api/admin/all-class", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        //  window.parent.location.assign(domain +"/admin/");
      }
      return res.json();
    })

    .then((data) => {
      removeSpinnerModal();
      if (data.length > 0) {
        for (i in data) {
          document.getElementById(
            "classes"
          ).innerHTML += `<option value="${data[i].id}">${data[i].class_name}</option>`;
        }
      }
    })
    .catch((err) => console.log(err));
}

function editClass(id, class_name, class_teacher) {
  console.log("STORED...");
  localStorage.setItem(
    "editClass",
    id + "~" + class_name + "~" + class_teacher
  );
}

function editClassDetails() {
  console.log(localStorage["editClass"]);
  localStorage["editClass"].split("~");
  document.getElementById("class_name").value =
    localStorage["editClass"].split("~")[1];

  document.getElementById("class_teacher").innerHTML =
    localStorage["editClass"].split("~")[2] == ""
      ? `<option value="-">Please Select Teacher *</option>`
      : `<option value="${localStorage["editClass"].split("~")[3]}">${
          localStorage["editClass"].split("~")[2]
        }</option>`;

  document.getElementById("class_sector").innerHTML =
    `<option value="${localStorage["editClass"].split("~")[4]}">${
      localStorage["editClass"].split("~")[4]
    }</option>` + document.getElementById("class_sector").innerHTML;
}

function createClass() {
  var class_name = document.getElementById("class_name").value;
  var class_sector = document.getElementById("class_sector").value;
  var class_teacher = document.getElementById("class_teacher").value;
  if (class_name != "" && class_sector != "") {
    // PUSH TO API
    warningtoast("<b>Processing ... Please wait</b>");
    fetch(ip + "/api/admin/create-class", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage["token"],
      },
      body: JSON.stringify({
        class_name: class_name,
        class_sector: class_sector,
        class_teacher: class_teacher,
      }),
    })
      .then(function (res) {
        console.log(res.status);
        if (res.status == 401) {
          openAuthenticationModal();
        }
        return res.json();
      })

      .then((data) => {
        toastr.remove();
        if (data.success) {
          successtoast("<b>" + data.message + "</b>");
          setTimeout(function () {
            parent.getAllClassForTable();
            parent.$("#modalYT").modal("hide");
          }, 1000);
        } else {
          errortoast("<b>" + data.message + "</b>");
        }
      })
      .catch((err) => console.log(err));
  } else {
    warningtoast("<b>Please check that no field is empty.</b>");
  }
}

function updateClass() {
  var class_name = document.getElementById("class_name").value;
  var class_sector = document.getElementById("class_sector").value;
  var class_teacher = document.getElementById("class_teacher").value;
  if (class_name != "" && class_sector != "") {
    // PUSH TO API
    warningtoast("<b>Processing ... Please wait</b>");
    fetch(ip + "/api/admin/edit-class", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage["token"],
      },
      body: JSON.stringify({
        class_id: localStorage["editClass"].split("~")[0],
        class_name: class_name,
        class_sector: class_sector,
        class_teacher: class_teacher,
      }),
    })
      .then(function (res) {
        console.log(res.status);
        if (res.status == 401) {
          openAuthenticationModal();
        }
        return res.json();
      })

      .then((data) => {
        toastr.remove();
        if (data.success) {
          successtoast("<b>" + data.message + "</b>");
          setTimeout(function () {
            parent.getAllClassForTable();
            parent.$("#editModal").modal("hide");
          }, 1000);
        } else {
          errortoast("<b>" + data.message + "</b>");
        }
      })
      .catch((err) => console.log(err));
  } else {
    warningtoast("<b>Please check that no field is empty.</b>");
  }
}

function deleteClass(class_id) {
  if (!confirm("You are about to delete this class ?")) {
    return 0;
  }
  warningtoast("<b>Processing ... Please wait</b>");
  fetch(ip + "/api/admin/delete-class/" + class_id, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      toastr.remove();
      if (data.success) {
        successtoast("<b>" + data.message + "</b>");
        setTimeout(function () {
          location.reload();
        }, 1000);
      } else {
        errortoast("<b>" + data.message + "</b>");
      }
    })
    .catch((err) => console.log(err));
}

function searchClass(class_name) {
  fetch(ip + "/api/admin/search-class/" + class_name, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      console.log(data);

      var c = 1;

      if (data.length > 0) {
        document.getElementById("class_table").innerHTML = ``;
        for (i in data) {
          if (c % 2 == 0) {
            if (data[i].class_teacher != null) {
              document.getElementById("class_table").innerHTML += `
              <tr class="even">
    
              <td>${c}.</td>
              <td>${data[i].class_name}</td>
              <td>${
                data[i].class_teacher.title +
                " " +
                data[i].class_teacher.first_name +
                " " +
                data[i].class_teacher.last_name
              }</td>
              <td>${data[i].student_no}</td>
              <td>
              <a  onmouseover="reloadEditFrame();localStorage.setItem('editClass','${
                data[i].id
              }~${data[i].class_name}~${
                data[i].class_teacher.title +
                " " +
                data[i].class_teacher.first_name +
                " " +
                data[i].class_teacher.last_name
              }~${
                data[i].class_teacher.id
              }')" class="btn btn-warning" data-bs-toggle="modal"
              data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
                  <a  onclick="deleteClass(${
                    data[i].id
                  })" class="btn btn-danger text-white"><i
                          class="fas fa-trash"></i>
                      Delete</a>
              </td>
    
          <tr>`;
            } else {
              document.getElementById("class_table").innerHTML += `
              <tr class="even">
    
              <td>${c}.</td>
              <td>${data[i].class_name}</td>
              <td class="text-white"><span class="badge bg-danger"><b>TEACHER NOT ASSIGNED</b></span></td>
              <td>${data[i].student_no}</td>
              <td>
              <a  onmouseover="reloadEditFrame();localStorage.setItem('editClass','${data[i].id}~${data[i].class_name}~')" class="btn btn-warning" data-bs-toggle="modal"
              data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
                  <a  onclick="deleteClass(${data[i].id})" class="btn btn-danger text-white"><i
                          class="fas fa-trash"></i>
                      Delete</a>
              </td>
    
          <tr>`;
            }
          } else {
            if (data[i].class_teacher != null) {
              document.getElementById("class_table").innerHTML += `
              <tr class="odd">
    
              <td>${c}.</td>
              <td>${data[i].class_name}</td>
              <td>${
                data[i].class_teacher.title +
                " " +
                data[i].class_teacher.first_name +
                " " +
                data[i].class_teacher.last_name
              }</td>
              <td>${data[i].student_no}</td>
              <td>
              <a  onmouseover="reloadEditFrame();localStorage.setItem('editClass','${
                data[i].id
              }~${data[i].class_name}~${
                data[i].class_teacher.title +
                " " +
                data[i].class_teacher.first_name +
                " " +
                data[i].class_teacher.last_name
              }~${
                data[i].class_teacher.id
              }')" class="btn btn-warning" data-bs-toggle="modal"
              data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
                  <a  onclick="deleteClass(${
                    data[i].id
                  })" class="btn btn-danger text-white"><i
                          class="fas fa-trash"></i>
                      Delete</a>
              </td>
    
          <tr>`;
            } else {
              document.getElementById("class_table").innerHTML += `
              <tr class="odd">
    
              <td>${c}.</td>
              <td>${data[i].class_name}</td>
              <td class="text-white"><span class="badge bg-danger"><b>TEACHER NOT ASSIGNED</b></span></td>
              <td>${data[i].student_no}</td>
              <td>
                  <a  onmouseover="reloadEditFrame();localStorage.setItem('editClass','${data[i].id}~${data[i].class_name}~')" class="btn btn-warning" data-bs-toggle="modal"
                      data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
                  <a  onclick="deleteClass(${data[i].id})" class="btn btn-danger text-white"><i
                          class="fas fa-trash"></i>
                      Delete</a>
              </td>
    
          <tr>`;
            }
          }

          c = c + 1;
        }
      } else {
        errortoast("<b>Class not found</b>");
      }
    })
    .catch((err) => console.log(err));
}

// SUBJECT
function createSubject() {
  var subject_name = document.getElementById("subject_name").value;
  var class_id = document.getElementById("classes").value;
  var teacher = document.getElementById("teacher").value;
  if (subject_name != "" && class_id != "") {
    // PUSH TO API
    warningtoast("<b>Processing ... Please wait</b>");
    fetch(ip + "/api/admin/create-subject", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage["token"],
      },
      body: JSON.stringify({
        class_id: class_id,
        subject_name: subject_name,
        teacher: teacher,
      }),
    })
      .then(function (res) {
        console.log(res.status);
        if (res.status == 401) {
          openAuthenticationModal();
        }
        return res.json();
      })

      .then((data) => {
        toastr.remove();
        if (data.success) {
          successtoast("<b>" + data.message + "</b>");
          setTimeout(function () {
            parent.getAllSubjectForTable();
            parent.$("#modalYT").modal("hide");
          }, 1000);
        } else {
          errortoast("<b>" + data.message + "</b>");
        }
      })
      .catch((err) => console.log(err));
  } else {
    warningtoast("<b>Please check that compulsory field is not empty.</b>");
  }
}
function getAllSubjectForTable() {
  fetch(ip + "/api/admin/all-subject", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })
    .then((data) => {
      console.log("DEBUG =>   RESULT: " + data);
      document.getElementById("subject_table").innerHTML = ``;
      var c = 1;
      for (i in data) {
        if (data[i].teacher != null) {
          console.log("DEBUG not null: " + data[i].teacher);
          console.log(data[i].teacher);
          document.getElementById("subject_table").innerHTML += `
            <tr class='${c % 2 == 0 ? "even" : "odd"}'>
  
            <td>${c}.</td>
            <td>${data[i].subject_name}</td>
             <td>${
               data[i].class == null ? `GRADUATED` : data[i].class.class_name
             }</td>
            <td>${
              data[i].teacher.title +
              " " +
              data[i].teacher.first_name +
              " " +
              data[i].teacher.last_name
            }</td>
            <td>${data[i].student_no}</td>

            <td>
            <a  onmouseover="reloadEditFrame();localStorage.setItem('editSubject','${
              data[i].id
            }~${data[i].subject_name}~${
            data[i].teacher.title +
            " " +
            data[i].teacher.first_name +
            " " +
            data[i].teacher.last_name
          }~${data[i].teacher.id}~${data[i].class.class_name}~${
            data[i].class.id
          }')" class="btn btn-warning" data-bs-toggle="modal"
            data-bs-target="#editModal"><i class="fas fa-edit"></i></a>

           <!-- <a  onclick="deleteSubject(${
             data[i].id
           })" class="btn btn-danger text-white"><i
                    class="fa fa-trash"></i></a> -->

            <a  onclick="exportSubjectSheet('${data[i].id}','${
            data[i].subject_name
          }','${data[i].class.class_name}'
            )" class="btn btn-primary text-white">
                <i class="fas fa-file-download"></i></a>       

            <a  onclick="uploadResultSheet(${
              data[i].id
            })" class="btn btn-success text-white">
                <i class="fas fa-file-upload"></i></a>   
                     
            </td>
  
        </tr>`;
        } else {
          console.log("DEBUG null: " + data[i].teacher);
          console.log(data[i].teacher);
          document.getElementById("subject_table").innerHTML += `
            <tr class='${c % 2 == 0 ? "even" : "odd"}'>
  
            <td>${c}.</td>
            <td>${data[i].subject_name}</td>
             <td>${
               data[i].class == null ? `GRADUATED` : data[i].class.class_name
             }</td>
            <td class="text-white"><span class="badge bg-danger"><b>TEACHER NOT ASSIGNED</b></span></td>
            <td>${data[i].student_no}</td>
            <td>
            <a  onmouseover="reloadEditFrame();localStorage.setItem('editSubject','${
              data[i].id
            }~${data[i].subject_name}~null~null~${data[i].class.class_name}~${
            data[i].class.id
          }')" class="btn btn-warning" data-bs-toggle="modal"
            data-bs-target="#editModal"><i class="btn btn-warning" data-bs-toggle="modal"
            data-bs-target="#editModal"><i class="fas fa-edit"></i></a>

            <a  onclick="deleteSubject(${
              data[i].id
            })" class="btn btn-danger text-white"><i
                    class="fa fa-trash"></i></a>

            <a  onclick="downloadResultSheet(${
              data[i].id
            })" class="btn btn-primary text-white">
                <i class="fas fa-file-download"></i></a>       

            <a  onclick="uploadResultSheet(${
              data[i].id
            })" class="btn btn-success text-white">
                <i class="fas fa-file-upload"></i></a>   
                     
            </td>
  
        </tr>`;
        }

        c = c + 1;
      }
      paginateTable();
    })
    .catch((err) => console.log(err));
}
function editSubject(id, subject_name, class_id, teacher) {
  console.log("STORED...");
  localStorage.setItem(
    "editSubject",
    id + "~" + subject_name + "~" + class_id + "~" + teacher
  );
}

function editSubjectDetails() {
  //  1~ENGLISH LANGUAGE~MISS Caitlyn Hoppe~3~JSS 1A~1
  // 2~MATHEMACTICS~ ~ ~JSS 1A~1
  console.log(localStorage["editSubject"]);
  localStorage["editSubject"].split("~");
  document.getElementById("subject_name").value =
    localStorage["editSubject"].split("~")[1];

  // FOR TEACHER
  document.getElementById("teacher").innerHTML =
    localStorage["editSubject"].split("~")[2] == "null"
      ? `<option value="-">Please Select Teacher *</option>`
      : `<option value="${localStorage["editSubject"].split("~")[3]}">${
          localStorage["editSubject"].split("~")[2]
        }</option>`;

  // FOR CLASS
  document.getElementById("class").innerHTML =
    localStorage["editSubject"].split("~")[4] == ""
      ? document.getElementById("class").innerHTML
      : `<option value="${localStorage["editSubject"].split("~")[5]}">${
          localStorage["editSubject"].split("~")[4]
        }</option>`;
}

function updateSubject() {
  var subject_name = document.getElementById("subject_name").value;
  var class_id = document.getElementById("classes").value;
  var teacher = document.getElementById("teacher").value;
  if (subject_name != "" && class_id != "") {
    // PUSH TO API
    warningtoast("<b>Processing ... Please wait</b>");
    fetch(ip + "/api/admin/edit-subject", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage["token"],
      },
      body: JSON.stringify({
        subject_id: localStorage["editSubject"].split("~")[0],
        class_id: class_id,
        subject_name: subject_name,
        teacher: teacher,
      }),
    })
      .then(function (res) {
        console.log(res.status);
        if (res.status == 401) {
          openAuthenticationModal();
        }
        return res.json();
      })

      .then((data) => {
        toastr.remove();
        if (data.success) {
          successtoast("<b>" + data.message + "</b>");
          setTimeout(function () {
            parent.getAllSubjectForTable();
            parent.$("#editModal").modal("hide");
          }, 1000);
        } else {
          errortoast("<b>" + data.message + "</b>");
        }
      })
      .catch((err) => console.log(err));
  } else {
    warningtoast("<b>Please check that compulsory field is not empty.</b>");
  }
}

function deleteSubject(subject_id) {
  if (!confirm("You are about to delete this subject ?")) {
    return 0;
  }
  warningtoast("<b>Processing ... Please wait</b>");
  fetch(ip + "/api/admin/delete-subject/" + subject_id, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      toastr.remove();
      if (data.success) {
        successtoast("<b>" + data.message + "</b>");
        setTimeout(function () {
          location.reload();
        }, 1000);
      } else {
        errortoast("<b>" + data.message + "</b>");
      }
    })
    .catch((err) => console.log(err));
}

function searchSubject(subject_name) {
  fetch(ip + "/api/admin/search-subject/" + subject_name, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      console.log(data);

      var c = 1;

      if (data.length > 0) {
        document.getElementById("subject_table").innerHTML = ``;
        for (i in data) {
          if (c % 2 == 0) {
            if (data[i].teacher != null) {
              console.log("DEBUG not null: " + data[i].teacher);
              console.log(data[i].teacher);
              document.getElementById("subject_table").innerHTML += `
              <tr class="even">
    
              <td>${c}.</td>
              <td>${data[i].subject_name}</td>
               <td>${
                 data[i].class == null ? `GRADUATED` : data[i].class.class_name
               }</td>
              <td>${
                data[i].teacher.title +
                " " +
                data[i].teacher.first_name +
                " " +
                data[i].teacher.last_name
              }</td>
              <td>${data[i].student_no}</td>
              <td>
              <a  onmouseover="reloadEditFrame();localStorage.setItem('editSubject','${
                data[i].id
              }~${data[i].subject_name}~${
                data[i].teacher.title +
                " " +
                data[i].teacher.first_name +
                " " +
                data[i].teacher.last_name
              }~${data[i].teacher.id}~${data[i].class.class_name}~${
                data[i].class.id
              }')" class="btn btn-warning" data-bs-toggle="modal"
              data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
                  <a  onclick="deleteSubject(${
                    data[i].id
                  })" class="btn btn-danger text-white"><i
                          class="fas fa-trash"></i>
                      Delete</a>
              </td>
    
          <tr>`;
            } else {
              console.log("DEBUG null: " + data[i].teacher);
              console.log(data[i].teacher);
              document.getElementById("subject_table").innerHTML += `
              <tr class="even">
    
              <td>${c}.</td>
              <td>${data[i].subject_name}</td>
               <td>${
                 data[i].class == null ? `GRADUATED` : data[i].class.class_name
               }</td>
              <td class="text-white"><span class="badge bg-danger"><b>TEACHER NOT ASSIGNED</b></span></td>
              <td>${data[i].student_no}</td>
              <td>
              <a  onmouseover="reloadEditFrame();localStorage.setItem('editSubject','${
                data[i].id
              }~${data[i].subject_name}~ ~ ~${data[i].class.class_name}~${
                data[i].class.id
              }')" class="btn btn-warning" data-bs-toggle="modal"
              data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
                  <a  onclick="deleteClass(${
                    data[i].id
                  })" class="btn btn-danger text-white"><i
                          class="fas fa-trash"></i>
                      Delete</a>
              </td>
    
          <tr>`;
            }
          } else {
            if (data[i].teacher != null) {
              document.getElementById("subject_table").innerHTML += `
              <tr class="odd">
    
              <td>${c}.</td>
              <td>${data[i].subject_name}</td>
               <td>${
                 data[i].class == null ? `GRADUATED` : data[i].class.class_name
               }</td>
              <td>${
                data[i].teacher.title +
                " " +
                data[i].teacher.first_name +
                " " +
                data[i].teacher.last_name
              }</td>
              <td>${data[i].student_no}</td>
              <td>
              <a  onmouseover="reloadEditFrame();localStorage.setItem('editSubject','${
                data[i].id
              }~${data[i].subject_name}~${
                data[i].teacher.title +
                " " +
                data[i].teacher.first_name +
                " " +
                data[i].teacher.last_name
              }~${data[i].teacher.id}~${data[i].class.class_name}~${
                data[i].class.id
              }')" class="btn btn-warning" data-bs-toggle="modal"
              data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
                  <a  onclick="deleteSubject(${
                    data[i].id
                  })" class="btn btn-danger text-white"><i
                          class="fas fa-trash"></i>
                      Delete</a>
              </td>
    
          <tr>`;
            } else {
              document.getElementById("subject_table").innerHTML += `
              <tr class="odd">
    
              <td>${c}.</td>
              <td>${data[i].subject_name}</td>
               <td>${
                 data[i].class == null ? `GRADUATED` : data[i].class.class_name
               }</td>
              <td class="text-white"><span class="badge bg-danger"><b>TEACHER NOT ASSIGNED</b></span></td>
              <td>${data[i].student_no}</td>
              <td>
                  <a  onmouseover="reloadEditFrame();localStorage.setItem('editSubject','${
                    data[i].id
                  }~${data[i].subject_name}~ ~ ~${data[i].class.class_name}~${
                data[i].class.id
              }')" class="btn btn-warning" data-bs-toggle="modal"
                      data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
                  <a  onclick="deleteSubject(${
                    data[i].id
                  })" class="btn btn-danger text-white"><i
                          class="fas fa-trash"></i>
                      Delete</a>
              </td>
    
          <tr>`;
            }
          }

          c = c + 1;
        }
      } else {
        errortoast("<b>Subject not found</b>");
      }
    })
    .catch((err) => console.log(err));
}

function exportSubjectSheet(subject_id, subject_name, class_name) {
  // PUSH TO API
  warningtoast("<b>Processing ... Please wait</b>");
  fetch(ip + "/api/admin/subject/export-sheet", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      subject_id: subject_id,
      session: localStorage["current_session"],
      subject_name: subject_name,
      class_name: class_name,
      term: localStorage["current_term"],
    }),
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.blob();
    })

    .then((blob) => {
      var url = window.URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download =
        subject_name +
        "_" +
        class_name +
        "_" +
        localStorage["current_session"] +
        "_" +
        localStorage["current_term"] +
        ".xlsx";
      document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
      a.click();
      a.remove(); //afterwards we remove the element again
    })
    .catch((err) => console.log(err));
}

function importSubjectSheet() {}

function getPreviousSubjectRegistration(student_id, class_id, session, term) {
  registered_subject = [];
  fetch(ip + "/api/student/registered-subject-id", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      student_id: student_id,
      class: class_id,
      session: session,
      term: term,
    }),
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        removeSpinnerModal();
        openAuthenticationModal();
        return 0;
      }
      return res.json();
    })

    .then((data) => {
      data.forEach((i) => {
        registered_subject.push(i);
      });

      document.getElementById("number_registered").innerHTML =
        "Total registered: " + registered_subject.length;
    })
    .catch((err) => console.log(err));

  return registered_subject;
}

function getAllSubjectForRegistration() {
  openSpinnerModal("Fetch subject to register for student");
  student_id = document.getElementById("student").value;
  class_id = document.getElementById("classes").value;
  session = document.getElementById("session_term").value.split("-")[0];
  term = document.getElementById("session_term").value.split("-")[1];

  registered_subject = [];
  registered_subject = getPreviousSubjectRegistration(
    student_id,
    class_id,
    session,
    term
  );

  var c = 1;
  // GET REGISTERED SUBJECT
  fetch(ip + "/api/student/registered-subject", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      student_id: student_id,
      class: class_id,
      session: session,
      term: term,
    }),
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        removeSpinnerModal();
        openAuthenticationModal();
        return 0;
      }
      return res.json();
    })

    .then((data) => {
      removeSpinnerModal();
      document.getElementById("subject_table").innerHTML = ``;

      // FIRST POPULATE COMPULSORY AND ELECTIVE REGISTERED FOR THE STUDENT
      for (i in data) {
        if (data[i].subject_type == "COMPULSORY") {
          document.getElementById("subject_table").innerHTML += `
            <tr>
    
                  <td><input type="checkbox" class="form-check-input ml-0" name="subject_registration"
                  value="${data[i].subject_id}" checked  onclick="this.checked = !this.checked">
                  </td>
    
                  <td>${c}.</td>
                  <td> <small><i class="fa fa-star" aria-hidden="true"></i></small> ${data[i].subject_name}</td>
                  <td>${data[i].subject_type}</td>
                  <td>${data[i].teacher}</td>
                  
               
                  
        
              </tr>`;
        } else {
          document.getElementById("subject_table").innerHTML += `
            <tr>
    
                  <td><input type="checkbox" class="form-check-input ml-0" name="subject_registration_elective"
                  value="${data[i].subject_id}" checked ">
                  </td>
    
                  <td>${c}.</td>
                  <td> <small><i class="fa fa-shapes" aria-hidden="true"></i></small> ${data[i].subject_name}</td>
                  <td>${data[i].subject_type}</td>
                  <td>${data[i].teacher}</td>
                  
               
                  
        
              </tr>`;
        }

        c = c + 1;
      }

      // NOW GET ELECTIVE SUBJECT
      fetch(ip + "/api/admin/all-subject", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: "Bearer " + localStorage["token"],
        },
      })
        .then(function (res) {
          console.log(res.status);
          if (res.status == 401) {
            openAuthenticationModal();
          }
          return res.json();
        })

        .then((data) => {
          for (i in data) {
            if (registered_subject.includes(data[i].id.toString())) {
              continue;
            }
            if (data[i].class.id != class_id) {
              continue;
            }
            document.getElementById("subject_table").innerHTML += `
                <tr>
        
                      <td><input type="checkbox" class="form-check-input ml-0" name="subject_registration_elective"
                      value="${data[i].id}">
                      </td>
        
                      <td>${c}.</td>
                      <td><i class="fa fa-shapes"></i> ${
                        data[i].subject_name
                      }</td>
                      <td>ELECTIVE</td>
                      <td>${
                        data[i].teacher.title +
                        " " +
                        data[i].teacher.first_name +
                        " " +
                        data[i].teacher.last_name
                      }</td>
                      
                      
            
                  </tr>`;

            c = c + 1;
          }

          table = document.getElementById("subject_table");
          if (table.rows.length == 0) {
            document.getElementById("subject_table").innerHTML = `
              <tr>
                  <td colspan="12">
                      <center>No subject registered</center>
                  </td>
              </tr>
            `;
          }
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}

function registerSubject() {
  student_id = document.getElementById("student").value;
  class_id = document.getElementById("classes").value;
  session = document.getElementById("session_term").value.split("-")[0];
  term = document.getElementById("session_term").value.split("-")[1];
  var subject_to_register = [];

  var selected_subject = document.getElementsByName(
    "subject_registration_elective"
  );
  for (var i = 0; i < selected_subject.length; i++) {
    if (selected_subject[i].checked == true) {
      subject_to_register.push(selected_subject[i].value);
    }
  }

  console.log(subject_to_register);
  //   subject_to_register.length >= 1
  if (true) {
    if (
      confirm(
        "Kindly confirm you would like to register the selected subject for session " +
          session +
          " " +
          term +
          " for the selected student"
      )
    ) {
      openSpinnerModal("Register subject for student");
      document.getElementById("register_subject").innerHTML = `<i
      class="fa fa-spinner fa-spin"></i> Registering ...`;

      // PUSH TO API
      fetch(ip + "/api/student/register-subject", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: "Bearer " + localStorage["token"],
        },
        body: JSON.stringify({
          student_id: student_id,
          subject_to_register: subject_to_register,
          class: class_id,
          session: session,
          term: term,
        }),
      })
        .then(function (res) {
          console.log(res.status);
          if (res.status == 401) {
            openAuthenticationModal();
          }
          return res.json();
        })

        .then((data) => {
          removeSpinnerModal();
          if (data.success) {
            alert("" + data.message + "");
            setTimeout(function () {
              //window.parent.location.reload();
              document.getElementById(
                "register_subject"
              ).innerHTML = `Register`;
              getAllSubjectForRegistration();
            }, 1000);
          } else {
            alert("" + data.message + "");
            setTimeout(function () {
              window.parent.location.reload();
            }, 1000);
          }
        })
        .catch((err) => console.log(err));
    }
  } else {
    alert("No subject selected !");
  }
}

function getAllSubjectForTable() {
  fetch(ip + "/api/admin/all-subject", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })
    .then((data) => {
      console.log("DEBUG =>   RESULT: " + data);
      document.getElementById("subject_table").innerHTML = ``;
      var c = 1;
      for (i in data) {
        if (data[i].teacher != null) {
          console.log("DEBUG not null: " + data[i].teacher);
          console.log(data[i].teacher);
          document.getElementById("subject_table").innerHTML += `
            <tr class='${c % 2 == 0 ? "even" : "odd"}'>
  
            <td>${c}.</td>
            <td>${data[i].subject_name}</td>
             <td>${
               data[i].class == null ? `GRADUATED` : data[i].class.class_name
             }</td>
            <td>${
              data[i].teacher.title +
              " " +
              data[i].teacher.first_name +
              " " +
              data[i].teacher.last_name
            }</td>
            <td>${data[i].student_no}</td>

            <td>
            <a  onclick="reloadEditFrame();localStorage.setItem('editSubject','${
              data[i].id
            }~${data[i].subject_name}~${
            data[i].teacher.title +
            " " +
            data[i].teacher.first_name +
            " " +
            data[i].teacher.last_name
          }~${data[i].teacher.id}~${data[i].class.class_name}~${
            data[i].class.id
          }')" class="btn btn-warning" data-bs-toggle="modal"
            data-bs-target="#editModal"><i class="fas fa-edit"></i></a>

           <!-- <a  onclick="deleteSubject(${
             data[i].id
           })" class="btn btn-danger text-white"><i
                    class="fa fa-trash"></i></a> -->

            <a  onclick="exportSubjectSheet('${data[i].id}','${
            data[i].subject_name
          }','${data[i].class.class_name}'
            )" class="btn btn-primary text-white">
                <i class="fas fa-file-download"></i></a>       

            <a  onclick="uploadResultSheet(${
              data[i].id
            })" class="btn btn-success text-white">
                <i class="fas fa-file-upload"></i></a>   
                     
            </td>
  
        </tr>`;
        } else {
          console.log("DEBUG null: " + data[i].teacher);
          console.log(data[i].teacher);
          document.getElementById("subject_table").innerHTML += `
            <tr class='${c % 2 == 0 ? "even" : "odd"}'>
  
            <td>${c}.</td>
            <td>${data[i].subject_name}</td>
             <td>${
               data[i].class == null ? `GRADUATED` : data[i].class.class_name
             }</td>
            <td class="text-white"><span class="badge bg-danger"><b>TEACHER NOT ASSIGNED</b></span></td>
            <td>${data[i].student_no}</td>
            <td>
            <a  onclick="reloadEditFrame();localStorage.setItem('editSubject','${
              data[i].id
            }~${data[i].subject_name}~null~null~${data[i].class.class_name}~${
            data[i].class.id
          }')" class="btn btn-warning" data-bs-toggle="modal"
            data-bs-target="#editModal"><i class="btn btn-warning" data-bs-toggle="modal"
            data-bs-target="#editModal"><i class="fas fa-edit"></i></a>

            <a  onclick="deleteSubject(${
              data[i].id
            })" class="btn btn-danger text-white"><i
                    class="fa fa-trash"></i></a>

            <a  onclick="downloadResultSheet(${
              data[i].id
            })" class="btn btn-primary text-white">
                <i class="fas fa-file-download"></i></a>       

            <a  onclick="uploadResultSheet(${
              data[i].id
            })" class="btn btn-success text-white">
                <i class="fas fa-file-upload"></i></a>   
                     
            </td>
  
        </tr>`;
        }

        c = c + 1;
      }
      paginateTable();
    })
    .catch((err) => console.log(err));
}

//
function getPreviousSubjectRegistration2(class_id, session, term) {
  registered_subject = [];
  fetch(ip + "/api/teacher/registered-subject", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      both_elective_and_compulsory: false,
      class: class_id,
      session: session,
      term: term,
    }),
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      data.forEach((i) => {
        registered_subject.push(i);
      });
      document.getElementById("number_registered").innerHTML =
        "Total registered: " +
        countDistinct(registered_subject, registered_subject.length);
    })
    .catch((err) => console.log(err));

  return registered_subject;
}

function getAllSubjectForTable2() {
  openSpinnerModal("Fetch subject to register for class");
  class_id = document.getElementById("classes").value;
  session = document.getElementById("session_term").value.split("-")[0];
  term = document.getElementById("session_term").value.split("-")[1];

  registered_subject = [];
  registered_subject = getPreviousSubjectRegistration2(class_id, session, term);

  console.log(registered_subject);
  c = 1;
  fetch(ip + "/api/admin/all-subject", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      removeSpinnerModal();
      console.log("DEBUG =>   RESULT: " + data);
      document.getElementById("subject_table").innerHTML = ``;
      var c = 1;
      for (i in data) {
        if (data[i].class.id != class_id) {
          continue;
        }

        if (data[i].teacher != null) {
          if (registered_subject.includes(data[i].id.toString())) {
            document.getElementById("subject_table").innerHTML += `
                <tr>
  
                <td><input type="checkbox" class="form-check-input ml-0" name="subject_registration"
                value="${data[i].id}" checked>
                </td>
  
                <td>${c}.</td>
                <td> <small><i class="fa fa-star" aria-hidden="true"></i></small> ${
                  data[i].subject_name
                }</td>
                <td>COMPULSORY</td>
                <td>${
                  data[i].teacher.title +
                  " " +
                  data[i].teacher.first_name +
                  " " +
                  data[i].teacher.last_name
                }</td>
                
      
            </tr>`;
          } else {
            document.getElementById("subject_table").innerHTML += `
              <tr>

              <td><input type="checkbox" class="form-check-input ml-0" name="subject_registration"
              value="${data[i].id}">
              </td>
              <td>${c}.</td>
              <td>${data[i].subject_name}</td>
              <td>COMPULSORY</td>
              <td>${
                data[i].teacher.title +
                " " +
                data[i].teacher.first_name +
                " " +
                data[i].teacher.last_name
              }</td>
              
    
          </tr>`;
          }
        } else {
          if (registered_subject.includes(data[i].id.toString())) {
            document.getElementById("subject_table").innerHTML += `
              <tr>

              <td><input type="checkbox" class="form-check-input ml-0" name="subject_registration"
                value="${data[i].id}" checked>
              </td>
              <td>${c}.</td>
              <td><small><i class="fa fa-star" aria-hidden="true"></i> ${data[i].subject_name}</td>
              <td>COMPULSORY</td>
              <td class="text-white"><span class="badge bg-danger"><b>TEACHER NOT ASSIGNED</b></span></td>
    
          </tr>`;
          } else {
            document.getElementById("subject_table").innerHTML += `
              <tr>
    
              <td><input type="checkbox" class="form-check-input ml-0" name="subject_registration"
              value="${data[i].id}">
              </td>
              <td>${c}.</td>
              <td>${data[i].subject_name}</td>
              <td>COMPULSORY</td>
              <td class="text-white"><span class="badge bg-danger"><b>TEACHER NOT ASSIGNED</b></span></td>
    
          </tr>`;
          }
        }

        c = c + 1;
      }
    })
    .catch((err) => console.log(err));
  // document.getElementById("number_registered").innerHTML =
  //   document.getElementById("number_registered").innerHTML + c;
}

function registerSubject2() {
  class_id = document.getElementById("classes").value;
  session = document.getElementById("session_term").value.split("-")[0];
  term = document.getElementById("session_term").value.split("-")[1];
  var subject_to_register = [];

  var selected_subject = document.getElementsByName("subject_registration");
  for (var i = 0; i < selected_subject.length; i++) {
    if (selected_subject[i].checked == true) {
      subject_to_register.push(selected_subject[i].value);
    }
  }

  console.log(subject_to_register);
  //   subject_to_register.length >= 1
  if (true) {
    if (
      confirm(
        "Kindly confirm you would like to register the selected subject for session " +
          session +
          " " +
          term +
          " for all student in the selected class"
      )
    ) {
      openSpinnerModal("Register subject for class");
      document.getElementById("register_subject").innerHTML = `<i
    class="fa fa-spinner fa-spin"></i> Registering ...`;

      // PUSH TO API
      fetch(ip + "/api/teacher/register-subject", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: "Bearer " + localStorage["token"],
        },
        body: JSON.stringify({
          subject_to_register: subject_to_register,
          class: class_id,
          session: session,
          term: term,
        }),
      })
        .then(function (res) {
          console.log(res.status);
          if (res.status == 401) {
            openAuthenticationModal();
          }
          return res.json();
        })

        .then((data) => {
          removeSpinnerModal();
          if (data.success) {
            alert("" + data.message + "");
            setTimeout(function () {
              getAllSubjectForTable2();
              document.getElementById(
                "register_subject"
              ).innerHTML = `Register`;
            }, 1000);
          } else {
            alert("" + data.message + "");
          }
        })
        .catch((err) => console.log(err));
    }
  } else {
    alert("No subject selected !");
  }
}

// SESSION
function createSession() {
  var session = document.getElementById("session").value;
  var term = document.getElementById("term").value;

  if (session != "" && term != "") {
    // PUSH TO API
    warningtoast("<b>Processing ... Please wait</b>");
    fetch(ip + "/api/admin/create-session", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage["token"],
      },
      body: JSON.stringify({
        session: session,
        term: term,
      }),
    })
      .then(function (res) {
        console.log(res.status);
        if (res.status == 401) {
          openAuthenticationModal();
        }
        return res.json();
      })

      .then((data) => {
        toastr.remove();
        if (data.success) {
          successtoast("<b>" + data.message + "</b>");
          setTimeout(function () {
            window.parent.location.reload();
          }, 1000);
        } else {
          errortoast("<b>" + data.message + "</b>");
        }
      })
      .catch((err) => console.log(err));
  } else {
    warningtoast("<b>Please check that compulsory field is not empty.</b>");
  }
}

function getAllSessionForTable() {
  fetch(ip + "/api/admin/all-session", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      console.log("DEBUG =>   RESULT: " + data);
      document.getElementById("session_table").innerHTML = ``;
      var c = 1;
      for (i in data) {
        if (c % 2 == 0) {
          if (data[i].session_status == "PAST") {
            console.log("DEBUG not null: " + data[i].teacher);
            console.log(data[i].teacher);
            document.getElementById("session_table").innerHTML += `
              <tr class="even">
    
              <td>${c}.</td>
              <td>${data[i].session}</td>
              <td>${data[i].term}</td>
              <td class="text-white"><span class="badge bg-danger"><b>PAST</b></span></td>
              <td>
              
                  
              </td>
    
          <tr>`;
          } else {
            console.log("DEBUG null: " + data[i].teacher);
            console.log(data[i].teacher);
            document.getElementById("session_table").innerHTML += `
            <tr class="even">
  
            <td>${c}.</td>
            <td>${data[i].session}</td>
            <td>${data[i].term}</td>
            <td class="text-white"><span class="badge bg-success"><b>CURRENT</b></span></td>
            <td>
            <a  onmouseover="reloadEditFrame();localStorage.setItem('editSession','${data[i].id}~${data[i].session}~${data[i].term}')" class="btn btn-warning" data-bs-toggle="modal"
            data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
                
            </td>
    
          <tr>`;
          }
        } else {
          if (data[i].session_status == "PAST") {
            document.getElementById("session_table").innerHTML += `
              <tr class="odd">
    
              <td>${c}.</td>
              <td>${data[i].session}</td>
              <td>${data[i].term}</td>
              <td class="text-white"><span class="badge bg-danger"><b>PAST</b></span></td>
              <td>
             
                  
              </td>
    
          <tr>`;
          } else {
            document.getElementById("session_table").innerHTML += `
            <tr class="odd">
  
            <td>${c}.</td>
            <td>${data[i].session}</td>
            <td>${data[i].term}</td>
            <td class="text-white"><span class="badge bg-success"><b>CURRENT</b></span></td>
            <td>
            <a  onmouseover="reloadEditFrame();localStorage.setItem('editSession','${data[i].id}~${data[i].session}~${data[i].term}')" class="btn btn-warning" data-bs-toggle="modal"
            data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
                
            </td>
    
          <tr>`;
          }
        }

        c = c + 1;
      }
    })
    .catch((err) => console.log(err));
}

function editSession(id, session, term) {
  console.log("STORED...");
  localStorage.setItem("editSession", id + "~" + session + "~" + term);
}

function editSessionDetails() {
  //

  document.getElementById("session").value =
    localStorage["editSession"].split("~")[1];

  document.getElementById("term").innerHTML =
    localStorage["editSession"].split("~")[2] == ""
      ? document.getElementById("term").innerHTML
      : `<option value="${localStorage["editSession"].split("~")[2]}">${
          localStorage["editSession"].split("~")[2]
        }</option>` + document.getElementById("term").innerHTML;
}

function updateSession() {
  var session = document.getElementById("session").value;
  var term = document.getElementById("term").value;

  if (session != "" && term != "") {
    // PUSH TO API
    warningtoast("<b>Processing ... Please wait</b>");
    fetch(ip + "/api/admin/edit-session", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage["token"],
      },
      body: JSON.stringify({
        session_id: localStorage["editSession"][0],
        session: session,
        term: term,
      }),
    })
      .then(function (res) {
        console.log(res.status);
        if (res.status == 401) {
          openAuthenticationModal();
        }
        return res.json();
      })

      .then((data) => {
        toastr.remove();
        if (data.success) {
          successtoast("<b>" + data.message + "</b>");
          setTimeout(function () {
            window.parent.location.reload();
          }, 1000);
        } else {
          errortoast("<b>" + data.message + "</b>");
        }
      })
      .catch((err) => console.log(err));
  } else {
    warningtoast("<b>Please check that compulsory field is not empty.</b>");
  }
}

// GRADE SETTINGS
function createGrade() {
  var grade = document.getElementById("grade").value;
  var min = document.getElementById("min").value;
  var max = document.getElementById("max").value;
  var remark = document.getElementById("remark").value;

  if (grade != "" && min != "" && max != "" && remark != "") {
    // PUSH TO API
    warningtoast("<b>Processing ... Please wait</b>");
    fetch(ip + "/api/admin/create-grade", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage["token"],
      },
      body: JSON.stringify({
        grade: grade,
        min: min,
        max: max,
        remark: remark,
      }),
    })
      .then(function (res) {
        console.log(res.status);
        if (res.status == 401) {
          openAuthenticationModal();
        }
        return res.json();
      })

      .then((data) => {
        toastr.remove();
        if (data.success) {
          successtoast("<b>" + data.message + "</b>");
          setTimeout(function () {
            parent.getAllGradeForTable();
            parent.$("#modalYT").modal("hide");
          }, 1000);
        } else {
          errortoast("<b>" + data.message + "</b>");
        }
      })
      .catch((err) => console.log(err));
  } else {
    warningtoast("<b>Please check that compulsory field is not empty.</b>");
  }
}

function getAllGradeForTable() {
  fetch(ip + "/api/admin/all-grade", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      document.getElementById("grade_table").innerHTML = ``;
      var c = 1;
      if (data.length > 0) {
        for (i in data) {
          document.getElementById("grade_table").innerHTML += `
                <tr ${c % 2 == 0 ? 'class="even"' : 'class="odd"'}>
      
                <td>${c}.</td>
                <td>${data[i].min + " - " + data[i].max}</td>
                <td>${data[i].grade}</td>
                <td>${data[i].remark}</td>
                <td>
                    <a  onmouseover="reloadEditFrame();localStorage.setItem('editGrade','${
                      data[i].id
                    }~${data[i].min}~${data[i].max}~${data[i].grade}~${
            data[i].remark
          }')" class="btn btn-warning" data-bs-toggle="modal"
                    data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
  
                    <a  onclick="deleteGrade(${
                      data[i].id
                    })" href="#" class="btn btn-danger"><i
                    class="fas fa-trash"></i>
                     Delete</a>
                 </td>
      
            <tr>`;

          c = c + 1;
        }
      } else {
        document.getElementById("grade_table").innerHTML = `NO DATA FOUND`;
      }
      //kkkkpaginateTable();
    })
    .catch((err) => console.log(err));
}

function editGradeDetails() {
  document.getElementById("grade").value =
    localStorage["editGrade"].split("~")[3];

  document.getElementById("min").value =
    localStorage["editGrade"].split("~")[1];

  document.getElementById("max").value =
    localStorage["editGrade"].split("~")[2];

  document.getElementById("remark").value =
    localStorage["editGrade"].split("~")[4];
}

function updateGrade() {
  var grade = document.getElementById("grade").value;
  var min = document.getElementById("min").value;
  var max = document.getElementById("max").value;
  var remark = document.getElementById("remark").value;

  if (grade != "" && min != "" && max != "" && remark != "") {
    // PUSH TO API
    warningtoast("<b>Processing ... Please wait</b>");
    fetch(ip + "/api/admin/edit-grade", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage["token"],
      },
      body: JSON.stringify({
        grade_id: localStorage["editGrade"][0],
        grade: grade,
        min: min,
        max: max,
        remark: remark,
      }),
    })
      .then(function (res) {
        console.log(res.status);
        if (res.status == 401) {
          openAuthenticationModal();
        }
        return res.json();
      })

      .then((data) => {
        toastr.remove();
        if (data.success) {
          successtoast("<b>" + data.message + "</b>");
          setTimeout(function () {
            parent.getAllGradeForTable();
            parent.$("#editModal").modal("hide");
          }, 1000);
        } else {
          errortoast("<b>" + data.message + "</b>");
        }
      })
      .catch((err) => console.log(err));
  } else {
    warningtoast("<b>Please check that compulsory field is not empty.</b>");
  }
}

function deleteGrade(id) {
  if (!confirm("You are about to delete this grade ?")) {
    return 0;
  }
  warningtoast("<b>Processing ... Please wait</b>");
  fetch(ip + "/api/admin/delete-grade/" + id, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      toastr.remove();
      if (data.success) {
        successtoast("<b>" + data.message + "</b>");
        getAllGradeForTable();
      } else {
        errortoast("<b>" + data.message + "</b>");
      }
    })
    .catch((err) => console.log(err));
}

// ATTENDANCE STUDENT
function getAttendanceDate() {
  document.getElementById("date").innerHTML += Date("DD-MM-YYYY").toUpperCase();
}

function takeAttendance() {
  // document.getElementById("attendance_class").innerHTML += JSON.parse(
  //   localStorage["user_data"]
  // ).data.assigned_class.class_name;

  var check_out = false;

  let scanner = new Instascan.Scanner({
    video: document.getElementById("preview"),
  });
  Instascan.Camera.getCameras()
    .then(function (cameras) {
      if (cameras.length > 0) {
        // CHECK IF BACK CAMERA IS AVAILABLE
        if (cameras.length > 1) {
          scanner.start(cameras[1]);
        } else {
          scanner.start(cameras[0]);
        }
      } else {
        alert("No cameras found");
      }
    })
    .catch(function (e) {
      console.error(e);
    });

  scanner.addListener("scan", function (qr_data) {
    // document.getElementById("student_id").value = qr_data; //StudentATDCard~id~class_id~first_name

    // NOTIFIER WHEN CARD HAS BEEN SCANNED
    //say("Card Scanned , Please wait ...");
    //alert("CARD SCANNED 👍. CLICK OK AND WAIT FOR A RESPONSE.");

    // CHECK IF CARD IS VALID
    if (qr_data.split("~")[0] != "StudentATDCard") {
      errorSound.play();
      setTimeout(function () {
        say("Invalid Card!");
      }, 1000);

      return 0;
    }

    // CHECK IF STUDENT IS ON ATTENDANCE LIST
    takenAttendance = isStudentIDInAttendanceList(qr_data.split("~")[1], "");
    console.log(takenAttendance);

    if (takenAttendance) {
      // CHECK IF STUDENT ALREADY CHECKED OUT
      checkedOut = hasStudentCheckedOut(qr_data.split("~")[1], "");
      if (checkedOut) {
        errorSound.play();
        alert("This student has been checked out.");
        return 0;
      }

      warningSound.play();
      if (window.parent.confirm("You are about to CHECK OUT this student !")) {
        // PROCEED TO CHECK OUT STUDENT
        check_out = true;
        warningSound.pause();
      } else {
        warningSound.pause();
        return 0;
      }
    }

    scanner.stop();
    openSpinnerModal("Card scanned");

    // PASS ATTENDANCE DETAILS TO API
    fetch(ip + "/api/teacher/take-attendance", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage["token"],
      },
      body: JSON.stringify({
        student_id: qr_data.split("~")[1],
        class_id: qr_data.split("~")[2],
        date: getDate().split("~")[1],
        time: getDate().split("~")[0],
        check_out: check_out,
        session: localStorage["current_session"],
        term: localStorage["current_term"],
      }),
    })
      .then(function (res) {
        console.log(res.status);
        if (res.status == 401) {
          openAuthenticationModal();
        }
        return res.json();
      })

      .then((data) => {
        if (data.success) {
          successSound.play();
          setTimeout(function () {
            say(data.message);
          }, 1000);
          getAttendance();
          removeSpinnerModal();
          takeAttendance();
        } else {
          errorSound.play();
          setTimeout(function () {
            say(data.message);
          }, 1000);
          getAttendance();
        }
      })
      .catch((err) => console.log(err));
  });
}

function takeAttendanceByStudentID() {
  var check_out = false;
  var student_id = document.getElementById("student_id").value;
  if (student_id == "") {
    return alert("INPUT STUDENT ID");
  }

  // CHECK IF STUDENT IS ON ATTENDANCE LIST
  takenAttendance = isStudentIDInAttendanceList(student_id, "STUDENT_NUMBER");
  console.log(takenAttendance);

  if (takenAttendance) {
    // CHECK IF STUDENT ALREADY CHECKED OUT
    checkedOut = hasStudentCheckedOut(student_id, "STUDENT_NUMBER");
    if (checkedOut) {
      errorSound.play();
      alert("This student has been checked out.");
      return 0;
    }

    if (window.parent.confirm("You are about to CHECK OUT this student !")) {
      // PROCEED TO CHECK OUT STUDENT
      check_out = true;
    } else {
      return 0;
    }
  }

  warningtoast("Taking Attendance Please wait ...");

  // PASS ATTENDANCE DETAILS TO API
  fetch(ip + "/api/teacher/take-attendance", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      student_id: document.getElementById("student_id").value,
      class_id: "",
      date: getDate().split("~")[1],
      time: getDate().split("~")[0],
      check_out: check_out,
      session: localStorage["current_session"],
      term: localStorage["current_term"],
    }),
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      toastr.remove();
      if (data.success) {
        successSound.play();
        setTimeout(function () {
          say(data.message);
        }, 1000);
        getAttendance();
      } else {
        errorSound.play();
        setTimeout(function () {
          say(data.message);
        }, 1000);
        getAttendance();
      }
    })
    .catch((err) => console.log(err));
}

function isStudentIDInAttendanceList(student_id, check_type) {
  attendance_list = JSON.parse(localStorage["attendanceListStudent"]);
  response = false;

  if (check_type == "STUDENT_NUMBER") {
    attendance_list.forEach((attendance) => {
      takenAttendance =
        attendance.student.student_id.toString().trim() ===
        student_id.toString().trim();
      if (takenAttendance) {
        response = true;
      }
    });
  } else {
    attendance_list.forEach((attendance) => {
      takenAttendance =
        attendance.student_id.toString().trim() ===
        student_id.toString().trim();
      if (takenAttendance) {
        response = true;
      }
    });
  }

  return response;
}

function hasStudentCheckedOut(student_id, check_type) {
  attendance_list = JSON.parse(localStorage["attendanceListStudent"]);
  response = false;

  if (check_type == "STUDENT_NUMBER") {
    attendance_list.forEach((attendance) => {
      if (
        attendance.student.student_id.toString().trim() ===
        student_id.toString().trim()
      ) {
        // CHECK IF TIME-OUT IS (-)
        attendance.time_out == "-" ? (response = false) : (response = true);
      }
    });
  } else {
    attendance_list.forEach((attendance) => {
      if (
        attendance.student_id.toString().trim() === student_id.toString().trim()
      ) {
        // CHECK IF TIME-OUT IS (-)
        attendance.time_out == "-" ? (response = false) : (response = true);
      }
    });
  }

  return response;
}

function getAttendance() {
  console.log(document.getElementById("attendance_date").value);
  fetch(ip + "/api/teacher/get-attendance", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      date:
        document.getElementById("attendance_date").value != ""
          ? document.getElementById("attendance_date").value
          : getDate().split("~")[1],
    }),
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      // SAVE IN THE LOCAL STORAGE FOR A LATER CHECK
      localStorage.setItem("attendanceListStudent", JSON.stringify(data));

      c = 1;
      document.getElementById("student_attendance").innerHTML = ``;
      if (data.length != 0) {
        for (i in data) {
          document.getElementById("student_attendance").innerHTML += `
              <tr ${c % 2 == 0 ? `class="even"` : `class="odd"`}>
      
                    <td>${c}.</td>
                    <td>${
                      data[i].student.first_name +
                      " " +
                      data[i].student.last_name
                    }</td>
                     <td>${
                       data[i].class == null
                         ? `GRADUATED`
                         : data[i].class.class_name
                     }</td>
                    <td>${data[i].student.gender}</td>
                    <td>${data[i].date}</td>
                    <td>${data[i].time_in}</td>
                    <td>${data[i].time_out}</td>
                    <td><span class="badge bg-success"><b>PRESENT</b></span></td>
                    
                  
          
                <tr>`;

          c = c + 1;
        }
      } else {
        document.getElementById(
          "student_attendance"
        ).innerHTML = `NO ATTENDANCE`;
      }
    })
    .catch((err) => console.log(err));
}

// TEACHER ATTENDANCE
function takeTeacherAttendance() {
  var check_out = false;

  let scanner = new Instascan.Scanner({
    video: document.getElementById("preview"),
  });
  Instascan.Camera.getCameras()
    .then(function (cameras) {
      if (cameras.length > 0) {
        // CHECK IF BACK CAMERA IS AVAILABLE
        if (cameras.length > 1) {
          scanner.start(cameras[1]);
        } else {
          scanner.start(cameras[0]);
        }
      } else {
        alert("No cameras found");
      }
    })
    .catch(function (e) {
      console.error(e);
    });

  scanner.addListener("scan", function (qr_data) {
    // document.getElementById("student_id").value = qr_data; //TeacherATDCard~id~class_id~first_name

    // NOTIFIER WHEN CARD HAS BEEN SCANNED
    // say("Card Scanned , Click OK.");
    // alert("CARD SCANNED 👍. CLICK OK AND WAIT FOR A RESPONSE.");

    // CHECK IF CARD IS VALID
    if (qr_data.split("~")[0] != "TeacherATDCard") {
      errorSound.play();
      setTimeout(function () {
        say("Invalid Card!");
      }, 1000);

      return 0;
    }

    // CHECK IF STAFF IS ON ATTENDANCE LIST
    takenAttendance = isStaffIDInAttendanceList(qr_data.split("~")[1], "");
    console.log(takenAttendance);

    if (takenAttendance) {
      // CHECK IF STAFF ALREADY CHECKED OUT
      checkedOut = hasStaffCheckedOut(qr_data.split("~")[1], "");
      if (checkedOut) {
        errorSound.play();
        alert("This staff has been checked out.");
        return 0;
      }

      warningSound.play();
      if (window.parent.confirm("You are about to CHECK OUT this staff !")) {
        // PROCEED TO CHECK OUT STAFF
        check_out = true;
        warningSound.pause();
      } else {
        warningSound.pause();
        return 0;
      }
    }

    scanner.stop();
    openSpinnerModal("Card scanned");

    // PASS ATTENDANCE DETAILS TO API
    fetch(ip + "/api/admin/take-teacher-attendance", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage["token"],
      },
      body: JSON.stringify({
        staff_id: qr_data.split("~")[1],
        class_id: "00",
        date: getDate().split("~")[1],
        time: getDate().split("~")[0],
        check_out: check_out,
        session: localStorage["current_session"],
        term: localStorage["current_term"],
      }),
    })
      .then(function (res) {
        console.log(res.status);
        if (res.status == 401) {
          openAuthenticationModal();
        }
        return res.json();
      })

      .then((data) => {
        if (data.success) {
          successSound.play();
          setTimeout(function () {
            say(data.message);
          }, 1000);
          getTeacherAttendance();
          removeSpinnerModal();
          takeTeacherAttendance();
        } else {
          errorSound.play();
          setTimeout(function () {
            say(data.message);
          }, 1000);
          getTeacherAttendance();
        }
      })
      .catch((err) => console.log(err));
  });
}

function takeAttendanceByStaffID() {
  var check_out = false;
  var staff_id = document.getElementById("staff_id").value;
  if (staff_id == "") {
    return alert("INPUT STAFF ID");
  }

  // CHECK IF STAFF IS ON ATTENDANCE LIST
  takenAttendance = isStaffIDInAttendanceList(staff_id, "STAFF_NUMBER");
  console.log(takenAttendance);

  if (takenAttendance) {
    // CHECK IF Staff ALREADY CHECKED OUT
    checkedOut = hasStaffCheckedOut(staff_id, "STAFF_NUMBER");
    if (checkedOut) {
      errorSound.play();
      alert("This staff has been checked out.");
      return 0;
    }

    if (window.parent.confirm("You are about to CHECK OUT this staff !")) {
      // PROCEED TO CHECK OUT STAFF
      check_out = true;
    } else {
      return 0;
    }
  }

  warningtoast("Taking Attendance Please wait ...");

  // PASS ATTENDANCE DETAILS TO API
  fetch(ip + "/api/admin/take-teacher-attendance", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      staff_id: document.getElementById("staff_id").value,
      class_id: "",
      date: getDate().split("~")[1],
      time: getDate().split("~")[0],
      check_out: check_out,
      session: localStorage["current_session"],
      term: localStorage["current_term"],
    }),
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      toastr.remove();
      if (data.success) {
        successSound.play();
        setTimeout(function () {
          say(data.message);
        }, 1000);
        getTeacherAttendance();
      } else {
        errorSound.play();
        setTimeout(function () {
          say(data.message);
        }, 1000);
        getTeacherAttendance();
      }
    })
    .catch((err) => console.log(err));
}

function isStaffIDInAttendanceList(staff_id, check_type) {
  attendance_list = JSON.parse(localStorage["attendanceListStaff"]);
  response = false;

  if (check_type == "STAFF_NUMBER") {
    attendance_list.forEach((attendance) => {
      takenAttendance =
        attendance.teacher.teacher_id.toString().trim() ===
        staff_id.toString().trim();
      if (takenAttendance) {
        response = true;
      }
    });
  } else {
    attendance_list.forEach((attendance) => {
      takenAttendance =
        attendance.teacher_id.toString().trim() === staff_id.toString().trim();
      if (takenAttendance) {
        response = true;
      }
    });
  }

  return response;
}

function hasStaffCheckedOut(staff_id, check_type) {
  attendance_list = JSON.parse(localStorage["attendanceListStaff"]);
  response = false;

  if (check_type == "STAFF_NUMBER") {
    attendance_list.forEach((attendance) => {
      if (
        attendance.teacher.teacher_id.toString().trim() ===
        staff_id.toString().trim()
      ) {
        // CHECK IF TIME-OUT IS (-)
        attendance.time_out == "-" ? (response = false) : (response = true);
      }
    });
  } else {
    attendance_list.forEach((attendance) => {
      if (
        attendance.teacher_id.toString().trim() === staff_id.toString().trim()
      ) {
        // CHECK IF TIME-OUT IS (-)
        attendance.time_out == "-" ? (response = false) : (response = true);
      }
    });
  }

  return response;
}

function getTeacherAttendance() {
  console.log(document.getElementById("attendance_date").value);
  fetch(ip + "/api/admin/get-teacher-attendance", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      date:
        document.getElementById("attendance_date").value != ""
          ? document.getElementById("attendance_date").value
          : getDate().split("~")[1],
    }),
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      // SAVE IN THE LOCAL STORAGE FOR A LATER CHECK
      localStorage.setItem("attendanceListStaff", JSON.stringify(data));

      c = 1;
      document.getElementById("teacher_attendance").innerHTML = ``;
      if (data.length != 0) {
        for (i in data) {
          document.getElementById("teacher_attendance").innerHTML += `
              <tr ${c % 2 == 0 ? `class="even"` : `class="odd"`}>
      
                    <td>${c}.</td>
                    <td>${
                      data[i].teacher.first_name +
                      " " +
                      data[i].teacher.last_name
                    }</td>
                    <td>${data[i].teacher.gender}</td>
                    <td>${data[i].date}</td>
                    <td>${data[i].time_in}</td>
                    <td>${data[i].time_out}</td>
                    <td><span class="badge bg-success"><b>PRESENT</b></span></td>
                    
                  
          
                <tr>`;

          c = c + 1;
        }
      } else {
        document.getElementById(
          "teacher_attendance"
        ).innerHTML = `NO ATTENDANCE`;
      }
    })
    .catch((err) => console.log(err));
}

function getDashboardInfo() {
  fetch(ip + "/api/admin/dashboard-information", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      document.getElementById("student_no").innerHTML = `<span class="counter"
      data-num="${data.student_no}">${data.student_no}</span>`;

      document.getElementById("teacher_no").innerHTML = `<span class="counter"
      data-num="${data.teacher_no}">${data.teacher_no}</span>`;

      document.getElementById("no_inventory_item").innerHTML = data.inventory;
    })
    .catch((err) => console.log(err));
}

// CONTROL PANEL
function saveControl() {
  warningtoast("Saving please wait ...");
  fetch(ip + "/api/admin/control-panel", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      access_result: document.getElementById("access_result").checked
        ? "YES"
        : "NO",
      register_subject: document.getElementById("register_subject").checked
        ? "YES"
        : "NO",
      update_debitor_list: document.getElementById("update_debitor_list")
        .checked
        ? "YES"
        : "NO",
      check_debitors: document.getElementById("check_debitor").checked
        ? document.getElementById("check_debitor_percentage").value + "-YES"
        : document.getElementById("check_debitor_percentage").value + "-NO",
      max_resumption: document.getElementById("max_resumption").checked
        ? document.getElementById("resumption_time").value + "-YES"
        : document.getElementById("resumption_time").value + "-NO",
    }),
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      toastr.remove();
      if (data.success) {
        successtoast("<b>" + data.message + "</b>");
        getControl();
      } else {
        errortoast("<b>" + data.message + "</b>");
      }
    })
    .catch((err) => console.log(err));
}

function getControl() {
  fetch(ip + "/api/admin/control-panel", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      data.access_result == "YES"
        ? (document.getElementById("access_result").checked = true)
        : "";

      data.register_subject == "YES"
        ? (document.getElementById("register_subject").checked = true)
        : "";

      data.check_debitors.split("-")[1] == "YES"
        ? (document.getElementById("check_debitor").checked = true)
        : "";

      document.getElementById("check_debitor_percentage").value =
        data.check_debitors.split("-")[0];

      data.max_resumption_time.split("-")[1] == "YES"
        ? (document.getElementById("max_resumption").checked = true)
        : "";

      document.getElementById("resumption_time").value =
        data.max_resumption_time.split("-")[0];

      data.debitor_list_last_update.split("-")[1] == "YES"
        ? (document.getElementById("update_debitor_list").checked = true)
        : "";
    })
    .catch((err) => console.log(err));
}

// LESSON PLAN
function getLessonPlan(lesson_status) {
  openSpinnerModal("Lesson Plan");
  fetch(ip + "/api/teacher/lesson-plan", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      user_type: "ADMIN",
      status: lesson_status,
      subject_id: document.getElementById("subject_class").value,
      term: localStorage["current_term"],
    }),
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      removeSpinnerModal();
      document.getElementById("lesson_plan_table").innerHTML = "";
      c = 1;
      data.forEach((lesson) => {
        document.getElementById("lesson_plan_table").innerHTML += `
      <tr>
        <td>${c}.</td>
        <td>${lesson.week}</td>
        <td>${lesson.teacher}</td>
        <td>${lesson.term}</td>
        <td><span class="badge ${
          lesson.status == "APPROVED"
            ? `bg-success`
            : lesson.status == "DISAPPROVED"
            ? `bg-danger`
            : `bg-warning`
        }"><b>${lesson.status}</b></span></td>
        <td>

            <a  onmouseover="populateLessonDetails(${JSON.stringify(
              lesson
            ).replace(
              /"/g,
              "'"
            )})" href="#" class="btn btn-primary" data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"><i class="fas fa-eye"></i> View</a>
            <a  onclick="saveLessonPlan(${
              lesson.id
            },'APPROVE')" href="#" class="btn btn-success" data-bs-toggle="modal"
                data-bs-target="#"><i class="fas fa-edit"></i> Approve</a>
            <a  onclick="saveLessonPlan(${
              lesson.id
            },'DISAPPROVE')" href="#" class="btn btn-danger"><i class="fas fa-ban"></i>
                Disapprove</a>
        </td>
      </tr>
        `;

        c = c + 1;
      });
      paginateTable();
    })
    .catch((err) => console.log(err));
}

function populateLessonDetails(lesson) {
  document.getElementById("lp_subject_class").innerHTML =
    localStorage["lp_subject_class"];
  document.getElementById("lp_status").innerHTML = `<span class="badge ${
    lesson.status == "APPROVED"
      ? `bg-success`
      : lesson.status == "DISAPPROVED"
      ? `bg-danger`
      : `bg-warning`
  }"><b>${lesson.status}</b></span>`;

  document.getElementById("lp_teacher").innerHTML = lesson.teacher;

  document.getElementById("week1").innerHTML =
    ` <option value="${lesson.week}">${lesson.week}</option>` +
    document.getElementById("week1").innerHTML;

  document.getElementById("instructional_material").innerHTML =
    lesson.instructional_material;
  document.getElementById("previous_knowledge").innerHTML =
    lesson.previous_knowledge;
  document.getElementById("previous_lesson").innerHTML = lesson.previous_lesson;
  document.getElementById("behavioural_objective").innerHTML =
    lesson.behavioural_objective;
  document.getElementById("content").innerHTML = lesson.content;
  document.getElementById("presentation").innerHTML = lesson.presentation;
  document.getElementById("evaluation").innerHTML = lesson.evaluation;
  document.getElementById("conclusion").innerHTML = lesson.conclusion;
  document.getElementById("assignment").innerHTML = lesson.assignment;
  document.getElementById("lesson_id").value = lesson.id;
}

function editLessonPlan() {
  document.getElementById("save_lesson_bt").hidden = false;

  lesson_content = document.getElementsByClassName("lesson_plan_content");

  lesson_content.forEach((element) => {
    element.contentEditable = true;
  });
}

function saveLessonPlan(id, status) {
  if (!confirm("You are about to " + status + " the lesson plan")) {
    return 0;
  }
  openSpinnerModal(status);
  fetch(ip + "/api/teacher/save-lesson-plan", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      user_type: "ADMIN",
      status: status,
      id: id,
    }),
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      removeSpinnerModal();
      toastr.remove();
      if (data.success) {
        successtoast(data.message);
        getLessonPlan("ALL");
      } else {
        errortoast(data.message);
      }
    })
    .catch((err) => console.log(err));
}

// INVENTORY
function createInventoryItem() {
  document.getElementById("inventory_table").innerHTML =
    `<tr id="new_item_roll">

  <td><span class="badge bg-success"><b>NEW</b></span></td>
  <td id="item" contenteditable="true"> ITEM NAME </td>
  <td id="description" contenteditable="true"> ITEM DESCRIPTION </td>
  <td id="quantity" contenteditable="true"> ITEM QUANTITY </td>
  <td id="">${getDate().split("~")[1]}</td>
  <td id="">${getDate().split("~")[1]}</td>
  <td>


      <a  onclick="saveInventoryItem()" href="#" class="btn btn-primary">
            Save
      </a>
      <a  onclick="document.getElementById('new_item_roll').remove()" href="#" class="btn btn-danger">
            Cancel
      </a>

  </td>
</tr>` + document.getElementById("inventory_table").innerHTML;
}

function saveInventoryItem() {
  var item = document.getElementById("item").innerHTML;
  var description = document.getElementById("description").innerHTML;
  var quantity = document.getElementById("quantity").innerHTML;

  if (description != "" && item != "" && quantity != "") {
    // PUSH TO API
    warningtoast("<b>Processing ... Please wait</b>");
    fetch(ip + "/api/admin/inventory", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage["token"],
      },
      body: JSON.stringify({
        item: item,
        description: description,
        quantity: quantity,
        date_created: getDate().split("~")[1],
        last_modified: getDate().split("~")[1],
      }),
    })
      .then(function (res) {
        console.log(res.status);
        if (res.status == 401) {
          openAuthenticationModal();
        }
        return res.json();
      })

      .then((data) => {
        toastr.remove();
        if (data.success) {
          successtoast("<b>" + data.message + "</b>");
          // setTimeout(function () {
          getInventory();
          // }, 1000);
        } else {
          errortoast("<b>" + data.message + "</b>");
        }
      })
      .catch((err) => console.log(err));
  } else {
    warningtoast("<b>Please check that compulsory field is not empty.</b>");
  }
}

function getInventory() {
  fetch(ip + "/api/admin/inventory", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      c = 1;
      document.getElementById("inventory_table").innerHTML = ``;
      if (data.length > 0) {
        data.forEach((data) => {
          document.getElementById("inventory_table").innerHTML += `
          <tr ${c % 2 == 0 ? `class="even"` : `class="odd"`}id="${data.id}">
          <td>${c}.</td>
          <td id="item${data.id}">${data.item}</td>
          <td id="description${data.id}">${data.description}</td>
          <td id="quantity${data.id}">${data.quantity}</td>
          <td id="date_created${data.id}">${data.date_created}</td>
          <td id="last_modified${data.id}">${data.last_modified}</td>
          <td>
        
              <a  id="saveUpdateButton${
                data.id
              }" onclick="updateInventoryItem(${
            data.id
          })" href="#" class="btn btn-primary" hidden>
                    Save Update
              </a>
              <a  id="editButton${data.id}" onclick="allowEdit(${
            data.id
          },true)" href="#" class="btn btn-warning">
                    Edit
              </a>
              <a  id="deleteButton${data.id}" onclick="deleteInventoryItem(${
            data.id
          })" href="#" class="btn btn-danger">
                    Delete
              </a>
  
              <a  id="discardButton${data.id}"onclick="allowEdit(${
            data.id
          },false)" href="#" class="btn btn-danger" hidden>
                    Discard Change
              </a>
        
          </td>
        </tr>`;
          c += 1;
        });
      } else {
        document.getElementById(
          "inventory_table"
        ).innerHTML = `NO ITEM IN THE INVENTORY`;
      }
    })
    .catch((err) => console.log(err));
}

function allowEdit(id, action) {
  if (action) {
    document.getElementById("item" + id).setAttribute("contenteditable", true);
    document
      .getElementById("description" + id)
      .setAttribute("contenteditable", true);
    document
      .getElementById("quantity" + id)
      .setAttribute("contenteditable", true);

    // ENABLE
    document.getElementById("saveUpdateButton" + id).hidden = false;
    document.getElementById("discardButton" + id).hidden = false;

    // DISABLE
    document.getElementById("updateButton" + id).hidden = true;
    document.getElementById("deleteButton" + id).hidden = true;
  } else {
    getInventory();
    // document.getElementById("item" + id).setAttribute("contenteditable", false);
    // document
    //   .getElementById("description" + id)
    //   .setAttribute("contenteditable", false);
    // document
    //   .getElementById("quantity" + id)
    //   .setAttribute("contenteditable", false);

    // // DISABLE
    // document.getElementById("saveUpdateButton" + id).hidden = true;
    // document.getElementById("discardButton" + id).hidden = true;

    // // ENABLE
    // document.getElementById("updateButton" + id).hidden = false;
    // document.getElementById("deleteButton" + id).hidden = false;
  }
}

function updateInventoryItem(id) {
  warningtoast("<b>Processing ... Please wait</b>");
  fetch(ip + "/api/admin/inventory", {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      id: id,
      item: document.getElementById("item" + id).innerHTML,
      description: document.getElementById("description" + id).innerHTML,
      quantity: document.getElementById("quantity" + id).innerHTML,
      last_modified: getDate().split("~")[1],
    }),
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      toastr.remove();
      if (data.success) {
        successtoast("<b>" + data.message + "</b>");
        setTimeout(function () {
          getInventory();
        }, 1000);
      } else {
        errortoast("<b>" + data.message + "</b>");
      }
    })
    .catch((err) => console.log(err));
}

function deleteInventoryItem(id) {
  if (!confirm("You are about to delete this Inventory ?")) {
    return 0;
  }
  fetch(ip + "/api/admin/inventory/" + id, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      successtoast(data.message);
      getInventory();
    })
    .catch((err) => console.log(err));
}

// GET TODAY'S DATE
function getDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  time = today.getHours() + ":" + today.getMinutes();
  date = dd + "/" + mm + "/" + yyyy;

  return time + "~" + date;
}

// TEXT TO SPEECH
function say(text) {
  let speech = new SpeechSynthesisUtterance();
  voices = speechSynthesis.getVoices();
  speech.lang = "en-US";
  speech.text = text;
  // speech.voice = voices[1];
  speech.volume = 1;
  speech.rate = 1;
  speech.pitch = 1;

  window.speechSynthesis.speak(speech);
}

// GET SCHOOL DETAILS
function getSchoolDetails() {
  return fetch(ip + "/api/general/school-details", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
  })
    .then(function (res) {
      return res.json();
    })

    .then((data) => {
      console.log(data);
      localStorage.setItem("SCHOOL_NAME", data[0].school_name);
      localStorage.setItem("SCHOOL_ADDRESS", data[0].school_address);
      localStorage.setItem("SCHOOL_PHONE", data[0].school_phone);
      localStorage.setItem("SCHOOL_EMAIL", data[0].school_email);
      localStorage.setItem("SCHOOL_COLOR", data[0].school_color);
    })
    .catch((err) => console.log(err));
}

// LOAD SCHOOL COLOR
function loadSchoolColor() {
  if (localStorage["SCHOOL_COLOR"] != "-") {
    var r = document.querySelector(":root");
    var rs = getComputedStyle(r);
    // alert("The value of --blue is: " + rs.getPropertyValue('--blue'));
    // SET SCHOOL COLOR

    r.style.setProperty(
      "--front-color",
      localStorage["SCHOOL_COLOR"].split("~")[0]
    );
    r.style.setProperty(
      "--back-color",
      localStorage["SCHOOL_COLOR"].split("~")[1]
    );
  }
}

// PAGENATION
function paginateTable() {
  $("#paginate").DataTable();
  $(".dataTables_length").addClass("bs-select");
}

//CHECK PORTAL SUBSCRIPTION
function getPortalSubscription() {
  fetch(ip + "/api/bursary/portal-subscription", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      c = 1;
      document.getElementById("subscription_table").innerHTML = ``;
      if (data.length > 0) {
        for (i in data) {
          document.getElementById("subscription_table").innerHTML += `
                    <tr class='${c % 2 == 0 ? "even" : "odd"}'>
            
                    <td>${c}.</td>
                    <td>${data[i].subscription_id}</td>
                    <td>${data[i].description}</td>  
                    <td><span style="color:white" class="badge ${
                      data[i].status == "NOT PAID"
                        ? `bg-danger`
                        : data[i].status == "USAGE IN-PROGRESS" ||
                          data[i].status == "EXTENDED"
                        ? `bg-warning`
                        : `bg-success`
                    }"><b>${data[i].status}</b></span></td>
                    <td>${formatNumber(parseInt(data[i].amount))}</td>
                    <td>   
                      ${
                        data[i].status == "NOT PAID" ||
                        data[i].status == "EXTENDED"
                          ? `<a  id="" onclick="payWithPaystack('${data[i].id}',
                          '${data[i].amount}',
                          '${data[i].subscription_id}',
                          '${data[i].description}'
                        )" href="#" class="btn btn-primary">
                                 Pay Now
                            </a>`
                          : ``
                      }
                    </td>
                   </tr>
                    `;
          c = c + 1;

          if (data[i].status == "NOT PAID") {
            payWithPaystack(
              data[i].id,
              data[i].amount,
              data[i].subscription_id,
              data[i].description
            );
          }
        }
      } else {
        document.getElementById(
          "subscription_table"
        ).innerHTML = `NO DATA FOUND`;
      }
    })
    .catch((err) => console.log(err));
}

function checkPortalSubscription() {
  fetch(ip + "/api/bursary/portal-subscription", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      for (i in data) {
        if (data[i].status == "NOT PAID") {
          alert("YOU HAVE AN UNPAID PORTAL USAGE");
          window.parent.location.assign(
            domain + "/admin/portal-subscription.html"
          );
          payWithPaystack(
            data[i].id,
            data[i].amount,
            data[i].subscription_id,
            data[i].description
          );
        }
      }
    })
    .catch((err) => console.log(err));
}

function payWithPaystack(id, amount, subscription_id, description) {
  var handler = PaystackPop.setup({
    key: localStorage["PSPK"], //put your public key here
    email: localStorage["SCHOOL_EMAIL"], //put your customer's email here
    amount: amount * 100, //amount the customer is supposed to pay
    currency: "NGN",
    metadata: {
      custom_fields: [
        {
          display_name: localStorage["SCHOOL_NAME"],
          variable_name: localStorage["SCHOOL_NAME"],
          value: localStorage["SCHOOL_PHONE"], //customer's mobile number
        },
      ],
    },
    callback: function (response) {
      console.table(response);

      //after the transaction have been completed

      //make post call  to the server with to verify payment
      //UPDATE THE SUBCRIPTION TABLE
      fetch(
        "https://api.paystack.co/transaction/verify/" + response.reference,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            Authorization: "Bearer " + localStorage["PSSK"],
          },
        }
      )
        .then(function (res) {
          return res.json();
        })

        .then((resp) => {
          console.table(resp);
          if (resp.data.status == "success") {
            //UPDATE THE SUBCRIPTION TABLE
            warningtoast("Recording payment ... please wait");
            fetch(ip + "/api/bursary/portal-subscription", {
              method: "PUT",
              headers: {
                Accept: "application/json",
                "Content-type": "application/json",
                Authorization: "Bearer " + localStorage["token"],
              },
              body: JSON.stringify({
                id: id,
                subscription_id: subscription_id + "-" + response.reference,
                amount: amount,
                description: description,
              }),
            })
              .then(function (res) {
                console.log(res.status);
                if (res.status == 401) {
                  openAuthenticationModal();
                }
                return res.json();
              })
              .then((data) => {
                if (data.success) {
                  toastr.remove();
                  successtoast(data.message);
                  getPortalSubscription();
                } else {
                  errortoast(data.message);
                }
              })
              .catch((err) => console.log(err));
          } else {
            errortoast("TRANSACTION FAILED");
          }
        })
        .catch((err) => console.log(err));
      //using transaction reference as post data
    },
    onClose: function () {
      //when the user close the payment modal
      alert("Transaction cancelled");
    },
  });
  handler.openIframe(); //open the paystack's payment modal
}

//GET CREDENTIALS
function getStoredCredential() {
  fetch(ip + "/api/general/stored-credential", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      localStorage.setItem("PSPK", data.PSPK);
      localStorage.setItem("PSSK", data.PSSK);
    })
    .catch((err) => console.log(err));
}
// RESET ACCOUNT
function resetAccount(user_type, id) {
  warningtoast("<b>Processing ... Please wait</b>");
  fetch(ip + "/api/admin/reset-account", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      user_type: user_type,
      id: id,
    }),
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })
    .then((data) => {
      toastr.remove();
      if (data.success) {
        successtoast("<b>" + data.message + "</b>");
      } else {
        errortoast("<b>" + data.message + "</b>");
      }
    })
    .catch((err) => console.log(err));
}

// ID CARD GENERATOR
async function generateIDCard() {
  document.getElementById("idcard_list").innerHTML = ``;
  user_type =
    document.getElementById("user_type_card").value == ""
      ? alert("WHO DO YOU WANT TO GENERATE ID CARD FOR ?")
      : document.getElementById("user_type_card").value;

  user_class_sector = document.getElementById("user_class_sector").value =
    document.getElementById("user_class_sector").value;

  document.getElementById("generate_idcard").innerHTML = `<i
    class="fa fa-spinner fa-spin"></i> Generating Cards Please wait ...`;

  document.getElementById("generate_idcard").disabled = true;

  await getSchoolDetails();
  // STUDENT_IMAGE
  user_image = domain + "/backend/storage/app/public/fileupload";

  // MINI SCHOOL LOGO
  school_logo_mini =
    domain + "/backend/storage/app/public/fileupload/school_logo_mini.png";

  if (user_type == "STUDENT") {
    user_image = user_image + "/student/";
  } else {
    user_image = user_image + "/staff/";
  }

  response = user_type == "STUDENT" ? getAllStudent() : getAllStaff();
  json_to_generate_qr = [];
  c = 1;
  response.then(function (data) {
    // CREATE TEMPLATE
    for (i in data) {
      if (
        user_type == "STUDENT" &&
        (data[i].class == null || data[i].class == "GRADUATED")
      ) {
        continue;
      }
      document.getElementById(
        "idcard_list"
      ).innerHTML += `<div style="margin-top: 20px;" class="container">
      <div class="padding">
          <div class="font">
              <div class="top">
                  <b>
                      <h4 id="school_name"
                          style="text-align: center; font-weight: bold; font-family: Poppins; color:white !important; margin-bottom: 0%; padding: 5px;">
                         ${localStorage["SCHOOL_NAME"]}
                      </h4>
                  </b>
                  <div
                      style="display: flex; justify-content: center; margin-top: 0px; margin-bottom: 100px;">
                      <img id="school_logo_mini" style="padding: 0%;" src="${school_logo_mini}" width="px">
                  </div>


                  <img id="user_image"
                      style="border-color: white; border-style: solid;padding: 0%; margin-top: 5px;"
                      src="${
                        user_type == "STUDENT"
                          ? user_image + data[i].student_id + ".png"
                          : user_image + data[i].teacher_id + ".png"
                      }" width="">


              </div>
              <div class="bottom">
                  <div style="margin-bottom:5px">
                      <p id="full_name" style="margin-bottom: 1px; font-family: Poppins; font-style: bold
                  ;color: black;">${
                    data[i].first_name + " " + data[i].last_name
                  }</p>
                      <p id="id" style="margin-bottom: 1px; color: black; ">${
                        user_type == "STUDENT"
                          ? data[i].student_id
                          : data[i].teacher_id
                      }</p>

                      <small>
                          <p id="gender" style="margin-bottom: 30px; color: black; font-size: 15px;">
                              ${data[i].gender}</p>
                      </small>

                  </div>
                  <br>


                  <div style="display: flex; justify-content: center; margin-top: 0px">
                      <img id="school_logo_mini"
                          style="border-color: white; border-style: solid;padding: 0%;" src=""
                          width="px">
                  </div>

                  <div style="margin-top: 20px;margin-bottom: 210px;">
                      <h5 id ="user_type" style="font-family: Poppins
                  ;color: black; text-align: center;">${
                    user_type == "STUDENT" ? "STUDENT" : "STAFF"
                  }</h5>
                  </div>

              </div>
          </div>
      </div>
      <div class="back">
          <h1 style="margin-bottom: 0; font-family: Poppins
          ;" class="Details">INFORMATION</h1>
          <hr style="background-color: white !important;">
          <small>
              <h6 style="text-align: center;color: white !important; margin-bottom: 2%;">SCAN HERE<br>
              </h6>
          </small>
          <div style="margin-top: 0%;" class="qrcode">
              <div style="display: flex; justify-content: center; text-align: center;" id="IDQR${
                data[i].id
              }">
              </div>
          </div>
          <div class="details-info">
              <h6 style="text-align: center;color: white !important;">if found please return to
              </h6>
              <h6 id="school_address"
                  style="text-align: center;color: white !important; margin-bottom: 10px;">
                  ${localStorage["SCHOOL_ADDRESS"]}</h6>

          </div>
      </div>
    </div>
    <div style="break-after:page"></div>
          `;

      json_to_generate_qr.push(data[i]);

      c = c + 1;
    }
    makeQRCode(json_to_generate_qr, user_type);
  });
}

async function generateIDCard2() {
  document.getElementById("idcard_list").innerHTML = ``;
  user_type =
    document.getElementById("user_type_card").value == ""
      ? alert("WHO DO YOU WANT TO GENERATE ID CARD FOR ?")
      : document.getElementById("user_type_card").value;

  user_class_sector = document.getElementById("user_class_sector").value =
    document.getElementById("user_class_sector").value;

  document.getElementById("generate_idcard").innerHTML = `<i
    class="fa fa-spinner fa-spin"></i> Generating Cards Please wait ...`;

  document.getElementById("generate_idcard").disabled = true;

  await getSchoolDetails();
  // STUDENT_IMAGE
  user_image = domain + "/backend/storage/app/public/fileupload";

  // MINI SCHOOL LOGO
  school_logo_mini =
    domain + "/backend/storage/app/public/fileupload/school_logo_mini.png";

  if (user_type == "STUDENT") {
    user_image = user_image + "/student/";
  } else {
    user_image = user_image + "/staff/";
  }

  response = user_type == "STUDENT" ? getAllStudent() : getAllStaff();
  json_to_generate_qr = [];
  c = 1;
  response.then(function (data) {
    // CREATE TEMPLATE
    for (i in data) {
      if (
        user_type == "STUDENT" &&
        (data[i].class == null || data[i].class == "GRADUATED")
      ) {
        continue;
      }
      document.getElementById(
        "idcard_list"
      ).innerHTML += `<div style="margin-top: 20px;" class="container">
      <div class="padding">
          <div class="font">
              <div class="top">
                  <b>
                      <h4 id="school_name"
                          style="text-align: center; font-weight: bold; font-family: Poppins; color:white !important; margin-bottom: 0%; padding: 5px;">
                         ${localStorage["SCHOOL_NAME"]}
                      </h4>
                  </b>
                  

                  <img id="user_image"
                      style="border-color: white; border-style: solid;padding: 0%; margin-top: 5px;"
                      src="${
                        user_type == "STUDENT"
                          ? user_image + data[i].student_id + ".png"
                          : user_image + data[i].teacher_id + ".png"
                      }" width="">


              </div>
              <div class="bottom">
                  <div style="margin-bottom:5px">
                      <p id="full_name" style="margin-bottom: 1px; font-family: Poppins; font-style: bold
                  ;color: black;">${
                    data[i].first_name + " " + data[i].last_name
                  }</p>
                      <p id="id" style="margin-bottom: 1px; color: black; ">${
                        user_type == "STUDENT"
                          ? data[i].student_id
                          : data[i].teacher_id
                      }</p>

                      <small>
                          <p id="gender" style="margin-bottom: 30px; color: black; font-size: 15px;">
                              ${data[i].gender}</p>
                      </small>

                  </div>
                  <br>

                  <div
                      style="display: flex; justify-content: center; margin-top: 0px">
                      <img id="school_logo_mini" style="padding: 0%;" src="${school_logo_mini}" width="px">
                  </div>


                  <div style="margin-top: 20px;margin-bottom: 210px;">
                      <h5 id ="user_type" style="font-family: Poppins
                  ;color: black; text-align: center;">${
                    user_type == "STUDENT" ? "STUDENT" : "STAFF"
                  }</h5>
                  </div>

              </div>
          </div>
      </div>
      <div class="back">
          <h1 style="margin-bottom: 0; font-family: Poppins
          ;" class="Details">INFORMATION</h1>
          <hr style="background-color: white !important;">
          <small>
              <h6 style="text-align: center;color: white !important; margin-bottom: 2%;">SCAN HERE<br>
              </h6>
          </small>
          <div style="margin-top: 0%;" class="qrcode">
              <div style="display: flex; justify-content: center; text-align: center;" id="IDQR${
                data[i].id
              }">
              </div>
          </div>
          <div class="details-info">
              <h6 style="text-align: center;color: white !important;">if found please return to
              </h6>
              <h6 id="school_address"
                  style="text-align: center;color: white !important; margin-bottom: 10px;">
                  ${localStorage["SCHOOL_ADDRESS"]}</h6>

          </div>
      </div>
    </div>
    <div style="break-after:page"></div>
          `;

      json_to_generate_qr.push(data[i]);

      c = c + 1;
    }
    makeQRCode(json_to_generate_qr, user_type);
  });
}

async function makeQRCode(data, user_type) {
  //  QR CODE
  for (i in data) {
    var QRDATA =
      user_type == "STUDENT"
        ? "StudentATDCard~" +
          data[i].id +
          "~" +
          data[i].class.id +
          "~" +
          data[i].first_name
        : "TeacherATDCard~" + data[i].id + "~" + data[i].first_name;

    var qrdiv = "IDQR" + data[i].id;
    qrcode = new QRCode(qrdiv, {
      text: QRDATA,
      width: 128,
      height: 128,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });
  }
}

// RESULT UPLOAD
function getAllstudentForSubjectResultUpload(refresh) {
  document.getElementById("proceed").innerHTML = `<i
  class="fa fa-spinner fa-spin"></i> Processing ...`;
  fetch(ip + "/api/teacher/student-registered", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      subject_id: document.getElementById("subject_class").value,
      session: document.getElementById("session_term").value.split("-")[0],
      term: document.getElementById("session_term").value.split("-")[1],
    }),
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })
    .then((data) => {
      // CLEAR RESUL LIST
      result_list = {};

      document.getElementById("proceed").innerHTML = "Proceed";
      console.log(data);

      document.getElementById("class_summary").innerHTML =
        "<b>CLASS SUMMARY FOR " +
        document.getElementById("subject_class").options[
          document.getElementById("subject_class").selectedIndex
        ].text +
        "</b>";

      document.getElementById("student_registered").innerHTML = ``;
      // RESULT SUMMARY
      document.getElementById("ave").innerHTML = parseFloat(data.avg).toFixed(
        0
      );
      document.getElementById("min").innerHTML = data.min;
      document.getElementById("max").innerHTML = data.max;
      var c = 1;
      if (data.result.length > 0) {
        for (i in data.result) {
          document.getElementById("student_registered").innerHTML += `
            <tr  ${c % 2 == 0 ? `class="even"` : `class="odd"`}>

            <td>${c}.</td>
            <td>${
              data.result[i].student.first_name +
              " " +
              data.result[i].student.middle_name +
              " " +
              data.result[i].student.last_name
            }</td>
            
            <td class="allownumeric" oninput="scoreLimit(this); addToResultList('${
              data.result[i].id
            }','first_ca',this.innerHTML)" contenteditable="true" >${
            data.result[i].first_ca
          }</td>
            <td oninput="scoreLimit(this); addToResultList('${
              data.result[i].id
            }','second_ca',this.innerHTML)" contenteditable="true">${
            data.result[i].second_ca
          }</td>
            <td oninput="scoreLimit(this); addToResultList('${
              data.result[i].id
            }','examination',this.innerHTML)" contenteditable="true">${
            data.result[i].examination
          }</td>
            <td style="font-size:20px; font-style:bold;"><b>${
              data.result[i].total
            }</b></td>
            <td> 
              <div class="select">
                  <select onChange="addToResultList('${
                    data.result[i].id
                  }','grade',this.value)" id="standard-select" id="grade" value="${
            data.result[i].grade == "-"
              ? "Select Grade"
              : `${data.result[i].grade}`
          }" class="select2">
                  <option value="<b>${
                    data.result[i].grade == `-`
                      ? `-`
                      : `${data.result[i].grade}`
                  }</b>">${
            data.result[i].grade == "-"
              ? "Select Grade"
              : `${data.result[i].grade}`
          }</option>
            ${
              // <option value="A">A</option>
              // <option value="B">B</option>
              // <option value="C">C</option>
              // <option value="D">D</option>
              // <option value="E">E</option>
              // <option value="F">F</option>
              ``
            }
                  </select>
            
                <span class="focus"></span>
              <div>
            </td>
            <td> 
            <div class="select">
                <select onChange="addToResultList('${
                  data.result[i].id
                }','remark',this.value)" id="standard-select" id="remark" value="<b>${
            data.result[i].grade == "-"
              ? "Select Remark"
              : `${data.result[i].remark}`
          }</b>" class="select2">
                <option value="${
                  data.result[i].remark == `-`
                    ? `-`
                    : `${data.result[i].remark}`
                }">${
            data.result[i].remark == "-"
              ? "Select Remark"
              : `${data.result[i].remark}`
          }</option>
                ${
                  //<option value="EXCELLENT">EXCELLENT</option>
                  // <option value="VERY GOOD">VERY GOOD</option>
                  // <option value="GOOD">GOOD</option>
                  // <option value="FAIR">FAIR</option>
                  // <option value="POOR">POOR</option>
                  // <option value="VERY POOR">VERY POOR</option>
                  ``
                }
                </select>
                <span class="focus"></span>
              <div>
            </td>
            
            

        </tr>`;
          c = c + 1;
        }
      }
    })
    .catch((err) => console.log(err));
}

function uploadResult(id, result_type, score) {
  if (result_type == "grade" || result_type == "remark") {
    document.getElementById("result_upload_style_grade_remark").innerHTML = `
    :root {
      --select-border: #777;
      --select-focus: #fc8c03;
      --select-arrow: var(--select-border);
  }`;
  } else {
    document.getElementById("result_upload_style").innerHTML = `
    [contenteditable] {

      outline-color: #fc8c03;
    }`;
  }

  fetch(ip + "/api/teacher/upload-result", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      id: id,
      result_type: result_type,
      score: score,
    }),
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })
    .then((data) => {
      if (data.success) {
        if (result_type == "grade" || result_type == "remark") {
          document.getElementById(
            "result_upload_style_grade_remark"
          ).innerHTML = `
          :root {
            --select-border: #777;
            --select-focus: #105c05;
            --select-arrow: var(--select-border);
        }`;
        } else {
          document.getElementById("result_upload_style").innerHTML = `
          [contenteditable] {
          
            outline-color: #105c05;
          }`;
          getAllstudentForSubjectResultUpload(true);
        }
      }
    })
    .catch((err) => console.log(err));

  console.log(score);
}

function addToResultList(id, result_type, score) {
  let result_obj = {};

  // CHECK IF KEY EXIST
  if (result_list[id]) {
    result_list[id][result_type] = score;
  } else {
    result_obj[result_type] = score;
    result_list[id] = result_obj;
  }
  console.log(result_list);
}

function uploadBulkResult() {
  if (Object.keys(result_list).length === 0) {
    errortoast("No result found");
    return 0;
  }
  warningtoast("Uploading result please wait ...");
  fetch(ip + "/api/teacher/upload-result/bulk", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify(result_list),
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })
    .then((data) => {
      toastr.remove();
      if (data.success) {
        successtoast(data.message);
        getAllstudentForSubjectResultUpload(true);
      } else {
        errortoast(data.message);
      }
    })
    .catch((err) => console.log(err));
}

// CUSTOM SUBJECT CLASS
function loadCustomSubjectClass() {
  fetch(ip + "/api/admin/all-subject", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      document.getElementById("subject_class").innerHTML = "";
      for (i in data) {
        document.getElementById(
          "subject_class"
        ).innerHTML += `<option value="${data[i].id}">${data[i].subject_name} (${data[i].class.class_name})</option>`;
      }

      getLessonPlan("ALL");
      subjects = document.getElementById("subject_class");
      localStorage.setItem(
        "lp_subject_class",
        subjects.options[subjects.selectedIndex].text
      );
    })
    .catch((err) => console.log(err));
}

// CUSTOM SESSION TERM
function loadCustomSessionTerm() {
  term = ["THIRD TERM", "SECOND TERM", "FIRST TERM"];

  fetch(ip + "/api/general/all-session/DESC", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      document.getElementById("session_term").innerHTML = `<option value="${
        localStorage["current_session"] + "-" + localStorage["current_term"]
      }">${
        localStorage["current_session"] + " - " + localStorage["current_term"]
      }</option>`;
      data.forEach((sessions) => {
        term.forEach((term) => {
          document.getElementById(
            "session_term"
          ).innerHTML += `<option value="${sessions.session + "-" + term}">${
            sessions.session + " - " + term
          }</option>`;
        });
      });
    })
    .catch((err) => console.log(err));
}

function downloadAsPDF(container) {
  const file = this.document.getElementById(container);
  var opt = {
    // margin: 1,
    // filename: "idcards.pdf",
    // image: { type: "png", quality: 0.98 },
    // html2canvas: { scale: 2 },
    // jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    margin: 0,
    filename: "time_sheet_report.pdf",
    image: { type: "jpeg", quality: 0.2 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "in", format: "a4", orientation: "p" },
  };
  html2pdf().from(file).set(opt).save();
}

function print() {
  var divContents = document.getElementById("idcard_list").innerHTML;
  var head = document.getElementById("common-library").innerHTML;
  console.log(divContents);
  var a = window.open("", "", "height=1000, width=1000");
  a.document.write("<html>");
  a.document.write(head);
  a.document.write(divContents);
  a.document.write(`</body></html>`);
  a.print();
  a.document.close();
}

// RESULT UPLOAD DEBOUCER
// DEBOUNCER
function debounce(func, timeout = 2000) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

const uploadResultDebouncer = debounce((id, result_type, score) =>
  uploadResult(id, result_type, score)
);

// COUNT ARRAY DISTINT VALUE
function countDistinct(arr, n) {
  let res = 1;

  // Pick all elements one by one
  for (let i = 1; i < n; i++) {
    let j = 0;
    for (j = 0; j < i; j++) if (arr[i] === arr[j]) break;

    // If not printed earlier, then print it
    if (i === j) res++;
  }
  return res;
}

function scoreLimit(element) {
  var max_chars = 2;
  if (element.innerHTML.length > max_chars) {
    element.innerHTML = element.innerHTML.substr(0, max_chars);
    element.blur();
  }
}

$(document).click(function (e) {
  if (!$(e.target).closest("#authenticationModal").length) {
    var modalExist = parent.document.getElementById("authenticationModal");
    if (modalExist != null) {
      modalExist.remove();

      parent.document.querySelectorAll(".modal-backdrop").forEach((el) => {
        console.log(el);
        el.remove();
      });
    }
  }
});

// RE - AUTHENTICATION MODAL
function openAuthenticationModal() {
  var modal = `<div class="modal fade" id="authenticationModal" tabindex="-1" role="dialog"
aria-labelledby="endModalTitle" aria-hidden="true" data-backdrop="static" data-keyboard="false">
<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
    <div class="modal-content">
        <div class="modal-header">
            <h4 style="font-family: Poppins; font-weight: bold;"
                class="modal-title col-12 text-center" id="authenticationModalTitle">
                <b>Session Timeout !</b>
            </h4>

        </div>
        <div class="modal-body text-center">
            <div class="row">
                <div class="col-lg-12 img-box">
                    <img src="../asset/images/login-banner.png" alt="">
                </div>
                <div class="col-lg-12 no-padding">
                    <div class="login-box">
                        <link rel="stylesheet" type="text/css" href="../asset/css/style.css" />
                        <link href="../assets/css/lib/toastr/toastr.min.css" rel="stylesheet">
                        <link href="../assets/css/lib/sweetalert/sweetalert.css" rel="stylesheet">
                        <div style="display: flex;
                        justify-content: center;" class="row">

                            <b>
                                <h3 style="font-weight: bold; font-family: Rowdies; color:#051f3e;">
                                    <i style="color: #051f3e;"
                                        class="fas fa-graduation-cap fa-xs"></i>
                                    SMARTSCHOOLHUB.net
                                </h3>
                            </b>

                        </div>
                        <br>

                        <h5 style="color: #ff9d01; font-family: Poppins; font-weight: bold;">Hi
                           ${localStorage["username"]},</script> please
                            signin
                            to continue
                        </h5>
                       <form autocomplete="off">   
                            <label for=""><i class="fas fa-unlock-alt"></i> Password</label>
                            <div class="login-row row no-margin">
                               
                                <input id="password" type="password" autocomplete="new-password"
                                    class="form-control form-control-sm">
                                    <br>
                                    <small id="togglePass" style="cursor:pointer; font-style:bold">Show password</small>
                            </div>
                        </form>    
                        <br>
                        <a  style="float: right; color: red;" href="./index.html">Log out</a>


                        <div class="login-row btnroo row no-margin">
                            <button id="signin" onclick="reAuth()"
                                class="btn btn-primary btn-sm ">Sign
                                In</button>
                        </div>

                        <br />

                    </div>
                    <footer class="footer">
                        <div style="display: flex;
                        justify-content: center;" class="copyright">© <a  style="color: #051f3e;"
                                href="../#"><b>
                                    Dextroux Technologies</b></a></div>
                    </footer>
                </div>

            </div>
            <script>
                const password = document.querySelector('#password');
                togglePass.addEventListener('click', function (e) {
                    // toggle the type attribute
                    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
                    password.setAttribute('type', type);
                    parent.document.getElementById('togglePass').innerHTML = parent.document.getElementById('togglePass').innerHTML == 'Show password' ? 'Hide password' : 'Show password';
                })
            </script>
            <script src="../assets/js/lib/toastr/toastr.min.js"></script>
            <script src="../assets/js/lib/toastr/toastr.init.js"></script>
            <script src="../assets/js/lib/sweetalert/sweetalert.min.js"></script>
            <script src="../assets/js/lib/sweetalert/sweetalert.init.js"></script>
        </div>
    </div>
</div>
</div>
`;

  authenticationModal = parent.document.getElementById("authenticationModal");
  if (authenticationModal != null) {
    return 0;
  }

  parent.$("body").append(modal);
  parent
    .$("#authenticationModal")
    .modal({ backdrop: "static", keyboard: false });
  parent.$("#authenticationModal").modal("show");
}

function openSpinnerModal(message) {
  modal = `<div class="modal fade" id="spinnerModal" tabindex="-1" role="dialog"
aria-labelledby="endModalTitle" aria-hidden="true" data-backdrop="static" data-keyboard="false">
<div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
        <div class="modal-body text-center">
        <div class="spinner-grow text-primary" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <div class="spinner-grow text-secondary" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <div class="spinner-grow text-success" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <div class="spinner-grow text-danger" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <div class="spinner-grow text-warning" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <div class="spinner-grow text-info" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <div class="spinner-grow text-light" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <div class="spinner-grow text-dark" role="status">
        <span class="sr-only">Loading...</span>
      </div>
        </div>

        <h4 style="font-family: Poppins; font-weight: bold;"
                class="modal-title col-12 text-center" id="spinnerModalTitle">
                <b>${message != null || message != "" ? message : ``}</b><br/>
                <b>Processing ...</b>
            </h4>
            <br>
    </div>
</div>
</div>
`;

  spinnerModal = parent.document.getElementById("spinnerModal");
  if (spinnerModal != null) {
    return 0;
  }

  parent.$("body").append(modal);
  parent.$("#spinnerModal").modal({ backdrop: "static", keyboard: false });
  parent.$("#spinnerModal").modal("show");
}

function removeSpinnerModal() {
  spinnerModal = parent.document.getElementById("spinnerModal");
  if (spinnerModal != null) {
    parent.$("#spinnerModal").modal("hide");
    parent.document.getElementById("spinnerModal").remove();
  }
}

function collapseSidebar() {
  if (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    // navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
  ) {
    // MOBILE
    a = true;
  } else {
    // DESKTOP
    wrapper = document.getElementById("wrapper");
    if (wrapper != null) {
      if ((wrapper.className = "wrapper bg-ash")) {
        wrapper.className = "wrapper bg-ash sidebar-collapsed";
        if (document.getElementById("logo").innerHTML != "") {
          changeLogo();
        }
      }
    }
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
    timeOut: 10000,
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

// SOUND VARIABLES
var successSound = new Audio("../asset/sound/verified.mp3");
var errorSound = new Audio("../asset/sound/error1.mp3");

// DEVELOPMENT IP
//var ip = "http://127.0.0.1:8000";
//var domain = "http://localhost/smartschoolhub.net/amazingbotim";

// LIVE IP
var ip = "https://smartschoolhub.net/backend/amazingbotim";
var domain = "https://amazingbotim.smartschoolhub.net";

// // REMOTE ACCESS
// var ip = "http://192.168.42.168/smartschoolhub.net/SSHUB_BACKEND/server.php";
// var domain = "http://192.168.42.168/smartschoolhub.net";

window.addEventListener("online", () =>
  successtoast("<b>INTERNET CONNECTED</b>")
);
window.addEventListener("offline", () =>
  errortoast("<b>INTERNET DISCONNECTED</b>")
);

getSchoolDetails();
if (!window.location.href.includes("portal-subscription") && localStorage["token"] != null) {
  checkPortalSubscription();
}
loadSchoolColor();

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
          window.location.href = "index.html";
        }
        return res.json();
      })

      .then((data) => {
        toastr.remove();
        if (data.success) {
          successtoast("<b>" + data.message + "</b>");
          localStorage.setItem("user_data", JSON.stringify(data));
          localStorage.setItem("token", data.token);
          getStoredCredential();
          username = JSON.parse(localStorage["user_data"]).data.username;

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
        window.parent.location.assign(domain + "/admin/");
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
        <a  id="student-attendance" href="student-attendance.html" class="nav-link"> <i class="fas fa-chart-line"></i></i>
        <span>Student Attendance</span></a>
    </li>

    <li class="nav-item">
        <a  id="teacher-attendance" href="teacher-attendance.html" class="nav-link"> <i class="fas fa-chart-line"></i></i>
        <span>Staff Attendance</span></a>
    </li>

    <li class="nav-item">
        <a onclick="goTo('')" href="#" class="nav-link"><i class="flaticon-turn-off"></i><span>Log
                Out</span></a>
    </li>

    
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
  } else {
    document.getElementById("side_nav").innerHTML = `
    <ul class="nav nav-sidebar-menu sidebar-toggle-view">
    <li class="nav-item">
        <a id="dashboard" href="dashboard.html" class="nav-link"><i
                class="flaticon-dashboard"></i><span>Dashboard</span></a>
    </li>

    <li class="nav-item">
        <a   id="students" href="students.html" class="nav-link"><i class="flaticon-classmates"></i><span>Student Management</span></a>
    </li>

    <li class="nav-item">
        <a  id="teachers" href="teachers.html" class="nav-link"> <i class="flaticon-multiple-users-silhouette"></i>
        <span>Staff Management</span></a>
    </li>

    
    <li class="nav-item">
        <a  id="class" href="class.html" class="nav-link"> <i class="fas fa-plus"></i>
        <span>Class Management</span></a>
    </li>

    <li class="nav-item">
        <a  id="subject" href="subject.html" class="nav-link"> <i class="fas fa-plus"></i>
        <span>Subject Management</span></a>
    </li>

    <li class="nav-item">
        <a  id="session-management" href="session-management.html" class="nav-link"> <i class="fas fa-tasks"></i>
        <span>Session Management</span></a>
    </li>


    <li class="nav-item">
        <a  id="grade-settings" href="grade-settings.html" class="nav-link"> <i class="fas fa-tools"></i></i>
        <span>Grade Settings</span></a>
    </li>

    <li class="nav-item">
        <a  id="student-attendance" href="student-attendance.html" class="nav-link"> <i class="fas fa-chart-line"></i></i>
        <span>Student Attendance</span></a>
    </li>

    <li class="nav-item">
        <a  id="teacher-attendance" href="teacher-attendance.html" class="nav-link"> <i class="fas fa-chart-line"></i></i>
        <span>Staff Attendance</span></a>
    </li>

    <li class="nav-item">
        <a  id="control-panel" href="control-panel.html" class="nav-link"> <i class="flaticon-settings-work-tool"></i></i>
        <span>Control Panel</span></a>
    </li>

    <li class="nav-item">
        <a  id="inventory" href="inventory.html" class="nav-link"><i class="fas fa-box-open"></i>
        <span>Inventory <small><sup><span style="color:white" class="badge bg-success"><b>NEW</b></span></sup></small></span></a>
    </li>

    <li class="nav-item">
        <a id="portal-subscription" href="portal-subscription.html" class="nav-link"><i class="fa fa-wrench" aria-hidden="true"></i><span>Portal Subscription</span></a>
    </li>

    <li class="nav-item">
        <a  id="events-timetable" href="#?events.html" class="nav-link"><i
                class="flaticon-calendar"></i><span>Events <sup><small>Coming Soon ...</small></sup></span></a>
    </li>

    <li class="nav-item">
        <a  id="create-notification" href="#?create-notification.html" class="nav-link"><i class="far fa-bell"></i>
        <span>Notification <sup><small>Coming Soon ...</small></sup></span></a>
    </li>

    <li class="nav-item">
        <a  id="change-password" href="#?change-password.html" class="nav-link"><i
                class="flaticon-settings"></i><span>Change Password</span></a>
    </li>

    <li class="nav-item">
        <a onclick="goTo('')" href="#" class="nav-link"><i class="flaticon-turn-off"></i><span>Log
                Out</span></a>
    </li>

    <!-- <li class="nav-item">
      <a style="cursor: pointer; color:white" id="" onclick="window.parent.location.assign('${
        domain + "/bursary/dashboard.html"
      }')" class="nav-link"><span><b>GOTO BURSARY</b></span></a>
    </li> !-->
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
  }

  document.getElementById(page).className += " menu-active";
}

function goTo(page) {
  if (page == "") {
    localStorage.clear();
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
        window.parent.location.assign(domain + "/admin/");
      }
      return res.json();
    })

    .then((data) => {
      for (i in data) {
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
        window.parent.location.assign(domain + "/admin/");
      }
      return res.json();
    })

    .then((data) => {
      for (i in data) {
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
        window.parent.location.assign(domain + "/admin/");
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
        <a onmouseover="viewTeacher(${JSON.stringify(data[i]).replace(/'/g,"").replace(
          /"/g,
          "'"
        )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                data-bs-target="#viewModal"><i class="fas fa-eye"></i> </a>
        <a onmouseover="reloadEditFrame(); editTeacher(${JSON.stringify(
          data[i]
        ).replace(/"/g, "'")})" class="btn btn-warning" data-bs-toggle="modal"
        data-bs-target="#editModal"><i class="fas fa-edit"></i></a>
    
        
        <a onclick="updateTeacherProfileStatus(${
          data[i].id
        })" class="btn gradient-orange-peel"><i
            class='${
              data[i].profile_status == "ENABLED"
                ? "fas fa-lock"
                : "fas fa-unlock-alt"
            }'></i></a>  
            
        <a onclick="viewStaffIDCard(${JSON.stringify(data[i]).replace(/'/g,"").replace(
          /"/g,
          "'"
        )})" class="btn btn-secondary text-white">
          <i class="fas fa-id-card"></i>
               </a> 
        
        <a onclick="resetAccount('STAFF','${
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
          window.location.href = "index.html";
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
          window.location.href = "index.html";
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
        window.parent.location.assign(domain + "/admin/");
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
        window.parent.location.assign(domain + "/admin/");
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
        window.parent.location.assign(domain + "/admin/");
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
              <a onmouseover="viewTeacher(${JSON.stringify(data[i]).replace(/'/g,"").replace(
                /"/g,
                "'"
              )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                      data-bs-target="#viewModal"><i class="fas fa-eye"></i> View</a>
              <a onmouseover="reloadEditFrame(); editTeacher(${JSON.stringify(
               data[i]).replace(/'/g,"").replace(
                /"/g,
                "'"
              )})" class="btn btn-warning" data-bs-toggle="modal"
              data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
  
              
              <a onclick="updateTeacherProfileStatus(${
                data[i].id
              })" class="btn gradient-orange-peel"><i
                  class="fas fa-lock"></i> Disable</a>  
  
              <a onclick="viewStaffIDCard(${JSON.stringify(data[i]).replace(/'/g,"").replace(
                /"/g,
                "'"
              )})" class="btn btn-secondary text-white"><i
                          class="fas fa-id-card"></i>
                      ID Card</a> 
              
              <a onclick="deleteTeacher(${
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
              <a onmouseover="viewTeacher(${JSON.stringify(data[i]).replace(/'/g,"").replace(
                /"/g,
                "'"
              )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                      data-bs-target="#viewModal"><i class="fas fa-eye"></i> View</a>
              <a onmouseover="reloadEditFrame(); editTeacher(${JSON.stringify(
               data[i]).replace(/'/g,"").replace(
                /"/g,
                "'"
              )})" class="btn btn-warning" data-bs-toggle="modal"
              data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
  
              
              <a onclick="updateTeacherProfileStatus(${
                data[i].id
              })" href="#" class="btn gradient-orange-peel"><i class="fas fa-unlock-alt"></i> Enable</a>  
  
              <a onclick="viewStaffIDCard(${JSON.stringify(data[i]).replace(/'/g,"").replace(
                /"/g,
                "'"
              )})" class="btn btn-secondary text-white"><i
                          class="fas fa-id-card"></i>
                      ID Card</a>
              
              <a onclick="deleteTeacher(${
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
              <a onmouseover="viewTeacher(${JSON.stringify(data[i]).replace(/'/g,"").replace(
                /"/g,
                "'"
              )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                      data-bs-target="#viewModal"><i class="fas fa-eye"></i> View</a>
              <a onmouseover="reloadEditFrame(); editTeacher(${JSON.stringify(
               data[i]).replace(/'/g,"").replace(
                /"/g,
                "'"
              )})" class="btn btn-warning" data-bs-toggle="modal"
              data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
  
              
              <a onclick="updateTeacherProfileStatus(${
                data[i].id
              })" href="#" class="btn gradient-orange-peel"><i
                  class="fas fa-lock"></i> Disable</a>  
              
              <a onclick="viewStaffIDCard(${JSON.stringify(data[i]).replace(/'/g,"").replace(
                /"/g,
                "'"
              )})" class="btn btn-secondary text-white"><i
                          class="fas fa-id-card"></i>
                      ID Card</a>    
              
              <a onclick="deleteTeacher(${
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
              <a onmouseover="viewTeacher(${JSON.stringify(data[i]).replace(/'/g,"").replace(
                /"/g,
                "'"
              )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                      data-bs-target="#viewModal"><i class="fas fa-eye"></i> View</a>
              <a onmouseover="reloadEditFrame(); editTeacher(${JSON.stringify(
               data[i]).replace(/'/g,"").replace(
                /"/g,
                "'"
              )})" class="btn btn-warning" data-bs-toggle="modal"
              data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
  
              
              <a onclick="updateTeacherProfileStatus(${
                data[i].id
              })" href="#" class="btn gradient-orange-peel"><i class="fas fa-unlock-alt"></i> Enable</a>  
  
              <a onclick="viewStaffIDCard(${JSON.stringify(data[i]).replace(/'/g,"").replace(
                /"/g,
                "'"
              )})" class="btn btn-secondary text-white"><i
                          class="fas fa-id-card"></i>
                      ID Card</a>
              
              <a onclick="deleteTeacher(${
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
        window.parent.location.assign(domain + "/admin/");
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
          <a onmouseover="viewStudent(${JSON.stringify(data[i]).replace(/'/g,"").replace(
            /"/g,
            "'"
          )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                  data-bs-target="#viewModal"><i class="fas fa-eye"></i> </a>
          <a onmouseover="reloadEditFrame(); editStudent(${JSON.stringify(data[i]).replace(/'/g,"").replace(/"/g, "'")})" class="btn btn-warning" data-bs-toggle="modal"
          data-bs-target="#editModal"><i class="fas fa-edit"></i></a>
      
          
          <a  onclick="updateStudentProfileStatus(${
            data[i].id
          })" class="btn gradient-orange-peel"><i
              class='${
                data[i].profile_status == "ENABLED"
                  ? "fas fa-lock"
                  : "fas fa-unlock-alt"
              }'></i></a>  
              
          <a onclick="viewStudentIDCard(${JSON.stringify(data[i]).replace(/'/g,"").replace(
            /"/g,
            "'"
          )})" class="btn btn-secondary text-white">
            <i class="fas fa-id-card"></i>
                 </a> 
          
          <a onclick="resetAccount('STUDENT','${
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

{
  /* <a onclick="deleteStudent(${
  data[i].id
})" class="btn btn-danger text-white"><i
            class="fas fa-trash"></i>
        Delete</a> */
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

  document.getElementById("class").innerHTML =
    `<option value="${json.class.id}">${json.class.class_name}</option>` +
    document.getElementById("class").innerHTML;

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
  var student_class = document.getElementById("class").value;

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
          window.parent.location.assign(domain + "/admin/");
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
  var student_class = document.getElementById("class").value;

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
          window.location.href = "index.html";
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
        window.parent.location.assign(domain + "/admin/");
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
        window.parent.location.assign(domain + "/admin/");
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
        window.parent.location.assign(domain + "/admin/");
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
            <a onmouseover="viewStudent(${JSON.stringify(data[i]).replace(/'/g,"").replace(
              /"/g,
              "'"
            )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                    data-bs-target="#viewModal"><i class="fas fa-eye"></i> View</a>
            <a onmouseover="reloadEditFrame(); editStudent(${JSON.stringify(
              data[i]
            ).replace(
              /"/g,
              "'"
            )})" class="btn btn-warning" data-bs-toggle="modal"
            data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>

            
            <a onclick="updateStudentProfileStatus(${
              data[i].id
            })" class="btn gradient-orange-peel"><i
                class="fas fa-lock"></i> Disable</a>  

            <a onclick="viewStudentIDCard(${JSON.stringify(data[i]).replace(/'/g,"").replace(
              /"/g,
              "'"
            )})" class="btn btn-secondary text-white"><i
                        class="fas fa-id-card"></i>
                    ID Card</a> 
            
            <a onclick="deleteStudent(${
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
            <a onmouseover="viewStudent(${JSON.stringify(data[i]).replace(/'/g,"").replace(
              /"/g,
              "'"
            )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                    data-bs-target="#viewModal"><i class="fas fa-eye"></i> View</a>
            <a onmouseover="reloadEditFrame(); editStudent(${JSON.stringify(
              data[i]
            ).replace(
              /"/g,
              "'"
            )})" class="btn btn-warning" data-bs-toggle="modal"
            data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>

            
            <a onclick="updateStudentProfileStatus(${
              data[i].id
            })" href="#" class="btn gradient-orange-peel"><i class="fas fa-unlock-alt"></i> Enable</a>  

            <a onclick="viewStudentIDCard(${JSON.stringify(data[i]).replace(/'/g,"").replace(
              /"/g,
              "'"
            )})" class="btn btn-secondary text-white"><i
                        class="fas fa-id-card"></i>
                    ID Card</a> 
            
            <a onclick="deleteStudent(${
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
            <a onmouseover="viewStudent(${JSON.stringify(data[i]).replace(/'/g,"").replace(
              /"/g,
              "'"
            )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                    data-bs-target="#viewModal"><i class="fas fa-eye"></i> View</a>
            <a onmouseover="reloadEditFrame(); editStudent(${JSON.stringify(
              data[i]
            ).replace(
              /"/g,
              "'"
            )})" class="btn btn-warning" data-bs-toggle="modal"
            data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>

            
            <a onclick="updateStudentProfileStatus(${
              data[i].id
            })" href="#" class="btn gradient-orange-peel"><i
                class="fas fa-lock"></i> Disable</a>  

            <a onclick="viewStudentIDCard(${JSON.stringify(data[i]).replace(/'/g,"").replace(
              /"/g,
              "'"
            )})" class="btn btn-secondary text-white"><i
                        class="fas fa-id-card"></i>
                    ID Card</a> 
            
            <a onclick="deleteStudent(${
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
            <a onmouseover="viewStudent(${JSON.stringify(data[i]).replace(/'/g,"").replace(
              /"/g,
              "'"
            )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                    data-bs-target="#viewModal"><i class="fas fa-eye"></i> View</a>
            <a onmouseover="reloadEditFrame(); editStudent(${JSON.stringify(
              data[i]
            ).replace(
              /"/g,
              "'"
            )})" class="btn btn-warning" data-bs-toggle="modal"
            data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>

            
            <a onclick="updateStudentProfileStatus(${
              data[i].id
            })" href="#" class="btn gradient-orange-peel"><i class="fas fa-unlock-alt"></i> Enable</a>  

            <a onclick="viewStudentIDCard(${JSON.stringify(data[i]).replace(/'/g,"").replace(
              /"/g,
              "'"
            )})" class="btn btn-secondary text-white"><i
                        class="fas fa-id-card"></i>
                    ID Card</a> 
            
            <a onclick="deleteStudent(${
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
        window.parent.location.assign(domain + "/admin/");
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
        window.parent.location.assign(domain + "/admin/");
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
  document.getElementById("student_image").src = url;

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
  document.getElementById("staff_image").src = url;

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
        window.parent.location.assign(domain + "/admin/");
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
            <a onmouseover="reloadEditFrame();localStorage.setItem('editClass','${
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
                <a onclick="deleteClass(${
                  data[i].id
                })" class="btn btn-danger text-white"><i
                        class="fas fa-trash"></i>
                    Delete</a>
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
            <a onmouseover="reloadEditFrame();localStorage.setItem('editClass','${
              data[i].id
            }~${data[i].class_name}~~~${
            data[i].class_sector
          }')" class="btn btn-warning" data-bs-toggle="modal"
            data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
                <a onclick="deleteClass(${
                  data[i].id
                })" class="btn btn-danger text-white"><i
                        class="fas fa-trash"></i>
                    Delete</a>
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
      for (i in data) {
        document.getElementById(
          "class"
        ).innerHTML += `<option value="${data[i].id}">${data[i].class_name}</option>`;
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
          window.location.href = "index.html";
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
          window.location.href = "index.html";
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
        window.parent.location.assign(domain + "/admin/");
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
        window.parent.location.assign(domain + "/admin/");
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
              <a onmouseover="reloadEditFrame();localStorage.setItem('editClass','${
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
                  <a onclick="deleteClass(${
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
              <a onmouseover="reloadEditFrame();localStorage.setItem('editClass','${data[i].id}~${data[i].class_name}~')" class="btn btn-warning" data-bs-toggle="modal"
              data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
                  <a onclick="deleteClass(${data[i].id})" class="btn btn-danger text-white"><i
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
              <a onmouseover="reloadEditFrame();localStorage.setItem('editClass','${
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
                  <a onclick="deleteClass(${
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
                  <a onmouseover="reloadEditFrame();localStorage.setItem('editClass','${data[i].id}~${data[i].class_name}~')" class="btn btn-warning" data-bs-toggle="modal"
                      data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
                  <a onclick="deleteClass(${data[i].id})" class="btn btn-danger text-white"><i
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
  var class_id = document.getElementById("class").value;
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
          window.location.href = "index.html";
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
        window.parent.location.assign(domain + "/admin/");
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
            <a onmouseover="reloadEditFrame();localStorage.setItem('editSubject','${
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
                <a onclick="deleteSubject(${
                  data[i].id
                })" class="btn btn-danger text-white"><i
                        class="fas fa-trash"></i>
                    Delete</a>
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
            <a onmouseover="reloadEditFrame();localStorage.setItem('editSubject','${
              data[i].id
            }~${data[i].subject_name}~null~null~${data[i].class.class_name}~${
            data[i].class.id
          }')" class="btn btn-warning" data-bs-toggle="modal"
            data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
                <a onclick="deleteClass(${
                  data[i].id
                })" class="btn btn-danger text-white"><i
                        class="fas fa-trash"></i>
                    Delete</a>
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
  var class_id = document.getElementById("class").value;
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
        subject_id: localStorage["editSubject"][0],
        class_id: class_id,
        subject_name: subject_name,
        teacher: teacher,
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
        window.parent.location.assign(domain + "/admin/");
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
        window.parent.location.assign(domain + "/admin/");
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
              <a onmouseover="reloadEditFrame();localStorage.setItem('editSubject','${
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
                  <a onclick="deleteSubject(${
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
              <a onmouseover="reloadEditFrame();localStorage.setItem('editSubject','${
                data[i].id
              }~${data[i].subject_name}~ ~ ~${data[i].class.class_name}~${
                data[i].class.id
              }')" class="btn btn-warning" data-bs-toggle="modal"
              data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
                  <a onclick="deleteClass(${
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
              <a onmouseover="reloadEditFrame();localStorage.setItem('editSubject','${
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
                  <a onclick="deleteSubject(${
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
                  <a onmouseover="reloadEditFrame();localStorage.setItem('editSubject','${
                    data[i].id
                  }~${data[i].subject_name}~ ~ ~${data[i].class.class_name}~${
                data[i].class.id
              }')" class="btn btn-warning" data-bs-toggle="modal"
                      data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
                  <a onclick="deleteSubject(${
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
          window.location.href = "index.html";
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
        window.parent.location.assign(domain + "/admin/");
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
            <a onmouseover="reloadEditFrame();localStorage.setItem('editSession','${data[i].id}~${data[i].session}~${data[i].term}')" class="btn btn-warning" data-bs-toggle="modal"
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
            <a onmouseover="reloadEditFrame();localStorage.setItem('editSession','${data[i].id}~${data[i].session}~${data[i].term}')" class="btn btn-warning" data-bs-toggle="modal"
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
          window.location.href = "index.html";
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
          window.location.href = "index.html";
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
        window.parent.location.assign(domain + "/admin/");
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
                    <a onmouseover="reloadEditFrame();localStorage.setItem('editGrade','${
                      data[i].id
                    }~${data[i].min}~${data[i].max}~${data[i].grade}~${
            data[i].remark
          }')" class="btn btn-warning" data-bs-toggle="modal"
                    data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
  
                    <a onclick="deleteGrade(${
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
          window.location.href = "index.html";
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
        window.parent.location.assign(domain + "/admin/");
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
    say("Card Scanned , Click OK.");
    alert("CARD SCANNED 👍. CLICK OK AND WAIT FOR A RESPONSE.");

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

      if (window.parent.confirm("You are about to CHECK OUT this student !")) {
        // PROCEED TO CHECK OUT STUDENT
        check_out = true;
      } else {
        return 0;
      }
    }

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
          window.parent.location.assign(domain + "/admin/");
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
        window.parent.location.assign(domain + "/admin/");
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
        window.parent.location.assign(domain + "/admin/");
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
    say("Card Scanned , Click OK.");
    alert("CARD SCANNED 👍. CLICK OK AND WAIT FOR A RESPONSE.");

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

      if (window.parent.confirm("You are about to CHECK OUT this staff !")) {
        // PROCEED TO CHECK OUT STAFF
        check_out = true;
      } else {
        return 0;
      }
    }

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
          window.parent.location.assign(domain + "/admin/");
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
        window.parent.location.assign(domain + "/admin/");
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
        window.parent.location.assign(domain + "/admin/");
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
        window.parent.location.assign(domain + "/admin/");
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
        window.location.href = "index.html";
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
        window.location.href = "index.html";
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
    })
    .catch((err) => console.log(err));
}

// LESSON PLAN
function editLessonPlan() {
  document.getElementById("save_lesson_bt").hidden = false;

  lesson_content = document.getElementsByName("lesson_plan_content");

  lesson_content.forEach((element) => {
    element.disabled = false;
  });
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


      <a onclick="saveInventoryItem()" href="#" class="btn btn-primary">
            Save
      </a>
      <a onclick="document.getElementById('new_item_roll').remove()" href="#" class="btn btn-danger">
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
          window.location.href = "index.html";
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
        window.location.href = "index.html";
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
        
              <a id="saveUpdateButton${data.id}" onclick="updateInventoryItem(${
            data.id
          })" href="#" class="btn btn-primary" hidden>
                    Save Update
              </a>
              <a id="editButton${data.id}" onclick="allowEdit(${
            data.id
          },true)" href="#" class="btn btn-warning">
                    Edit
              </a>
              <a id="deleteButton${data.id}" onclick="deleteInventoryItem(${
            data.id
          })" href="#" class="btn btn-danger">
                    Delete
              </a>
  
              <a id="discardButton${data.id}"onclick="allowEdit(${
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
        window.location.href = "index.html";
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
        window.parent.location.assign(domain + "/admin/");
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
        window.location.href = "index.html";
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
                        : data[i].status == "USAGE IN-PROGRESS"
                        ? `bg-warning`
                        : `bg-success`
                    }"><b>${data[i].status}</b></span></td>
                    <td>${formatNumber(parseInt(data[i].amount))}</td>
                    <td>   
                      ${
                        data[i].status == "NOT PAID"
                          ? `<a id="" onclick="payWithPaystack('${data[i].id}',
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
        window.location.href = "index.html";
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
                  window.location.href = "index.html";
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
        window.location.href = "index.html";
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
        window.location.href = "index.html";
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

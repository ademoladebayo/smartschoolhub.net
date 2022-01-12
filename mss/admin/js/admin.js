// SOUND VARIABLES
var successSound = new Audio("../asset/sound/verified.mp3");
var errorSound = new Audio("../asset/sound/error1.mp3");

// DEVELOPMENT IP
var ip = "http://127.0.0.1:8000";
var domain = "http://localhost/smartschoolhub.net/demo";

// // LIVE IP
// var ip = "https://smartschoolhub.net/backend/demo";
// var domain = "https://demo.smartschoolhub.net";

// REMOTE ACCESS
// var ip = "http://192.168.42.168/smartschoolhub.ng/SSHUB_BACKEND/server.php";
// var domain = "http://192.168.42.168/smartschoolhub.ng";

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
        window.parent.location.assign(domain + "/bursary/");
      }
      return res.json();
    })

    .then((data) => {
      document.getElementById(
        "session_term"
      ).innerHTML = `<div id="" class="item-number"><span class="counter"
          >${data.session} - ${data.term}</span></div>`;

      localStorage.setItem("current_session", data.session);
      localStorage.setItem("current_term", data.term);
    })
    .catch((err) => console.log(err));
}

function loadSideNav(page) {
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
        <span>Teacher Management</span></a>
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
        <span>Teacher Attendance</span></a>
    </li>


    <li class="nav-item">
        <a  id="inventory" href="#?inventory.html" class="nav-link"><i class="fas fa-box-open"></i><span>Inventory <sup><small>Coming Soon ...</small></sup></span></a>
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

function goTo(page) {
  if (page == "") {
    localStorage.clear();
  }
  window.parent.location.assign(domain + "/teacher/" + page);
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
        if (c % 2 == 0) {
          if (data[i].profile_status == "ENABLED") {
            document.getElementById("teacher_table").innerHTML += `
            <tr class="even">
  
            <td>${c}.</td>
            <td>${data[i].teacher_id}</td>
            <td>${
              data[i].title + " " + data[i].first_name + " " + data[i].last_name
            }</td>
            <td>${data[i].gender}</td>
            <td class="text-white"><span class="badge bg-success"><b>ENABLED</b></span></td>
           
            <td>
            <a onmouseover="viewTeacher(${JSON.stringify(data[i]).replace(
              /"/g,
              "'"
            )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                    data-bs-target="#viewModal"><i class="fas fa-eye"></i> View</a>
            <a onmouseover="reloadEditFrame(); editTeacher(${JSON.stringify(
              data[i]
            ).replace(
              /"/g,
              "'"
            )})" class="btn btn-warning" data-bs-toggle="modal"
            data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>

            
            <a onclick="updateTeacherProfileStatus(${
              data[i].id
            })" class="btn gradient-orange-peel"><i
                class="fas fa-lock"></i> Disable</a>  
            
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
              data[i].title + " " + data[i].first_name + " " + data[i].last_name
            }</td>
            <td>${data[i].gender}</td>
            <td class="text-white"><span class="badge bg-danger"><b>DISABLED</b></span></td>
            
            <td>
            <a onmouseover="viewTeacher(${JSON.stringify(data[i]).replace(
              /"/g,
              "'"
            )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                    data-bs-target="#viewModal"><i class="fas fa-eye"></i> View</a>
            <a onmouseover="reloadEditFrame(); editTeacher(${JSON.stringify(
              data[i]
            ).replace(
              /"/g,
              "'"
            )})" class="btn btn-warning" data-bs-toggle="modal"
            data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>

            
            <a onclick="updateTeacherProfileStatus(${
              data[i].id
            })" href="#" class="btn gradient-orange-peel"><i class="fas fa-unlock-alt"></i> Enable</a>  
            
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
              data[i].title + " " + data[i].first_name + " " + data[i].last_name
            }</td>
            <td>${data[i].gender}</td>
            <td class="text-white"><span class="badge bg-success"><b>ENABLED</b></span></td>
            
            <td>
            <a onmouseover="viewTeacher(${JSON.stringify(data[i]).replace(
              /"/g,
              "'"
            )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                    data-bs-target="#viewModal"><i class="fas fa-eye"></i> View</a>
            <a onmouseover="reloadEditFrame(); editTeacher(${JSON.stringify(
              data[i]
            ).replace(
              /"/g,
              "'"
            )})" class="btn btn-warning" data-bs-toggle="modal"
            data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>

            
            <a onclick="updateTeacherProfileStatus(${
              data[i].id
            })" href="#" class="btn gradient-orange-peel"><i
                class="fas fa-lock"></i> Disable</a>  
            
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
              data[i].title + " " + data[i].first_name + " " + data[i].last_name
            }</td>
            <td>${data[i].gender}</td>
            <td class="text-white"><span class="badge bg-danger"><b>DISABLED</b></span></td>
            
            <td>
            <a onmouseover="viewTeacher(${JSON.stringify(data[i]).replace(
              /"/g,
              "'"
            )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                    data-bs-target="#viewModal"><i class="fas fa-eye"></i> View</a>
            <a onmouseover="reloadEditFrame(); editTeacher(${JSON.stringify(
              data[i]
            ).replace(
              /"/g,
              "'"
            )})" class="btn btn-warning" data-bs-toggle="modal"
            data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>

            
            <a onclick="updateTeacherProfileStatus(${
              data[i].id
            })" href="#" class="btn gradient-orange-peel"><i class="fas fa-unlock-alt"></i> Enable</a>  
            
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
    })
    .catch((err) => console.log(err));
}

function viewTeacher(json) {
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
            window.parent.location.reload();
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
            window.parent.location.reload();
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
        setTimeout(function () {
          window.parent.location.reload();
        }, 1000);
      } else {
        errortoast("<b>" + data.message + "</b>");
      }
    })
    .catch((err) => console.log(err));
}

function deleteTeacher(id) {
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
        setTimeout(function () {
          location.reload();
        }, 1000);
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
              <a onmouseover="viewTeacher(${JSON.stringify(data[i]).replace(
                /"/g,
                "'"
              )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                      data-bs-target="#viewModal"><i class="fas fa-eye"></i> View</a>
              <a onmouseover="reloadEditFrame(); editTeacher(${JSON.stringify(
                data[i]
              ).replace(
                /"/g,
                "'"
              )})" class="btn btn-warning" data-bs-toggle="modal"
              data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
  
              
              <a onclick="updateTeacherProfileStatus(${
                data[i].id
              })" class="btn gradient-orange-peel"><i
                  class="fas fa-lock"></i> Disable</a>  
              
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
              <a onmouseover="viewTeacher(${JSON.stringify(data[i]).replace(
                /"/g,
                "'"
              )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                      data-bs-target="#viewModal"><i class="fas fa-eye"></i> View</a>
              <a onmouseover="reloadEditFrame(); editTeacher(${JSON.stringify(
                data[i]
              ).replace(
                /"/g,
                "'"
              )})" class="btn btn-warning" data-bs-toggle="modal"
              data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
  
              
              <a onclick="updateTeacherProfileStatus(${
                data[i].id
              })" href="#" class="btn gradient-orange-peel"><i class="fas fa-unlock-alt"></i> Enable</a>  
              
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
              <a onmouseover="viewTeacher(${JSON.stringify(data[i]).replace(
                /"/g,
                "'"
              )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                      data-bs-target="#viewModal"><i class="fas fa-eye"></i> View</a>
              <a onmouseover="reloadEditFrame(); editTeacher(${JSON.stringify(
                data[i]
              ).replace(
                /"/g,
                "'"
              )})" class="btn btn-warning" data-bs-toggle="modal"
              data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
  
              
              <a onclick="updateTeacherProfileStatus(${
                data[i].id
              })" href="#" class="btn gradient-orange-peel"><i
                  class="fas fa-lock"></i> Disable</a>  
              
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
              <a onmouseover="viewTeacher(${JSON.stringify(data[i]).replace(
                /"/g,
                "'"
              )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                      data-bs-target="#viewModal"><i class="fas fa-eye"></i> View</a>
              <a onmouseover="reloadEditFrame(); editTeacher(${JSON.stringify(
                data[i]
              ).replace(
                /"/g,
                "'"
              )})" class="btn btn-warning" data-bs-toggle="modal"
              data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
  
              
              <a onclick="updateTeacherProfileStatus(${
                data[i].id
              })" href="#" class="btn gradient-orange-peel"><i class="fas fa-unlock-alt"></i> Enable</a>  
              
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
      console.log(data);
      document.getElementById("student_table").innerHTML = ``;
      var c = 1;
      if (data.length > 0) {
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
            <td>${data[i].class.class_name}</td>
            <td>
            <a onmouseover="viewStudent(${JSON.stringify(data[i]).replace(
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
            <td>${data[i].class.class_name}</td>
            <td>
            <a onmouseover="viewStudent(${JSON.stringify(data[i]).replace(
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
            <td>${data[i].class.class_name}</td>
            <td>
            <a onmouseover="viewStudent(${JSON.stringify(data[i]).replace(
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
            <td>${data[i].class.class_name}</td>
            <td>
            <a onmouseover="viewStudent(${JSON.stringify(data[i]).replace(
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
        document.getElementById(
          "student_table"
        ).innerHTML = `<h4 style="text-align:center;">NO RECORD FOUND</h4>`;
      }
    })
    .catch((err) => console.log(err));
}

function viewStudent(json) {
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
    warningtoast("<b>Please check that no field is empty.</b>");
  }
}

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
            window.parent.location.reload();
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
        setTimeout(function () {
          window.parent.location.reload();
        }, 1000);
      } else {
        errortoast("<b>" + data.message + "</b>");
      }
    })
    .catch((err) => console.log(err));
}

function deleteStudent(id) {
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
        setTimeout(function () {
          location.reload();
        }, 1000);
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
            <td>${data[i].class.class_name}</td>
            <td>
            <a onmouseover="viewStudent(${JSON.stringify(data[i]).replace(
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
            <td>${data[i].class.class_name}</td>
            <td>
            <a onmouseover="viewStudent(${JSON.stringify(data[i]).replace(
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
            <td>${data[i].class.class_name}</td>
            <td>
            <a onmouseover="viewStudent(${JSON.stringify(data[i]).replace(
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
            <td>${data[i].class.class_name}</td>
            <td>
            <a onmouseover="viewStudent(${JSON.stringify(data[i]).replace(
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
        if (c % 2 == 0) {
          if (data[i].class_teacher != null) {
            document.getElementById("class_table").innerHTML += `
            <tr class="even">
  
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
            <td>25</td>
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
  
        <tr>`;
          } else {
            document.getElementById("class_table").innerHTML += `
            <tr class="even">
  
            <td>${c}.</td>
            <td>${data[i].class_name}</td>
            <td>${data[i].class_sector}</td>
            <td class="text-white"><span class="badge bg-danger"><b>TEACHER NOT ASSIGNED</b></span></td>
            <td>25</td>
            <td>
            <a onmouseover="reloadEditFrame();localStorage.setItem('editClass','${data[i].id}~${data[i].class_name}~~${data[i].class_sector}')" class="btn btn-warning" data-bs-toggle="modal"
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
            <td>${data[i].class_sector}</td>
            <td>${
              data[i].class_teacher.title +
              " " +
              data[i].class_teacher.first_name +
              " " +
              data[i].class_teacher.last_name
            }</td>
            <td>25</td>
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
  
        <tr>`;
          } else {
            document.getElementById("class_table").innerHTML += `
            <tr class="odd">
  
            <td>${c}.</td>
            <td>${data[i].class_name}</td>
            <td>${data[i].class_sector}</td>
            <td class="text-white"><span class="badge bg-danger"><b>TEACHER NOT ASSIGNED</b></span></td>
            <td>25</td>
            <td>
                <a onmouseover="reloadEditFrame();localStorage.setItem('editClass','${data[i].id}~${data[i].class_name}~~${data[i].class_sector}')" class="btn btn-warning" data-bs-toggle="modal"
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
            window.parent.location.reload();
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
            window.parent.location.reload();
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
              <td>25</td>
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
              <td>25</td>
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
              <td>25</td>
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
              <td>25</td>
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
        if (c % 2 == 0) {
          if (data[i].teacher != null) {
            console.log("DEBUG not null: " + data[i].teacher);
            console.log(data[i].teacher);
            document.getElementById("subject_table").innerHTML += `
            <tr class="even">
  
            <td>${c}.</td>
            <td>${data[i].subject_name}</td>
            <td>${data[i].class.class_name}</td>
            <td>${
              data[i].teacher.title +
              " " +
              data[i].teacher.first_name +
              " " +
              data[i].teacher.last_name
            }</td>
            <td>25</td>
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
            <td>${data[i].class.class_name}</td>
            <td class="text-white"><span class="badge bg-danger"><b>TEACHER NOT ASSIGNED</b></span></td>
            <td>25</td>
            <td>
            <a onmouseover="reloadEditFrame();localStorage.setItem('editSubject','${data[i].id}~${data[i].subject_name}~null~null~${data[i].class.class_name}~${data[i].class.id}')" class="btn btn-warning" data-bs-toggle="modal"
            data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
                <a onclick="deleteClass(${data[i].id})" class="btn btn-danger text-white"><i
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
            <td>${data[i].class.class_name}</td>
            <td>${
              data[i].teacher.title +
              " " +
              data[i].teacher.first_name +
              " " +
              data[i].teacher.last_name
            }</td>
            <td>25</td>
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
            <td>${data[i].class.class_name}</td>
            <td class="text-white"><span class="badge bg-danger"><b>TEACHER NOT ASSIGNED</b></span></td>
            <td>25</td>
            <td>
                <a onmouseover="reloadEditFrame();localStorage.setItem('editSubject','${data[i].id}~${data[i].subject_name}~null~null~${data[i].class.class_name}~${data[i].class.id}')" class="btn btn-warning" data-bs-toggle="modal"
                    data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
                <a onclick="deleteSubject(${data[i].id})" class="btn btn-danger text-white"><i
                        class="fas fa-trash"></i>
                    Delete</a>
            </td>
  
        <tr>`;
          }
        }

        c = c + 1;
      }
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
              <td>${data[i].class.class_name}</td>
              <td>${
                data[i].teacher.title +
                " " +
                data[i].teacher.first_name +
                " " +
                data[i].teacher.last_name
              }</td>
              <td>25</td>
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
              <td>${data[i].class.class_name}</td>
              <td class="text-white"><span class="badge bg-danger"><b>TEACHER NOT ASSIGNED</b></span></td>
              <td>25</td>
              <td>
              <a onmouseover="reloadEditFrame();localStorage.setItem('editSubject','${data[i].id}~${data[i].subject_name}~ ~ ~${data[i].class.class_name}~${data[i].class.id}')" class="btn btn-warning" data-bs-toggle="modal"
              data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
                  <a onclick="deleteClass(${data[i].id})" class="btn btn-danger text-white"><i
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
              <td>${data[i].class.class_name}</td>
              <td>${
                data[i].teacher.title +
                " " +
                data[i].teacher.first_name +
                " " +
                data[i].teacher.last_name
              }</td>
              <td>25</td>
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
              <td>${data[i].class.class_name}</td>
              <td class="text-white"><span class="badge bg-danger"><b>TEACHER NOT ASSIGNED</b></span></td>
              <td>25</td>
              <td>
                  <a onmouseover="reloadEditFrame();localStorage.setItem('editSubject','${data[i].id}~${data[i].subject_name}~ ~ ~${data[i].class.class_name}~${data[i].class.id}')" class="btn btn-warning" data-bs-toggle="modal"
                      data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
                  <a onclick="deleteSubject(${data[i].id})" class="btn btn-danger text-white"><i
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

// ATTENDANCE
function takeAttendance() {
  document.getElementById("date").innerHTML += Date("DD-MM-YYYY").toUpperCase();
  // document.getElementById("attendance_class").innerHTML += JSON.parse(
  //   localStorage["user_data"]
  // ).data.assigned_class.class_name;

  let scanner = new Instascan.Scanner({
    video: document.getElementById("preview"),
  });
  Instascan.Camera.getCameras()
    .then(function (cameras) {
      if (cameras.length > 0) {
        scanner.start(cameras[0]);
      } else {
        alert("No cameras found");
      }
    })
    .catch(function (e) {
      console.error(e);
    });

  scanner.addListener("scan", function (qr_data) {
    // document.getElementById("student_id").value = qr_data; //StudentATDCard~id~class_id~first_name

    // CHECK IF CARD IS VALID
    if (qr_data.split("~")[0] != "StudentATDCard") {
      errorSound.play();
      setTimeout(function () {
        say("Invalid Card!");
      }, 1000);

      return 0;
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
          getAttendance();
          successSound.play();
          setTimeout(function () {
            say("Verified!");
          }, 1000);
          getAttendance();
        } else {
          errorSound.play();
          setTimeout(function () {
            say("Attendance as already been taken!");
          }, 1000);
          getAttendance();
        }
      })
      .catch((err) => console.log(err));
  });
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
                    <td>${data[i].class.class_name}</td>
                    <td>${data[i].student.gender}</td>
                    <td>${data[i].date}</td>
                    <td>${data[i].time}</td>
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

function takeTeacherAttendance() {
  document.getElementById("date").innerHTML += Date("DD-MM-YYYY").toUpperCase();
  // document.getElementById("attendance_class").innerHTML += JSON.parse(
  //   localStorage["user_data"]
  // ).data.assigned_class.class_name;

  let scanner = new Instascan.Scanner({
    video: document.getElementById("preview"),
  });
  Instascan.Camera.getCameras()
    .then(function (cameras) {
      if (cameras.length > 0) {
        scanner.start(cameras[0]);
      } else {
        alert("No cameras found");
      }
    })
    .catch(function (e) {
      console.error(e);
    });

  scanner.addListener("scan", function (qr_data) {
    // document.getElementById("student_id").value = qr_data; //TeacherATDCard~id~first_name

    // CHECK IF CARD IS VALID
    if (qr_data.split("~")[0] != "TeacherATDCard") {
      errorSound.play();
      setTimeout(function () {
        say("Invalid Card!");
      }, 1000);

      return 0;
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
        teacher_id: qr_data.split("~")[1],
        date: getDate().split("~")[1],
        time: getDate().split("~")[0],
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
            say("Verified!");
          }, 1000);
          getTeacherAttendance();
        } else {
          errorSound.play();
          setTimeout(function () {
            say("Attendance as already been taken!");
          }, 1000);
          getTeacherAttendance();
        }
      })
      .catch((err) => console.log(err));
  });
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
                    <td>${data[i].time}</td>
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
    timeOut: 60 * 60,
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

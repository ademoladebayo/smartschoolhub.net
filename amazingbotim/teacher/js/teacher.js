// SOUND VARIABLES
var successSound = new Audio("../asset/sound/verified.mp3");
var errorSound = new Audio("../asset/sound/error1.mp3");

// DEVELOPMENT IP
//var ip = "http://127.0.0.1:8000";
//var domain = "http://localhost/smartschoolhub.net/amazingbotim";

// LIVE IP
 var ip = "https://smartschoolhub.net/backend/amazingbotim";
 var domain = "https://amazingbotim.smartschoolhub.net";

// CBT VARIABLES
var question = [];
var options = [];
var questions_number = [];
var answer = [];

getSchoolDetails();
//getCurrentSession();

// VAR
result_list = {};

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

function formatNumber(number) {
  console.log("NUMBER: " + number);
  return number.toLocaleString(
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

function loadDashBoardInformation() {
  document.getElementById("user_name").innerHTML = `<b>${
    JSON.parse(localStorage["user_data"]).data.first_name +
    " " +
    JSON.parse(localStorage["user_data"]).data.last_name
  }</b>`;
  document.getElementById("user_name1").innerHTML = `<b>${
    JSON.parse(localStorage["user_data"]).data.first_name +
    " " +
    JSON.parse(localStorage["user_data"]).data.last_name
  }</b>`;
  document.getElementById("male").innerHTML = formatNumber(
    JSON.parse(localStorage["user_data"]).dashboard_information.male
  );
  document.getElementById("female").innerHTML = formatNumber(
    JSON.parse(localStorage["user_data"]).dashboard_information.female
  );

  document.getElementById(
    "no_of_student"
  ).innerHTML = `<span class="counter" data-num="${parseInt(
    formatNumber(
      JSON.parse(localStorage["user_data"]).dashboard_information.no_of_student
    )
  )}">${formatNumber(
    JSON.parse(localStorage["user_data"]).dashboard_information.no_of_student
  )}</span>
    </div>`;

  document.getElementById(
    "no_of_assigned_subject"
  ).innerHTML = `<span class="counter" data-num="${parseInt(
    formatNumber(
      JSON.parse(localStorage["user_data"]).dashboard_information
        .no_of_assigned_subject
    )
  )}">${formatNumber(
    JSON.parse(localStorage["user_data"]).dashboard_information
      .no_of_assigned_subject
  )}</span>
    </div>`;
}

function getProfileData() {
  document.getElementById("fullname").innerHTML =
    JSON.parse(localStorage["user_data"]).data.first_name +
    " " +
    JSON.parse(localStorage["user_data"]).data.last_name;
  data_key = [];
  user_data = JSON.parse(localStorage["user_data"]).data;

  for (i = 0; i < Object.keys(user_data).length; i++) {
    data_key[i] = Object.keys(user_data)[i];
  }

  for (i = 0; i < data_key.length; i++) {
    if (
      data_key[i] == "id" ||
      data_key[i] == "assigned_class" ||
      data_key[i] == "image_url"
    ) {
      continue;
    }
    document.getElementById("profile_data").innerHTML += ` 
        <tr>
                <td>${data_key[i].toUpperCase().replace("_", " ")}:</td>
                <td id="${
                  data_key[i]
                }" name="profile_data" class="font-medium text-dark-medium">${
      user_data[data_key[i]]
    }</td>
        </tr>
        
        `;
  }
}

function loadSideNav(page) {
  document.getElementById("side_nav").innerHTML = `
    <ul class="nav nav-sidebar-menu sidebar-toggle-view">
    <li class="nav-item">
        <a onclick="goTo('dashboard.html')" id="dashboard" href="#" class="nav-link"><i
                class="flaticon-dashboard"></i><span>Dashboard</span></a>
    </li>

    <li class="nav-item">
        <a onclick="goTo('my-profile.html')"    id="my-profile" href="#" class="nav-link"><i class="far fa-address-card"></i><span>My profile</span></a>
    </li>

    <li class="nav-item">
        <a onclick="goTo('my-student.html')"  id="my-student" href="#" class="nav-link"> <i class="fas fa-users"></i>
        <span>My Students</span></a>
    </li>

    <li class="nav-item">
        <a data-bs-placement="top" data-bs-toggle="tooltip" title="Coming Soon ..."  id="learning-hub" href="learning-hub.html" class="nav-link"><i
                class="flaticon-open-book"></i><span>Learning Hub</span></a>
    </li>

    
    <li class="nav-item">
    <a  onclick="goTo('subject-registration.html')"  id="subject-registration" href="#" class="nav-link"><i class="fas fa-plus"></i><span>Subject Registration</span></a>
    </li>

    <!-- <li class="nav-item">
    <a  id="idcard" href="id-card.html" class="nav-link"><i class="fa fa-id-badge"></i>
    <span>Attendance Card</span></a>
    </li> --!>


    <li class="nav-item">
        <a id="timetable" href="#" class="nav-link"><i
                class="flaticon-calendar"></i><span>My Timetable <sup><small>Coming Soon ...</small></sup></span></a>
    </li>

    <li class="nav-item">
        <a onclick="goTo('attendance.html')"  id="attendance" href="#" class="nav-link"><i class="fas fa-chart-line"></i>
        <span>Mark Attendance</span></a>
    </li>

    <li class="nav-item">
        <a onclick="goTo('cbt.html')"  id="cbt" href="#" class="nav-link"><i class="fas fa-desktop"></i><span>CBT</span></a>
    </li>

    <li class="nav-item">
        <a onclick="goTo('result.html')"  id="result" href="#" class="nav-link"><i class="fas fa-file-upload"></i></i><span>Upload Result</span></a>
    </li>

    <li class="nav-item">
        <a onclick="goTo('change-password.html')"  id="change-password" href="#" class="nav-link"><i
                class="flaticon-settings"></i><span>Change Password</span></a>
    </li>
    <li class="nav-item">
        <a onclick="goTo('');" href="#" class="nav-link"><i class="flaticon-turn-off"></i><span>Log
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
          openAuthenticationModal();
        }
        return res.json();
      })

      .then((data) => {
        toastr.remove();
        if (data.success) {
          successtoast("<b>" + data.message + "</b>");
          localStorage.setItem("user_data", JSON.stringify(data));
          username = JSON.parse(localStorage["user_data"]).data.first_name;
          localStorage.setItem("username", username);
          localStorage.setItem(
            "user_id",
            JSON.parse(localStorage["user_data"]).data.teacher_id
          );
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

function reAuth() {
  var id = localStorage["user_id"];
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
          //parent.getStoredCredential();
          username = JSON.parse(localStorage["user_data"]).data.first_name;
          localStorage.setItem("username", username);
          localStorage.setItem(
            "user_id",
            JSON.parse(localStorage["user_data"]).data.teacher_id
          );
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

function reloadEditFrame() {
  var iframe = document.getElementById("edit_frame");
  temp = iframe.src;
  iframe.src = "";
  iframe.src = temp;
}

function getTermAndSession() {
  document.getElementById("term_registration").innerHTML =
    localStorage["current_session"] +
    " " +
    localStorage["current_term"] +
    document.getElementById("term_registration").innerHTML;
  document.getElementById("info").innerHTML =
    document.getElementById("info").innerHTML +
    JSON.parse(localStorage["user_data"]).data.assigned_class.class_name;
}

function goTo(page) {
  if (page == "") {
    localStorage.clear();
  }
  window.parent.location.assign(domain + "/teacher/" + page);
}

//   TEACHER
function getTeacherClass() {
  teacher = JSON.parse(localStorage["user_data"]).data;
  document.getElementById(
    "class"
  ).innerHTML = ` <option value="${teacher.assigned_class.id}">${teacher.assigned_class.class_name}</option>`;
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
          student_class =
            data[i].class == null ? `GRADUATED` : data[i].class.id;
          if (
            student_class !=
            JSON.parse(localStorage["user_data"]).data.assigned_class.id
          ) {
            continue;
          }
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
          <a onmouseover="viewStudent(${JSON.stringify(data[i])
            .replace(/'/g, "")
            .replace(
              /"/g,
              "'"
            )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                  data-bs-target="#viewModal"><i class="fas fa-eye"></i> </a>
          <a onclick="viewStudentResult(${JSON.stringify(data[i])
            .replace(/'/g, "")
            .replace(
              /"/g,
              "'"
            )})" class="btn gradient-orange-peel text-black"><i
                      class="fas fa-poll"></i>
                  Result</a>
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

function viewStudent(json) {
  document.getElementById("first_name").value = json.first_name;
  document.getElementById("middle_name").value = json.middle_name;
  document.getElementById("last_name").value = json.last_name;
  document.getElementById("gender").value = json.gender;
  document.getElementById("religion").value = json.religion;
  document.getElementById("dob").value = json.dob;
  document.getElementById("joining_date").value = json.joining_date;
  document.getElementById("joining_session").value = json.joining_session;
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

  document.getElementById("joining_session").innerHTML =
    `<option value="${json.joining_session}">${json.joining_session}</option>` +
    document.getElementById("joining_session").innerHTML;

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
  var joining_session = document.getElementById("joining_session").value;
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
    joining_session != "" &&
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
        joining_session: joining_session,
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
  var joining_session = document.getElementById("joining_session").value;
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
    joining_session != "" &&
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
        joining_session: joining_session,
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
          if (
            data[i].class.id !=
            JSON.parse(localStorage["user_data"]).data.assigned_class.id
          ) {
            continue;
          }
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
              <a onmouseover="viewStudent(${JSON.stringify(data[i])
                .replace(/'/g, "")
                .replace(
                  /"/g,
                  "'"
                )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                      data-bs-target="#viewModal"><i class="fas fa-eye"></i> View</a>
              <a onmouseover="reloadEditFrame(); editStudent(${JSON.stringify(
                data[i]
              )
                .replace(/'/g, "")
                .replace(
                  /"/g,
                  "'"
                )})" class="btn btn-warning" data-bs-toggle="modal"
              data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
  
              
              <a onclick="updateStudentProfileStatus(${
                data[i].id
              })" class="btn btn-secondary text-black"><i
                  class="fas fa-lock"></i> Disable</a>  

              
              <a onclick="viewStudentResult(${JSON.stringify(data[i])
                .replace(/'/g, "")
                .replace(
                  /"/g,
                  "'"
                )})" class="btn gradient-orange-peel text-black"><i
                          class="fas fa-poll"></i>
                      Result</a> 
              
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
              <a onmouseover="viewStudent(${JSON.stringify(data[i])
                .replace(/'/g, "")
                .replace(
                  /"/g,
                  "'"
                )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                      data-bs-target="#viewModal"><i class="fas fa-eye"></i> View</a>
              <a onmouseover="reloadEditFrame(); editStudent(${JSON.stringify(
                data[i]
              )
                .replace(/'/g, "")
                .replace(
                  /"/g,
                  "'"
                )})" class="btn btn-warning" data-bs-toggle="modal"
              data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
  
              
              <a onclick="updateStudentProfileStatus(${
                data[i].id
              })" class="btn btn-secondary text-black"><i
                  class="fas fa-unlock-alt"></i> Enable</a>  

              
              <a onclick="viewStudentResult(${JSON.stringify(data[i])
                .replace(/'/g, "")
                .replace(
                  /"/g,
                  "'"
                )})" class="btn gradient-orange-peel text-black"><i
                          class="fas fa-poll"></i>
                      Result</a> 
              
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
              <a onmouseover="viewStudent(${JSON.stringify(data[i])
                .replace(/'/g, "")
                .replace(
                  /"/g,
                  "'"
                )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                      data-bs-target="#viewModal"><i class="fas fa-eye"></i> View</a>
              <a onmouseover="reloadEditFrame(); editStudent(${JSON.stringify(
                data[i]
              )
                .replace(/'/g, "")
                .replace(
                  /"/g,
                  "'"
                )})" class="btn btn-warning" data-bs-toggle="modal"
              data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
  
              
              <a onclick="updateStudentProfileStatus(${
                data[i].id
              })" class="btn btn-secondary text-black"><i
                  class="fas fa-lock"></i> Disable</a>  

              
              <a onclick="viewStudentResult(${JSON.stringify(data[i])
                .replace(/'/g, "")
                .replace(
                  /"/g,
                  "'"
                )})" class="btn gradient-orange-peel text-black"><i
                          class="fas fa-poll"></i>
                      Result</a> 

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
              <a onmouseover="viewStudent(${JSON.stringify(data[i])
                .replace(/'/g, "")
                .replace(
                  /"/g,
                  "'"
                )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                      data-bs-target="#viewModal"><i class="fas fa-eye"></i> View</a>
              <a onmouseover="reloadEditFrame(); editStudent(${JSON.stringify(
                data[i]
              )
                .replace(/'/g, "")
                .replace(
                  /"/g,
                  "'"
                )})" class="btn btn-warning" data-bs-toggle="modal"
              data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
  
              
              <a onclick="updateStudentProfileStatus(${
                data[i].id
              })" class="btn btn-secondary text-black"><i
                  class="fas fa-unlock-alt"></i> Enable</a>  

              
              <a onclick="viewStudentResult(${JSON.stringify(data[i])
                .replace(/'/g, "")
                .replace(
                  /"/g,
                  "'"
                )})" class="btn gradient-orange-peel text-black"><i
                          class="fas fa-poll"></i>
                      Result</a> 
              
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

function viewStudentResult(data) {
  localStorage.setItem("student_result", JSON.stringify(data));
  window.parent.location.assign(domain + "/teacher/student-transcript.html");
}

// STUDENT RESULT
function getTranscript() {
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
    user_data.class.class_sector;
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
  sessions[0] = localStorage["current_session"];
  terms[0] = localStorage["current_term"];

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
    // ATTENDANCEk
    getAttendanceSummary(container_name);
    //ACADEMIC PERFORMANCE
    getResult(container_name);
    // COMMENTS AND PSYCHO MOTOR REPORTS
    getCommentsAndPsycho(container_name);
  }
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
      class_id: JSON.parse(localStorage["student_result"]).class.id,
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

//   SUBJECT
function getPreviousSubjectRegistration() {
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
      class: JSON.parse(localStorage["user_data"]).data.assigned_class.id,
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
      data.forEach((i) => {
        registered_subject.push(i);
      });
      document.getElementById("number_registered").innerHTML =
        document.getElementById("number_registered").innerHTML +
        countDistinct(registered_subject, registered_subject.length);
    })
    .catch((err) => console.log(err));

  return registered_subject;
}

function getAllSubjectForTable() {
  registered_subject = [];
  registered_subject = getPreviousSubjectRegistration();

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
      console.log("DEBUG =>   RESULT: " + data);
      document.getElementById("subject_table").innerHTML = ``;
      var c = 1;
      for (i in data) {
        if (
          data[i].class.id !=
          JSON.parse(localStorage["user_data"]).data.assigned_class.id
        ) {
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
                <td>${
                  data[i].teacher.title +
                  " " +
                  data[i].teacher.first_name +
                  " " +
                  data[i].teacher.last_name
                }</td>
                
      
            <tr>`;
          } else {
            document.getElementById("subject_table").innerHTML += `
              <tr>

              <td><input type="checkbox" class="form-check-input ml-0" name="subject_registration"
              value="${data[i].id}">
              </td>

              <td>${c}.</td>
              <td>${data[i].subject_name}</td>
              <td>${
                data[i].teacher.title +
                " " +
                data[i].teacher.first_name +
                " " +
                data[i].teacher.last_name
              }</td>
              
    
          <tr>`;
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
              <td class="text-white"><span class="badge bg-danger"><b>TEACHER NOT ASSIGNED</b></span></td>
    
          <tr>`;
          } else {
            document.getElementById("subject_table").innerHTML += `
              <tr>
    
              <td><input type="checkbox" class="form-check-input ml-0" name="subject_registration"
              value="${data[i].id}">
              </td>
              <td>${c}.</td>
              <td>${data[i].subject_name}</td>
              <td class="text-white"><span class="badge bg-danger"><b>TEACHER NOT ASSIGNED</b></span></td>
    
          <tr>`;
          }
        }

        c = c + 1;
      }
    })
    .catch((err) => console.log(err));
  // document.getElementById("number_registered").innerHTML =
  //   document.getElementById("number_registered").innerHTML + c;
}

function registerSubject() {
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
          localStorage["current_session"] +
          " " +
          localStorage["current_term"]
      )
    ) {
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
          class: JSON.parse(localStorage["user_data"]).data.assigned_class.id,
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
            alert("" + data.message + "");
            setTimeout(function () {
              window.parent.location.reload();
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

// CBT
function getAssignedSubject() {
  var c = 1;
  // GET ASSIGNED SUBJECT
  fetch(ip + "/api/teacher/assigned-subject", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      teacher_id: JSON.parse(localStorage["user_data"]).data.id,
      //   session: localStorage["current_session"],
      //   term: localStorage["current_term"],
    }),
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        // openAuthenticationModal();
        openAuthenticationModal();
        return 0;
      }
      return res.json();
    })

    .then((data) => {
      document.getElementById("subject_table").innerHTML = ``;
      for (i in data) {
        document.getElementById("subject_table").innerHTML += `
                  <tr>
          
                        <td>${c}.</td>
                        <td> <small>${data[i].subject_name}</td>
                        <td>${data[i].class.class_name}</td>
                        <td>
                            <button onclick="showCBTList('${data[i].subject_name}','${data[i].id}','${data[i].class.class_name}','${data[i].class.id}')" type="button" class="btn btn-primary">
                                SEE AVAILABLE CBT
                            </button>
                       </td>
                        
                     
                        
              
                    <tr>`;

        c = c + 1;
      }
      document.getElementById("assigned_registered").innerHTML =
        document.getElementById("assigned_registered").innerHTML + (c - 1);
    })
    .catch((err) => console.log(err));
}

function showCBTList(subject_name, subject_id, class_name, class_id) {
  window.location.href = "./cbt-list.html";
  localStorage.setItem("cbt_subject_name", subject_name);
  localStorage.setItem("cbt_subject_id", subject_id);
  localStorage.setItem("cbt_subject_class", class_name);
  localStorage.setItem("cbt_subject_class_id", class_id);
}

function getCBTForSubject() {
  document.getElementById("infoo").innerHTML =
    document.getElementById("infoo").innerHTML +
    localStorage["cbt_subject_name"] +
    " " +
    localStorage["cbt_subject_class"];

  // GET CBT
  fetch(ip + "/api/teacher/all-cbt", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      subject_id: localStorage["cbt_subject_id"],
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
      c = 1;
      document.getElementById("cbt_table").innerHTML = ``;
      if (data.length > 0) {
        for (i in data) {
          document.getElementById("cbt_table").innerHTML += `
          <tr>
          <td>
              ${c}.</td>
  
          <td>
              ${data[i].cbt_title}</td>
          <td>
          ${data[i].cbt_date}</td>
          <td>
          ${data[i].start_time}</td>
          <td>
          ${
            data[i].cbt_status == "OPEN"
              ? `<span class="badge bg-success text-white"><b>${data[i].cbt_status}</b></span>`
              : `<span class="badge bg-danger text-white"><b>${data[i].cbt_status}</b></span>`
          }</td>
  
          
  
          <td>
              <button style="text-decoration: none; cursor: pointer;" class="btn-sm btn-primary" onclick="viewCBT(${JSON.stringify(
                data[i]
              )
                .replace(/'/g, "")
                .replace(/"/g, "'")})"
                 ><i class="fas fa-eye"></i> View</button>
              <button style="text-decoration: none; cursor: pointer;" onclick=" reloadEditFrame(); editCBT(${JSON.stringify(
                data[i]
              )
                .replace(/'/g, "")
                .replace(/"/g, "'")})"
                  class="btn-sm btn-warning" data-bs-toggle="modal"
                  data-bs-target="#editModal"><i class="fas fa-edit"></i>
                  Edit</button>
              <button style="text-decoration: none; cursor: pointer;" onclick="viewResultForCBT(${
                data[i].id
              })"
                  class="btn-sm btn-success"><i class="fas fa-poll"></i>
                  Check Result</button>

              ${
                data[i].cbt_status == "OPEN"
                  ? ` <button style="text-decoration: none; cursor: pointer;" onclick="changeCBTStatus(${data[i].id},'CLOSE')"
                      class="btn-sm btn-secondary"><i class="fas fa-lock"></i></i>
                      Close CBT</button>`
                  : `
                  <button
                    style="text-decoration: none; cursor: pointer;"
                    onclick="changeCBTStatus(${data[i].id},'OPEN')"
                    class="btn-sm btn-secondary"
                  >
                  <i class="fas fa-lock-open"></i>
                    Open CBT
                  </button>`
              }

              <button style="text-decoration: none; cursor: pointer;" onclick="deleteCBT(${
                data[i].id
              })"
                  class="btn-sm btn-danger"><i class="fas fa-trash"></i>
                  Delete</button>

              </td>
          </td>
  
      </tr>
          
          `;

          c = c + 1;
        }
      } else {
        document.getElementById(
          "cbt_table"
        ).innerHTML = `<h5 style="text-align:center;">NO CBT FOUND</h5>`;
      }
    })
    .catch((err) => console.log(err));
}

function proceedToSetQuestion() {
  var cbt_title = document.getElementById("cbt_title").value;
  var cbt_date = document.getElementById("cbt_date").value;
  var start_time = document.getElementById("start_time").value;
  var cbt_duration = document.getElementById("cbt_duration").innerHTML;
  var cbt_instruction = document.getElementById("cbt_instruction").value;
  var question_no = document.getElementById("question_no").value;
  // var use_result_for = document.getElementById("use_result_for").value;

  if (
    cbt_title != "" &&
    cbt_date != "" &&
    start_time != "" &&
    cbt_duration != "" &&
    cbt_instruction != "" &&
    question_no != ""
  ) {
    confirmed = window.confirm(
      "Kindly confirm you are about to set " +
        cbt_title +
        " which will be taken on " +
        cbt_date +
        " by " +
        start_time +
        " duration will be " +
        cbt_duration
    );
    if (confirmed) {
      localStorage.setItem("cbt_title", cbt_title);
      localStorage.setItem("cbt_date", cbt_date);
      localStorage.setItem("start_time", start_time);
      localStorage.setItem("cbt_duration", cbt_duration);
      localStorage.setItem("cbt_instruction", cbt_instruction);
      localStorage.setItem("question_no", question_no);
      window.parent.parent.location.assign(
        domain + "/teacher/cbt/cbt-questions-create.html"
      );
    }
  } else {
    window.alert("Please check that no feild is empty.");
  }
}

function getCBTdetails() {
  document.getElementById("session_term").innerHTML =
    localStorage["current_session"] +
    " Session | " +
    localStorage["current_term"];

  document.getElementById("cbt_date_time").innerHTML =
    localStorage["cbt_date"] + " " + localStorage["start_time"];

  document.getElementById("school_name").innerHTML =
    localStorage["SCHOOL_NAME"] + "<br/>" + localStorage["SCHOOL_ADDRESS"];

  document.getElementById("subject_class").innerHTML =
    localStorage["cbt_subject_name"] + " " + localStorage["cbt_subject_class"];

  document.getElementById("cbt_title").innerHTML = localStorage["cbt_title"];

  document.getElementById("cbt_instruction").innerHTML =
    localStorage["cbt_instruction"];

  document.getElementById("cbt_duration").innerHTML =
    localStorage["cbt_duration"];

  console.log(question.length);

  // PRE INPUT QUESTIONS
  for (i = 0; i < localStorage["question_no"]; i++) {
    question.push(
      "Type question " +
        (i + 1) +
        " here &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
    );
    options.push(
      "Option A &nbsp;&nbsp;&nbsp;&nbsp;~ Option B &nbsp;&nbsp;&nbsp;&nbsp;~ Option C &nbsp;&nbsp;&nbsp;&nbsp;~ Option D &nbsp;&nbsp;&nbsp;&nbsp;"
    );
    questions_number.push(i);
    answer.push("");
  }

  getSavedQuestions();
}

function getSavedQuestions() {
  c = 1;
  document.getElementById("cbt_view").innerHTML = `<div class="h5">

  <div id="question_no" style="text-align: center;" class="mb-2"><b>NUMBER OF QUESTION TO ANSWER: ${question.length}</b></div>
</div>
<hr>
`;
  for (n = 0; n < questions_number.length; n++) {
    document.getElementById("cbt_view").innerHTML += ` <div class="mb-3">
     <p  class="mb-1"><b>${c}: </b> <span oninput="saveQuestion(this.id,this.innerHTML)"  id="${
      questions_number[n]
    }" contenteditable="true">${question[questions_number[n]].replace(
      /⌑/g,
      ","
    )}</span></p>
   <div class="pl-2">
             <div id="optionA${
               questions_number[n]
             }" class="form-check"> <input onclick="saveAnswer(this.id)" class="form-check-input" type="radio" name="${
      questions_number[n]
    }"
                     id="A${questions_number[n]}" value="A"  ${
      answer[questions_number[n]] == "A" ? `checked` : ""
    }> <label oninput="saveOptions(this.id)" id="${
      questions_number[n]
    }" class="form-check-label" for="A${
      questions_number[n]
    }" contenteditable="true">${options[questions_number[n]]
      .split("~")[0]
      .replace(/⌑/g, ",")
      .replace(/®/g, "~")}
               </label> </input></div>
 
               <div id="optionB${
                 questions_number[n]
               }" class="form-check"> <input onclick="saveAnswer(this.id)" class="form-check-input" type="radio" name="${
      questions_number[n]
    }"
                       id="B${questions_number[n]}" value="B"  ${
      answer[questions_number[n]] == "B" ? `checked` : ""
    }> <label oninput="saveOptions(this.id)" id="${
      questions_number[n]
    }" class="form-check-label" for="B${
      questions_number[n]
    }" contenteditable="true">${options[questions_number[n]]
      .split("~")[1]
      .replace(/⌑/g, ",")
      .replace(/®/g, "~")}
                 </label></input> </div>
 
                 <div id="optionC${
                   questions_number[n]
                 }" class="form-check"> <input onclick="saveAnswer(this.id)" class="form-check-input" type="radio" name="${
      questions_number[n]
    }"
                         id="C${questions_number[n]}" value="C"  ${
      answer[questions_number[n]] == "C" ? `checked` : ""
    }> <label oninput="saveOptions(this.id)" id="${
      questions_number[n]
    }" class="form-check-label" for="C${
      questions_number[n]
    }" contenteditable="true">${options[questions_number[n]]
      .split("~")[2]
      .replace(/⌑/g, ",")
      .replace(/®/g, "~")}
                   </label> </input> </div>
 
                   <div id="optionD${
                     questions_number[n]
                   }" class="form-check"> <input onclick="saveAnswer(this.id)" class="form-check-input" type="radio" name="${
      questions_number[n]
    }"
                           id="D${questions_number[n]}" value="D"  ${
      answer[questions_number[n]] == "D" ? `checked` : ""
    }> <label oninput="saveOptions(this.id)" id="${
      questions_number[n]
    }" class="form-check-label" for="D${
      questions_number[n]
    }" contenteditable="true">${options[questions_number[n]]
      .split("~")[3]
      .replace(/⌑/g, ",")
      .replace(/®/g, "~")}
                     </label></input> </div>
              </div>
    </div>
 
    <small class="ml-1 btn btn-sm text-right mb-2 text-danger pr-2" onclick="deleteQuestion(${
      questions_number[n]
    })"><span
                                     id="" class="" role="status">
                                     <b><i class="fas fa-times"></i> Delete
                                         Question </b></small>
    <hr class="mt-0 mb-0 pt-0 pb-0">
    <br/>
    `;

    c = c + 1;
  }
  document.getElementById("cbt_view").innerHTML += `
   <small class="ml-1 btn btn-sm text-right mb-2 text-success pr-2" onclick="addQuestion()"><span
                                     id="" class="" role="status">
                                     <b><i class="fas fa-plus"></i> Add
                                         Question </b></small>
   `;
}

function saveQuestion(number, question_text) {
  // REPLACE EVERY "," with "⌑"
  question[number] = question_text.replace(/,/g, "⌑");
}

function saveAnswer(text) {
  answer_value = text.charAt(0);
  answer_index = text.replace(text.charAt(0), "");
  answer[answer_index] = answer_value;
  console.log(answer);
}

function saveOptions(number) {
  // GET OPTIONS FOR QUESTION
  var new_options = "";
  option = document.getElementsByName(number);
  for (var i = 0; i < option.length; i++) {
    if (option[i].checked == true) {
      answer[number] = option[i].value;
    }

    // APPEND NEW OPTIONS
    // REPLACE EVERY "~" with "®"
    // REPLACE EVERY "," with "⌑"
    new_options +=
      document
        .getElementById("option" + option[i].id)
        .children[1].innerHTML.trim()
        .replace(/~/g, "®")
        .replace(/,/g, "⌑") + "~";
  }
  options[number] = new_options;
}

function addQuestion() {
  question.push("Type question " + (question.length + 1) + " here   ");
  options.push("Option A ~ Option B ~ Option C ~ Option D");
  questions_number.push(questions_number.length);
  answer.push("");

  getSavedQuestions();
}

function deleteQuestion(number) {
  questions_number.pop();
  question.splice(number, 1);
  options.splice(number, 1);
  answer.splice(number, 1);

  getSavedQuestions();
}

function saveCBT() {
  if (window.parent.confirm("ARE YOU SURE YOU WANT TO PROCEED ?")) {
    // PUSH TO API
    document.getElementById("save_cbt").innerHTML = `<i
    class="fa fa-spinner fa-spin"></i> Saving CBT ...`;
    // PUSH TO API
    fetch(ip + "/api/teacher/create-cbt", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage["token"],
      },
      body: JSON.stringify({
        cbt_title: localStorage["cbt_title"],
        cbt_date: localStorage["cbt_date"],
        start_time: localStorage["start_time"],
        cbt_duration: localStorage["cbt_duration"],
        cbt_instruction: localStorage["cbt_instruction"],
        cbt_question: question.toString().trim(),
        cbt_options: options.toString().trim(),
        cbt_answer: answer.toString().trim(),
        cbt_questions_number: questions_number.toString().trim(),
        subject_id: localStorage["cbt_subject_id"],
        class_id: localStorage["cbt_subject_class_id"],
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
        // toastr.remove();
        if (data.success) {
          window.alert(data.message);
          setTimeout(function () {
            window.parent.location.assign(domain + "/teacher/cbt.html");
          }, 1000);
        } else {
          window.alert(data.message);
        }
      })
      .catch((err) => console.log(err));
  }
}

function viewCBT(json) {
  console.log(JSON.stringify(json));
  localStorage.setItem("cbt_detail", JSON.stringify(json));
  window.parent.location.assign(
    domain + "/teacher/cbt/cbt-questions-view.html"
  );
}

function getCBTdetailsView() {
  document.getElementById("session_term").innerHTML =
    JSON.parse(localStorage["cbt_detail"]).session +
    " Session | " +
    JSON.parse(localStorage["cbt_detail"]).term;

  document.getElementById("cbt_date_time").innerHTML =
    JSON.parse(localStorage["cbt_detail"]).cbt_date +
    " " +
    JSON.parse(localStorage["cbt_detail"]).start_time;

  document.getElementById("school_name").innerHTML =
    localStorage["SCHOOL_NAME"] + "<br/>" + localStorage["SCHOOL_ADDRESS"];

  // GETTING PREVIOUS DETAILS

  document.getElementById("subject_class").innerHTML =
    JSON.parse(localStorage["cbt_detail"]).subject.subject_name +
    " " +
    JSON.parse(localStorage["cbt_detail"]).class.class_name;

  document.getElementById("cbt_title").innerHTML = JSON.parse(
    localStorage["cbt_detail"]
  ).cbt_title;

  document.getElementById("cbt_instruction").innerHTML = JSON.parse(
    localStorage["cbt_detail"]
  ).cbt_instruction;

  document.getElementById("cbt_duration").innerHTML = JSON.parse(
    localStorage["cbt_detail"]
  ).cbt_duration;

  // RANDOM QUESTIONS
  randomQuestion = [];

  while (
    randomQuestion.length !=
    JSON.parse(localStorage["cbt_detail"]).cbt_questions_number.split(",")
      .length
  ) {
    n = Math.floor(
      Math.random() *
        JSON.parse(localStorage["cbt_detail"]).cbt_questions_number.split(",")
          .length +
        0
    );
    if (!randomQuestion.includes(n)) {
      randomQuestion.push(n);
      console.log(randomQuestion);
    }
  }

  console.log(randomQuestion);

  questions_number = randomQuestion;
  // questions_number = JSON.parse(
  //   localStorage["cbt_detail"]
  // ).cbt_questions_number.split(",");
  question = JSON.parse(localStorage["cbt_detail"]).cbt_question.split(",");
  options = JSON.parse(localStorage["cbt_detail"]).cbt_options.split(",");
  answer = JSON.parse(localStorage["cbt_detail"]).cbt_answer.split(",");

  c = 1;
  document.getElementById("cbt_view").innerHTML = `<div class="h5">

  <div id="question_no" style="text-align: center;" class="mb-2"><b>NUMBER OF QUESTION TO ANSWER: ${question.length}</b></div>
</div>
<hr>
`;
  for (n = 0; n < questions_number.length; n++) {
    document.getElementById("cbt_view").innerHTML += ` <div class="mb-3">
   <p  class="mb-1"><b>${c}: </b> <span oninput="saveQuestion(this.id,this.innerHTML)"  id="${
      questions_number[n]
    }" >${question[questions_number[n]].replace(/⌑/g, ",")}</span></p>
 <div class="pl-2">
           <div id="optionA${
             questions_number[n]
           }" class="form-check"> <input  class="form-check-input" type="radio" name="${
      questions_number[n]
    }"
                   id="A${questions_number[n]}" value="A"    ${
      answer[questions_number[n]] == "A" ? `checked` : `disabled='disabled'`
    }> <label oninput="saveOptions(this.id)" id="${
      questions_number[n]
    }" class="form-check-label" for="A${questions_number[n]}" >${options[
      questions_number[n]
    ]
      .split("~")[0]
      .replace(/⌑/g, ",")
      .replace(/®/g, "~")}
             </label> </input></div>

             <div id="optionB${
               questions_number[n]
             }" class="form-check"> <input  class="form-check-input" type="radio" name="${
      questions_number[n]
    }"
                     id="B${questions_number[n]}" value="B" ${
      answer[questions_number[n]] == "B" ? `checked` : `disabled='disabled'`
    } > <label oninput="saveOptions(this.id)" id="${
      questions_number[n]
    }" class="form-check-label" for="B${questions_number[n]}" >${options[
      questions_number[n]
    ]
      .split("~")[1]
      .replace(/⌑/g, ",")
      .replace(/®/g, "~")}
               </label></input> </div>

               <div id="optionC${
                 questions_number[n]
               }" class="form-check"> <input class="form-check-input" type="radio" name="${
      questions_number[n]
    }"
                       id="C${questions_number[n]}" value="C" ${
      answer[questions_number[n]] == "C" ? `checked` : `disabled='disabled'`
    }> <label oninput="saveOptions(this.id)" id="${
      questions_number[n]
    }" class="form-check-label" for="C${questions_number[n]}" >${options[
      questions_number[n]
    ]
      .split("~")[2]
      .replace(/⌑/g, ",")
      .replace(/®/g, "~")}
                 </label> </input> </div>

                 <div id="optionD${
                   questions_number[n]
                 }" class="form-check"> <input class="form-check-input" type="radio" name="${
      questions_number[n]
    }"
                         id="D${questions_number[n]}" value="D" ${
      answer[questions_number[n]] == "D" ? `checked` : `disabled='disabled'`
    } > <label oninput="saveOptions(this.id)" id="${
      questions_number[n]
    }" class="form-check-label" for="D${questions_number[n]}" >${options[
      questions_number[n]
    ]
      .split("~")[3]
      .replace(/⌑/g, ",")
      .replace(/®/g, "~")}
                   </label></input> </div>
            </div>
  </div>

  
  <hr class="mt-0 mb-0 pt-0 pb-0">
  <br/>
  `;

    c = c + 1;
  }
}

function editCBT(json) {
  localStorage.setItem("cbt_edit_details", JSON.stringify(json));
}

function populateCBTDetails() {
  document.getElementById("cbt_title").value = JSON.parse(
    localStorage["cbt_edit_details"]
  ).cbt_title;
  document.getElementById("cbt_date").value = JSON.parse(
    localStorage["cbt_edit_details"]
  ).cbt_date;
  document.getElementById("start_time").value = JSON.parse(
    localStorage["cbt_edit_details"]
  ).start_time;
  document.getElementById("cbt_duration").innerHTML = JSON.parse(
    localStorage["cbt_edit_details"]
  ).cbt_duration;
  document.getElementById("cbt_instruction").value = JSON.parse(
    localStorage["cbt_edit_details"]
  ).cbt_instruction;
}

function proceedToEditQuestion() {
  var cbt_title = document.getElementById("cbt_title").value;
  var cbt_date = document.getElementById("cbt_date").value;
  var start_time = document.getElementById("start_time").value;
  var cbt_duration = document.getElementById("cbt_duration").innerHTML;
  var cbt_instruction = document.getElementById("cbt_instruction").value;
  // var question_no = document.getElementById("question_no").value;
  // var use_result_for = document.getElementById("use_result_for").value;

  if (
    cbt_title != "" &&
    cbt_date != "" &&
    start_time != "" &&
    cbt_duration != "" &&
    cbt_instruction != ""
  ) {
    confirmed = window.confirm(
      "Kindly confirm you are about to edit " +
        cbt_title +
        " which will be taken on " +
        cbt_date +
        " by " +
        start_time +
        " duration will be " +
        cbt_duration
    );
    if (confirmed) {
      localStorage.setItem("cbt_title", cbt_title);
      localStorage.setItem("cbt_date", cbt_date);
      localStorage.setItem("start_time", start_time);
      localStorage.setItem("cbt_duration", cbt_duration);
      localStorage.setItem("cbt_instruction", cbt_instruction);

      window.parent.parent.location.assign(
        domain + "/teacher/cbt/cbt-questions-edit.html"
      );
    }
  } else {
    window.alert("Please check that no feild is empty.");
  }
}

function getCBTdetailsEdit() {
  document.getElementById("session_term").innerHTML =
    localStorage["current_session"] +
    " Session | " +
    localStorage["current_term"];

  document.getElementById("cbt_date_time").innerHTML =
    localStorage["cbt_date"] + " " + localStorage["start_time"];

  document.getElementById("school_name").innerHTML =
    localStorage["SCHOOL_NAME"] + "<br/>" + localStorage["SCHOOL_ADDRESS"];

  document.getElementById("subject_class").innerHTML =
    localStorage["cbt_subject_name"] + " " + localStorage["cbt_subject_class"];

  document.getElementById("cbt_title").innerHTML = localStorage["cbt_title"];

  document.getElementById("cbt_instruction").innerHTML =
    localStorage["cbt_instruction"];

  document.getElementById("cbt_duration").innerHTML =
    localStorage["cbt_duration"];

  // GETTING PREVIOUS DETAILS
  questions_number = JSON.parse(
    localStorage["cbt_edit_details"]
  ).cbt_questions_number.split(",");
  question = JSON.parse(localStorage["cbt_edit_details"]).cbt_question.split(
    ","
  );
  options = JSON.parse(localStorage["cbt_edit_details"]).cbt_options.split(",");
  answer = JSON.parse(localStorage["cbt_edit_details"]).cbt_answer.split(",");

  c = 1;
  document.getElementById("cbt_view").innerHTML = `<div class="h5">

  <div id="question_no" style="text-align: center;" class="mb-2"><b>NUMBER OF QUESTION TO ANSWER: ${question.length}</b></div>
</div>
<hr>
`;
  for (n = 0; n < questions_number.length; n++) {
    document.getElementById("cbt_view").innerHTML += ` <div class="mb-3">
     <p  class="mb-1"><b>${c}: </b> <span oninput="saveQuestion(this.id,this.innerHTML)"  id="${
      questions_number[n]
    }" contenteditable="true">${question[questions_number[n]].replace(
      /⌑/g,
      ","
    )}</span></p>
   <div class="pl-2">
             <div id="optionA${
               questions_number[n]
             }" class="form-check"> <input onclick="saveAnswer(this.id)" class="form-check-input" type="radio" name="${
      questions_number[n]
    }"
                     id="A${questions_number[n]}" value="A"  ${
      answer[questions_number[n]] == "A" ? `checked` : ""
    }> <label oninput="saveOptions(this.id)" id="${
      questions_number[n]
    }" class="form-check-label" for="A${
      questions_number[n]
    }" contenteditable="true">${options[questions_number[n]]
      .split("~")[0]
      .replace(/⌑/g, ",")
      .replace(/®/g, "~")}
               </label> </input></div>
 
               <div id="optionB${
                 questions_number[n]
               }" class="form-check"> <input onclick="saveAnswer(this.id)" class="form-check-input" type="radio" name="${
      questions_number[n]
    }"
                       id="B${questions_number[n]}" value="B"  ${
      answer[questions_number[n]] == "B" ? `checked` : ""
    }> <label oninput="saveOptions(this.id)" id="${
      questions_number[n]
    }" class="form-check-label" for="B${
      questions_number[n]
    }" contenteditable="true">${options[questions_number[n]]
      .split("~")[1]
      .replace(/⌑/g, ",")
      .replace(/®/g, "~")}
                 </label></input> </div>
 
                 <div id="optionC${
                   questions_number[n]
                 }" class="form-check"> <input onclick="saveAnswer(this.id)" class="form-check-input" type="radio" name="${
      questions_number[n]
    }"
                         id="C${questions_number[n]}" value="C"  ${
      answer[questions_number[n]] == "C" ? `checked` : ""
    }> <label oninput="saveOptions(this.id)" id="${
      questions_number[n]
    }" class="form-check-label" for="C${
      questions_number[n]
    }" contenteditable="true">${options[questions_number[n]]
      .split("~")[2]
      .replace(/⌑/g, ",")
      .replace(/®/g, "~")}
                   </label> </input> </div>
 
                   <div id="optionD${
                     questions_number[n]
                   }" class="form-check"> <input onclick="saveAnswer(this.id)" class="form-check-input" type="radio" name="${
      questions_number[n]
    }"
                           id="D${questions_number[n]}" value="D"  ${
      answer[questions_number[n]] == "D" ? `checked` : ""
    }> <label oninput="saveOptions(this.id)" id="${
      questions_number[n]
    }" class="form-check-label" for="D${
      questions_number[n]
    }" contenteditable="true">${options[questions_number[n]]
      .split("~")[3]
      .replace(/⌑/g, ",")
      .replace(/®/g, "~")}
                     </label></input> </div>
              </div>
    </div>
 
    <small class="ml-1 btn btn-sm text-right mb-2 text-danger pr-2" onclick="deleteQuestion(${
      questions_number[n]
    })"><span
                                     id="" class="" role="status">
                                     <b><i class="fas fa-times"></i> Delete
                                         Question </b></small>
    <hr class="mt-0 mb-0 pt-0 pb-0">
    <br/>
    `;

    c = c + 1;
  }
  document.getElementById("cbt_view").innerHTML += `
   <small class="ml-1 btn btn-sm text-right mb-2 text-success pr-2" onclick="addQuestion()"><span
                                     id="" class="" role="status">
                                     <b><i class="fas fa-plus"></i> Add
                                         Question </b></small>
   `;
}

function updateCBT() {
  if (window.parent.confirm("ARE YOU SURE YOU WANT TO PROCEED ?")) {
    // PUSH TO API
    document.getElementById("update_cbt").innerHTML = `<i
    class="fa fa-spinner fa-spin"></i> Updating CBT ...`;
    // PUSH TO API
    fetch(ip + "/api/teacher/edit-cbt", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage["token"],
      },
      body: JSON.stringify({
        cbt_id: JSON.parse(localStorage["cbt_edit_details"]).id,
        cbt_title: localStorage["cbt_title"],
        cbt_date: localStorage["cbt_date"],
        start_time: localStorage["start_time"],
        cbt_duration: localStorage["cbt_duration"],
        cbt_instruction: localStorage["cbt_instruction"],
        cbt_question: question.toString().trim(),
        cbt_options: options.toString().trim(),
        cbt_answer: answer.toString().trim(),
        cbt_questions_number: questions_number.toString().trim(),
        subject_id: localStorage["cbt_subject_id"],
        class_id: localStorage["cbt_subject_class_id"],
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
        // toastr.remove();
        if (data.success) {
          window.alert(data.message);
          setTimeout(function () {
            window.parent.location.assign(domain + "/teacher/cbt.html");
          }, 1000);
        } else {
          window.alert(data.message);
        }
      })
      .catch((err) => console.log(err));
  }
}

function deleteCBT(cbt_id) {
  // PUSH TO API
  fetch(ip + "/api/teacher/delete-cbt/" + cbt_id, {
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
      alert(data.message);
      window.location.reload();
    })
    .catch((err) => console.log(err));
}

function changeCBTStatus(cbt_id, status) {
  fetch(ip + "/api/teacher/cbt-change-status/" + cbt_id + "/" + status, {
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
      alert(data.message);
      window.location.reload();
    })
    .catch((err) => console.log(err));
}

function viewResultForCBT(cbt_id) {
  localStorage.setItem("cbt_result_cbt_id", cbt_id);
  window.parent.location.assign(domain + "/teacher/cbt/cbt-result.html");
}

function getResultForCBT() {
  document.getElementById("result_title").innerHTML =
    " CBT RESULT FOR " +
    localStorage["cbt_subject_name"] +
    " " +
    localStorage["cbt_subject_class"];
  // PUSH TO API
  fetch(ip + "/api/teacher/cbt-result/" + localStorage["cbt_result_cbt_id"], {
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
      document.getElementById("cbt_result").innerHTML = ``;
      if (data.length > 0) {
        for (i in data) {
          document.getElementById("cbt_result").innerHTML += `
        <tr ${c % 2 == 0 ? `class="even"` : `class="odd"`}>
              <td>${c}.</td>
              <td>${
                data[i].student.first_name + " " + data[i].student.last_name
              }</td>
              <td>${data[i].score}</td>
        </tr>
        `;
          c = c + 1;
        }
      } else {
        document.getElementById("cbt_result").innerHTML = `No Result found.`;
      }
    })
    .catch((err) => console.log(err));
}

function useCBTResultFor() {
  // PUSH TO API
  fetch(
    ip +
      "/api/teacher/use-cbt-result/" +
      localStorage["cbt_result_cbt_id"] +
      "/" +
      document.getElementById("use_result_for").value +
      "/" +
      localStorage["cbt_subject_id"],
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage["token"],
      },
    }
  )
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      alert(data.message);
    })
    .catch((err) => console.log(err));
}

// RESULT UPLOADS
function getAssignedSubjectForResultUpload() {
  var c = 1;
  // GET ASSIGNED SUBJECT
  fetch(ip + "/api/teacher/assigned-subject", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      teacher_id: JSON.parse(localStorage["user_data"]).data.id,
      //   session: localStorage["current_session"],
      //   term: localStorage["current_term"],
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
      document.getElementById("subject_table").innerHTML = ``;
      for (i in data) {
        document.getElementById("subject_table").innerHTML += `
                  <tr>
          
                        <td>${c}.</td>
                        <td> <small>${data[i].subject_name}</td>
                        <td>${data[i].class.class_name}</td>
                        <td>
                            <button onclick="showResultUpload('${data[i].subject_name}','${data[i].id}','${data[i].class.class_name}','${data[i].class.id}')" type="button" class="btn btn-primary">
                                RESULT UPLOAD
                            </button>
                       </td>
                        
                     
                        
              
                    <tr>`;

        c = c + 1;
      }
      document.getElementById("assigned_registered").innerHTML =
        document.getElementById("assigned_registered").innerHTML + (c - 1);
    })
    .catch((err) => console.log(err));
}

function showResultUpload(subject_name, subject_id, class_name, class_id) {
  window.parent.location.assign(domain + "/teacher/result/upload-result.html");
  localStorage.setItem("result_upload_subject_name", subject_name);
  localStorage.setItem("result_upload_subject_id", subject_id);
  localStorage.setItem("result_upload_subject_class", class_name);
  localStorage.setItem("result_upload_class_id", class_id);
}

function getAllstudentForSubjectResultUpload(refresh) {
  // CLEAR RESUL LIST
  result_list = {};

  if (!refresh) {
    document.getElementById("result_subject_class").innerHTML +=
      localStorage["result_upload_subject_name"] +
      " " +
      localStorage["result_upload_subject_class"];
  }
  fetch(ip + "/api/teacher/student-registered", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      subject_id: localStorage["result_upload_subject_id"],
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
      console.log(data);
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
                  data.result[i].grade == `-` ? `-` : `${data.result[i].grade}`
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
            ""
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
                data.result[i].remark == `-` ? `-` : `${data.result[i].remark}`
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
                 ""
               }
              </select>
              <span class="focus"></span>
            <div>
          </td>
          
          

      </tr>`;
          c = c + 1;
        }
      } else {
        document.getElementById(
          "student_registered"
        ).innerHTML = `<h4 style="text-align:center;">NO RECORD FOUND</h4>`;
      }
      //paginateTable();
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

// ATTENDANCE
function getAttendanceDate() {
  document.getElementById("date").innerHTML += Date("DD-MM-YYYY").toUpperCase();
}

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

    // NOTIFIER WHEN CAN HAS BEEN SCANNED
    alert("CARD SCANNED");

    // CHECK IF CARD IS VALID
    if (qr_data.split("~")[0] != "StudentATDCard") {
      errorSound.play();
      setTimeout(function () {
        say("Invalid Card!");
      }, 1000);

      return 0;
    }

    if (
      qr_data.split("~")[2] !=
      JSON.parse(localStorage["user_data"]).data.assigned_class.id
    ) {
      errorSound.play();
      setTimeout(function () {
        say("Invalid Class!");
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
          openAuthenticationModal();
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
        openAuthenticationModal();
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

function takeAttendanceByStudentID() {
  if (document.getElementById("student_id").value == "") {
    return alert("INPUT STUDENT ID");
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
      student_id: document.getElementById("student_id").value,
      class_id: "",
      date: getDate().split("~")[1],
      time: getDate().split("~")[0],
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
          say("Verified!");
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

// LESSON PLAN
function getLessonPlan(week) {
  if (week == "") {
    week = document.getElementById("week").value;
  }

  fetch(ip + "/api/teacher/lesson-plan", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      subject_id: localStorage["LESSON-PLAN"].split("-")[0],
      week: week,
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
      document.getElementById("lesson_plan_for").innerHTML =
        "LESSON PLAN FOR " +
        localStorage["LESSON-PLAN"].split("-")[1] +
        " " +
        localStorage["LESSON-PLAN"].split("-")[2];

      document.getElementById("week1").innerHTML =
        ` <option value="${data.week}">${data.week}</option>` +
        document.getElementById("week1").innerHTML;

      document.getElementById("instructional_material").value =
        data.instructional_material;
      document.getElementById("previous_knowledge").value =
        data.previous_knowledge;
      document.getElementById("previous_lesson").value = data.previous_lesson;
      document.getElementById("behavioural_objective").value =
        data.behavioural_objective;
      document.getElementById("content").value = data.content;
      document.getElementById("presentation").value = data.presentation;
      document.getElementById("evaluation").value = data.evaluation;
      document.getElementById("conclusion").value = data.conclusion;
      document.getElementById("assignment").value = data.assignment;
      document.getElementById("lesson_id").value = data.id;
    })
    .catch((err) => console.log(err));
}

function getAssignedSubjectForLearningHub() {
  var c = 1;
  // GET ASSIGNED SUBJECT
  fetch(ip + "/api/teacher/assigned-subject", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      teacher_id: JSON.parse(localStorage["user_data"]).data.id,
      //   session: localStorage["current_session"],
      //   term: localStorage["current_term"],
    }),
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        // openAuthenticationModal();
        openAuthenticationModal();
        return 0;
      }
      return res.json();
    })

    .then((data) => {
      document.getElementById("subject_table").innerHTML = ``;
      for (i in data) {
        document.getElementById("subject_table").innerHTML += `
                  <tr>
          
                        <td>${c}.</td>
                        <td> <small>${data[i].subject_name}</td>
                        <td>${data[i].class.class_name}</td>
                        <td>
                          <button type="button" class="btn btn-primary btn-block"
                              data-bs-toggle="modal" data-bs-target="#staticBackdrop" disabled>
                              Materials
                          </button>
                          <button type="button" class="btn btn-primary btn-block  btn-sm" onclick="loadLessonPage('${data[i].id}-${data[i].subject_name}-${data[i].class.class_name}')">
                            Lesson Plan
                          </button>
                         </td>
                        
                     
                        
              
                    <tr>`;

        c = c + 1;
      }
      document.getElementById("assigned_registered").innerHTML =
        document.getElementById("assigned_registered").innerHTML + (c - 1);
    })
    .catch((err) => console.log(err));
}

function saveLessonPlan() {
  warningtoast("Processing ... please wait");
  fetch(ip + "/api/teacher/save-lesson-plan", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      week: document.getElementById("week1").value,
      instructional_material: document.getElementById("instructional_material")
        .value,
      previous_knowledge: document.getElementById("previous_knowledge").value,
      previous_lesson: document.getElementById("previous_lesson").value,
      behavioural_objective: document.getElementById("behavioural_objective")
        .value,
      content: document.getElementById("content").value,
      presentation: document.getElementById("presentation").value,
      evaluation: document.getElementById("evaluation").value,
      conclusion: document.getElementById("conclusion").value,
      assignment: document.getElementById("assignment").value,
      id: document.getElementById("lesson_id").value,
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
        successtoast(data.message);
      } else {
        errortoast(data.message);
      }
    })
    .catch((err) => console.log(err));
}

function loadLessonPage(value) {
  localStorage.setItem("LESSON-PLAN", value);
  goTo("lesson-plan.html");
}

// CHANGE PASSWORD
function changePassword() {
  var current_password = document
    .getElementById("current_password")
    .value.trim();
  var new_password = document.getElementById("new_password").value.trim();
  var c_new_password = document.getElementById("c_new_password").value.trim();

  if (current_password == "" || new_password == "" || c_new_password == "") {
    warningtoast("Please check no field is empty");
    return 0;
  }

  if (new_password !== c_new_password) {
    say("Password do not match");
    errortoast("Password do not match");
    return 0;
  }
  warningtoast("Processing... Please wait");
  fetch(ip + "/api/teacher/change-password", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      teacher_id: JSON.parse(localStorage["user_data"]).data.teacher_id,
      current_password: current_password,
      new_password: new_password,
      c_new_password: c_new_password,
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
        successtoast(data.message);
        setTimeout(function () {
          window.parent.location.reload();
        }, 1000);
      } else {
        errortoast(data.message);
      }
    })
    .catch((err) => console.log(err));
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

// PRINT
// function print() {
//   var divContents = document.getElementById("attendance_table").innerHTML;
//   var header = document.getElementById("header").innerHTML;
//   console.log(divContents);
//   var a = window.open("", "", "height=500, width=500");
//   a.document.write("<html>");
//   a.document.write(header);
//   a.document.write("<body style="font-family: Poppins; font-weight: bold;" style="font-family: Poppins; font-weight: bold;"  > <h1>Div contents are <br>");
//   a.document.write(divContents);
//   a.document.write("</body></html>");
//   a.document.close();
//   a.print();
// }

// ID
function getIDCard() {
  // FILL CARD DETAILS
  document.getElementById("full_name").innerHTML =
    JSON.parse(localStorage["user_data"]).data.first_name +
    " " +
    JSON.parse(localStorage["user_data"]).data.last_name;

  document.getElementById("id").innerHTML = JSON.parse(
    localStorage["user_data"]
  ).data.teacher_id;

  document.getElementById("gender").innerHTML = JSON.parse(
    localStorage["user_data"]
  ).data.gender;
  document.getElementById("school_address").innerHTML =
    localStorage["SCHOOL_ADDRESS"];

  //TeacherATDCard~id~first_name
  var qrcode = new QRCode("IDQR", {
    text:
      "TeacherATDCard~" +
      JSON.parse(localStorage["user_data"]).data.id +
      "~" +
      JSON.parse(localStorage["user_data"]).data.first_name,
    width: 128,
    height: 128,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });
}

// PRINT
function print() {
  var divContents = document.getElementById("iframe").innerHTML;
  var head = document.getElementById("head").innerHTML;
  console.log(divContents);
  var a = window.open("", "", "height=1000, width=1000");
  a.document.write("<html>");
  a.document.write(head);
  a.document.write(`<body style="font-family: Poppins; font-weight: bold;"`);
  a.document
    .write(`<iframe id="iframe" src="./transcript.html" title="description" style="border:none;"
  title="Iframe Example" scrolling="no"></iframe>`);
  a.document.write(`
  </body>
  
  <script src="../js/iframeSizer.min.js"></script>
  <script src="../js/frame_script.js"></script>
  
  </html>`);
  a.print();
  a.document.close();
}

function print1(section) {
  var divContents = document.getElementById(section).innerHTML;
  var head = document.getElementById("common-library").innerHTML;
  console.log(divContents);
  var a = window.open("", "", "height=1000, width=1000");
  a.document.write("<html>");
  a.document.write(head);
  a.document.write(`<body style="font-family: Poppins; font-weight: bold;">`);
  a.document.write(divContents);
  a.document.write(`
  </body>
  </html>`);
  a.print();
  a.document.close();
}

// CLASSES
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

// PROMOTE STUDENT
function promoteStudent() {
  class_id = document.getElementById("class").value;
  class_name = document.getElementById("class");
  index = document.getElementById("class").selectedIndex;

  if (class_id == "") {
    alert("Please select a class to promote student to !");
  } else {
    // CHECK IF SAME CLASS
    if (
      class_id == JSON.parse(localStorage["user_data"]).data.assigned_class.id
    ) {
      alert("Students are aleady in " + class_name[index].text);
      return 0;
    }

    // CONFIRM PROMOTION
    if (
      confirm(
        "You are about to promote all students in " +
          JSON.parse(localStorage["user_data"]).data.assigned_class.class_name +
          " to " +
          class_name[index].text
      )
    ) {
      // CALL API
      warningtoast("Processing ... Please wait");
      fetch(ip + "/api/teacher/promote-students", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: "Bearer " + localStorage["token"],
        },
        body: JSON.stringify({
          old_class: JSON.parse(localStorage["user_data"]).data.assigned_class
            .id,
          new_class: class_id,
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
            alert(data.message);
            getAllStudentForTable();
          }
        })
        .catch((err) => console.log(err));
    }
  }
}

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

// RESULT UPLOAD DEBOUCER
const uploadResultDebouncer = debounce((id, result_type, score) =>
  uploadResult(id, result_type, score)
);

// SEARCH DEBOUCER
const searchStudentDebouncer = debounce((search_data) =>
  searchStudent(search_data)
);

// UPLOAD COMMENT AND RATING DEBOUNCER
const uploadCommentAndRatingDebouncer = debounce((type, value, rating_type) =>
  uploadCommentAndRating(type, value, rating_type)
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

function editLessonPlan() {
  document.getElementById("save_lesson_bt").hidden = false;

  lesson_content = document.getElementsByName("lesson_plan_content");

  lesson_content.forEach((element) => {
    element.disabled = false;
  });
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
    })
    .catch((err) => console.log(err));
}

// PAGENATION
function paginateTable() {
  $("#paginate").DataTable();
  $(".dataTables_length").addClass("bs-select");
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
      document.getElementById("session_term0").innerHTML = `<option value="${
        localStorage["current_session"] + "-" + localStorage["current_term"]
      }">${
        localStorage["current_session"] + "-" + localStorage["current_term"]
      }</option>`;
      data.forEach((sessions) => {
        term.forEach((term) => {
          document.getElementById(
            "session_term0"
          ).innerHTML += `<option value="${sessions.session + "-" + term}">${
            sessions.session + "-" + term
          }</option>`;
        });
      });
    })
    .catch((err) => console.log(err));
}

function useCustomSessionTerm(session_term) {
  console.log(session_term);
  localStorage.setItem("current_session", session_term.split("-")[0]);
  localStorage.setItem("current_term", session_term.split("-")[1]);
  //getDashboardInfo();
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
    modalExist = parent.document.getElementById("authenticationModal");
    if (modalExist != null) {
      modalExist.remove();
    }
  }
});

// RE - AUTHENTICATION MODAL
function openAuthenticationModal() {
  modal = `<div class="modal fade" id="authenticationModal" tabindex="-1" role="dialog"
aria-labelledby="endModalTitle" aria-hidden="true" data-backdrop="static" data-keyboard="false">
<div class="modal-dialog modal-dialog-centered" role="document">
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
                        <a style="float: right; color: red;" href="./index.html">Log out</a>


                        <div class="login-row btnroo row no-margin">
                            <button id="signin" onclick="reAuth()"
                                class="btn btn-primary btn-sm ">Sign
                                In</button>
                        </div>

                        <br />

                    </div>
                    <footer class="footer">
                        <div style="display: flex;
                        justify-content: center;" class="copyright">© <a style="color: #051f3e;"
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
  parent.$("#authenticationModal").modal({backdrop:"static",keyboard:false})
  parent.$("#authenticationModal").modal("show");
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

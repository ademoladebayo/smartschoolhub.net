// SOUND VARIABLES
var successSound = new Audio("../asset/sound/verified.mp3");
var errorSound = new Audio("../asset/sound/error1.mp3");

var ip = localStorage["ip"];
var domain = localStorage["domain"];

// CBT VARIABLES
var question = [];
var options = [];
var questions_number = [];
var answer = [];

getSchoolDetails();
collapseSidebar();
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
      "school": localStorage["school"],
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
  document.getElementById("user_name").innerHTML = `<b>${JSON.parse(localStorage["user_data"]).data.first_name +
    " " +
    JSON.parse(localStorage["user_data"]).data.last_name
    }</b>`;
  document.getElementById("user_name1").innerHTML = `<b>${JSON.parse(localStorage["user_data"]).data.first_name +
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

  document.getElementById(
    "cbt_no"
  ).innerHTML = `<span class="counter" data-num="${parseInt(
    formatNumber(
      JSON.parse(localStorage["user_data"]).dashboard_information.cbt.cbt_no
    )
  )}">${formatNumber(
    JSON.parse(localStorage["user_data"]).dashboard_information.cbt.cbt_no
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
                <td id="${data_key[i]
      }" name="profile_data" class="font-medium text-dark-medium">${user_data[data_key[i]]
      }</td>
        </tr>
        
        `;
  }
}

function loadSideNav(page) {
  document.getElementById("side_nav").innerHTML = `
    <ul class="nav nav-sidebar-menu sidebar-toggle-view">
    <li class="nav-item">
        <a  onclick="goTo('dashboard.html')" id="dashboard" href="#" class="nav-link"><i
                class="flaticon-dashboard"></i><span>Dashboard</span></a>
    </li>

    <li class="nav-item">
        <a  onclick="goTo('my-profile.html')"    id="my-profile" href="#" class="nav-link"><i class="far fa-address-card"></i><span>My profile</span></a>
    </li>

    <li class="nav-item">
        <a  onclick="goTo('my-student.html')"  id="my-student" href="#" class="nav-link"> <i class="fas fa-users"></i>
        <span>My Students</span></a>
    </li>

    <li class="nav-item">
        <a   id="learning-hub" href="learning-hub-frame.html" class="nav-link"><i
                class="flaticon-open-book"></i><span>Learning Hub</span></a>
    </li>

    
    <li class="nav-item">
    <a   onclick="goTo('subject-registration.html')"  id="subject-registration" href="#" class="nav-link"><i class="fas fa-plus"></i><span>Subject Registration</span></a>
    </li>

    <!-- <li class="nav-item">
    <a   id="idcard" href="id-card.html" class="nav-link"><i class="fa fa-id-badge"></i>
    <span>Attendance Card</span></a>
    </li> --!>


    <li class="nav-item">
        <a  id="timetable" href="#" class="nav-link"><i
                class="flaticon-calendar"></i><span>My Timetable <sup><small>Coming Soon ...</small></sup></span></a>
    </li>

    <li class="nav-item">
        <a  onclick="goTo('attendance.html')"  id="attendance" href="#" class="nav-link"><i class="fas fa-chart-line"></i>
        <span>Mark Attendance</span></a>
    </li>

    <li class="nav-item">
        <a  onclick="goTo('cbt.html')"  id="cbt" href="#" class="nav-link"><i class="fas fa-desktop"></i><span>CBT</span></a>
    </li>

    <li class="nav-item">
        <a  onclick="goTo('result.html')"  id="result" href="#" class="nav-link"><i class="fas fa-file-upload"></i></i><span>Upload Result</span></a>
    </li>

    <li class="nav-item">
        <a  onclick="goTo('change-password.html')"  id="change-password" href="#" class="nav-link"><i
                class="flaticon-settings"></i><span>Change Password</span></a>
    </li>
    <li class="nav-item">
        <a  onclick="goTo('');" href="#" class="nav-link"><i class="flaticon-turn-off"></i><span>Log
                Out</span></a>
    </li>
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
        "school": localStorage["school"],
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

          //REGISTER USER DEVICE
          deviceToken = await initFirebaseMessagingRegistration();
          await sendTokenToServer(deviceToken, "TEACHER", data.data.id);

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
        "school": localStorage["school"],
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
    school = localStorage['school'];
    localStorage.clear();
    localStorage.setItem('school', school);
    window.parent.location.assign(domain);
    return 0;
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
      "school": localStorage["school"],
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
            JSON.parse(localStorage["user_data"]).data.assigned_class.id ||
            data[i].profile_status == "DISABLED"
          ) {
            continue;
          }
          document.getElementById("student_table").innerHTML += `
          <tr class='${c % 2 == 0 ? "even" : "odd"}'>
      
          <td>${c}.</td>
          <td>${data[i].student_id}</td>
          <td>${data[i].first_name + " " + data[i].last_name}</td>
          <td>${data[i].gender}</td>
          <td class="text-white">${data[i].profile_status == "ENABLED"
              ? `<span class="badge bg-success"><b>ENABLED</b></span>`
              : `<span class="badge bg-danger"><b>DISABLED</b></span>`
            }</td>
          <td>${data[i].class == null ? `GRADUATED` : data[i].class.class_name
            }</td>
          <td>
          <a  onmouseover="viewStudent(${JSON.stringify(data[i])
              .replace(/'/g, "")
              .replace(
                /"/g,
                "'"
              )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                  data-bs-target="#viewModal"><i class="fas fa-eye"></i> </a>
          <a  onclick="viewStudentResult(${JSON.stringify(data[i])
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
        "school": localStorage["school"],
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
        "school": localStorage["school"],
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
      "school": localStorage["school"],
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
      "school": localStorage["school"],
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
      "school": localStorage["school"],
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
              <a  onmouseover="viewStudent(${JSON.stringify(data[i])
                  .replace(/'/g, "")
                  .replace(
                    /"/g,
                    "'"
                  )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                      data-bs-target="#viewModal"><i class="fas fa-eye"></i> View</a>
              <a  onmouseover="reloadEditFrame(); editStudent(${JSON.stringify(
                    data[i]
                  )
                  .replace(/'/g, "")
                  .replace(
                    /"/g,
                    "'"
                  )})" class="btn btn-warning" data-bs-toggle="modal"
              data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
  
              
              <a  onclick="updateStudentProfileStatus(${data[i].id
                })" class="btn btn-secondary text-black"><i
                  class="fas fa-lock"></i> Disable</a>  

              
              <a  onclick="viewStudentResult(${JSON.stringify(data[i])
                  .replace(/'/g, "")
                  .replace(
                    /"/g,
                    "'"
                  )})" class="btn gradient-orange-peel text-black"><i
                          class="fas fa-poll"></i>
                      Result</a> 
              
              <a  onclick="deleteStudent(${data[i].id
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
              <a  onmouseover="viewStudent(${JSON.stringify(data[i])
                  .replace(/'/g, "")
                  .replace(
                    /"/g,
                    "'"
                  )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                      data-bs-target="#viewModal"><i class="fas fa-eye"></i> View</a>
              <a  onmouseover="reloadEditFrame(); editStudent(${JSON.stringify(
                    data[i]
                  )
                  .replace(/'/g, "")
                  .replace(
                    /"/g,
                    "'"
                  )})" class="btn btn-warning" data-bs-toggle="modal"
              data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
  
              
              <a  onclick="updateStudentProfileStatus(${data[i].id
                })" class="btn btn-secondary text-black"><i
                  class="fas fa-unlock-alt"></i> Enable</a>  

              
              <a  onclick="viewStudentResult(${JSON.stringify(data[i])
                  .replace(/'/g, "")
                  .replace(
                    /"/g,
                    "'"
                  )})" class="btn gradient-orange-peel text-black"><i
                          class="fas fa-poll"></i>
                      Result</a> 
              
              <a  onclick="deleteStudent(${data[i].id
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
              <a  onmouseover="viewStudent(${JSON.stringify(data[i])
                  .replace(/'/g, "")
                  .replace(
                    /"/g,
                    "'"
                  )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                      data-bs-target="#viewModal"><i class="fas fa-eye"></i> View</a>
              <a  onmouseover="reloadEditFrame(); editStudent(${JSON.stringify(
                    data[i]
                  )
                  .replace(/'/g, "")
                  .replace(
                    /"/g,
                    "'"
                  )})" class="btn btn-warning" data-bs-toggle="modal"
              data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
  
              
              <a  onclick="updateStudentProfileStatus(${data[i].id
                })" class="btn btn-secondary text-black"><i
                  class="fas fa-lock"></i> Disable</a>  

              
              <a  onclick="viewStudentResult(${JSON.stringify(data[i])
                  .replace(/'/g, "")
                  .replace(
                    /"/g,
                    "'"
                  )})" class="btn gradient-orange-peel text-black"><i
                          class="fas fa-poll"></i>
                      Result</a> 

              <a  onclick="deleteStudent(${data[i].id
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
              <a  onmouseover="viewStudent(${JSON.stringify(data[i])
                  .replace(/'/g, "")
                  .replace(
                    /"/g,
                    "'"
                  )})"  class="btn btn-primary text-white" data-bs-toggle="modal"
                                                      data-bs-target="#viewModal"><i class="fas fa-eye"></i> View</a>
              <a  onmouseover="reloadEditFrame(); editStudent(${JSON.stringify(
                    data[i]
                  )
                  .replace(/'/g, "")
                  .replace(
                    /"/g,
                    "'"
                  )})" class="btn btn-warning" data-bs-toggle="modal"
              data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
  
              
              <a  onclick="updateStudentProfileStatus(${data[i].id
                })" class="btn btn-secondary text-black"><i
                  class="fas fa-unlock-alt"></i> Enable</a>  

              
              <a  onclick="viewStudentResult(${JSON.stringify(data[i])
                  .replace(/'/g, "")
                  .replace(
                    /"/g,
                    "'"
                  )})" class="btn gradient-orange-peel text-black"><i
                          class="fas fa-poll"></i>
                      Result</a> 
              
              <a  onclick="deleteStudent(${data[i].id
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
      "school": localStorage["school"],
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
              <td style="color: ${result.grade.includes("F")
              ? "red"
              : result.grade.includes("A")
                ? "blue"
                : "black"
            } ; font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold; text-align:center;">
              ${result.grade}
              </td>
              <td style="color: ${result.grade.includes("F")
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
      "school": localStorage["school"],
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
      "school": localStorage["school"],
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
      "school": localStorage["school"],
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
      "school": localStorage["school"],
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
      "school": localStorage["school"],
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
                <td> <small><i class="fa fa-star" aria-hidden="true"></i></small> ${data[i].subject_name
              }</td>
                <td>${data[i].teacher.title +
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
              <td>${data[i].teacher.title +
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
          "school": localStorage["school"],
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
      "school": localStorage["school"],
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
        // GET CBT COUNT
        var cbt_details = JSON.parse(localStorage["user_data"])
          .dashboard_information.cbt;
        var index = cbt_details.cbt_subject_id.indexOf(data[i].id);
        var count = index == -1 ? 0 : cbt_details.cbt_subject_count[index];

        document.getElementById("subject_table").innerHTML += `
                  <tr>
          
                        <td>${c}.</td>
                        <td> <small>${data[i].subject_name}</td>
                        <td>${data[i].class.class_name}</td>
                        <td>
                            <button onclick="showCBTList('${data[i].subject_name}','${data[i].id}','${data[i].class.class_name}','${data[i].class.id}')" type="button" class="btn btn-primary">
                               <span id="" class="badge bg-white"
                      style="color:blue">${count}</span> CBT AVAILABLE
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
      "school": localStorage["school"],
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
          ${data[i].cbt_status == "OPEN"
              ? `<span class="badge bg-success text-white"><b>${data[i].cbt_status}</b></span>`
              : `<span class="badge bg-danger text-white"><b>${data[i].cbt_status}</b></span>`
            }</td>
  
          
  
          <td>
              <button style="text-decoration: none; cursor: pointer;" class="btn-sm btn-primary" onclick="viewCBT(${JSON.stringify(
              data[i]
            )
              .replace(/'/g, "")
              .replace(/"/g, "'")
              .replace(/&#39;/g, "™")})"
                 ><i class="fas fa-eye"></i></button>
              <button style="text-decoration: none; cursor: pointer;" onclick=" reloadEditFrame(); editCBT(${JSON.stringify(
                data[i]
              )
              .replace(/'/g, "")
              .replace(/"/g, "'")
              .replace(/&#39;/g, "™")})"
                  class="btn-sm btn-warning" data-bs-toggle="modal"
                  data-bs-target="#editModal"><i class="fas fa-edit"></i></button>
              <button style="text-decoration: none; cursor: pointer;" onclick="viewResultForCBT(${data[i].id
            })"
                  class="btn-sm btn-success"><i class="fas fa-poll"></i></button>

              ${data[i].cbt_status == "OPEN"
              ? ` <button style="text-decoration: none; cursor: pointer;" onclick="changeCBTStatus(${data[i].id},'CLOSE')"
                      class="btn-sm btn-secondary"><i class="fas fa-lock"></i></i></button>`
              : `
                  <button
                    style="text-decoration: none; cursor: pointer;"
                    onclick="changeCBTStatus(${data[i].id},'OPEN')"
                    class="btn-sm btn-secondary"
                  >
                  <i class="fas fa-lock-open"></i>
                  </button>`
            }

              <button style="text-decoration: none; cursor: pointer;" onclick="deleteCBT(${data[i].id
            })"
                  class="btn-sm btn-danger"><i class="fas fa-trash"></i></button>

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
        domain + "/teacher/cbt/frame-cbt-question-create.html"
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
    <div id="demo" class="" class="card-body text-dark bg-light">
    <b id="Q${questions_number[n]}">Question ${c}</b> <br><br>
        <div onclick="openQuestionModal(this.id,this.innerHTML); scrollToElement('C0')" onchange="alert('chnage');saveQuestion(this.id,this.innerHTML)"  id="${questions_number[n]
      }" style="overflow: auto; height: 25vh; border:1px solid black" contenteditable="true">
            ${question[questions_number[n]]
        .replace(/⌑/g, ",")
        .replace(/™/g, "'")}
        </div>
    </div>
    <br>
  
    <div class="pl-2">
             <div id="optionA${questions_number[n]
      }" class="form-check"> <input onclick="saveAnswer(this.id)" class="form-check-input" type="radio" name="${questions_number[n]
      }"
                     id="A${questions_number[n]}" value="A"  ${answer[questions_number[n]] == "A" ? `checked` : ""
      }> <label oninput="saveOptions(this.id)" id="${questions_number[n]
      }" class="form-check-label" forr="A${questions_number[n]
      }" contenteditable="true">${options[questions_number[n]]
        .split("~")[0]
        .replace(/⌑/g, ",")
        .replace(/®/g, "~")
        .replace(/™/g, "'")}
               </label> </input></div>
 
               <div id="optionB${questions_number[n]
      }" class="form-check"> <input onclick="saveAnswer(this.id)" class="form-check-input" type="radio" name="${questions_number[n]
      }"
                       id="B${questions_number[n]}" value="B"  ${answer[questions_number[n]] == "B" ? `checked` : ""
      }> <label oninput="saveOptions(this.id)" id="${questions_number[n]
      }" class="form-check-label" forr="B${questions_number[n]
      }" contenteditable="true">${options[questions_number[n]]
        .split("~")[1]
        .replace(/⌑/g, ",")
        .replace(/®/g, "~")
        .replace(/™/g, "'")}
                 </label></input> </div>
 
                 <div id="optionC${questions_number[n]
      }" class="form-check"> <input onclick="saveAnswer(this.id)" class="form-check-input" type="radio" name="${questions_number[n]
      }"
                         id="C${questions_number[n]}" value="C"  ${answer[questions_number[n]] == "C" ? `checked` : ""
      }> <label oninput="saveOptions(this.id)" id="${questions_number[n]
      }" class="form-check-label" forr="C${questions_number[n]
      }" contenteditable="true">${options[questions_number[n]]
        .split("~")[2]
        .replace(/⌑/g, ",")
        .replace(/®/g, "~")
        .replace(/™/g, "'")}
                   </label> </input> </div>
 
                   <div id="optionD${questions_number[n]
      }" class="form-check"> <input onclick="saveAnswer(this.id)" class="form-check-input" type="radio" name="${questions_number[n]
      }"
                           id="D${questions_number[n]}" value="D"  ${answer[questions_number[n]] == "D" ? `checked` : ""
      }> <label oninput="saveOptions(this.id)" id="${questions_number[n]
      }" class="form-check-label" forr="D${questions_number[n]
      }" contenteditable="true">${options[questions_number[n]]
        .split("~")[3]
        .replace(/⌑/g, ",")
        .replace(/®/g, "~")
        .replace(/™/g, "'")}
                     </label></input> </div>
              </div>
    </div>
 
    <small class="ml-1 btn btn-sm text-right mb-2 text-danger pr-2" onclick="deleteQuestion(${questions_number[n]
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
  // REPLACE EVERY "," with "⌑" AND EVERY "'" WITH ""
  question[number] = question_text
    .replace(/,/g, "⌑")
    .replace(/'/g, "™")
    .replace(/&#39;/g, "™");
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
        .replace(/,/g, "⌑")
        .replace(/'/g, "™")
        .replace(/&#39;/g, "™") + "~";
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
        "school": localStorage["school"],
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
    document.getElementById("cbt_view").innerHTML += ` 
  <div class="mb-3">
   <p  class="mb-1"><b id="Q${questions_number[n]}">Question ${c}</b> <br><br>
   <span oninput="saveQuestion(this.id,this.innerHTML)"  id="${questions_number[n]
      }" >${question[questions_number[n]]
        .replace(/⌑/g, ",")
        .replace(/™/g, "'")}</span></p>
 <div class="pl-2">
           <div id="optionA${questions_number[n]
      }" class="form-check"> <input  class="form-check-input" type="radio" name="${questions_number[n]
      }"
                   id="A${questions_number[n]}" value="A"    ${answer[questions_number[n]] == "A" ? `checked` : `disabled='disabled'`
      }> <label oninput="saveOptions(this.id)" id="${questions_number[n]
      }" class="form-check-label" for="A${questions_number[n]}" >${options[
        questions_number[n]
      ]
        .split("~")[0]
        .replace(/⌑/g, ",")
        .replace(/®/g, "~")
        .replace(/™/g, "'")}
             </label> </input></div>

             <div id="optionB${questions_number[n]
      }" class="form-check"> <input  class="form-check-input" type="radio" name="${questions_number[n]
      }"
                     id="B${questions_number[n]}" value="B" ${answer[questions_number[n]] == "B" ? `checked` : `disabled='disabled'`
      } > <label oninput="saveOptions(this.id)" id="${questions_number[n]
      }" class="form-check-label" for="B${questions_number[n]}" >${options[
        questions_number[n]
      ]
        .split("~")[1]
        .replace(/⌑/g, ",")
        .replace(/®/g, "~")
        .replace(/™/g, "'")}
               </label></input> </div>

               <div id="optionC${questions_number[n]
      }" class="form-check"> <input class="form-check-input" type="radio" name="${questions_number[n]
      }"
                       id="C${questions_number[n]}" value="C" ${answer[questions_number[n]] == "C" ? `checked` : `disabled='disabled'`
      }> <label oninput="saveOptions(this.id)" id="${questions_number[n]
      }" class="form-check-label" for="C${questions_number[n]}" >${options[
        questions_number[n]
      ]
        .split("~")[2]
        .replace(/⌑/g, ",")
        .replace(/®/g, "~")
        .replace(/™/g, "'")}
                 </label> </input> </div>

                 <div id="optionD${questions_number[n]
      }" class="form-check"> <input class="form-check-input" type="radio" name="${questions_number[n]
      }"
                         id="D${questions_number[n]}" value="D" ${answer[questions_number[n]] == "D" ? `checked` : `disabled='disabled'`
      } > <label oninput="saveOptions(this.id)" id="${questions_number[n]
      }" class="form-check-label" for="D${questions_number[n]}" >${options[
        questions_number[n]
      ]
        .split("~")[3]
        .replace(/⌑/g, ",")
        .replace(/®/g, "~")
        .replace(/™/g, "'")}
                   </label></in put> </div>
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
        domain + "/teacher/cbt/frame-cbt-question-edit.html"
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

    <div id="demo" class="" class="card-body text-dark bg-light">
    <b id="Q${questions_number[n]}">Question ${c}</b> <br><br>
        <div onclick="openQuestionModal(this.id,this.innerHTML); scrollToElement('C0')" onchange="alert('chnage');saveQuestion(this.id,this.innerHTML)"  id="${questions_number[n]
      }" style="overflow: auto; height: 25vh; border:1px solid black" contenteditable="true">
            ${question[questions_number[n]]
        .replace(/⌑/g, ",")
        .replace(/™/g, "'")}
        </div>
    </div>
    <br>


   <div class="pl-2">
             <div id="optionA${questions_number[n]
      }" class="form-check"> <input onclick="saveAnswer(this.id)" class="form-check-input" type="radio" name="${questions_number[n]
      }"
                     id="A${questions_number[n]}" value="A"  ${answer[questions_number[n]] == "A" ? `checked` : ""
      }> <label oninput="saveOptions(this.id)" id="${questions_number[n]
      }" class="form-check-label" forr="A${questions_number[n]
      }" contenteditable="true">${options[questions_number[n]]
        .split("~")[0]
        .replace(/⌑/g, ",")
        .replace(/®/g, "~")
        .replace(/™/g, "'")}
               </label> </input></div>
 
               <div id="optionB${questions_number[n]
      }" class="form-check"> <input onclick="saveAnswer(this.id)" class="form-check-input" type="radio" name="${questions_number[n]
      }"
                       id="B${questions_number[n]}" value="B"  ${answer[questions_number[n]] == "B" ? `checked` : ""
      }> <label oninput="saveOptions(this.id)" id="${questions_number[n]
      }" class="form-check-label" forr="B${questions_number[n]
      }" contenteditable="true">${options[questions_number[n]]
        .split("~")[1]
        .replace(/⌑/g, ",")
        .replace(/®/g, "~")
        .replace(/™/g, "'")}
                 </label></input> </div>
 
                 <div id="optionC${questions_number[n]
      }" class="form-check"> <input onclick="saveAnswer(this.id)" class="form-check-input" type="radio" name="${questions_number[n]
      }"
                         id="C${questions_number[n]}" value="C"  ${answer[questions_number[n]] == "C" ? `checked` : ""
      }> <label oninput="saveOptions(this.id)" id="${questions_number[n]
      }" class="form-check-label" forr="C${questions_number[n]
      }" contenteditable="true">${options[questions_number[n]]
        .split("~")[2]
        .replace(/⌑/g, ",")
        .replace(/®/g, "~")
        .replace(/™/g, "'")}
                   </label> </input> </div>
 
                   <div id="optionD${questions_number[n]
      }" class="form-check"> <input onclick="saveAnswer(this.id)" class="form-check-input" type="radio" name="${questions_number[n]
      }"
                           id="D${questions_number[n]}" value="D"  ${answer[questions_number[n]] == "D" ? `checked` : ""
      }> <label oninput="saveOptions(this.id)" id="${questions_number[n]
      }" class="form-check-label" forr="D${questions_number[n]
      }" contenteditable="true">${options[questions_number[n]]
        .split("~")[3]
        .replace(/⌑/g, ",")
        .replace(/®/g, "~")
        .replace(/™/g, "'")}
                     </label></input> </div>
              </div>
    </div>
 
    <small class="ml-1 btn btn-sm text-right mb-2 text-danger pr-2" onclick="deleteQuestion(${questions_number[n]
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
        "school": localStorage["school"],
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
      "school": localStorage["school"],
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
      "school": localStorage["school"],
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
      "school": localStorage["school"],
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
              <td>${data[i].student.first_name + " " + data[i].student.last_name
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
        "school": localStorage["school"],
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
      "school": localStorage["school"],
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
      "school": localStorage["school"],
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
          <td>${data.result[i].student.first_name +
            " " +
            data.result[i].student.middle_name +
            " " +
            data.result[i].student.last_name
            }</td>
          
          <td class="allownumeric" oninput="scoreLimit(this); addToResultList('${data.result[i].id
            }','first_ca',this.innerHTML)" contenteditable="true" >${data.result[i].first_ca
            }</td>
          <td oninput="scoreLimit(this); addToResultList('${data.result[i].id
            }','second_ca',this.innerHTML)" contenteditable="true">${data.result[i].second_ca
            }</td>
          <td oninput="scoreLimit(this); addToResultList('${data.result[i].id
            }','examination',this.innerHTML)" contenteditable="true">${data.result[i].examination
            }</td>
          <td style="font-size:20px; font-style:bold;"><b>${data.result[i].total
            }</b></td>
          <td> 
            <div class="select">
                <select onChange="addToResultList('${data.result[i].id
            }','grade',this.value)" id="standard-select" id="grade" value="${data.result[i].grade == "-"
              ? "Select Grade"
              : `${data.result[i].grade}`
            }" class="select2">
                <option value="<b>${data.result[i].grade == `-` ? `-` : `${data.result[i].grade}`
            }</b>">${data.result[i].grade == "-"
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
              <select onChange="addToResultList('${data.result[i].id
            }','remark',this.value)" id="standard-select" id="remark" value="<b>${data.result[i].grade == "-"
              ? "Select Remark"
              : `${data.result[i].remark}`
            }</b>" class="select2">
              <option value="${data.result[i].remark == `-` ? `-` : `${data.result[i].remark}`
            }">${data.result[i].remark == "-"
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
      "school": localStorage["school"],
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
      "school": localStorage["school"],
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
        "school": localStorage["school"],
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
      "school": localStorage["school"],
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
                    <td>${data[i].student.first_name +
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
      "school": localStorage["school"],
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

// LESSON PLAN AND LEARNING HUB
function getLessonPlan(week) {
  openSpinnerModal();
  if (week == "") {
    week = document.getElementById("week").value;
  }

  fetch(ip + "/api/teacher/lesson-plan", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "school": localStorage["school"],
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
      removeSpinnerModal();
      document.getElementById("lesson_plan_for").innerHTML =
        "LESSON PLAN FOR " +
        localStorage["LESSON-PLAN"].split("-")[1] +
        " " +
        localStorage["LESSON-PLAN"].split("-")[2];

      document.getElementById("lp_status").innerHTML = `<span class="badge ${data.status == "APPROVED"
        ? `bg-success`
        : data.status == "DISAPPROVED"
          ? `bg-danger`
          : `bg-warning`
        }"><b>${data.status}</b></span>`;

      // document.getElementById("week1").value =
      //   ` <option value="${data.week}">${data.week}</option>` +
      //   document.getElementById("week1").value;

      document.getElementById("instructional_material").innerHTML =
        data.instructional_material;
      document.getElementById("previous_knowledge").innerHTML =
        data.previous_knowledge;
      document.getElementById("previous_lesson").innerHTML =
        data.previous_lesson;
      document.getElementById("behavioural_objective").innerHTML =
        data.behavioural_objective;
      CKEDITOR.instances.editor1.setData(data.content);
      document.getElementById("presentation").innerHTML = data.presentation;
      document.getElementById("evaluation").innerHTML = data.evaluation;
      document.getElementById("conclusion").innerHTML = data.conclusion;
      document.getElementById("assignment").innerHTML = data.assignment;
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
      "school": localStorage["school"],
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
                          <a  onclick="localStorage.setItem('LH_SUBJECT_ID','${data[i].id}'); localStorage.setItem('LH_SUBJECT_CLASS','${data[i].subject_name} ${data[i].class.class_name}'); getLearningHubMaterials('${data[i].id}'); getScheduledClass();" type="button" class="btn btn-primary btn-block"
                              data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                              Materials
                          </a     >
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
  openSpinnerModal();
  fetch(ip + "/api/teacher/save-lesson-plan", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "school": localStorage["school"],
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      //week: document.getElementById("week1").value,
      instructional_material: document.getElementById("instructional_material")
        .innerHTML,
      previous_knowledge:
        document.getElementById("previous_knowledge").innerHTML,
      previous_lesson: document.getElementById("previous_lesson").innerHTML,
      behavioural_objective: document.getElementById("behavioural_objective")
        .innerHTML,
      content: CKEDITOR.instances.editor1.getData(),
      presentation: document.getElementById("presentation").innerHTML,
      evaluation: document.getElementById("evaluation").innerHTML,
      conclusion: document.getElementById("conclusion").innerHTML,
      assignment: document.getElementById("assignment").innerHTML,
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
      removeSpinnerModal();
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

function processContent() {
  var CONTENT_ACTION = localStorage["CONTENT_ACTION"];
  var CONTENT_TYPE = localStorage["CONTENT_TYPE"];
  var CONTENT = CKEDITOR.instances.editor1.getData();
  var TOPIC = document.getElementById("topic").value;

  if (CONTENT_ACTION == "CREATE") {
    if (CONTENT != "" && TOPIC != "") {
      postMaterial(TOPIC, CONTENT, CONTENT_TYPE);
    } else {
      warningtoast("Check that no feild is empty.");
    }
  } else if (CONTENT_ACTION == "EDIT") {
    if (CONTENT != "" && TOPIC != "") {
      editMaterial(TOPIC, CONTENT, CONTENT_TYPE);
    } else {
      warningtoast("Check that no feild is empty.");
    }
  }
}

function postMaterial(TOPIC, CONTENT, material_type) {
  openSpinnerModal();

  body = "";
  headers = "";

  if (material_type == "UPLOAD") {
    var file = document.getElementById("file-upload").files[0];

    // USE FORM DATA
    const formData = new FormData();
    formData.append("file", file);
    formData.append("material_type", material_type);
    formData.append("subject_id", localStorage["LH_SUBJECT_ID"]);

    headers = {
      Accept: "application/json",
      "school": localStorage["school"],
      Authorization: "Bearer " + localStorage["token"],
    };

    body = formData;
  } else {
    headers = {
      Accept: "application/json",
      "school": localStorage["school"],
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    };

    body = JSON.stringify({
      material_type: material_type,
      topic: TOPIC,
      content: CONTENT,
      subject_id: localStorage["LH_SUBJECT_ID"],
      mark_obtainable:
        document.getElementById("mark_obtainable").value != ""
          ? document.getElementById("mark_obtainable").value
          : 0,
    });
  }

  fetch(ip + "/api/teacher/subject-material", {
    method: "POST",
    headers: headers,
    body: body,
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        openAuthenticationModal();
      }
      return res.json();
    })

    .then((data) => {
      parent.$("#spinnerModal").modal("hide");
      parent.document.getElementById("spinnerModal").remove();
      toastr.remove();

      if (data.success) {
        successtoast(data.message);
        setTimeout(function () {
          history.back();
          getLearningHubMaterials(localStorage["LH_SUBJECT_ID"]);
        }, 1000);
      } else {
        errortoast(data.message);
      }
    })
    .catch((err) => console.log(err));
}

function editMaterial(TOPIC, CONTENT, material_type) {
  openSpinnerModal();
  fetch(ip + "/api/teacher/subject-material", {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "school": localStorage["school"],
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      material_id: JSON.parse(
        CryptoJS.AES.decrypt(
          localStorage["LH_EDIT_MATERIAL"],
          "AESENCRYPT"
        ).toString(CryptoJS.enc.Utf8)
      ).id,
      material_type: material_type,
      topic: TOPIC,
      content: CONTENT,
      subject_id: localStorage["LH_SUBJECT_ID"],
      mark_obtainable:
        document.getElementById("mark_obtainable").value != ""
          ? document.getElementById("mark_obtainable").value
          : 0,
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
      parent.$("#spinnerModal").modal("hide");
      parent.document.getElementById("spinnerModal").remove();
      toastr.remove();

      if (data.success) {
        successtoast(data.message);
        setTimeout(function () {
          history.back();
          getLearningHubMaterials(localStorage["LH_SUBJECT_ID"]);
        }, 1000);
      } else {
        errortoast(data.message);
      }
    })
    .catch((err) => console.log(err));
}

function deleteMaterial(material_id, material_type) {
  if (!confirm("You are about to delete this material ")) {
    return 0;
  }

  openSpinnerModal();
  fetch(ip + "/api/teacher/subject-material", {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "school": localStorage["school"],
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      material_id: material_id,
      material_type: material_type,
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
      parent.$("#spinnerModal").modal("hide");
      parent.document.getElementById("spinnerModal").remove();
      toastr.remove();

      if (data.success) {
        alert(data.message);
        setTimeout(function () {
          getLearningHubMaterials(localStorage["LH_SUBJECT_ID"]);
        }, 1000);
      } else {
        alert(data.message);
      }
    })
    .catch((err) => console.log(err));
}

function getLearningHubMaterials(subject_id) {
  openSpinnerModal("Loading materials");
  document.getElementById("subject").innerHTML =
    "LEARNING HUB FOR " + localStorage["LH_SUBJECT_CLASS"];
  fetch(ip + "/api/teacher/subject-material/" + subject_id, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "school": localStorage["school"],
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
      //POPULATE COUNTS
      document.getElementById("note-count").innerHTML = data.note.length;
      document.getElementById("upload-count").innerHTML = data.upload.length;
      document.getElementById("video-count").innerHTML = data.video.length;
      document.getElementById("assignment-count").innerHTML =
        data.assignment.length;

      // DISPLAY UPLOADED NOTE
      if (data.note.length > 0) {
        document.getElementById("notes-content-main").innerHTML = ``;
        data.note.forEach((note) => {
          console.log(note);
          document.getElementById(
            "notes-content-main"
          ).innerHTML += `  <div class="card shadow mb-3">
              <div onclick="collapseContent('note_${note.id
            }')" class="card-header">
                  <small id="date_time" class="m-0 text-primary">${note.date
            }</small>
                  <a  onclick="deleteMaterial('${note.id
            }','NOTE')" target="_blank"
                      class="btn  btn-circle btn-sm float-right">
                      <i style="color:red;" class="fas fa-trash-alt"></i></i>
                  </a>
                  <a  onclick="content('EDIT','NOTE','${CryptoJS.AES.encrypt(
              JSON.stringify(note),
              "AESENCRYPT"
            )}')" target="_blank"
                      class="btn  btn-circle btn-sm float-right">
                      <i style="color:black;" class="far fa-edit"></i>
                  </a>
                  <br>
                  <span class="m-0 text-primary">
                      <a  id="topic" data-toggle="collapse" href="#demo">${note.topic
            }</a>
                  </span>
              </div>
              <div id="note_${note.id}" class="collapse"
                  class="card-body text-dark bg-light">
                  <div class="p-2"
                      style="overflow: auto; height: auto; border:1px solid black; color: black;">
                    ${note.content}

                  </div>
              </div>
              </div>`;
        });
      } else {
        document.getElementById("notes-content-main").innerHTML = ``;
        document.getElementById(
          "notes-content-main"
        ).innerHTML += ` <div class="card shadow mb-1">
                                                    <div class="card-body" 
                                                    style="justify-content:center; display:flex">No Note Here</div>
                                                </div>`;
      }

      // DISPLAY UPLOADED CONTENT
      if (data.upload.length > 0) {
        document.getElementById("uploads-content-main").innerHTML = ``;
        data.upload.forEach((upload) => {
          document.getElementById(
            "uploads-content-main"
          ).innerHTML += `  <div class="card shadow mb-3">
        <div onclick="collapseContent('upload_${upload.id
            }')" class="card-header">
            <small id="date_time" class="m-0 text-primary">${upload.date
            }</small>
            <a  onclick="deleteMaterial('${upload.id
            }','UPLOAD')" target="_blank"
                class="btn  btn-circle btn-sm float-right">
                <i style="color:red;" class="fas fa-trash-alt"></i></i>
            </a>
            <br>
            <span class="m-0 text-primary">
                <a  id="topic" data-toggle="collapse" href="#demo">${upload.url
            }</a>
            </span>
        </div>
        <div id="upload_${upload.id}" class="collapse"
            class="card-body text-dark bg-light">
           
 <object data="${domain + "/backend/storage/app/public/fileupload/learninghub/" + upload.url
            }"  type="application/pdf" class="img-fluid"style="width: 100vw; height: 65vh; border:1px solid black; background: lightgrey">
        <embed
            src="${domain +
            "/backend/storage/app/public/fileupload/learninghub/" +
            upload.url
            }"
            type="application/pdf" class="img-fluid">
    </object>
        </div>
        </div>`;
        });
      } else {
        document.getElementById("uploads-content-main").innerHTML = ``;
        document.getElementById(
          "uploads-content-main"
        ).innerHTML += ` <div class="card shadow mb-1">
                                              <div class="card-body" 
                                              style="justify-content:center; display:flex">No upload here</div>
                                          </div>`;
      }

      // DISPLAY VIDEO CONTENT
      if (data.video.length > 0) {
        document.getElementById("videos-content-main").innerHTML = ``;
        c = data.video.length;
        data.video.forEach((video) => {
          document.getElementById(
            "videos-content-main"
          ).innerHTML += `  <div class="card shadow mb-3">
        <div onclick="collapseContent('video_${video.id}')" class="card-header">
            <small id="date_time" class="m-0 text-primary">${video.date}</small>
            <a  onclick="deleteMaterial('${video.id}','VIDEO')" target="_blank"
                class="btn  btn-circle btn-sm float-right">
                <i style="color:red;" class="fas fa-trash-alt"></i></i>
            </a>
            <br>
            <span class="m-0 text-primary">
                <a  id="topic" data-toggle="collapse" href="#demo">Video ${c}</a>
            </span>
        </div>
        <div id="video_${video.id}" class="collapse"
            class="card-body text-dark bg-light">
            <iframe width="100%" height="300px"
            src="${video.url}" frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen></iframe>
        </div>
        </div>`;
          c = c - 1;
        });
      } else {
        document.getElementById("videos-content-main").innerHTML = ``;
        document.getElementById(
          "videos-content-main"
        ).innerHTML += ` <div class="card shadow mb-1">
                                              <div class="card-body" 
                                              style="justify-content:center; display:flex">No video here</div>
                                          </div>`;
      }

      // DISPLAY UPLOADED ASSIGNMENT
      if (data.assignment.length > 0) {
        document.getElementById("assignments-content-main").innerHTML = ``;
        data.assignment.forEach((assignment) => {
          console.log(assignment);
          document.getElementById(
            "assignments-content-main"
          ).innerHTML += `  <div class="card shadow mb-3">
              <div onclick="collapseContent('assignment_${assignment.id
            }')" class="card-header">
                  <small id="date_time" class="m-0 text-primary">${assignment.date
            }</small>
                  <a  onclick="deleteMaterial('${assignment.id
            }','ASSIGNMENT')" target="_blank"
                      class="btn  btn-circle btn-sm float-right">
                      <i style="color:red;" class="fas fa-trash-alt"></i></i>
                  </a>


                  <a onclick="assignmentSubmission('${assignment.id}','${assignment.topic
            }','${assignment.mark_obtainable
            }')" target="_blank" class="btn  btn-circle btn-sm float-right"><i style="color:green;" class="fas fa-poll"></i>
                  </a>
 

                  <a onclick="updateAssignmentStatus('${assignment.id
            }')" target="_blank" class="btn  btn-circle btn-sm float-right"><i style="color:blue;" class="${assignment.status == "OPEN" ? `fas fa-lock` : `fas fa-unlock-alt`
            }"></i>
                  </a>


                  <a  onclick="content('EDIT','ASSIGNMENT','${CryptoJS.AES.encrypt(
              JSON.stringify(assignment),
              "AESENCRYPT"
            )}')" target="_blank"
                      class="btn  btn-circle btn-sm float-right">
                      <i style="color:black;" class="far fa-edit"></i>
                  </a>
                  <br>
                  <span class="m-0 text-primary">
                      <a  id="topic" data-toggle="collapse" href="#demo">${assignment.topic
            } 
                      
                      <sup> 
                      ${assignment.status == "OPEN"
              ? ` <span class="badge bg-success" style="color: white;"><b> open </b></span>`
              : ` <span class="badge bg-danger" style="color: white;"><b> closed</b></span>`
            }
                  </sup>
                      </a>
                      
                  </span>
              </div>
              <div id="assignment_${assignment.id}" class="collapse"
                  class="card-body text-dark bg-light">
                  <div class="p-2"
                      style="overflow: auto; height: auto; border:1px solid black; color: black;">
                    ${assignment.content} 
                  </div>
              </div>
              </div>`;
        });
      } else {
        document.getElementById("assignments-content-main").innerHTML = ``;
        document.getElementById(
          "assignments-content-main"
        ).innerHTML += ` <div class="card shadow mb-1">
                                                    <div class="card-body" 
                                                    style="justify-content:center; display:flex">No Assignment Here</div>
                                                </div>`;
      }
    })
    .catch((err) => console.log(err));
}

function updateAssignmentStatus(id) {
  if (!confirm("You are about to change this material status")) {
    return 0;
  }
  openSpinnerModal("Updating status");
  fetch(ip + "/api/teacher/subject-material", {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "school": localStorage["school"],
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      material_id: id + "-STATUS",
      material_type: "ASSIGNMENT",
      subject_id: localStorage["LH_SUBJECT_ID"],
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
      parent.$("#spinnerModal").modal("hide");
      parent.document.getElementById("spinnerModal").remove();
      toastr.remove();

      if (data.success) {
        successtoast(data.message);
        setTimeout(function () {
          //history.back();
          getLearningHubMaterials(localStorage["LH_SUBJECT_ID"]);
        }, 1000);
      } else {
        errortoast(data.message);
      }
    })
    .catch((err) => console.log(err));
}

function assignmentSubmission(id, topic, mark) {
  if (topic != "" || mark != "") {
    document.getElementById("assignments-submission-tab").hidden = false;
    showMaterial("assignments-submission");
    document.getElementById("assignment").innerHTML =
      topic + " ASSIGNMENT SUBMISSION (" + mark + " MARKS)";
  }

  // GET SUBMISSIONS FOR ASSIGNMENT
  openSpinnerModal("Loading submissions");

  fetch(ip + "/api/teacher/assignment-submission/" + id, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "school": localStorage["school"],
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
      //POPULATE COUNTS
      document.getElementById("assignment-submission-count").innerHTML =
        data.submission.length;

      // DISPLAY UPLOADED NOTE
      if (data.submission.length > 0) {
        document.getElementById(
          "assignments-submission-content-main"
        ).innerHTML = ``;
        data.submission.forEach((submission) => {
          document.getElementById(
            "assignments-submission-content-main"
          ).innerHTML += `  <div class="card shadow mb-3">
              <div onclick="collapseContent('submission_${submission.id
            }')" class="card-header">
                  <small id="date_time" class="m-0 text-primary">${submission.date
            }</small>

                  <div class="">
                      <div class="left">
                          <span class="m-0 text-primary">
                              <a  id="student_name" data-toggle="collapse" href="#demo">${submission.student_name
            }
                              
                                  <sup> 
                                    ${submission.graded == "TRUE"
              ? ` <span class="badge bg-success" style="color: white;"><b> Graded </b></span>`
              : ` <span class="badge bg-danger" style="color: white;"><b> Not Graded</b></span>`
            }
                                  </sup>
                              </a>
                          </span>
                  </div>

                  <div class="right">
                      <input id="score_${submission.id}" value="${submission.score
            }" type="number" placeholder="score" class="input-field no-arrow" min="0">
                      <button onclick="gradeAssignment('${submission.id}','${submission.assignment_id
            }')" class="submit-btn">Grade Assignment</button> 
                  </div>

                  
            
          </div>
                  
              </div>
              <div id="submission_${submission.id}" class="collapse"
                  class="card-body text-dark bg-light">
                  <div class="p-2"
                      style="overflow: auto; height: auto; border:1px solid black; color: black;">
                    ${submission.content}
                  </div>
              </div>
              </div>`;
        });
      } else {
        document.getElementById(
          "assignments-submission-content-main"
        ).innerHTML = ``;
        document.getElementById(
          "assignments-submission-content-main"
        ).innerHTML += ` <div class="card shadow mb-1">
                                                    <div class="card-body" 
                                                    style="justify-content:center; display:flex">No Submission Here</div>
                                                </div>`;
      }
    })
    .catch((err) => console.log(err));
}

function gradeAssignment(submission_id, assignment_id) {
  if (!confirm("You are about to grade this assignment")) {
    return 0;
  }
  openSpinnerModal("Grading Assignment");
  fetch(ip + "/api/teacher/assignment-submission", {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "school": localStorage["school"],
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      submission_id: submission_id,
      score: document.getElementById("score_" + submission_id).value,
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
      parent.$("#spinnerModal").modal("hide");
      parent.document.getElementById("spinnerModal").remove();
      toastr.remove();

      if (data.success) {
        successtoast(data.message);
        setTimeout(function () {
          //history.back();
          assignmentSubmission(assignment_id, "", "");
        }, 1000);
      } else {
        errortoast(data.message);
      }
    })
    .catch((err) => console.log(err));
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
      "school": localStorage["school"],
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
      "school": localStorage["school"],
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
          "classes"
        ).innerHTML += `<option value="${data[i].id}">${data[i].class_name}</option>`;
      }
    })
    .catch((err) => console.log(err));
}

// PROMOTE STUDENT
function promoteStudent() {
  class_id = document.getElementById("classes").value;
  class_name = document.getElementById("classes");
  index = document.getElementById("classes").selectedIndex;

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
          "school": localStorage["school"],
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

  lesson_content = document.getElementsByClassName("lesson_plan_content");

  for (var i = 0; i < lesson_content.length; i++) {
    lesson_content[i].contentEditable = true;
  }
}

// GET SCHOOL DETAILS
function getSchoolDetails() {
  return fetch(ip + "/api/general/school-details", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "school": localStorage["school"],
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
      "school": localStorage["school"],
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
      document.getElementById("session_term0").innerHTML = `<option value="${localStorage["current_session"] + "-" + localStorage["current_term"]
        }">${localStorage["current_session"] + "-" + localStorage["current_term"]
        }</option>`;
      data.forEach((sessions) => {
        term.forEach((term) => {
          document.getElementById(
            "session_term0"
          ).innerHTML += `<option value="${sessions.session + "-" + term}">${sessions.session + "-" + term
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

      parent.document.querySelectorAll(".modal-backdrop").forEach((el) => {
        console.log(el);
        el.remove();
      });
    }
  }
});

//  SCHEDULE LIVE CLASS
function scheduleClass() {
  topic = document.getElementById("topic1").value;
  date = document.getElementById("date").value;
  time = document.getElementById("time").value;
  if (time == "" || date == "" || topic == "") {
    warningtoast("Check that no feild is empty.");
    return 0;
  }

  openSpinnerModal("Scheduling live class");
  fetch(ip + "/api/teacher/live-class", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "school": localStorage["school"],
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      subject_id: localStorage["LH_SUBJECT_ID"],
      topic: topic,
      date: date,
      time: time,
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
      if (data.success) {
        successtoast(data.message);
        closeModal("scheduleLiveClass");
        getScheduledClass();
      } else {
        errortoast(data.message);
      }
    })
    .catch((err) => console.log(err));
}

function getScheduledClass() {
  openSpinnerModal("Loading scheduled class");
  fetch(ip + "/api/teacher/live-class/" + localStorage["LH_SUBJECT_ID"], {
    method: "GET",
    headers: {
      Accept: "application/json",
      "school": localStorage["school"],
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
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
      uc = 1;
      pc = 1;
      today = getDate().split("~")[1];
      today =
        today.split("/")[2] +
        "-" +
        today.split("/")[1] +
        "-" +
        today.split("/")[0];
      today = new Date(today); //.replace(new RegExp('/', 'g'),'-')

      console.log("DATE : " + today);
      removeSpinnerModal();

      if (data.length > 0) {
        document.getElementById("upcoming_class").innerHTML = ``;
        document.getElementById("previous_class").innerHTML = ``;
        data.forEach((LC) => {
          if (new Date(LC.date) >= today) {
            // UPCOMING CLASS
            document.getElementById("upcoming_class").innerHTML += `
           <tr>
                  <td>${uc}.</td>
                  <td><small>${LC.topic} ${LC.status == "LIVE"
                ? ` <span class="badge bg-success"
                  style="color: white;"><b> LIVE </b></span>`
                : ``
              }</small></td>
                  <td><small>${LC.date}</small></td>
                  <td><small>${LC.time}</small></td>
                  <td>

                      <a onclick="openLiveClass('${LC.topic}')" ${LC.status != "LIVE" ? `hidden` : ``
              } class="btn btn-sm btn-primary btn-block"><i
                                  class="fas fa-video"></i></a>

                      <a onclick="startLiveClass('${LC.id}','${LC.topic}','${LC.live_id
              }')" ${LC.status == "LIVE" ? `hidden` : ``
              } class="btn btn-primary"><i
                              class="fas fa-video"></i></a>


                       <small> <a ${LC.status == "LIVE" ? `hidden` : ``
              } onmouseover="editLiveClass('${encryptData(
                JSON.stringify(LC)
              )}')" class="btn btn-warning" data-bs-toggle="modal"
                        data-bs-target="#editLiveClass"><i class="fas fa-edit"></i></a></small>
            
                        <small><a ${LC.status == "LIVE" ? `hidden` : ``
              } onclick="deleteLiveClass(${LC.id
              })" class="btn btn-danger text-white"><i
                                class="fa fa-trash"></i></a></small>


                  </td>
                </tr>
           `;
            uc = uc + 1;
          } else {
            // PREVIOUS CLASS
            document.getElementById("previous_class").innerHTML += `
                <tr>
                  <td>${pc}.</td>
                  <td><small>${LC.topic}</small></td>
                  <td><small>${LC.date}</small></td>
                  <td><small>${LC.time}</small></td>
                  <td>
                  <small><a onclick="deleteLiveClass(${LC.id
              })" class="btn btn-danger text-white"><i
                          class="fa fa-trash"></i></a></small>

                          <small><a onclick="showMaterial('videos')" class="btn btn-primary text-white"><i
                                        class="fa fa-video"></i></a></small>

                  </td>
                </tr>
            `;
            pc = pc + 1;
          }
        });

        if (document.getElementById("upcoming_class").innerHTML == "") {
          document.getElementById("upcoming_class").innerHTML = `
            <tr>
                <td colspan="4">
                    <center>No scheduled class yet.</center>
                </td>
            </tr>
          `;
        }

        if (document.getElementById("previous_class").innerHTML == "") {
          document.getElementById("previous_class").innerHTML = `
          <tr>
              <td colspan="4">
                  <center>No previous class yet.</center>
              </td>
          </tr>
          `;
        }
      }
    })
    .catch((err) => console.log(err));
}

function editLiveClass(data) {
  data = JSON.parse(decryptData(data));
  document.getElementById("e_topic1").value = data.topic;
  document.getElementById("e_date").value = data.date;
  document.getElementById("e_time").value = data.time;
  document.getElementById("live_id").value = data.id;
}

function updateScheduledClass() {
  topic = document.getElementById("e_topic1").value;
  date = document.getElementById("e_date").value;
  time = document.getElementById("e_time").value;
  if (time == "" || date == "" || topic == "") {
    warningtoast("Check that no feild is empty.");
    return 0;
  }

  openSpinnerModal("Updating schedule");
  fetch(ip + "/api/teacher/live-class", {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "school": localStorage["school"],
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      live_id: document.getElementById("live_id").value,
      subject_id: localStorage["LH_SUBJECT_ID"],
      topic: topic,
      date: date,
      time: time,
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
      if (data.success) {
        successtoast(data.message);
        closeModal("editLiveClass");
        getScheduledClass();
      } else {
        errortoast(data.message);
      }
    })
    .catch((err) => console.log(err));
}

function deleteLiveClass(id) {
  if (!confirm("You are about to delete this scheduled live class")) {
    return 0;
  }

  openSpinnerModal("Delete live class");
  fetch(ip + "/api/teacher/live-class/" + id, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "school": localStorage["school"],
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
      parent.$("#spinnerModal").modal("hide");
      parent.document.getElementById("spinnerModal").remove();
      toastr.remove();

      if (data.success) {
        alert(data.message);
        setTimeout(function () {
          getScheduledClass();
        }, 1000);
      } else {
        alert(data.message);
      }
    })
    .catch((err) => console.log(err));
}

function startLiveClass(id, topic) {
  if (!confirm("YOU ARE ABOUT TO START LIVE CLASS " + topic)) {
    return 0;
  }

  openSpinnerModal("Starting live class");
  fetch(ip + "/api/teacher/live-class", {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "school": localStorage["school"],
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      live_id: id,
      topic: "LIVE",
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
      if (data.success) {
        successtoast(data.message);
        getScheduledClass();
        openLiveClass(topic);
      } else {
        errortoast(data.message);
      }
    })
    .catch((err) => console.log(err));
}

function openLiveClass(topic) {
  openModal("liveClass");
  teacher = JSON.parse(localStorage["user_data"]).data;
  roomName = topic + " (" + localStorage["LH_SUBJECT_CLASS"] + ")";

  if (!document.getElementById("jitsi-view").innerHTML.includes(roomName)) {
    var domain = "meet.jit.si";
    var options = {
      roomName: roomName,
      width: 1700,
      height: 700,
      parentNode: document.querySelector("#jitsi-view"),

      userInfo: {
        //email: 'email@jitsiexamplemail.com',
        displayName:
          teacher.title +
          " " +
          teacher.first_name +
          " " +
          teacher.last_name +
          " (TEACHER)",
      },
    };
    var api = new JitsiMeetExternalAPI(domain, options);
  }
}

// DEVICE TOKEN
async function sendTokenToServer(deviceToken, user_type, id) {
  return fetch(ip + "/api/device-token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      "school": localStorage["school"]
    },
    body: JSON.stringify({
      id: id,
      device_token: deviceToken,
      user_type: user_type,

    }),
  })
    .then(function (res) {
      return res.json();
    })

    .then((data) => {
      console.log(data);
    })
    .catch((err) => console.log(err));


}

// RE - AUTHENTICATION MODAL
function openAuthenticationModal() {
  modal = `<div class="modal fade" id="authenticationModal" tabindex="-1" role="dialog"
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

  // JQUERY LIBRARY
  //document.body.innerHTML += `<script src="../js/jquery-3.3.1.min.js"></script>`;

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
                <small><b>${message != null && message != "" && message != undefined
      ? message
      : ``
    }</b><br>
                <b>Processing ...</b>
                </small>
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
  parent.$("#spinnerModal").modal("hide");
  el = parent.document.getElementById("spinnerModal");
  el != null ? el.remove() : ``;
}

function scrollToElement(target) {
  window.location.href = "#" + target;
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

function closeModal(id) {
  parent.$("#" + id).modal("hide");
  el = parent.document.getElementById("#" + id);
  el != null ? el.remove() : ``;
}

function openModal(id) {
  parent.$("#" + id).modal("show");
}

function encryptData(data) {
  return CryptoJS.AES.encrypt(data, "AESENCRYPT");
}

function decryptData(data) {
  return CryptoJS.AES.decrypt(data, "AESENCRYPT").toString(CryptoJS.enc.Utf8);
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

// DEVELOPMENT IP
var ip = "http://127.0.0.1:8000";

window.addEventListener("online", () =>
  successtoast("<b>INTERNET CONNECTED</b>")
);
window.addEventListener("offline", () =>
  errortoast("<b>INTERNET DISCONNECTED</b>")
);

function loadSideNav(page) {
  document.getElementById("side_nav").innerHTML = `
    <ul class="nav nav-sidebar-menu sidebar-toggle-view">
    <li class="nav-item">
        <a id="index" href="index.html" class="nav-link"><i
                class="flaticon-dashboard"></i><span>Dashboard</span></a>
    </li>

    <li class="nav-item">
        <a   id="students" href="students.html" class="nav-link"><i class="flaticon-classmates"></i><span>Students</span></a>
    </li>

    <li class="nav-item">
        <a  id="teachers" href="teachers.html" class="nav-link"> <i class="flaticon-multiple-users-silhouette"></i>
        <span>Teacher</span></a>
    </li>

    
    <li class="nav-item">
        <a  id="subject" href="subject.html" class="nav-link"> <i class="fas fa-plus"></i>
        <span>Subject</span></a>
    </li>

    <li class="nav-item">
        <a  id="class" href="class.html" class="nav-link"> <i class="fas fa-plus"></i>
        <span>Class</span></a>
    </li>

    <li class="nav-item">
        <a  id="inventory" href="inventory.html" class="nav-link"><i class="fas fa-box-open"></i><span>Inventory</span></a>
    </li>


    <li class="nav-item">
        <a  id="events-timetable" href="events.html" class="nav-link"><i
                class="flaticon-calendar"></i><span>Events and Timetable</span></a>
    </li>

    <li class="nav-item">
        <a  id="create-notification" href="create-notification.html" class="nav-link"><i class="far fa-bell"></i>
        <span>Create Notification</span></a>
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

function getAllTeacher() {
  fetch(ip + "/api/all-teacher", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    // body: JSON.stringify({
    //   // organisation_email: email,
    //   // password: pass,
    // }),
  })
    .then((res) => res.json())

    .then((data) => {
      console.log(data);

      for (i in data) {
        if (data[i].class == null) {
          document.getElementById(
            "class_teacher"
          ).innerHTML += `<option value="${data[i].id}">${
            data[i].title + " " + data[i].first_name + " " + data[i].last_name
          }</option>`;
        } else {
          document.getElementById(
            "class_teacher"
          ).innerHTML += `<option value="${data[i].id}">${
            data[i].title +
            " " +
            data[i].first_name +
            " " +
            data[i].last_name +
            " (" +
            data[i].class.class_name +
            ")"
          }</option>`;
        }
      }
    })
    .catch((err) => console.log(err));
}

function getAllClass() {
  fetch(ip + "/api/all-class", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    // body: JSON.stringify({
    //   // organisation_email: email,
    //   // password: pass,
    // }),
  })
    .then((res) => res.json())

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
            <td>${
              data[i].class_teacher.title +
              " " +
              data[i].class_teacher.first_name +
              " " +
              data[i].class_teacher.last_name
            }</td>
            <td>25</td>
            <td>
                <a onclick="editClass(${data[i].id},${data[i].class_name},${
              data[i].class_teacher.title +
              " " +
              data[i].class_teacher.first_name +
              " " +
              data[i].class_teacher.last_name
            })" href="#" class="btn btn-warning" data-bs-toggle="modal"
                    data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
                <a onclick="" href="#" class="btn btn-danger"><i
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
                <a onclick="editClass(${data[i].id},${data[i].class_name},${
              data[i].class_teacher.title +
              " " +
              data[i].class_teacher.first_name +
              " " +
              data[i].class_teacher.last_name
            })" href="#" class="btn btn-warning" data-bs-toggle="modal"
                    data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
                <a onclick="" href="#" class="btn btn-danger"><i
                        class="fas fa-trash"></i>
                    Delete</a>
            </td>
  
        <tr>`;
          }
        } else {
          if (data[i].class_teacher != null) {
            document.getElementById("class_table").innerHTML += `
            <tr class="odd">
  
            <td>${data[i].id}.</td>
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
                <a onclick="editClass(${data[i].id},${data[i].class_name},${
              data[i].class_teacher.title +
              " " +
              data[i].class_teacher.first_name +
              " " +
              data[i].class_teacher.last_name
            })" href="#" class="btn btn-warning" data-bs-toggle="modal"
                    data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
                <a onclick="" href="#" class="btn btn-danger"><i
                        class="fas fa-trash"></i>
                    Delete</a>
            </td>
  
        <tr>`;
          } else {
            document.getElementById("class_table").innerHTML += `
            <tr class="odd">
  
            <td>${data[i].id}.</td>
            <td>${data[i].class_name}</td>
            <td class="text-white"><span class="badge bg-danger"><b>TEACHER NOT ASSIGNED</b></span></td>
            <td>25</td>
            <td>
                <a onclick="editClass(${data[i].id},${data[i].class_name},'')"   class="btn btn-warning" data-bs-toggle="modal"
                    data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
                <a onclick="alert('Hello')" href="#" class="btn btn-danger"><i
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

function editClass(id, class_name, class_teacher) {
  console.log("STORED...");
  localStorage.setItem(
    "editClass",
    id + "~" + class_name + "~" + class_teacher
  );
}
function editClassDetails() {
  localStorage["editClass"].split("~")
  document.getElementById("class_name").value = localStorage["editClass"].slit("~")[1];
  document.getElementById("class_teacher").value = localStorage["editClass"].slit("~")[2];
}

function createClass() {
  var class_name = document.getElementById("class_name").value;
  var class_teacher = document.getElementById("class_teacher").value;
  if (class_name != "" && class_teacher != "") {
    // PUSH TO API
    warningtoast("<b>Processing ... Please wait</b>");
    fetch(ip + "/api/create-class", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        class_name: class_name,
        class_teacher: class_teacher,
      }),
    })
      .then((res) => res.json())

      .then((data) => {
        toastr.remove();
        if (data.success) {
          successtoast("<b>" + data.message + "</b>");
          document.getElementById("class_name").value = "";
          document.getElementById("class_teacher").value = "";
        } else {
          errortoast("<b>" + data.message + "</b>");
        }
      })
      .catch((err) => console.log(err));
  } else {
    warningtoast("<b>Please check that no field is empty.</b>");
  }
}

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

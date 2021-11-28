// DEVELOPMENT IP
// var ip = "http://127.0.0.1:8000";
// var domain = "http://localhost/smartschoolhub.ng";

// LIVE IP
var ip = "https://demo-api.smartschoolhub.net";
var domain = "https://demo.smartschoolhub.net";

// REMOTE ACCESS
// var ip = "http://192.168.42.168/smartschoolhub.ng/SSHUB_BACKEND/server.php";
// var domain = "http://192.168.42.168/smartschoolhub.ng";



// CBT VARIABLE
answer = [];

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
        <a id="dashboard" href="dashboard.html" class="nav-link"><i
                class="flaticon-dashboard"></i><span>Dashboard</span></a>
    </li>

    <li class="nav-item">
         <a  id="subject-registration" href="subject-registration.html" class="nav-link"><i class="fas fa-plus"></i><span>Subject Registration</span></a>
    </li>

    <li class="nav-item">
        <a  id="learning-hub" href="learning-hub.html" class="nav-link"><i
                class="flaticon-open-book"></i><span>Learning Hub</span></a>
    </li>
    <li class="nav-item">
        <a  id="timetable" href="timetable.html" class="nav-link"><i
                class="flaticon-calendar"></i><span>Timetable</span></a>
    </li>

    <li class="nav-item">
    <a  id="attendance" href="attendance.html" class="nav-link"><i class="fas fa-chart-line"></i>
    <span>My Attendance</span></a>
    </li>

    <li class="nav-item">
    <a  id="idcard" href="id-card.html" class="nav-link"><i class="fa fa-id-badge"></i>
    <span>My ID Card</span></a>
    </li>

    <li class="nav-item">
        <a   id="cbt" href="cbt.html" class="nav-link"><i class="fas fa-desktop"></i><span>CBT</span></a>
    </li>
    <li class="nav-item">
        <a   id="result" href="results.html" class="nav-link"><i class="fas fa-poll"></i><span>My
                Results</span></a>
    </li>
   
    <li class="nav-item">
        <a  id="payment" href="payment-history.html" class="nav-link"><i class="flaticon-money"></i><span>Payment
                and History</span></a>
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

function changeLogo() {
  document.getElementById("logo").innerHTML =
    document.getElementById("logo").innerHTML != ""
      ? ""
      : `<h1 style="font-weight: bold; font-family: Rowdies; color:white;">
        <i style="color: white; " class="fas fa-graduation-cap fa-xs"></i> SSHUB </h1>`;
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
        window.parent.location.assign(domain + "/student/");
      }
      return res.json();
    })

    .then((data) => {
      //   document.getElementById(
      //     "session_term"
      //   ).innerHTML = `<div id="" class="item-number"><span class="counter"
      //       >${data.session}</span></div>
      //       <div class="item-title">${data.term}</div>`;

      localStorage.setItem("current_session", data.session);
      localStorage.setItem("current_term", data.term);
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

    // INTERCEPT OBJECTS
    if (data_key[i] == "class") {
      document.getElementById("profile_data").innerHTML += ` 
          <tr>
                  <td>${data_key[i].toUpperCase().replace("_", " ")}:</td>
                  <td id="${
                    data_key[i]
                  }" name="profile_data" class="font-medium text-dark-medium">${
        user_data[data_key[i]].class_name
      }</td>
          </tr>
          
          `;
    } else {
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
  window.parent.location.assign(domain + "/student/" + page);
}

function signIn() {
  var id = document.getElementById("id").value;
  var password = document.getElementById("password").value;
  if (id != "" && password != "") {
    // PUSH TO API
    document.getElementById("signin").innerHTML = `<i
        class="fa fa-spinner fa-spin"></i> Processing ...`;
    fetch(ip + "/api/student/signin", {
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
          window.parent.location.assign(domain + "/student/");
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

// CBT

function showCBTList(subject_name, subject_id) {
  window.location.href = "./cbt-list.html";
  localStorage.setItem("cbt_subject_name", subject_name);
  localStorage.setItem("cbt_subject_id", subject_id);
}

function getCBTForSubject() {
  document.getElementById("info").innerHTML =
    document.getElementById("info").innerHTML +
    localStorage["cbt_subject_name"] +
    " FOR ";
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
        window.parent.location.assign(domain + "/student/");
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
              <button style="text-decoration: none; cursor: pointer;" class="btn-sm btn-primary"   ${
                data[i].cbt_status == "OPEN"
                  ? `onclick="startCBT(${JSON.stringify(data[i]).replace(
                      /"/g,
                      "'"
                    )})"`
                  : `onclick="alert('CBT Closed!')"`
              }
                 ><i class="fas fa-play"></i> START CBT</button>
              
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

function startCBT(cbt) {
  // check if student have taken the CBT

  fetch(
    ip +
      "/api/student/taken-cbt/" +
      cbt.id +
      "/" +
      JSON.parse(localStorage["user_data"]).data.id,
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
        window.parent.location.assign(domain + "/student/");
      }
      return res.json();
    })

    .then((data) => {
      if (data.taken) {
        alert("You have taken the CBT!");
      } else {
        // LOAD CBT PAGE
        localStorage.setItem("cbt_detail", JSON.stringify(cbt));
        window.parent.location.assign(domain + "/student/cbt-questions.html");
      }
    })
    .catch((err) => console.log(err));
}

function getCBTdetails() {
  document.getElementById("session_term").innerHTML =
    JSON.parse(localStorage["cbt_detail"]).session +
    " Session | " +
    JSON.parse(localStorage["cbt_detail"]).term;

  document.getElementById("cbt_date_time").innerHTML =
    JSON.parse(localStorage["cbt_detail"]).cbt_date +
    " " +
    JSON.parse(localStorage["cbt_detail"]).start_time;

  document.getElementById("school_name").innerHTML =
    "Community Secondary School, Imode Kwara State.";
  //   localStorage["school_name"];

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
  question = JSON.parse(localStorage["cbt_detail"]).cbt_question.split(",");
  options = JSON.parse(localStorage["cbt_detail"]).cbt_options.split(",");

  for (i = 0; i < question.length; i++) {
    answer.push("");
  }

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
           }" class="form-check"> <input onclick="saveAnswer(this.id)"  class="form-check-input" type="radio" name="${
      questions_number[n]
    }"
                   id="A${
                     questions_number[n]
                   }" value="A"> <label oninput="saveOptions(this.id)" id="${
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
             }" class="form-check"> <input onclick="saveAnswer(this.id)"  class="form-check-input" type="radio" name="${
      questions_number[n]
    }"
                     id="B${
                       questions_number[n]
                     }" value="B" > <label oninput="saveOptions(this.id)" id="${
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
               }" class="form-check"> <input onclick="saveAnswer(this.id)" class="form-check-input" type="radio" name="${
      questions_number[n]
    }"
                       id="C${
                         questions_number[n]
                       }" value="C"> <label oninput="saveOptions(this.id)" id="${
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
                 }" class="form-check"> <input onclick="saveAnswer(this.id)" class="form-check-input" type="radio" name="${
      questions_number[n]
    }"
                         id="D${
                           questions_number[n]
                         }" value="D"> <label oninput="saveOptions(this.id)" id="${
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
function saveAnswer(text) {
  answer[text.charAt(1)] = text.charAt(0);
  console.log(answer);
}

function submitCBT(timeup) {
  if (timeup) {
    // SUBMIT CBT
    fetch(ip + "/api/student/submit-cbt", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage["token"],
      },
      body: JSON.stringify({
        cbt_id: JSON.parse(localStorage["cbt_detail"]).id,
        student_id: JSON.parse(localStorage["user_data"]).data.id,
        student_answer: answer,
      }),
    })
      .then(function (res) {
        console.log(res.status);
        if (res.status == 401) {
          window.parent.location.assign(domain + "/student/");
        }
        return res.json();
      })

      .then((data) => {
        //  CALL RESULT MODAL
        $("#endExamModalCenter").modal("hide");
        $("#resultModal").modal("show");
        document.getElementById("result").innerHTML = data.result;
      })
      .catch((err) => console.log(err));
  } else {
    if (confirm("ARE YOU SURE YOU WANT TO SUBMIT NOW ?")) {
      clearInterval(timeInterval);
      document.getElementById("submitCBT").innerHTML = `<i
        class="fa fa-spinner fa-spin"></i> Submitting ...`;
      // SUBMIT CBT
      fetch(ip + "/api/student/submit-cbt", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: "Bearer " + localStorage["token"],
        },
        body: JSON.stringify({
          cbt_id: JSON.parse(localStorage["cbt_detail"]).id,
          student_id: JSON.parse(localStorage["user_data"]).data.id,
          student_answer: answer,
        }),
      })
        .then(function (res) {
          console.log(res.status);
          if (res.status == 401) {
            window.parent.location.assign(domain + "/student/");
          }
          return res.json();
        })

        .then((data) => {
          document.getElementById("submitCBT").innerHTML = `Submitted`;
          //  CALL RESULT MODAL
          $("#resultModal").modal("show");
          document.getElementById("result").innerHTML = data.result;
        })
        .catch((err) => console.log(err));
    }
  }
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
      both_elective_and_compulsory: true,
      class: JSON.parse(localStorage["user_data"]).data.class.id,
      session: localStorage["current_session"],
      term: localStorage["current_term"],
    }),
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        window.parent.location.assign(domain + "/student/");
      }
      return res.json();
    })

    .then((data) => {
      data.forEach((i) => {
        registered_subject.push(i);
      });
    })
    .catch((err) => console.log(err));

  document.getElementById("number_registered").innerHTML =
    document.getElementById("number_registered").innerHTML +
    registered_subject.length;

  return registered_subject;
}

function getAllSubjectForTable() {
  registered_subject = [];
  registered_subject = getPreviousSubjectRegistration();

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
      student_id: JSON.parse(localStorage["user_data"]).data.id,
      class: JSON.parse(localStorage["user_data"]).data.class.id,
      session: localStorage["current_session"],
      term: localStorage["current_term"],
    }),
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        window.parent.location.assign(domain + "/student/");
      }
      return res.json();
    })

    .then((data) => {
      document.getElementById("subject_table").innerHTML = ``;
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
                  
               
                  
        
              <tr>`;
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
                  
               
                  
        
              <tr>`;
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
            window.parent.location.assign(domain + "/student/");
          }
          return res.json();
        })

        .then((data) => {
          for (i in data) {
            if (registered_subject.includes(data[i].id.toString())) {
              continue;
            }
            if (
              data[i].class.id !=
              JSON.parse(localStorage["user_data"]).data.class.id
            ) {
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
                      
                      
            
                  <tr>`;

            c = c + 1;
          }
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}

function registerSubject() {
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
          localStorage["current_session"] +
          " " +
          localStorage["current_term"]
      )
    ) {
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
          student_id: JSON.parse(localStorage["user_data"]).data.id,
          subject_to_register: subject_to_register,
          class: JSON.parse(localStorage["user_data"]).data.class.id,
          session: localStorage["current_session"],
          term: localStorage["current_term"],
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

function getRegisteredSubjectForTable() {
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
      student_id: JSON.parse(localStorage["user_data"]).data.id,
      class: JSON.parse(localStorage["user_data"]).data.class.id,
      session: localStorage["current_session"],
      term: localStorage["current_term"],
    }),
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        window.parent.location.assign(domain + "/student/");
      }
      return res.json();
    })

    .then((data) => {
      document.getElementById("subject_table").innerHTML = ``;
      for (i in data) {
        if (data[i].subject_type == "COMPULSORY") {
          document.getElementById("subject_table").innerHTML += `
            <tr>
    
                  <td>${c}.</td>
                  <td> <small><i class="fa fa-star" aria-hidden="true"></i></small> ${data[i].subject_name}</td>
                  <td>${data[i].subject_type}</td>
                  <td>${data[i].teacher}</td>
                  <td>
                    <button type="button" class="btn btn-primary btn-block"
                        data-bs-toggle="modal" data-bs-target="#staticBackdrop">

                        Materials
                    </button>
                 </td>
                  
               
                  
        
              <tr>`;
        } else {
          document.getElementById("subject_table").innerHTML += `
            <tr>
    
                  <td>${c}.</td>
                  <td> <small><i class="fa fa-shapes" aria-hidden="true"></i></small> ${data[i].subject_name}</td>
                  <td>${data[i].subject_type}</td>
                  <td>${data[i].teacher}</td>
                  <td>
                    <button type="button" class="btn btn-primary btn-block"
                        data-bs-toggle="modal" data-bs-target="#staticBackdrop">

                        Materials
                    </button>
                 </td>
                  
               
                  
        
              <tr>`;
        }

        c = c + 1;
      }
      document.getElementById("number_registered").innerHTML =
        document.getElementById("number_registered").innerHTML + (c - 1);
    })
    .catch((err) => console.log(err));
}

function getRegisteredSubjectForTableCBT() {
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
      student_id: JSON.parse(localStorage["user_data"]).data.id,
      class: JSON.parse(localStorage["user_data"]).data.class.id,
      session: localStorage["current_session"],
      term: localStorage["current_term"],
    }),
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        window.parent.location.assign(domain + "/student/");
      }
      return res.json();
    })

    .then((data) => {
      document.getElementById("subject_table").innerHTML = ``;
      for (i in data) {
        if (data[i].subject_type == "COMPULSORY") {
          document.getElementById("subject_table").innerHTML += `
              <tr>
      
                    <td>${c}.</td>
                    <td> <small><i class="fa fa-star" aria-hidden="true"></i></small> ${data[i].subject_name}</td>
                    <td>${data[i].subject_type}</td>
                    <td>${data[i].teacher}</td>
                    <td>
                        <button onclick="showCBTList('${data[i].subject_name}',${data[i].subject_id})" type="button" class="btn btn-primary">
                            SEE AVAILABLE CBT
                        </button>
                   </td>
                    
                 
                    
          
                <tr>`;
        } else {
          document.getElementById("subject_table").innerHTML += `
              <tr>
      
                    <td>${c}.</td>
                    <td> <small><i class="fa fa-shapes" aria-hidden="true"></i></small> ${data[i].subject_name}</td>
                    <td>${data[i].subject_type}</td>
                    <td>${data[i].teacher}</td>
                    <td>
                    <button onclick="showCBTList('${data[i].subject_name}',${data[i].subject_id})" type="button" class="btn btn-primary">
                        SEE AVAILABLE CBT
                    </button>
                   </td>
                    
                 
                    
          
                <tr>`;
        }

        c = c + 1;
      }
      document.getElementById("number_registered").innerHTML =
        document.getElementById("number_registered").innerHTML + (c - 1);
    })
    .catch((err) => console.log(err));
}

// RESULT
function getTranscript() {
  // sessions = getSessions();
  sessions = ["2021/20", "2012/27", "21/20"];
  terms = ["FIRST TERM", "SECOND TERM", "THIRD TERM"];
  var qrcode = new QRCode("verificationQR", {
    text: "STUDENT NUMBER",
    width: 128,
    height: 128,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });

  // LOOP THROUGH EACH SESSION AND TERM
  for (i in sessions) {
    for (j in terms) {
      console.log(sessions[i] + "-" + terms[j]);
    }
  }
}

function getSessions() {
  return 0;
}

// ID
function getIDCard() {
  var qrcode = new QRCode("IDQR", {
    text: "2~12~LANRE",
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
  a.document.write("<body>");
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

  // originalPage = document.body.innerHTML;
  // document.body.innerHTML =
  //   "<html><head><title></title></head><body>" + printData + "</body>";
  /// window.print();
  // document.body.innerHTML = originalData;
}

function print1(section) {
  var divContents = document.getElementById(section).innerHTML;
  var head = document.getElementById("common-library").innerHTML;
  console.log(divContents);
  var a = window.open("", "", "height=1000, width=1000");
  a.document.write("<html>");
  a.document.write(head);
  a.document.write("<body>");
  a.document.write(divContents);
  a.document.write(`
  </body>
  </html>`);
  a.print();
  a.document.close();
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

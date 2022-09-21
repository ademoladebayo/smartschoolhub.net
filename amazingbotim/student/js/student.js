// SOUND VARIABLES
var successSound = new Audio("../asset/sound/verified.mp3");
var errorSound = new Audio("../asset/sound/error1.mp3");

// DEVELOPMENT IP
//var ip = "http://127.0.0.1:8000";
//var domain = "http://localhost/smartschoolhub.net/amazingbotim";


// LIVE IP
 var ip = "https://smartschoolhub.net/backend/amazingbotim";
 var domain = "https://amazingbotim.smartschoolhub.net";

// CBT VARIABLE
answer = [];

window.addEventListener("online", () =>
  successtoast("<b>INTERNET CONNECTED</b>")
);
window.addEventListener("offline", () =>
  errortoast("<b>INTERNET DISCONNECTED</b>")
);

getSchoolDetails();
getCurrentSession();
loadSchoolColor();

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
        <a  id="timetable" href="?#timetable.html" class="nav-link"><i
                class="flaticon-calendar"></i><span>Timetable<sup><small>Coming Soon ...</small></sup></span></a>
    </li>

    <li class="nav-item">
        <a  id="attendance" href="attendance.html" class="nav-link"><i class="fas fa-chart-line"></i>
        <span>My Attendance</span></a>
    </li>

    <!--  <li class="nav-item">
    <a  id="idcard" href="id-card.html" class="nav-link"><i class="fa fa-id-badge"></i>
    <span>Attendance Card</span></a>
    </li>  --!>

    <li class="nav-item">
        <a   id="cbt" href="cbt.html" class="nav-link"><i class="fas fa-desktop"></i><span>CBT</span></a>
    </li>
    <li class="nav-item">
        <a   id="result" href="results.html" class="nav-link"><i class="fas fa-poll"></i><span>My
                Results</span></a>
    </li>
   
    <li class="nav-item">
        <a  id="payment-history" href="payment-history.html" class="nav-link"><i class="flaticon-money"></i><span>Payment
                and History</span></a>
    </li>

    
    <li class="nav-item">
      <a id="change-password" href="change-password.html" class="nav-link">
        <i class="flaticon-settings"></i>
        <span>Change Password</span>
      </a>
    </li>
      
    
    <li class="nav-item">
        <a onclick="goTo('')" href="#" class="nav-link"><i class="flaticon-turn-off"></i><span>Log
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

function allSession() {
  session = [];
  fetch(ip + "/api/general/all-session/ASC", {
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
      data.forEach((sessions) => {
        session.push(sessions.session);
      });
      return session;
    })
    .catch((err) => console.log(err));
}

function formatNumber(number) {
  console.log("NUMBER: " + number);
  return number.toLocaleString(
    undefined, // leave undefined to use the visitor's browser
    // locale or a string like 'en-US' to override it.
    { minimumFractionDigits: 0 }
  );
}

function loadDashBoardInformation() {
  student_id = JSON.parse(localStorage["user_data"]).data.student_id;

  // IMAGE URL
  url =
    domain +
    "/backend/storage/app/public/fileupload/student/" +
    student_id +
    ".png";

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

  // STUDENT_IMAGE
  document.getElementById("student_image").src = url;
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

function reloadBreakdownFrame() {
  var iframe = document.getElementById("breakdown");
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
    JSON.parse(localStorage["user_data"]).data.class.class_name;
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
    localStorage["cbt_subject_name"];
  // " " +
  // localStorage["cbt_subject_class"];

  // GET CBT
  fetch(ip + "/api/student/all-cbt", {
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
                  ? `onclick="startCBT(${JSON.stringify(data[i]).replace(/'/g,"").replace(
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
        window.parent.location.assign(
          domain + "/student/frame-cbt-questions.html"
        );
      }
    })
    .catch((err) => console.log(err));
}

async function getCBTdetails() {
  await getSchoolDetails();
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
    // carousel-item
    document.getElementById("cbt_view").innerHTML += ` <div class="mb-3 ">
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
  answer_value = text.charAt(0);
  answer_index = text.replace(text.charAt(0), "");
  answer[answer_index] = answer_value;
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
          // SCROLL TO CENTER
          document
            .getElementById("cbt_view")
            .scrollIntoView({ block: "center" });
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
  fetch(ip + "/api/student/registered-subject-id", {
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
      data.forEach((i) => {
        registered_subject.push(i);
      });

      document.getElementById("number_registered").innerHTML =
        document.getElementById("number_registered").innerHTML +
        registered_subject.length;
    })
    .catch((err) => console.log(err));

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
                  <td>${data[i].student}</td>
                  
               
                  
        
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
                        data-bs-toggle="modal" data-bs-target="#staticBackdrop" disabled>
                        Materials
                    </button>
                    <button type="button" class="btn btn-primary btn-block  btn-sm" onclick="loadLessonPage('${data[i].id}-${data[i].subject_name}-${data[i].class.class_name}')">
                      Lesson Plan
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
                        data-bs-toggle="modal" data-bs-target="#staticBackdrop" disabled>
                        Materials
                    </button>
                    <button type="button" class="btn btn-primary btn-block  btn-sm" onclick="loadLessonPage('${data[i].id}-${data[i].subject_name}-${data[i].class.class_name}')">
                      Lesson Plan
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
async function getTranscript() {
  await getSchoolDetails();
  user_data = JSON.parse(localStorage["user_data"]);

  // IMAGE URL
  url =
    domain +
    "/backend/storage/app/public/fileupload/student/" +
    user_data.data.student_id +
    ".png";

    
  // SCHOOL LOGO URL
  school_logo_url =
  domain +
  "/backend/storage/app/public/fileupload/school_logo.png";

    // SCHOOL_LOGO
  document.getElementById("school_logo").src = school_logo_url;

  // STUDENT_IMAGE
  document.getElementById("student_image").src = url;

  // POPULATE STUDENTS INFORMATION
  document.getElementById("full_name").innerHTML =
    "<b>" +
    user_data.data.last_name +
    "</b>" +
    " " +
    user_data.data.first_name +
    " " +
    user_data.data.middle_name;

  document.getElementById("student_id").innerHTML = user_data.data.student_id;
  document.getElementById("class_sector").innerHTML =
    user_data.data.class.class_sector;
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
  var terms = ["FIRST TERM", "SECOND TERM", "THIRD TERM"];

  // CALL API THAT GET ALL SESSION
  fetch(ip + "/api/general/all-session/ASC", {
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
      // STORE IN SESSIONS ARRAY
      data.forEach((data) => {
        sessions.push(data.session);
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
                                                    <font color="black"><b id="teacher_comment_${session}_${term}"></b></font>
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
                                        <td id="handwriting_${session}_${term}"
                                            style="width:60%; padding:3px; size: 5px; font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold;">
                                            </td>

                                    </tr>
                                    
                                    <tr>
                                        <td 
                                            style="width:60%; padding:3px; size: 5px; font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold;">
                                            Games
                                        </td>
                                        <td id="games_${session}_${term}"
                                            style="width:60%; padding:3px; size: 5px; font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold;">
                                            </td>

                                    </tr>
                                    
                                    <tr>
                                        <td
                                            style="width:60%; padding:3px; size: 5px; font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold;">
                                            Handing Tools
                                        </td>
                                        <td id="handing_tools_${session}_${term}"
                                            style="width:60%; padding:3px; size: 5px; font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold;">
                                            </td>

                                    </tr>
                                    <tr>
                                        <td
                                            style="width:60%; padding:3px; size: 5px; font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold;">
                                            Drawing and Painting
                                        </td>
                                        <td id="drawing_painting_${session}_${term}"
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
                                        <td id="neatness_${session}_${term}"
                                            style="width:60%; padding:3px; size: 5px; font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold;">
                                            </td>

                                    </tr>
                                    <tr>
                                        <td
                                            style="width:60%; padding:3px; size: 5px; font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold;">
                                            Politeness
                                        </td>
                                        <td id="politeness_${session}_${term}"
                                            style="width:60%; padding:3px; size: 5px; font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold;">
                                            </td>

                                    </tr>
                                   
                                    <tr>
                                        <td
                                            style="width:60%; padding:3px; size: 5px; font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold;">
                                            Co-operation with others
                                        </td>
                                        <td id="cooperation_${session}_${term}"
                                            style="width:60%; padding:3px; size: 5px; font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold;">
                                            </td>

                                    </tr>
                                    
                              
                                    <tr>
                                        <td
                                            style="width:60%; padding:3px; size: 5px; font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold;">
                                            Health
                                        </td>
                                        <td id="health_${session}_${term}"
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
      user_type:"STUDENT",
      student_id: JSON.parse(localStorage["user_data"]).data.id,
      class_id: JSON.parse(localStorage["user_data"]).data.class.id,
      session: value.split("_")[1],
      term: value.split("_")[2],
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
      if (!data.success) {
        document.getElementById(value).innerHTML = `
        <hr style="color: black; border: 1px solid black">
        <h3 style="text-align: center;">${data.message}</h3>
        <hr style="color: black; border: 1px solid black">
        `;
        return 0;
      }

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
                result.grade == "F" ? "red" : "blue"
              } ; font-size: 13px;font-family: Open Sans, sans-serif;font-weight: bold; text-align:center;">
              ${result.grade}
              </td>
              <td style="color: ${
                result.grade == "F" ? "red" : "blue"
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
      student_id: JSON.parse(localStorage["user_data"]).data.id,
      session: value.split("_")[1],
      term: value.split("_")[2],
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

// ATTENDANCE
function getAttendanceSummary(value) {
  if (value == "ATTENDANCE_HISTORY") {
    // GET ACADEMIC PERFORMANCE
    return fetch(ip + "/api/student/attendance-summary", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage["token"],
      },
      body: JSON.stringify({
        student_id: JSON.parse(localStorage["user_data"]).data.id,
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
        document.getElementById("opened").innerHTML +=
          data.opened > 1 ? data.opened + " days" : data.opened + " day";
        document.getElementById("present").innerHTML += data.present
          ? data.present + " days"
          : data.present + " day";
        abesent = data.opened - data.present;
        document.getElementById("absent").innerHTML +=
          abesent > 1 ? abesent + " days" : abesent + " day";

        document.getElementById("attendance_history").innerHTML = "";
        c = 1;
        if (data.attendance_summary.length > 0) {
          data.attendance_summary.forEach((attendance) => {
            document.getElementById("attendance_history").innerHTML += `
            <tr>
                <td>
                  ${c}.</td>
                <td>
                    ${attendance.date}</td>
                <td>
                ${attendance.time_in}</td>
                <td>
                ${attendance.time_out}</td>

            </tr>
            `;
            c = c + 1;
          });
        } else {
          document.getElementById("attendance_history").innerHTML =
            "NO ATTENDANCE FOUND.";
        }
      })
      .catch((err) => console.log(err));
  }
  // GET ACADEMIC PERFORMANCE
  return fetch(ip + "/api/student/attendance-summary", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      student_id: JSON.parse(localStorage["user_data"]).data.id,
      session: value.split("_")[1],
      term: value.split("_")[2],
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
      document.getElementById(
        "opened_" + value.split("_")[1] + "_" + value.split("_")[2]
      ).innerHTML = data.opened;
      document.getElementById(
        "present_" + value.split("_")[1] + "_" + value.split("_")[2]
      ).innerHTML = data.present;
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
        window.parent.location.assign(domain + "/student/");
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

function loadLessonPage(value) {
  localStorage.setItem("LESSON-PLAN", value);
  goTo("lesson-plan.html");
}

// ID CARD
async function getIDCard() {
  await getSchoolDetails();
  student_id = JSON.parse(localStorage["user_data"]).data.student_id;

  // GET SCHOOL NAME
  document.getElementById("school_name").innerHTML =
    localStorage["SCHOOL_NAME"];

  // IMAGE URL
  url =
    domain +
    "/backend/storage/app/public/fileupload/student/" +
    student_id +
    ".png";

  // STUDENT_IMAGE
  document.getElementById("student_image").src = url;

  // FILL CARD DETAILS
  document.getElementById("full_name").innerHTML =
    JSON.parse(localStorage["user_data"]).data.first_name +
    " " +
    JSON.parse(localStorage["user_data"]).data.last_name;

  document.getElementById("id").innerHTML = JSON.parse(
    localStorage["user_data"]
  ).data.student_id;

  document.getElementById("gender").innerHTML = JSON.parse(
    localStorage["user_data"]
  ).data.gender;

  document.getElementById("school_address").innerHTML =
    localStorage["SCHOOL_ADDRESS"];

  //StudentATDCard~id~class_id~first_name
  var qrcode = new QRCode("IDQR", {
    text:
      "StudentATDCard~" +
      JSON.parse(localStorage["user_data"]).data.id +
      "~" +
      JSON.parse(localStorage["user_data"]).data.class.id +
      "~" +
      JSON.parse(localStorage["user_data"]).data.first_name,
    width: 128,
    height: 128,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });
}

// FEE
function getFee() {
  return fetch(ip + "/api/student/all-fee", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      student_id: JSON.parse(localStorage["user_data"]).data.id,
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
      localStorage.setItem("fee", JSON.stringify(data));
      document.getElementById("due_balance").innerHTML =
        "₦" + formatNumber(data.total_due_balance);
    })
    .catch((err) => console.log(err));
}

function loadFeeBreakdown() {
  data = JSON.parse(localStorage["fee"]);

  optional_fee = [];
  optional_fee = data.optional_fee_id;

  document.getElementById("expected_amount").innerHTML =
    "₦" + formatNumber(data.expected_amount);
  document.getElementById("total_paid").innerHTML =
    "₦" + formatNumber(data.total_paid);
  document.getElementById("due_balance").innerHTML =
    "₦" + formatNumber(data.due_balance);

  document.getElementById("arrears").innerHTML =
    "₦" + formatNumber(data.arrears);

  document.getElementById("total_due_balance").innerHTML =
    "₦" + formatNumber(data.total_due_balance);

  // document.getElementById("amount").value = data.due_balance;

  document.getElementById("fee_table").innerHTML = ``;
  c = 1;
  data.fee_breakdown.forEach((fee) => {
    document.getElementById("fee_table").innerHTML += `
    <tr>
         ${
           fee.type == "COMPULSORY"
             ? ` <td><input type="checkbox" class="form-check-input ml-0" name="fee_compulsory"
         value="${fee.id}" checked  onclick="this.checked = !this.checked">`
             : `<td><input type="checkbox" class="form-check-input ml-0" name="fee_optional"
             value="${fee.id}"  ${
                 optional_fee.includes(fee.id.toString()) ? `checked` : ``
               }>`
         }
         <td>${c}.</td>
         <td>${fee.description}</td>
         <td>${fee.type}</td>
         <td>${
           fee.class == JSON.parse(localStorage["user_data"]).data.class.id
             ? JSON.parse(localStorage["user_data"]).data.class.class_name
             : fee.class
         }</td>
        <td>₦${formatNumber(fee.amount)}</td>
    </tr>
    `;

    c = c + 1;
  });
}

// PAYMENT HISTORY
function getAllPaymentHistory() {
  fetch(ip + "/api/student/payment-history", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      student_id: JSON.parse(localStorage["user_data"]).data.id,
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
      c = 1;
      document.getElementById("payment_history_table").innerHTML = ``;
      if (data.length > 0) {
        for (i in data) {
          document.getElementById("payment_history_table").innerHTML += `
                    <tr class='${c % 2 == 0 ? "even" : "odd"}'>
            
                    <td>${c}.</td>
                    <td><b>${data[i].payment_type}</b></td>
                    <td><b>${data[i].payment_description}</b></td>
                    <td><b>${data[i].fee_type}</b></td>
                    <td>${data[i].date}</td>
                    <td>${data[i].session}</td>
                    <td>${data[i].term}</td>
                    <td>${formatNumber(parseInt(data[i].amount))}</td>
                    
                   </tr>
                    `;
          c = c + 1;
        }
      }
      paginateTable();
    })
    .catch((err) => console.log(err));
}

// GENERATE PAYMENT
function generatePayment() {
  var optional_fee_id = [];

  var fee_optional = document.getElementsByName("fee_optional");
  for (var i = 0; i < fee_optional.length; i++) {
    if (fee_optional[i].checked == true) {
      optional_fee_id.push(fee_optional[i].value);
    }
  }
  console.log(optional_fee_id);

  if (optional_fee_id.length > 0) {
    if (
      !confirm(
        "Kindly confirm you would like to add the selected optional fee for " +
          localStorage["current_session"] +
          " " +
          localStorage["current_term"]
      )
    ) {
      return 0;
    }
  }

  document.getElementById("add_optional_fee").innerHTML = `<i
      class="fa fa-spinner fa-spin"></i> Processing Please wait ...`;

  // PUSH TO API
  fetch(ip + "/api/student/add-optional-fee", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      student_id: JSON.parse(localStorage["user_data"]).data.id,
      optional_fee_id: optional_fee_id,
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
        getFee();
        loadFeeBreakdown();
        // LOAD PAYMENT SLIP PAGE
        window.parent.location.assign(domain + "/student/payment-slip.html");
      }
    })
    .catch((err) => console.log(err));
}

async function getPaymentSlip(loadPage) {
  await getFee();
  if (loadPage) {
    window.parent.location.assign(domain + "/student/payment-slip.html");
  } else {
    data = JSON.parse(localStorage["fee"]);

    optional_fee = [];
    optional_fee = data.optional_fee_id;

    // SLIP HEADER
    user_data = JSON.parse(localStorage["user_data"]);

    // IMAGE URL
    url =
      domain +
      "/backend/storage/app/public/fileupload/student/" +
      user_data.data.student_id +
      ".png";

    // STUDENT_IMAGE
    document.getElementById("student_image").src = url;

    // POPULATE STUDENTS INFORMATION
    document.getElementById("full_name").innerHTML =
      "<b>" +
      user_data.data.last_name +
      "</b>" +
      " " +
      user_data.data.first_name +
      " " +
      user_data.data.middle_name;

    document.getElementById("student_id").innerHTML = user_data.data.student_id;
    document.getElementById("class_sector").innerHTML =
      user_data.data.class.class_sector;
    document.getElementById("school_details").innerHTML =
      localStorage["SCHOOL_NAME"] + "<br> " + localStorage["SCHOOL_ADDRESS"];

    document.getElementById("student_class").innerHTML =
      user_data.data.class.class_name;

    document.getElementById("session").innerHTML =
      localStorage["current_session"];

    document.getElementById("term").innerHTML = localStorage["current_term"];

    document.getElementById("date_generated").innerHTML =
      getDate().split("~")[1];

    // SLIP FOOTER
    document.getElementById("total_expected").innerHTML =
      "₦" + formatNumber(data.expected_amount);
    document.getElementById("total_paid").innerHTML =
      "₦" + formatNumber(data.total_paid);
    document.getElementById("percentage_paid").innerHTML = data.percentage_paid;
    document.getElementById("balance").innerHTML =
      "₦" + formatNumber(data.due_balance);

    document.getElementById("arrears").innerHTML =
      "₦" + formatNumber(data.arrears);

    document.getElementById("total_due_balance").innerHTML =
      "₦" + formatNumber(data.total_due_balance);

    document.getElementById("payment_slip_table").innerHTML = ``;

    c = 1;
    data.fee_breakdown.forEach((fee) => {
      if (fee.type == "OPTIONAL" && !optional_fee.includes(fee.id.toString())) {
        return;
      }

      document.getElementById("payment_slip_table").innerHTML += `
    <tr>
        <td><input type="checkbox" class="form-check-input ml-0" name="fee_compulsory"
        value="${fee.id}" checked  onclick="this.checked = !this.checked">
         <td>${c}.</td>
         <td>${fee.description}</td>
         <td>${fee.type}</td>
         <td>${
           fee.class == JSON.parse(localStorage["user_data"]).data.class.id
             ? JSON.parse(localStorage["user_data"]).data.class.class_name
             : fee.class
         }</td>
        <td>₦${formatNumber(fee.amount)}</td>
    </tr>
    `;

      c = c + 1;
    });
  }
}

function download() {
  const payment_slip = this.document.getElementById("payment-slip");
  console.log(payment_slip);
  console.log(window);
  var opt = {
    // margin: 1,
    // filename: "myfile.pdf",
    // image: { type: "jpeg", quality: 0.98 },
    // html2canvas: { scale: 2 },
    // jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };
  html2pdf().from(payment_slip).set(opt).save();
}

// PRINT
function print() {
  var divContents = document.getElementById("iframe").innerHTML;
  var head = document.getElementById("head").innerHTML;
  console.log(divContents);
  var a = window.open("", "", "height=1000, width=1000");
  a.document.write("<html>");
  a.document.write(head);
  a.document.write(`<body style="font-family: Poppins; font-weight: bold;">`);
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

async function makePayment(amount) {
  await getSchoolDetails();
  FlutterwaveCheckout({
    public_key: "FLWPUBK_TEST-4a013176d7cab721b11eef9c4437fbba-X",
    tx_ref: "T1",
    amount: amount,
    currency: "NGN",
    country: "NG",
    payment_options: " ",
    // specified redirect URL
    redirect_url: "#",
    meta: {
      consumer_id: 23,
      consumer_mac: "92a3-912ba-1192a",
    },
    customer: {
      email: "info@demo-school.com",
      phone_number: "08102909304",
      name: "Damilola Oyebanji",
    },
    callback: function (data) {
      console.log(data);
    },
    onclose: function () {
      // close modal
    },
    customizations: {
      title: localStorage["SCHOOL_NAME"],
      description:
        "PAYMENT FOR " +
        localStorage["current_session"] +
        "-" +
        localStorage["current_term"],
      logo: domain + "/assets/img/sample_logo.png",
    },
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
      localStorage.setItem("SCHOOL_COLOR", data[0].school_color);
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

// LOAD SCHOOL COLOR
function loadSchoolColor(){
  if(localStorage["SCHOOL_COLOR"] != "-"){
    var r = document.querySelector(':root');
    var rs = getComputedStyle(r);
   // alert("The value of --blue is: " + rs.getPropertyValue('--blue'));
   // SET SCHOOL COLOR
    r.style.setProperty('--front-color', localStorage["SCHOOL_COLOR"].split("~")[0]);
    r.style.setProperty('--back-color', localStorage["SCHOOL_COLOR"].split("~")[1]);
  }
}

// PAGENATION
function paginateTable(){
  $("#paginate").DataTable();
  $(".dataTables_length").addClass("bs-select");
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
  fetch(ip + "/api/student/change-password", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      student_id: JSON.parse(localStorage["user_data"]).data.student_id,
      current_password: current_password,
      new_password: new_password,
      c_new_password: c_new_password,
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

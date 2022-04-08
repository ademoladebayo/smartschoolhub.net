// DEVELOPMENT IP
// var ip = "http://127.0.0.1:8000";
// var domain = "http://localhost/smartschoolhub.net/mss";

// LIVE IP
var ip = "https://smartschoolhub.net/backend/mss";
var domain = "https://mss.smartschoolhub.net";

// // REMOTE ACCESS
// var ip = "http://192.168.42.168/smartschoolhub.ng/SSHUB_BACKEND/server.php";
// var domain = "http://192.168.42.168/smartschoolhub.ng";

getSchoolDetails();
getCurrentSession();

function loadSideNav(page) {
  document.getElementById("side_nav").innerHTML = `
    <ul class="nav nav-sidebar-menu sidebar-toggle-view">
    <li class="nav-item">
        <a id="index" href="dashboard.html" class="nav-link"><i
                class="flaticon-dashboard"></i><span>Dashboard</span></a>
    </li>

    <li class="nav-item">
        <a   id="manual-payment" href="manual-payment.html" class="nav-link"><i class="fas fa-hand-holding-usd"></i><span>Manual Payment</span></a>
    </li>

    <li class="nav-item">
        <a  id="online-payment" href="online-payment.html" class="nav-link"> <i class="fas fa-globe"></i>
        <span>Online Payments</span></a>
    </li>


    <li class="nav-item">
        <a  id="debitors" href="debitors.html" class="nav-link"><i class="fas fa-times-circle"></i>
        <span>Debitors</span></a>
    </li>

    <li class="nav-item">
        <a   id="new-fee" href="new-fee.html" class="nav-link"><i class="fas fa-plus"></i><span>Fee Management</span></a>
    </li>

    <li class="nav-item">
        <a  id="expense" href="expense.html" class="nav-link"><i class="fas fa-file-invoice-dollar"></i><span>Expenses</span></a>
    </li>

    
    <li class="nav-item">
        <a  id="payment-history" href="payment-history.html" class="nav-link"><i class="flaticon-money"></i><span>Payment History</span></a>
    </li>

    <li class="nav-item">
        <a  id="change-password" href="#?change-password.html" class="nav-link"><i
                class="flaticon-settings"></i><span>Change Password</span></a>
    </li>
    <li class="nav-item">
        <a onclick="goTo('');" href="#" class="nav-link"><i class="flaticon-turn-off"></i><span>Log
                Out</span></a>
    </li>

    <li class="nav-item">
       <a style="cursor: pointer; color:white" id="" onclick="window.parent.location.assign('${
         domain + "/admin/dashboard.html"
       }')" class="nav-link"><span><b>GOTO ADMIN</b></span></a>
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
    fetch(ip + "/api/bursary/signin", {
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
          window.parent.location.assign(domain + "/bursary/");
        }
        return res.json();
      })

      .then((data) => {
        toastr.remove();
        if (data.success) {
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
function changeLogo() {
  document.getElementById("logo").innerHTML =
    document.getElementById("logo").innerHTML != ""
      ? ""
      : `<h1 style="font-weight: bold; font-family: Rowdies; color:white;">
          <i style="color: white; " class="fas fa-graduation-cap fa-xs"></i> SSHUB </h1>`;
}

function reloadEditFrame() {
  var iframe = document.getElementById("edit_frame");
  temp = iframe.src;
  iframe.src = "";
  iframe.src = temp;
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
        window.parent.location.assign(domain + "/bursary/");
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
    JSON.parse(localStorage["user_data"]).data.username
  }</b>`;
  document.getElementById("user_name1").innerHTML = `<b>${
    JSON.parse(localStorage["user_data"]).data.username
  }</b>`;
  //   document.getElementById("male").innerHTML = formatNumber(
  //     JSON.parse(localStorage["user_data"]).dashboard_information.male
  //   );
  //   document.getElementById("female").innerHTML = formatNumber(
  //     JSON.parse(localStorage["user_data"]).dashboard_information.female
  //   );

  //   document.getElementById(
  //     "no_of_student"
  //   ).innerHTML = `<span class="counter" data-num="${parseInt(
  //     formatNumber(
  //       JSON.parse(localStorage["user_data"]).dashboard_information.no_of_student
  //     )
  //   )}">${formatNumber(
  //     JSON.parse(localStorage["user_data"]).dashboard_information.no_of_student
  //   )}</span>
  //       </div>`;

  //   document.getElementById(
  //     "no_of_assigned_subject"
  //   ).innerHTML = `<span class="counter" data-num="${parseInt(
  //     formatNumber(
  //       JSON.parse(localStorage["user_data"]).dashboard_information
  //         .no_of_assigned_subject
  //     )
  //   )}">${formatNumber(
  //     JSON.parse(localStorage["user_data"]).dashboard_information
  //       .no_of_assigned_subject
  //   )}</span>
  //       </div>`;
}

function goTo(page) {
  if (page == "") {
    localStorage.clear();
  }
  window.parent.location.assign(domain + "/bursary/" + page);
}

function getFeeSession() {
  document.getElementById("fee_session").innerHTML +=
    localStorage["current_session"] + " - " + localStorage["current_term"];
}

// FEE MANAGEMENT
function createFee() {
  var description = document.getElementById("description").value;
  var amount = document.getElementById("amount").value;
  var fee_type = document.getElementById("fee_type").value;
  var class_payment = document.getElementById("class").value;

  if (
    description != "" &&
    amount != "" &&
    fee_type != "" &&
    class_payment != ""
  ) {
    // PUSH TO API
    warningtoast("<b>Processing ... Please wait</b>");
    fetch(ip + "/api/bursary/create-fee", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage["token"],
      },
      body: JSON.stringify({
        description: description,
        amount: amount,
        fee_type: fee_type,
        class: class_payment,
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

function getAllFee() {
  fetch(ip + "/api/bursary/all-fee", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
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
      document.getElementById("fee_table").innerHTML = ``;
      if (data.length > 0) {
        for (i in data) {
          document.getElementById("fee_table").innerHTML += `
            <tr class='${c % 2 == 0 ? "even" : "odd"}'>
    
            <td>${c}.</td>
            <td>${data[i].description}</td>
            <td>${data[i].type}</td>
            <td>${
              data[i].pay_by == null ? data[i].class : data[i].pay_by.class_name
            }</td>
            <td>${formatNumber(data[i].amount)}</td>
            <td>
                <a onmouseover="reloadEditFrame();localStorage.setItem('editFee','${
                  data[i].id
                }~${data[i].description}~${data[i].type}~${data[i].class}~${
            data[i].amount
          }')" href="#" class="btn btn-warning" data-bs-toggle="modal"
                    data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
                <a onclick="deleteFee(${
                  data[i].id
                })" href="#" class="btn btn-danger"><i
                        class="fas fa-trash"></i>
                    Delete</a>
            </td>
           </tr>
            `;
          c = c + 1;
        }
      }
    })
    .catch((err) => console.log(err));
}

function editFeeDetails() {
  document.getElementById("description").value =
    localStorage["editFee"].split("~")[1];

  document.getElementById("fee_type").innerHTML =
    `<option value="${localStorage["editFee"].split("~")[2]}">${
      localStorage["editFee"].split("~")[2]
    }</option>` + document.getElementById("fee_type").innerHTML;

  document.getElementById("class").innerHTML =
    `<option value="${localStorage["editFee"].split("~")[3]}">${
      localStorage["editFee"].split("~")[3]
    }</option>` + document.getElementById("class").innerHTML;

  document.getElementById("amount").value =
    localStorage["editFee"].split("~")[4];
}

function updateFee() {
  var description = document.getElementById("description").value;
  var amount = document.getElementById("amount").value;
  var fee_type = document.getElementById("fee_type").value;
  var class_payment = document.getElementById("class").value;

  if (
    description != "" &&
    amount != "" &&
    fee_type != "" &&
    class_payment != ""
  ) {
    // PUSH TO API
    warningtoast("<b>Processing ... Please wait</b>");
    fetch(ip + "/api/bursary/edit-fee", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage["token"],
      },
      body: JSON.stringify({
        fee_id: localStorage["editFee"].split("~")[0],
        description: description,
        amount: amount,
        fee_type: fee_type,
        class: class_payment,
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

function deleteFee(id) {
  fetch(ip + "/api/bursary/delete-fee/" + id, {
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
      toastr.remove();
      if (data.success) {
        successtoast("<b>" + data.message + "</b>");
        getAllFee();
      } else {
        errortoast("<b>" + data.message + "</b>");
      }
    })
    .catch((err) => console.log(err));
}

// EXPENSE MANAGEMENT
function createExpense() {
  var description = document.getElementById("description").value;
  var amount = document.getElementById("amount").value;
  var date = document.getElementById("date").value;

  if (description != "" && amount != "" && date != "") {
    // PUSH TO API
    warningtoast("<b>Processing ... Please wait</b>");
    fetch(ip + "/api/bursary/create-expense", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage["token"],
      },
      body: JSON.stringify({
        description: description,
        amount: amount,
        date_incurred: date,
        last_modified: getDate().split("~")[1],
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

function getAllExpense() {
  fetch(ip + "/api/bursary/all-expense", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
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
      document.getElementById("expense_table").innerHTML = ``;
      if (data.length > 0) {
        for (i in data) {
          document.getElementById("expense_table").innerHTML += `
              <tr class='${c % 2 == 0 ? "even" : "odd"}'>
      
              <td>${c}.</td>
              <td>${data[i].description}</td>
              <td>${formatNumber(parseInt(data[i].amount))}</td>
              <td>${data[i].date_incurred}</td>
              <td>${data[i].last_modified}</td>
              <td>
                  <a onmouseover="reloadEditFrame();localStorage.setItem('editExpense','${
                    data[i].id
                  }~${data[i].description}~${data[i].date_incurred}~${
            data[i].amount
          }')" href="#" class="btn btn-warning" data-bs-toggle="modal"
                      data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
                  <a onclick="deleteExpense(${
                    data[i].id
                  })" href="#" class="btn btn-danger"><i
                          class="fas fa-trash"></i>
                      Delete</a>
              </td>
             </tr>
              `;
          c = c + 1;
        }
      }
    })
    .catch((err) => console.log(err));
}

function editExpenseDetails() {
  document.getElementById("description").value =
    localStorage["editExpense"].split("~")[1];

  document.getElementById("date").value =
    localStorage["editExpense"].split("~")[2];

  document.getElementById("amount").value =
    localStorage["editExpense"].split("~")[3];
}

function updateExpense() {
  var description = document.getElementById("description").value;
  var amount = document.getElementById("amount").value;
  var date = document.getElementById("date").value;

  if (description != "" && amount != "" && date != "") {
    // PUSH TO API
    warningtoast("<b>Processing ... Please wait</b>");
    fetch(ip + "/api/bursary/edit-expense", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage["token"],
      },
      body: JSON.stringify({
        expense_id: localStorage["editExpense"].split("~")[0],
        description: description,
        amount: amount,
        date_incurred: date,
        last_modified: getDate().split("~")[1],
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

function deleteExpense(id) {
  fetch(ip + "/api/bursary/delete-expense/" + id, {
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
      toastr.remove();
      if (data.success) {
        successtoast("<b>" + data.message + "</b>");
        getAllExpense();
      } else {
        errortoast("<b>" + data.message + "</b>");
      }
    })
    .catch((err) => console.log(err));
}

// MANUAL PAYMENT MANAGEMENT
function createManualPayment() {
  var student_class = document.getElementById("class").value;
  var student = document.getElementById("student").value;
  var date = document.getElementById("date").value;
  var amount = document.getElementById("amount").value;
  var payment_type = document.getElementById("payment_type").value;
  var fee_type = document.getElementById("fee_type").value;

  var payment_description = document.getElementById(
    "payment_description"
  ).value;

  if (
    student_class != "" &&
    amount != "" &&
    date != "" &&
    student != "" &&
    payment_type != "" &&
    fee_type != "" &&
    payment_description != ""
  ) {
    // PUSH TO API
    warningtoast("<b>Processing ... Please wait</b>");
    fetch(ip + "/api/bursary/create-manual-payment", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage["token"],
      },
      body: JSON.stringify({
        student_class: student_class,
        amount: amount,
        date: date,
        student: student,
        payment_type: payment_type,
        fee_type: fee_type,
        payment_description: payment_description,
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

function getAllManualPayment() {
  fetch(ip + "/api/bursary/all-manual-payment", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
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
      document.getElementById("manual_payment_table").innerHTML = ``;
      if (data.length > 0) {
        for (i in data) {
          document.getElementById("manual_payment_table").innerHTML += `
                <tr class='${c % 2 == 0 ? "even" : "odd"}'>
        
                <td>${c}.</td>
                <td>${data[i].student.student_id}</td>
                <td>${
                  data[i].student.first_name + " " + data[i].student.last_name
                }</td>
                <td>${data[i].class.class_name}</td>
                <td>${data[i].date}</td>
                <td><b>${data[i].payment_type}</b></td>
                <td><b>${data[i].fee_type}</b></td>
                <td><b>${data[i].payment_description}</b></td>
                <td>${formatNumber(parseInt(data[i].amount))}</td>
                <td>
                    <a onmouseover="reloadEditFrame();localStorage.setItem('editManualPayment','${
                      data[i].id
                    }~${data[i].student.id}~${
            data[i].student.first_name + " " + data[i].student.last_name
          }~${data[i].class.id}~${data[i].class.class_name}~${data[i].date}~${
            data[i].payment_type
          }~${data[i].payment_description}~${data[i].amount}~${
            data[i].fee_type
          }')" href="#" class="btn btn-warning" data-bs-toggle="modal"
                        data-bs-target="#editModal"><i class="fas fa-edit"></i> Edit</a>
                    <a onclick="deleteManualPayment(${
                      data[i].id
                    })" href="#" class="btn btn-danger"><i
                            class="fas fa-trash"></i>
                        Delete</a>
                </td>
               </tr>
                `;
          c = c + 1;
        }
      }
    })
    .catch((err) => console.log(err));
}

function editManualPaymentDetails() {
  // 1~8~CHRISTINA ABEGUNDE~2~SS2~03/01/2022~BANK~Payment description~25000
  //   0  1          2        3  4        5      6     7                 8

  document.getElementById("class").innerHTML =
    `
  <option value="${localStorage["editManualPayment"].split("~")[3]}">${
      localStorage["editManualPayment"].split("~")[4]
    }</option>` + document.getElementById("class").innerHTML;

  document.getElementById("student").innerHTML =
    `
  <option value="${localStorage["editManualPayment"].split("~")[1]}">${
      localStorage["editManualPayment"].split("~")[2]
    }</option>` + document.getElementById("student").innerHTML;

  document.getElementById("date").value =
    localStorage["editManualPayment"].split("~")[5];

  document.getElementById("payment_type").innerHTML =
    `
  <option value="${localStorage["editManualPayment"].split("~")[6]}">${
      localStorage["editManualPayment"].split("~")[6]
    }</option>` + document.getElementById("payment_type").innerHTML;

  document.getElementById("payment_description").value =
    localStorage["editManualPayment"].split("~")[7];

  document.getElementById("amount").value =
    localStorage["editManualPayment"].split("~")[8];

  document.getElementById("payment_type").innerHTML =
    `
  <option value="${localStorage["editManualPayment"].split("~")[9]}">${
      localStorage["editManualPayment"].split("~")[6]
    }</option>` + document.getElementById("fee_type").innerHTML;
}

function updateManualPayment() {
  var student_class = document.getElementById("class").value;
  var student = document.getElementById("student").value;
  var date = document.getElementById("date").value;
  var amount = document.getElementById("amount").value;
  var payment_type = document.getElementById("payment_type").value;
  var fee_type = document.getElementById("fee_type").value;
  var payment_description = document.getElementById(
    "payment_description"
  ).value;

  if (
    student_class != "" &&
    amount != "" &&
    date != "" &&
    student != "" &&
    payment_type != "" &&
    fee_type != "" &&
    payment_description != ""
  ) {
    // PUSH TO API
    warningtoast("<b>Processing ... Please wait</b>");
    fetch(ip + "/api/bursary/edit-manual-payment", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage["token"],
      },
      body: JSON.stringify({
        manual_payment_id: localStorage["editManualPayment"].split("~")[0],
        student_class: student_class,
        amount: amount,
        date: date,
        student: student,
        payment_type: payment_type,
        fee_type: fee_type,
        payment_description: payment_description,
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

function deleteManualPayment(id) {
  fetch(ip + "/api/bursary/delete-manual-payment/" + id, {
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
      toastr.remove();
      if (data.success) {
        successtoast("<b>" + data.message + "</b>");
        getAllManualPayment();
      } else {
        errortoast("<b>" + data.message + "</b>");
      }
    })
    .catch((err) => console.log(err));
}

// ONLINE PAYMENT MANAGEMENT
function getAllOnlinePayment() {}

// PAYMENT HISTORY
function getAllPaymentHistory() {
  fetch(ip + "/api/bursary/all-payment-history", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
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
                    <td>${data[i].student.student_id}</td>
                    <td>${
                      data[i].student.first_name +
                      " " +
                      data[i].student.last_name
                    }</td>
                    <td>${data[i].class.class_name}</td>
                    <td><b>${data[i].payment_type}</b></td>
                    <td><b>${data[i].payment_description}</b></td>
                    <td>${data[i].date}</td>
                    <td>${formatNumber(parseInt(data[i].amount))}</td>
                    
                   </tr>
                    `;
          c = c + 1;
        }
      }
    })
    .catch((err) => console.log(err));
}

function searchPayment(search_data) {
  fetch(ip + "/api/bursary/search-payment-history", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
      search_data: search_data,
      session: localStorage["current_session"],
      term: localStorage["current_term"],
    }),
  })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 401) {
        window.parent.location.assign(domain + "/bursary/");
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
                      <td>${data[i].student.student_id}</td>
                      <td>${
                        data[i].student.first_name +
                        " " +
                        data[i].student.last_name
                      }</td>
                      <td>${data[i].class.class_name}</td>
                      <td><b>${data[i].payment_type}</b></td>
                      <td>${data[i].date}</td>
                      <td>${formatNumber(parseInt(data[i].amount))}</td>
                      
                     </tr>
                      `;
          c = c + 1;
        }
      }
    })
    .catch((err) => console.log(err));
}

// DEBITORS
function getAllDebitor() {
  fetch(ip + "/api/bursary/all-debitor", {
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
      document.getElementById("debitors_table").innerHTML +=
        data[0].last_checked;
      c = 1;
      document.getElementById("debitors_table").innerHTML = ``;
      if (data.length > 0) {
        for (i in data) {
          document.getElementById("debitors_table").innerHTML += `
                    <tr class='${c % 2 == 0 ? "even" : "odd"}'>
            
                    <td>${c}.</td>
                    <td>${data[i].student.student_id}</td>
                    <td>${
                      data[i].student.first_name +
                      " " +
                      data[i].student.last_name
                    }</td>                 
                    <td>${formatNumber(parseInt(data[i].amount))}</td>
                    
                   </tr>
                    `;
          c = c + 1;
        }
      } else {
        document.getElementById(
          "debitors_table"
        ).innerHTML = `NO DEBITOR FOUND`;
      }
    })
    .catch((err) => console.log(err));
}

function syncLatestDebitor() {
  fetch(ip + "/api/bursary/sync-lastest-debitor", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
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
        successtoast(data.message);
        getAllDebitor();
      } else {
        errortoast(data.message);
      }
    })
    .catch((err) => console.log(err));
}

// SEARCH DEBOUCER
const searchPaymentDebouncer = debounce((search_data) =>
  searchPayment(search_data)
);

// CLASS
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
        window.parent.location.assign(domain + "/bursary/");
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

// STUDENT
function getAllStudent(class_id) {
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
        window.parent.location.assign(domain + "/teacher/");
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      document.getElementById("student").innerHTML = ``;
      if (data.length > 0) {
        for (i in data) {
          if (data[i].class.id != class_id) {
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

function getDashboardInfo() {
  fetch(ip + "/api/bursary/dashboard-information", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage["token"],
    },
    body: JSON.stringify({
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
      document.getElementById("student_no").innerHTML = `<span class="counter"
      data-num="${data.student_no}">${data.student_no}</span>`;

      document.getElementById("total_manual_payment").innerHTML = formatNumber(
        parseInt(data.total_manual_payment)
      );

      document.getElementById("total_expense").innerHTML = formatNumber(
        parseInt(data.total_expense)
      );
    })
    .catch((err) => console.log(err));
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

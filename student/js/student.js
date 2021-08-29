function loadSideNav(page) {
  document.getElementById("side_nav").innerHTML = `
    <ul class="nav nav-sidebar-menu sidebar-toggle-view">
    <li class="nav-item">
        <a id="index" href="index.html" class="nav-link"><i
                class="flaticon-dashboard"></i><span>Dashboard</span></a>
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
    <span>Attendance</span></a>
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

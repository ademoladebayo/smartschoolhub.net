function loadSideNav(page) {
  document.getElementById("side_nav").innerHTML = `
    <ul class="nav nav-sidebar-menu sidebar-toggle-view">
    <li class="nav-item">
        <a id="index" href="index.html" class="nav-link"><i
                class="flaticon-dashboard"></i><span>Dashboard</span></a>
    </li>

    <li class="nav-item">
        <a   id="student-payment" href="student-payment.html" class="nav-link"><i class="fas fa-hand-holding-usd"></i><span>Student's Payments</span></a>
    </li>

    <li class="nav-item">
        <a  id="online-payment" href="online-payment.html" class="nav-link"> <i class="fas fa-globe"></i>
        <span>Online Payments</span></a>
    </li>

    <li class="nav-item">
        <a  id="online-payment" href="online-payment.html" class="nav-link"><i class="far fa-money-bill-alt"></i><span>Manual Payments</span></a>
    </li>


    <li class="nav-item">
        <a  id="creditors" href="creditors.html" class="nav-link"><i
        class="fas fa-check-circle"></i><span>Creditors</span></a>
    </li>

    <li class="nav-item">
        <a  id="debitors" href="debitors.html" class="nav-link"><i class="fas fa-times-circle"></i>
        <span>Debitors</span></a>
    </li>

    <li class="nav-item">
        <a   id="new-fee" href="new-fee.html" class="nav-link"><i class="fas fa-plus"></i><span>Create New Fee</span></a>
    </li>

    <li class="nav-item">
        <a  id="expense" href="expense.html" class="nav-link"><i class="fas fa-file-invoice-dollar"></i><span>Expenses</span></a>
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

<?php
session_start();
?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Account Details</title>
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
  
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.min.css">

    <link rel="stylesheet" href="style/account_details.css">
</head>
  <body>

    <header>
      <div class="d-flex align-items-center justify-content-between">
        <div class="logo">
            <img src="../res/imgs/navi-event-logo(3d).png" alt="Logo">
        </div>
    
        <div class="pf-dropdown">
          <button class="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <div class="d-flex align-items-center">
                <div class="profile-box">
                    <div class="pf">
                      <div class="profile-icon">
                        <i class="bi bi-person"></i>
                    </div>
                    <span class="username"><?php echo $_SESSION['username']; ?> </span>
                    
                    </div>
            </div>
          </button>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="../client/account_details.php">Account Details</a></li>
            <li><a class="dropdown-item" href="../client/bookmarked_events.php">Bookmarks</a></li>
            <li><a class="dropdown-item" href="../client/event_history.php">Event History</a></li>
            <li><a class="dropdown-item" href="../client/pending_evaluation.php">Pending Evaluations</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#">
              <form action="../php/logoutfunctions.php" method="post"><button type="submit" class="dropdown-item" onclick="return confirm('Are you sure you want to logout?')">Logout</button></form></a></li>
          </ul>
        </div>
      </div>
      
    </header>

    <nav>
        <div class="nav-links">
            <a href="../index.php">HOME</a>
        </div>
    </nav>

    <div class="container mt-4">
        <div class="row">
          
          <div class="col-md-6">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">
                  <i class="bi bi-lock-fill"></i> <a href="change_password.php">Change Password</a>
                </h5>
              </div>
            </div>
          </div>
      
          <div class="col-md-6">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Account Details</h5>
      
                <p><strong>Username:</strong><?php echo $_SESSION['username']; ?></p>
                <p><strong>ID Number:</strong><?php echo $_SESSION['userId']; ?></p>
                <p><strong>Email:</strong><?php echo $_SESSION['email']; ?></p>
              </div>
            </div>
          </div>
        </div>
      </div>

    <footer>
        <div class="footer-bottom">
            <div class="logo">
                <img src="../res/imgs/navi-event-logo(3d).png" alt="Logo" class="footer-logo">
            </div>
            <p>© 2023 NavEnt. A Saint Louis University Company. All Rights Reserved. CS Slot Org ™</p>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
  
    </body>
  </html>
<?php
require_once "../php/dbconnection.php";
session_start();
$userID = $_SESSION['userId'];
$st = $conn -> prepare('SELECT Event_ID FROM REGISDETAILS WHERE User_ID = ?');
$st -> bind_param("i",$userID);
$st -> execute();
$result = $st -> get_result();
if ($result->num_rows != 0) {
    while ($row = $result->fetch_assoc()) {
        $events[] = $row['Event_ID'];
    }
}

$st->close();
$result->close();

$placeholders = implode(',', array_fill(0, count($events), '?'));
?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Announcements</title>
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
  
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.min.css">

    <link rel="stylesheet" href="style/announcement.css">
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
                    <span class="username"><?php echo $_SESSION['username']; ?></span>
                    
                    </div>
            </div>
          </button>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="../client/account_details.php">Account Details</a></li>
            <li><a class="dropdown-item" href="../client/bookmarked_events.php">Bookmarks</a></li>
            <li><a class="dropdown-item" href="../client/event_history.php">Event History</a></li>
            <li><a class="dropdown-item" href="../client/pending_evaluation.php">Pending Evaluations</a></li>
            <li><hr class="dropdown-divider"></li>
            <li>
            <form action="php\logoutfunctions.php" method="POST"><button type="submit" class="dropdown-item" onclick="return confirm('Are you sure you want to logout?')">Logout</button></form>
            </li>
          </ul>
        </div>
      </div>
      
    </header>

    <nav>
        <div class="nav-links">
            <a href="../index.php">HOME</a>
            <a href="../client/announcement.php">ANNOUNCEMENTS</a>
        </div>  
    </nav>

    <div class="container-fluid">
        <div class="row">
            <nav id="sidebar" class="col-md-3 col-lg-2 d-md-block bg-light sidebar">
                <div class="position-sticky">
                    <ul class="nav flex-column">
                        <li class="nav-item">
                            <a class="nav-link active" href="#">
                                <i class="bi bi-card-list"></i> All Announcements
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
            <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 class="h2">Announcements</h1>
                </div>
                <?php
                // Construct the second query with placeholders
                $st = $conn->prepare("SELECT * FROM Announcements WHERE Event_ID IN ($placeholders)");
                // Bind parameters for the second query
                $types = str_repeat('s', count($events));
                $st->bind_param($types, ...$events);
                $st->execute();

                $result = $st->get_result();

                while ($row = $result->fetch_assoc()) {
                ?>
                <div class="card mb-3">
                    <div class="card-header">
                        <h5 class="card-title"></h5>
                    </div>
                    <div class="card-body">
                        <p class="card-text"><?php echo $row['Details']; ?></p>
                    </div>
                    <div class="card-footer text-muted">
                        <?php echo $row['Date_Posted']; ?>
                    </div>
                </div>
                <?php
                }
                $st -> close();
                ?>   
            </main>
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
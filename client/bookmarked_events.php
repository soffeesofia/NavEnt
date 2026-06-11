<?php
session_start();
require "../php/dbconnection.php";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bookmarked Events</title>
 
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
  
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.min.css">

    <link rel="stylesheet" href="style/bookmarked_events.css">
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
              <li><a class="dropdown-item" href="#">
                <form action="..php/logout.php" method="post"><button type="submit" class="dropdown-item" onclick="return confirm('Are you sure you want to logout?')">Logout</button></form></a></li>
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

    <section id="packages" class="pt-3 pb-3 custom-left-padding">
      <h2 class="text-left my-3">Bookmarked Events</h2>
    <?php
    $bookmarkedUserID = $_SESSION['userId']; 
    $st = $conn ->prepare("SELECT Event_ID FROM bookmarks WHERE User_ID=?");
    $st -> bind_param("i",$bookmarkedUserID);
    $st -> execute();
    $result = $st -> get_result();
    if($result -> num_rows != 0){
      $bookmarkedEvents = $result->fetch_all(MYSQLI_ASSOC);
    }
    $st->close();
    $result->close();
    $bookmarkedEventsCount = count($bookmarkedEvents);
     for($i = 0; $i < $bookmarkedEventsCount; $i++){
        $EventItself = array_shift($bookmarkedEvents[$i]);  
        $st = $conn -> prepare("SELECT * FROM EVENTS WHERE Event_ID=?");
        $st -> bind_param('s',$EventItself);
        $st -> execute();
        $result = $st -> get_result();
        if($result -> num_rows != 0){
        $bmEvents = $result -> fetch_all(MYSQLI_ASSOC);
        $eventBook = array_shift($bmEvents);
   

    ?>
    <div id="latestEventsSlider" class="carousel slide" data-bs-ride="false">
        <div class="carousel-inner">
          <div class="carousel-item active">
            <div class="container">
                <div class="col-lg">
                  <div class="card latest-event w-100">
                   <!--- <img src="https://images.unsplash.com/photo-1560439514-07abbb294a86?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" class="card-img" alt="event4"> -->
                    <div class="card-img-overlay">
                      <h5 class="card-title"><?php echo $eventBook['Event_Name']; ?></h5>
                      <p class="card-text"><?php echo $eventBook['Event_Description']; ?></p>
                      <p class="card-text"><small><?php echo $eventBook['Event_StartDate']; ?></small></p>
                      <form action="../client/event_details.php" method="POST">
                      <input type="hidden" name="event" value="<?php echo $eventBook['Event_ID'];  ?>">
                      <button type="submit" class="btn btn-primary" name="readMore">Read More</button>
                      </form>
                    </div>
                  </div>
                </div>
            </div>
        </div>
    </div>
  </div>
    <?php
                      
      }
      $st -> close();
      $result -> close();
    }
    ?>
    </section>
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
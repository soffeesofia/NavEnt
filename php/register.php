<?php
session_start();
require("dbconnection.php");
require "../vendor/autoload.php";

use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;

if (isset($_POST["register"])) {
    if ($_POST["IDnum"] == $_SESSION['userId']) {
        $nameUser = $_POST['uname'];
        $age = $_POST['age'];
        $course = $_POST['course'];
        $yearlevel = $_POST['year'];
        $eventiD = $_POST['eventid'];
        $uID = $_POST['IDnum'];
        $registerID = (int)$uID . $eventiD;
        $_SESSION['IDEvent'] = $eventiD;
        $_SESSION['temp'] = $registerID;

        $st = $conn->prepare('INSERT INTO registration (`Registration_ID`, `Name`, `Age`, `Course`, `Year`, `User_ID`) VALUES (?,?,?,?,?,?)');
        $st->bind_param('issssi', $registerID, $nameUser, $age, $course, $yearlevel, $uID);
        $st->execute();
        $st->close();
        $qrData = $uID . $eventiD;
        $qr_code = QrCode::create($qrData);
        $writer = new PngWriter;
        $qrGenerated = $writer->write($qr_code);
        $final = $qrGenerated->getString();

        $st = $conn->prepare('INSERT INTO regisdetails (`User_ID`, `Event_ID`,`QR_Code`) VALUES (?,?,?)');
        $st->bind_param('iis', $uID, $eventiD, $final);
        $st->execute();
        $st->close();

        $imageFilePath = "phpqrcode/$nameUser" . "$eventiD";
        file_put_contents($imageFilePath, $qrGenerated->getString());
    }
}
?>

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>NavEnt Home</title>
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
  
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.min.css">

    <link rel="stylesheet" href="style/successfully_registered.css">
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

                <div class="pf">
                  <div class="profile-icon">
                    <i class="bi bi-person"></i>
                </div>
                <span class="username"><?php echo $_SESSION['username']; ?><Username></span>
                </div>
            </div>
          </button>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="acount_details.php">Account Details</a></li>
            <li><a class="dropdown-item" href="bookmarked_events.html">Bookmarks</a></li>
            <li><a class="dropdown-item" href="event_history.html">Event History</a></li>
            <li><a class="dropdown-item" href="pending_evaluation.html">Pending Evaluations</a></li>
            <li><a class="dropdown-item" href="qr_code.html">QR Code</a></li>
            <li><hr class="dropdown-divider"></li>
            <li>
            <form action="../php/logoutfunctions.php" method="POST"><button type="submit" class="dropdown-item" onclick="return confirm('Are you sure you want to logout?')">Logout</button></form></li>
          </ul>
        </div>
      </div>
      
    </header>

    <nav>
        <div class="nav-links">
            <a href="../index.php">HOME</a>
            <a href="announcement.html">ANNOUNCEMENTS</a>
        </div>
        <div class="box">
            <input type="text" placeholder="Search...">
            <a href="">
                <i class="bi bi-search search-icon"></i>
                <i class="fas fa-search"></i>
            </a>
    </nav>

    <section id="packages" class="pt-3 pb-3 text-center">
        <h1>SUCCESSFULLY REGISTERED</h1>
        <h2 class="my-3">Your QR Code</h2>

        <div class="container">
            <div class="row">
            </div>

                <div class="col-md-6 d-flex align-items-center justify-content-center">
                    <div class="d-flex flex-column align-items-center">
                        <button class="button" onclick="downloadQR()">Download</button>
                        <button class="button" onclick="printQR()">Print</button>
                    </div>
                </div>                
            </div>
        </div>
    </section>
  

      <footer>
        <div class="footer-bottom">
            <div class="logo">
                <img src="../res/imgs/navi-event-logo(3d).png" alt="Logo" class="footer-logo">
            </div>
            <p>© 2023 NavEnt. A Saint Louis University Company. All Rights Reserved. CS Slot Org ™</p>
        </div>
    </footer>

    <script>
        function downloadQR() {
            var downloadLink = document.createElement("a");
            downloadLink.href = "/res/imgs/prof_placeholder.png";
            downloadLink.download = "qr-code.png";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }

        function printQR() {
            window.print();
        }
    </script>

  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>

  </body>
</html>
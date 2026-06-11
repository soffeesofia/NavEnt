<?php
session_start();
require("../php/dbconnection.php");
require "../vendor/autoload.php";

use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Endroid\QrCode\Label\Label;
use Endroid\QrCode\Logo\Logo;

$error = 'SUCCESSFULLY REGISTERED!';
try{
if (isset($_POST["register"])) {
  $nameUser = $_POST['uname'];
  $role = $_POST['role'];
  $course = $_POST['course'];
  $school = $_POST['school'];
  $eventiD = $_POST['eventid'];
  $uID = $_POST['IDnum'];
  $organization = $_POST['Organization'];
  $postion = $_POST['Position'];
  $registerID = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
  $_SESSION['IDEvent'] = $eventiD;
  $_SESSION['temp'] = $registerID;

  $st = $conn -> prepare("SELECT * FROM REGISDETAILS WHERE User_ID=? and Event_ID=?;");
  $st-> bind_param('ii', $uID, $eventiD);
  $st-> execute();
  $result= $st->get_result();
  $st -> close(); 
    if ($result->num_rows ==  0){
      $st = $conn->prepare('INSERT INTO registration (`Registration_ID`,`Name`, `Course`, `School`, `Role`, `Organization`, `Org_Position`, `User_ID`) VALUES (?,?,?,?,?,?,?,?)');
      $st->bind_param('issssssi',$registerID, $nameUser, $course, $school, $role, $organization, $postion, $uID);
      $st->execute();
      $st->close();
      $qr_code = QrCode::create($uID . $eventiD);
      $writer = new PngWriter;
      $qrGenerated = $writer ->write($qr_code);
      $final = $qrGenerated -> getString();


      $st = $conn->prepare('INSERT INTO regisdetails (`User_ID`, `Event_ID`,`QR_Code`) VALUES (?,?,?)');
      $st->bind_param('iis', $uID, $eventiD, $final);
      $st->execute();
      $st->close();

    } else{
      $error = "You have already Registered for this event";
    }
}
} catch (mysqli_sql_exception $e) {
  if ($e->getCode() == 1062) {
      //$error =  "You have already Registered for this event";
  } else {
     // $error = "Error: " . $e->getMessage();
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
            <li><a class="dropdown-item" href="../client/acount_details.php">Account Details</a></li>
            <li><a class="dropdown-item" href="../client/bookmarked_events.php">Bookmarks</a></li>
            <li><a class="dropdown-item" href="../client/event_history.php">Event History</a></li>
            <li><a class="dropdown-item" href="../client/pending_evaluation.php">Pending Evaluations</a></li>
            <li><hr class=" dropdown-divider"></li>
            <li>
            <form action="../php/logoutfunctions.php" method="POST"><button type="submit" class="dropdown-item" onclick="return confirm('Are you sure you want to logout?')">Logout</button></form></li>
          </ul>
        </div>
      </div>
      
    </header>

    <nav>
        <div class="nav-links">
            <a href="../index.php">HOME</a>
            <a href="../client/announcement.php">ANNOUNCEMENTS</a>
        </div>  
        <div class="box">
            <input type="text" placeholder="Search...">
            <a href="">
                <i class="bi bi-search search-icon"></i>
                <i class="fas fa-search"></i>
            </a>
    </nav>

    <section id="packages" class="pt-3 pb-3 text-center">
        <h1><?php echo $error; ?></h1>
        <h2 class="my-3"><?php
          if($error == "SUCCESSFULLY REGISTERED!"){
            $message = $_SESSION['name'];
            echo "Your QR code for $message.";
          }else{
            echo "Something went wrong...";
          }
          ?>

        <div class="container">
            <div class="row">
                <div class="col-md-6 mx-auto text-center">
                  <?php
                  $qr_code = QrCode::create($_POST['IDnum'] . $_SESSION['IDEvent'] )
                            -> setSize(200);
                  $label = Label::create("$nameUser");
                  $logo = Logo::create("../res/imgs/navi-event-logo(flat-40a-circle).png")
                          -> setResizeToWidth(30);                   
                  $writer = new PngWriter;
                  $qrGenerated = $writer ->write($qr_code,$logo,$label);
                  $QrImage = $qrGenerated -> getString();
                  $filePath = "../res/QRimages/"."$nameUser".".png"; 

                  file_put_contents($filePath, $QrImage);
                  
                  if (file_exists($filePath)) {
                      echo '<img src="' . $filePath . '" alt="QR Code">';
                  } else {
                      echo 'Failed to save QR code.';
                  }
                  ?>
                </div>

                <div class="col-md-6 d-flex align-items-center justify-content-center flex-column">
                    <div class="d-flex flex-column align-items-center mb-3">
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
            downloadLink.href = "<?php echo $filePath ?>";
            downloadLink.download = "<?php echo $filePath ?>";  
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
<?php
require("../php/dbconnection.php");
include("../php/loginfunctions.php");
$errors = array('username'=>'','password'=>'');
session_start(); 
if (isset($_POST['submit'])){
    $username = $_POST['username'];
    $password = $_POST['password'];
    $st = $conn -> prepare("SELECT * FROM ACCOUNTS WHERE Email_Address=? and Password=?");
    $st-> bind_param('ss', $username, $password);
    $st-> execute();
    $result= $st->get_result(); 
    if ($result->num_rows !=0){
        $row = $result->fetch_assoc();  
        $firstName = $row['First_Name'];
        $lastName = $row['Last_Name'];
        $email = $row['Email_Address'];
        $userId = $row['User_ID'];
        $password = $row['Password'];
        $_SESSION['username'] = $firstName . " " . $lastName;
        $_SESSION['userId'] = $userId;
        $_SESSION['email'] = $email;
        $_SESSION['Password'] = $password;
        //echo "logged in as: $firstName";
        //echo $_SESSION['email'] ."" . $_SESSION['userId'];
        header("Location: ../index.php");
    }else{
        $errors['username'] = 'your email is not here';
        $errors['password'] = 'your password might be incorrect';
    }
    $st->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Login Page</title>
    <link rel="stylesheet" href="style/user_login.css">
</head>
<body>
    <div class="container">
        <div class="logo-container">
            <img src="../res/imgs/navi-event-logo(3d).png" alt="Your Logo" class="logo">
        </div>
        <div class="login-form-container">
            <div class="login_form">
                <form action="user_login.php" method="POST">
                    
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" placeholder="<?php echo $errors['username']; ?>" required>

                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" placeholder="<?php echo $errors['password']; ?>" required>

                    <button type="submit" id="submit" name="submit">Continue</button>
                </form>
            </div>
        </div>
    </div>
</body>
</html>

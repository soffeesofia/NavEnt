<?php
require_once "../php/dbconnection.php";
$errors = array('','');
if(isset($_POST["signup"])){
    if($_POST["password"] == $_POST["confirm_password"]){
        $nameFirst = $_POST["fname"];
        $nameSecond = $_POST["lname"];
        $email = $_POST["email"];
        $password = $_POST["password"];
        $schoolID = substr($email, 0 , 7);

    $st = $conn ->prepare('INSERT INTO accounts (`User_ID`, `First_Name`,`Last_Name`,`Email_Address`,`Password`) VALUES (?,?,?,?,?)');
        $st -> bind_param('issss', $schoolID, $nameFirst, $nameSecond, $email, $password);
        $st -> execute();
        $st -> close();

        header('Location: ../index.php');
    }else{
        $errors[0] = 'Password did not match!';
        $errors[1] = 'Password did not match!';
    }

}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign up</title>
    <link rel="stylesheet" href="style/user_signup.css">
</head>
<body>
    <div class="container">
        <div class="logo-container">
            <img src="..\res\imgs\navi-event-logo(3d).png" alt="Your Logo" class="logo">
        </div>
        <div class="signup-form-container">
            <div class="signup_form">
                <form action="user_signup.php" method="POST">

                    <label for="fname">First Name:</label>
                    <input type="fname" id="fname" name="fname" required>

                    <label for="lname">Last Name:</label>
                    <input type="lname" id="lname" name="lname" required>

                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" required>

                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" placeholder="<?php echo $errors[0]; ?>" required>

                    <label for="confirm_password">Confirm Password:</label>
                    <input type="password" id="confirm_password" name="confirm_password" placeholder="<?php echo $errors[1]; ?>" required>

                    <button type="submit" name="signup">Sign Up</button>
                </form>
            </div>
        </div>
    </div>
</body>
</html>
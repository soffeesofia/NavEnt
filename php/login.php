<?php
require("dbconnection.php");
include("loginfunctions.php");

session_start();
if (isset($_POST['username'])){
    $username = $_POST['username'];
    $password = $_POST['password'];
    $st = $conn -> prepare("SELECT * FROM ACCOUNTS WHERE Email_Address=? and Password=?;");
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
        echo "wrong login credentials";
    }
    $st->close();
}
exit();
?>
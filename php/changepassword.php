<?php
session_start();
require("dbconnection.php");
$errors = array('password'=> '', 'newPassword' => '', 'confirm' => '');
if (isset($_POST['change'] )) {
if($_POST['password'] == $_SESSION['Password']){
    if($_POST['newpassword'] == $_POST['confirm']){
        $newPassword = $_POST['newpassword'];
        $email = $_SESSION['email'];
    $st = $conn ->prepare("UPDATE ACCOUNTS SET Password = ? WHERE Email_Address=?;");
    $st -> bind_param("ss", $newPassword, $email);
    $result = $st -> execute();
    if ($result) {
        // Update successful
        $msg = "password has been updated!";
        
    } else {
        // Update failed
        $errors['password'] = "Error updating password: " . $st->error;
        
    }
    }else{
        $errors['confirm'] = "did not match!";
        $errors['newPassword'] = "did not match!";
        
    }
}else{
    $errors["password"] = "Incorrect Password";
    
}
}
$result -> close();
$st -> close();
exit();
?>
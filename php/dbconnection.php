<?php
    $serverName = "localhost";
    $dbUsername = "root";
    $dbPassword = "";
    $dbName = "webdev";

    $conn = new mysqli($serverName, $dbUsername, $dbPassword, $dbName);

    if(!$conn){
        die("Connection to database failed". mysqli_error($conn));
    } 
?>
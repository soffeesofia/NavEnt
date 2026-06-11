<?php
session_start();
if (isset($_SESSION["username"])) {
   include("client/logged_home.php");
} else {
   include("client/home.php");
}
?>
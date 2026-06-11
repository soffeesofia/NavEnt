<?php
require_once "dbconnection.php";
date_default_timezone_set("Asia/Hong_Kong");
if(isset($_POST['boobmark'])){
    $bookmarkIDGenerator = str_pad(rand(0, 999999), 7, '0', STR_PAD_LEFT);
    $date = date('Y-m-d');
    $userBookmark = $_POST['user'];
    $eventBookmark = $_POST['bookmarkedEvent'];
    $st = $conn -> prepare("SELECT * FROM bookmarks WHERE User_ID=? AND Event_ID=?");
    $st -> bind_param("ii",$userBookmark, $eventBookmark);
    $st -> execute();
    $result = $st -> get_result();
    if($result -> num_rows == 0){
        $st = $conn->prepare("INSERT INTO bookmarks (`Bookmark_ID`, `Date_Bookmarked`, `User_ID`, `Event_ID`) VALUES 
                            ('$bookmarkIDGenerator', '$date', '$userBookmark', '$eventBookmark')");
    $st->execute();
    $st->close();
    }
}
header("Location:  ../client/bookmarked_events.php");


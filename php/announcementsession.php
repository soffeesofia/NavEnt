<?php
session_start();
include "../php/dbconnection.php";
$userID = 2226098;

$st = $conn->prepare("SELECT Event_ID FROM regisdetails WHERE User_ID=?");
$st->bind_param("i", $userID);
$st->execute();
$result = $st->get_result();
$events = array(); // Initialize an array to store Event_IDs

if ($result->num_rows != 0) {
    // Fetch each row and extract the 'Event_ID' value
    while ($row = $result->fetch_assoc()) {
        $events[] = $row['Event_ID'];
    }
}

$st->close();
$result->close();

$placeholders = implode(',', array_fill(0, count($events), '?'));

// Construct the second query with placeholders
$st = $conn->prepare("SELECT * FROM Announcements WHERE Event_ID IN ($placeholders)");

// Bind parameters for the second query
$types = str_repeat('s', count($events));
$st->bind_param($types, ...$events);

$st->execute();

$result = $st->get_result();

while ($row = $result->fetch_assoc()) {
    // Process each row
    print_r($row);
}

$st->close();

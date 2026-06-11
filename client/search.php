<?php
// Establish a database connection (you should replace the placeholder values with your actual database credentials)
$db_host = "localhost";
$db_user = "root";
$db_password = "";
$db_name = "webdev";

$conn = new mysqli($db_host, $db_user, $db_password, $db_name);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $search_query = $_POST["search_query"];

    // Perform a simple search on the Event_Name column
    $sql = "SELECT * FROM events WHERE Event_Name LIKE '%$search_query%'";
    $result = $conn->query($sql);

    echo '<table border="1">';
    echo '<tr><th>Event ID</th><th>Event Name</th><th>Event Tagline</th></tr>';

    while ($row = $result->fetch_assoc()) {
        echo '<tr>';
        echo '<td>' . $row['Event_ID'] . '</td>';
        echo '<td>' . $row['Event_Name'] . '</td>';
        echo '<td>' . $row['Event_Tagline'] . '</td>';
        echo '</tr>';
    }

    echo '</table>';
}

// Close the database connection
$conn->close();
?>
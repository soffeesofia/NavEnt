<?php
require("dbconnection.php");

if($_SERVER["REQUEST_METHOD"] == "POST") {
    $userFirstName = $_POST["fname"];
    $userLastName = $_POST["lname"];
    $password = $_POST["password"];
    $email = $_POST["email"];

    // Validate input (you should add more validation as needed)
    if (empty($userFirstName) || empty($userLastName) || empty($password) || empty($email)) {
        echo "All fields are required.";
    } else {
        // Insert user data into the database
        $sql = "INSERT INTO accounts (fname, lname, password, email) VALUES ('$fname', '$lname', '$password', '$email')";

        if ($conn->query($sql) === TRUE) {
            echo "Registration successful!";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }
}

// Close the database connection
$conn->close();
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
                <form action="php/.." method="POST">
                    <label for="role">Signup as</label>
                    <select id="role" name="role">
                        <option value="student">Student</option>
                        <option value="guest">Guest</option>
                    </select>

                    <label for="fname">First Name:</label>
                    <input type="fname" id="fname" name="fname" required>

                    <label for="lname">Last Name:</label>
                    <input type="lname" id="lname" name="lname" required>

                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" required>

                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" required>

                    <label for="confirm_password">Confirm Password:</label>
                    <input type="password" id="confirm_password" name="confirm_password" required>

                    <button type="submit">Sign Up</button>
                </form>
            </div>
        </div>
    </div>
</body>
</html>

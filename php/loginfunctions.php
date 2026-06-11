<?php

function emptyInputLogin($username, $password) {
    if (empty($username) || empty($password)) {
        $result = "true";
    }
    return $result;
}

function userNotFound($conn, $username) {
    $sql = "SELECT * FROM ACCOUNTS WHERE User_ID=?;";
    $stmnt = mysqli_stmt_init($conn);
    mysqli_stmt_prepare($stmnt, $sql);
    if (!mysqli_stmt_prepare($stmnt, $sql)){
        header("Location: ../login.php?error=SQLStmntFailure");
        exit();
    }

    mysqli_stmt_bind_param($stmnt,"ss", $username);
    mysqli_stmt_execute($stmnt);

    $accData = mysqli_stmt_get_result($stmnt);
    if ($row = mysqli_fetch_assoc($accData)){
        return $row;
    } else {
        $result = false;
        return $result;
    }

    mysqli_stmt_close($stmnt);
}

?>
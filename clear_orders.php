<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "order_management";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("連接失敗: " . $conn->connect_error);
}

// 刪除所有訂單
$sql = "TRUNCATE TABLE orders";
if ($conn->query($sql) === TRUE) {
    echo "所有訂單已成功刪除。";
} else {
    echo "刪除訂單時發生錯誤: " . $conn->error;
}

$conn->close();
?>

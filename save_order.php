<?php
// 建立 MySQL 連接
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "order_management";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  die("連接失敗: " . $conn->connect_error);
} else {
  echo "連接成功！";
}

// 接收從主頁面送出的訂單資料
if (isset($_POST["data"])) {
  $jsonData = $_POST["data"];
  $orderData = json_decode($jsonData, true);

  $items = json_encode($orderData["items"]);
  $total = $orderData["total"];

  // 使用 prepared statement 防止 SQL 注入攻擊
  $stmt = $conn->prepare("INSERT INTO orders (date, serial, items, total) VALUES (?, ?, ?, ?)");
  $stmt->bind_param("ssss", $date, $serial, $items, $total);

  // 設定日期和序號
  $date = date("Y-m-d");
  $serial = generateSerial();

  // 執行 prepared statement
  if ($stmt->execute()) {
    echo "訂單已成功儲存到資料庫！";
  } else {
    echo "儲存訂單時發生錯誤：" . $stmt->error;
  }

  // 關閉 prepared statement 和資料庫連接
  $stmt->close();
  $conn->close();
} else {
  echo "無法接收訂單資料。";
}

// 生成序號的函式
function generateSerial() {
  // 自行實現生成序號的邏輯
}
?>

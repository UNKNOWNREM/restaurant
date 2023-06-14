<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>歷史訂單</title>
  <link rel="stylesheet" href="history.css">
</head>
<body>
  <header>
    <div class="top-buttons">
      <button class="clear-button">清除所有訂單</button>
      <a href="index.html"><button class="back-button">返回主頁面</button></a>
    </div>
  </header>
  <main>  
    <div class="container">
      <h1 class="title">歷史訂單</h1>
      <table class="order-history">
        <thead>
          <tr>
            <th>日期</th>
            <th>序號</th>
            <th>小項目的名稱和數量</th>
            <th>訂單金額</th>
          </tr>
        </thead>
        <tbody>
          <?php
            // 從資料庫中取出歷史訂單資料並顯示在表格中
            $servername = "localhost";
            $username = "root";
            $password = "";
            $dbname = "order_management";

            $conn = new mysqli($servername, $username, $password, $dbname);

            // 檢查連接是否成功
              if ($conn->connect_error) {
                die("連接失敗: " . $conn->connect_error);
              }
              
              // 連接成功的處理程式碼
              echo "資料庫連接成功";

            $sql = "SELECT * FROM orders";
            $result = $conn->query($sql);

            if ($result->num_rows > 0) {
              while ($row = $result->fetch_assoc()) {
                $items = json_decode($row["items"], true);
                $itemList = "";

                foreach ($items as $item) {
                  $itemName = $item["name"];
                  $itemQuantity = $item["quantity"];
                  $itemList .= "$itemName x$itemQuantity, ";
                }

                $itemList = rtrim($itemList, ", ");

                echo "<tr>";
                echo "<td>" . $row["date"] . "</td>";
                echo "<td>" . $row["serial"] . "</td>";
                echo "<td>" . $itemList . "</td>";
                echo "<td>$" . $row["total"] . "</td>";
                echo "</tr>";
              }
            } else {
              echo "<tr><td colspan='4'>目前沒有歷史訂單。</td></tr>";
            }

            $conn->close();
          ?>
        </tbody>
      </table>
    </div>
  </main>

  <script src="history.js"></script>
</body>
</html>

window.addEventListener("load", function() {
  var orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.forEach(function(orderData, index) {
    var date = orderData.date;
    var serial = orderData.serial;
    var items = orderData.items;
    var total = orderData.total;
    saveOrderToHistory(date, serial, items, total);
  });
});

function saveOrderToHistory(date, serial, items, total) {
  var orderHistoryTable = document.querySelector(".order-history tbody");

  // 創建新的一列
  var row = document.createElement("tr");

  // 日期
  var dateCell = document.createElement("td");
  dateCell.innerText = date;
  row.appendChild(dateCell);

  // 序號
  var serialCell = document.createElement("td");
  serialCell.innerText = serial;
  row.appendChild(serialCell);

  // 小項目的名稱和數量
  var itemsCell = document.createElement("td");
  itemsCell.innerText = items;
  row.appendChild(itemsCell);

  // 訂單金額
  var totalCell = document.createElement("td");
  totalCell.innerText = "$" + total;
  row.appendChild(totalCell);

  // 將新的一列添加到表格中
  orderHistoryTable.appendChild(row);
}

function getDate() {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  return year + "-" + month + "-" + day;
}

function getSerial() {
  var orders = JSON.parse(localStorage.getItem("orders")) || [];
  return orders.length + 1;
}

// 清除所有訂單按鈕的點擊事件
document.addEventListener("DOMContentLoaded", function() {
  var clearAllButton = document.querySelector(".clear-button");
  clearAllButton.addEventListener("click", clearAllOrders);

  function clearAllOrders() {
    var orderHistoryTable = document.querySelector(".order-history tbody");
    orderHistoryTable.innerHTML = "";

    // 清除本地存儲中的訂單資料
    localStorage.removeItem("orders");

    // 向清除訂單的 PHP 檔案發送請求
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "clear_orders.php", true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        console.log(xhr.responseText);
      }
    };
    xhr.send();
  }

  // 返回主頁面按鈕的點擊事件
  var backButton = document.querySelector(".back-button");
  backButton.addEventListener("click", navigateToHomePage);

  function navigateToHomePage() {
    window.location.href = "index.html";
  }
});

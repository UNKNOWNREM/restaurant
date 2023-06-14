document.addEventListener("DOMContentLoaded", function() {
    var navigationItems = document.querySelectorAll(".navigation li");
  
    navigationItems.forEach(function(item) {
      item.addEventListener("click", function() {
        var fileName = item.getAttribute("data-file");
        var filePath = "menu/" + fileName;
  
        // 使用 AJAX 加載獨立的 HTML 檔案
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
              var menuContent = document.querySelector(".menu-content");
              menuContent.innerHTML = xhr.responseText;
            } else {
              console.error("Failed to load menu item: " + fileName);
            }
          }
        };
  
        xhr.open("GET", filePath, true);
        xhr.send();
      });
    });
});
  
///////////////////////////////////////////////////////////////
// 宣告一個空陣列來儲存選項
var selectedItems = [];

function handleConfirm(name, quantity, totalPrice) {
  console.log("名稱：" + name);
  console.log("數量：" + quantity);
  console.log("總價格：" + totalPrice);

  var orderItem = document.createElement("li");
  orderItem.innerText = name + " x" + quantity + " - $" + totalPrice;

  // 將訂單項目添加到訂單管理區域的項目清單中
  var orderList = document.querySelector(".order-list");
  orderList.appendChild(orderItem);

  // 計算所有訂單項目的總金額
  updateSubtotal();

  // 清除訂單按鈕的點擊事件
  var clearOrderButton = document.querySelector(".clear-button");
  clearOrderButton.addEventListener("click", function () {
    clearOrder();
    updateSubtotal();
  });

  // 刪除按鈕
  var deleteButton = document.createElement("button");
  deleteButton.innerText = "刪除";
  deleteButton.classList.add("delete-button");
  orderItem.appendChild(deleteButton);

  // 註冊刪除按鈕的點擊事件
  deleteButton.addEventListener("click", function () {
    orderItem.remove();
    updateSubtotal();
  });
}

function clearOrder() {
  // 移除所有訂單項目
  var orderList = document.querySelector(".order-list");
  orderList.innerHTML = "";
}

function updateSubtotal() {
  // 計算所有訂單項目的總金額
  var orderItems = document.querySelectorAll(".order-list li");
  var subtotal = 0;

  orderItems.forEach(function (item) {
    var itemPrice = parseInt(item.innerText.split("- $")[1]);
    subtotal += itemPrice;
  });

  // 更新試算金額
  var subtotalElement = document.querySelector(".subtotal");
  subtotalElement.innerText = "試算金額: $" + subtotal;
}

function getOrderItems() {
  var orderItems = [];
  var orderList = document.querySelector(".order-list");
  var orderListItems = orderList.querySelectorAll("li");
  orderListItems.forEach(function(item) {
    var itemText = item.innerText;
    var itemName = itemText.split(" x")[0];
    var itemQuantity = parseInt(itemText.split(" x")[1].split(" -")[0]);
    orderItems.push({ name: itemName, quantity: itemQuantity });
  });
  return orderItems;
}

function calculateTotal() {
  var orderItems = document.querySelectorAll(".order-list li");
  var total = 0;
  orderItems.forEach(function(item) {
    var itemPrice = parseInt(item.innerText.split("- $")[1]);
    total += itemPrice;
  });
  return total;
}


/////////////////////////////////////////////////////////////////

function showQuantitySelection(item) {
  var price = parseInt(item.getAttribute("data-price"));
  var name = item.querySelector(".item-details h2").innerText;

  // 創建數量選擇彈出視窗
  var quantityPopup = document.createElement("div");
  quantityPopup.classList.add("quantity-popup");

  // 數量減少按鈕
  var decreaseButton = document.createElement("button");
  decreaseButton.innerText = "-";
  decreaseButton.classList.add("quantity-button", "decrease");
  quantityPopup.appendChild(decreaseButton);

  // 數量顯示
  var quantityDisplay = document.createElement("span");
  quantityDisplay.classList.add("quantity-display");
  quantityDisplay.innerText = "1";
  quantityPopup.appendChild(quantityDisplay);

  // 數量增加按鈕
  var increaseButton = document.createElement("button");
  increaseButton.innerText = "+";
  increaseButton.classList.add("quantity-button", "increase");
  quantityPopup.appendChild(increaseButton);

  // 確認按鈕
  var confirmButton = document.createElement("button");
  confirmButton.innerText = "確認";
  confirmButton.classList.add("confirm-button");
  quantityPopup.appendChild(confirmButton);

  // 註冊數量增加和減少按鈕的點擊事件
  decreaseButton.addEventListener("click", decreaseQuantity);
  increaseButton.addEventListener("click", increaseQuantity);

  // 註冊確認按鈕的點擊事件
  confirmButton.addEventListener("click", function () {
    var quantity = parseInt(quantityDisplay.innerText);
    var totalPrice = price * quantity;

    // 執行相應的處理函數，例如更新總價格等
    handleConfirm(name, quantity, totalPrice);

    // 從菜單欄位中移除數量選擇彈出視窗
    quantityPopup.remove();
  });

  // 將數量選擇彈出視窗添加到菜單欄位中
  var menuContent = document.querySelector(".menu-content");
  menuContent.innerHTML = "";
  menuContent.appendChild(quantityPopup);

  event.stopPropagation();
}

function decreaseQuantity() {
  var quantityDisplay = document.querySelector(".quantity-display");
  var quantity = parseInt(quantityDisplay.innerText);

  if (quantity > 1) {
    quantity--;
    quantityDisplay.innerText = quantity;
  }
}

function increaseQuantity() {
  var quantityDisplay = document.querySelector(".quantity-display");
  var quantity = parseInt(quantityDisplay.innerText);
  quantity++;
  quantityDisplay.innerText = quantity;
}

////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function() {
  // 結帳按鈕的點擊事件
  var checkoutButton = document.querySelector(".checkout-button");
  checkoutButton.addEventListener("click", checkout);

  function checkout() {
    var orderList = document.querySelector(".order-list");
    var orderItems = orderList.querySelectorAll("li");

    if (orderItems.length > 0) {
      // 儲存訂單到歷史清單
      saveOrderToDatabase();

      // 清除訂單
      clearOrder();

      // 跳轉到歷史清單頁面
      window.location.href = "history/history.php";
    }
  }

  function saveOrderToDatabase() {
    // 將訂單資料傳送到後端 PHP 檔案
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "save_order.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        console.log(xhr.responseText);
      }
    };

    var orderItems = getOrderItems();
    var totalPrice = calculateTotal();

    // 將訂單資料轉換成 JSON 字串
    var orderData = {
      items: orderItems,
      total: totalPrice
    };
    var jsonData = JSON.stringify(orderData);

    // 將訂單資料作為參數傳遞到 PHP 檔案
    var params = "data=" + encodeURIComponent(jsonData);
    xhr.send(params);
  }

  // 其他函式...

});


var order;
var receiptElement = $('#eo-receipt');
$.get('http://localhost:3000/order', function(response) {
  order = response;
  console.log(response);
  createReceipt(order);
});

// Helper Functions
function createReceipt(order) {
  var receiptBuyer;
  if(order.delivery) {
    receiptBuyer =   `
  <div class="receipt-buyer">
    <h3> Buyer Information </h3>
    <p> We will be delivery your food within 40 minutes at this address: <span> ${order.address} </span> </p>
    <p> Payment information: <span> Using creditcard number ${order.card} <span> </p>
    <p> We will call this phone number upon arrival: <span> ${order.phone} </span> </p>
  </div>`;
  } else {
    receiptBuyer =  `
  <div class="receipt-buyer">
    <h3> Buyer Information </h3>
      <p> Your order will be available for pickup and payment at 555 Some Place, Irvine within 20 minutes! </p>
      <p> We will be using this phone number to call you: <span> ${order.phone} <span> </p>
  </div>`;
  }

  var receiptItems = `<div class="receipt-items">
    <h3> Items Ordered <h3>`;
  for (var i in order.cart.items) {
    var cItem = order.cart.items[i];
    receiptItems += `<p>${cItem.item.name} x${cItem.qty} => ${cItem.qty * cItem.item.price}</p>`;
  }
  receiptItems += `</div>`

  var receiptTotals = `<div class="receipt-totals">
    <p>Subtotal $${order.cart.totalCost}</p>
    <p>Sales Tax $${order.cost.tax}</p>
    <p>Delivery $${order.cost.delivery}</p>
    <p><em>Grand Total: $${order.cost.final}<em></p>
  </div>`;

  var complete = receiptBuyer + receiptItems + receiptTotals;
  receiptElement.before(complete);
}

//!! NOT NECESSARY BUT USEFUL TO DEBUG TO MAKE SURE CART HAS BEEN EMPTIED
//Update cart header
//Cart Button Increment w/ event delegation
var cartBtn = document.querySelector('#cart-btn');
var totalamt = document.querySelector("#total-cost");
var totalCount = 0;
var totalCost = 0;

$.get("http://localhost:3000/cart", function(response) {
  totalCount = response.totalQty;
  totalCost = response.totalCost;
  cartBtn.innerHTML = "Cart(" + totalCount + " Items)";
  totalamt.innerHTML = "$" + totalCost;
});

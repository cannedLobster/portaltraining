//Update cart header
//Cart Button Increment w/ event delegation
var cartBtn = document.querySelector('#cart-btn');
var totalamt = document.querySelector("#total-cost");
var subTotal = document.querySelector('#sub-amt');
var tax = document.querySelector('#salestax-amt');
var delivery = document.querySelector('#delivery-amt');
var finalTotal = document.querySelector('#final-totalamt');
var totalCount = 0;
var totalCost = 0;
var salestax = 1;
var deliveryFee = 0;
var cart;

$.get("http://localhost:3000/cart", function(response) {
  totalCount = response.totalQty;
  totalCost = response.totalCost;
  cartBtn.innerHTML = "Cart(" + totalCount + " Items)";
  totalamt.innerHTML = "$" + totalCost;
  subTotal.innerHTML = "$" + totalCost;
  tax.innerHTML = "$" + salestax;
  delivery.innerHTML = "$" + deliveryFee;
  finalTotal.innerHTML = "$" + parseInt(totalCost + salestax + deliveryFee);
  cart = response;
});

//On Pickup submit
$('#pickup-form').on('submit', function(event) {
  var cartId;
  event.preventDefault();
  $.ajax({
    type: 'POST',
    url: 'http://localhost:3000/order',
    data: {
      cart,
      phone: $('#pickup-phone').val(),
      delivery: false,
      cost: {
        delivery: deliveryFee,
        tax: salestax,
        final: parseInt(totalCost + salestax + deliveryFee)
      }
    },
    success: function(response) {
      cartId = response.userId;
      $.ajax({
        type: 'DELETE',
        url: 'http://localhost:3000/cart/' + cartId,
        success: function(res) {
          alert('Order Placed!');
          document.location.href = '/receiptpage';
        }
      });
    }
  });
});

//On Delivery submit
$('#delivery-form').on('submit', function(event) {
  var cartId;
  event.preventDefault();
  $.ajax({
    type: 'POST',
    url: 'http://localhost:3000/order',
    data: {
      cart,
      phone: $('#delivery-phone').val(),
      delivery: true,
      address: $('#delivery-addr').val(),
      card: $('#delivery-card').val(),
      cost: {
        delivery: deliveryFee,
        tax: salestax,
        final: parseInt(totalCost + salestax + deliveryFee)
      }
    },
    success: function(response) {
      cartId = response.userId;
      $.ajax({
        type: 'DELETE',
        url: 'http://localhost:3000/cart/' + cartId,
        success: function(res) {
          alert('Order Placed!');
          document.location.href = '/receiptpage';
        }
      });
    }
  });
});

$('#delivery-switch').change(function() {
  if(this.checked){
    deliveryFee = 10;
    delivery.innerHTML = "$" + deliveryFee;
    finalTotal.innerHTML = "$" + parseInt(totalCost + salestax + deliveryFee);
  } else {
    deliveryFee = 0;
    delivery.innerHTML = "$" + deliveryFee;
    finalTotal.innerHTML = "$" + parseInt(totalCost + salestax + deliveryFee);
  }
});

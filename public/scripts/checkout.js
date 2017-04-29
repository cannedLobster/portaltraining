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

update();

$('.information').on('click', '#coupon-submit', function(event) {
  event.preventDefault();
  let code = $('#code').val();
  $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/coupon/use/'+code,
      success: function(response) {
          cart.coupon = true;
          cart.couponObj = response;
          if (response.type == 'flat') {
            cart.deductedTotal = cart.totalCost > response.val ? cart.totalCost - response.val : 0;
          } else if (response.type == 'percent') {
            cart.deductedTotal = cart.totalCost * (response.val / 100);
          } else {
            cart.deductedTotal = cart.totalQty > 1 ? bogoCalc(cart.items, cart.totalCost) : cart.totalCost;
          }
          $.ajax({
            url: 'http://localhost:3000/cart',
            type: 'POST',
            data: cart,
            success: function(response) {
              update();
            }
          });
      },
      statusCode: {
          401: function(err) {alert(err.responseJSON.error);},
      }
  });
});

function bogoCalc(items, tot) {
  var min = Number.MAX_SAFE_INTEGER;
  for (var i in items) {
    if (items[i].item.price < min) {
      min = items[i].item.price;
    }
  }
  return tot-min;
}

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
        final: parseFloat(totalCost + salestax + deliveryFee),
        saved: cart.coupon ? cart.totalCost - cart.deductedTotal : 0
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
        final: parseFloat(totalCost + salestax + deliveryFee),
        saved: cart.coupon ? cart.totalCost - cart.deductedTotal : 0
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

$('.information').on('click', '#coupon-remove', function(event) {
  cart.couponObj = null;
  cart.coupon = false;
  cart.deductedTotal = 0;
  $.post('http://localhost:3000/cart/', cart, function(response) {
    update();
  });
});

//HELPER Functions
function removeCoupons() {
  $('#coupon-form').remove();
  $('#coupon-remove').remove();
}
function update() {
  $.get("http://localhost:3000/cart", function(response) {
    var total = response.coupon ? response.deductedTotal : response.totalCost;
    totalCount = response.totalQty;
    totalCost = total;
    cartBtn.innerHTML = "Cart(" + totalCount + " Items)";
    totalamt.innerHTML = "$" + totalCost;
    subTotal.innerHTML = "$" + totalCost;
    tax.innerHTML = "$" + salestax;
    delivery.innerHTML = "$" + deliveryFee;
    finalTotal.innerHTML = "$" + parseFloat(totalCost + salestax + deliveryFee);
    cart = response;
    if (response.coupon === null || !response.coupon) {
      removeCoupons();
      $('.checkout .information').append(`<form id='coupon-form'>
      <input id='code' type='text' placeholder='Coupon Code'>
      <button id='coupon-submit' type='submit'>Apply Coupon</button>
      </form>`);
    } else {
      removeCoupons();
      $('.checkout .information').append(`<button type='submit' id='coupon-remove'>Remove Coupon</button>`);
    }
  });
}

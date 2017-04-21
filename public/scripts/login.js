//Registration submit
$('#register-form').on('submit', function(event) {
    event.preventDefault();
    if ($('#reg-pass').val() != $('#reg-repass').val()) {
        alert('Different passwords inputted in fields!');
    } else {
        $.get('http://localhost:3000/cart', function(cart) {
            var guestID = cart.userId;
            $.ajax({
                type: 'POST',
                url: 'http://localhost:3000/user',
                data: {
                    name: $('#reg-name').val(),
                    user: $('#reg-user').val(),
                    email: $('#reg-email').val(),
                    pass: $('#reg-pass').val()
                },
                success: function(response) {
                    if (!response.success) {
                        alert('User already exists. Please try again.');
                    } else {
                        if (cart.items.length) {
                            $.post('http://localhost:3000/cart',{items: cart.items}, function(updatedCart) {
                              $.ajax({url: 'http://localhost:3000/cart/' + guestID, type: 'DELETE',
                                success: function(deletion) {document.location.href = '/';}});
                            });
                        } else {
                            document.location.href = '/';
                        }
                    }
                }
            });
        });
    }
});
// Login submit
$('#login-form').on('submit', function(event) {
  event.preventDefault();
  $.get('http://localhost:3000/cart', function(cart) {
    var guestID = cart.userId;
    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/user/login',
      data: {
          user: $('#log-user').val(),
          pass: $('#log-pass').val()
      },
      success: function(response) {
        if (cart.items.length) {
            $.post('http://localhost:3000/cart',{items: cart.items}, function(updatedCart) {
              $.ajax({url: 'http://localhost:3000/cart/' + guestID, type: 'DELETE',
                success: function(deletion) {document.location.href = '/';}});
            });
        } else {
            document.location.href = '/';
        }
      },
      statusCode: {
          401: function() {
              alert('Invalid Login.');
          }
      }
    });
  });
});

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
//Helper Functions

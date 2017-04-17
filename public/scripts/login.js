//Registration submit
$('#register-form').on('submit', function(event) {
  event.preventDefault();
  if ($('#reg-pass').val() != $('#reg-repass').val()) {
    event.preventDefault();
    alert('Different passwords inputted in fields!');
 }
 else {
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
       if (!response.length) {
         alert('User already exists. Please try again.');
       } else {
         document.location.href = '/';
       }
     }
   });
 }
});
// Login submit
$('#login-form').on('submit', function(event) {
  event.preventDefault();
  $.ajax({
    type: 'POST',
    url: 'http://localhost:3000/user/login',
    data: {
      user: $('#log-user').val(),
      pass: $('#log-pass').val()
    },
    success: function(response) {document.location.href = '/';},
    statusCode: {401: function() {alert('Invalid Login.');}}
  });
});

//Update cart header
var cartBtn = document.querySelector('#cart-btn');
var totalamt = document.querySelector("#total-cost");
var totalCount = 0;
var totalCost = 0;
$.get("http://localhost:3000/cart", function(response) {
  for (var i in response) {
    totalCount += response[i].qty;
    totalCost += (response[i].qty * response[i].price)
  }
  cartBtn.innerHTML = "Cart(" + totalCount + " Items)";
  totalamt.innerHTML = "$" + totalCost;
});
//Helper Functions

//Registration submit
$('#register-form').on('submit', function(event) {
  if ($('#reg-pass').val() != $('#reg-repass').val()) {
    event.preventDefault();
   alert('Different password inputted in fields!');
 }
 else {
   var fullname = $('#reg-name').val();
   var username = $('#reg-user').val();
   var emailaddr = $('#reg-email').val();
   var password = $('#reg-pass').val();
   $.post('http://localhost:3000/user', {
     name: fullname,
     user: username,
     email: emailaddr,
     pass: password
   }, function(response) {
     document.location.href = './index.html';
   });
 }
});

$('#login-form').on('submit', function(event) {
  var username = $('#log-name').val();
  var password = $('#log-pass').val();
  $.get('http//localhost:3000/user', {
    user: username, pass: password
  }, function(response) {

  });
});

//Helper Functions

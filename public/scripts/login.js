$('#register-submit').on('click', function(event) {
  //TODO Verify for password re-enter
  if (true) {
    console.log("CLICK!");
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
  } else {}
});

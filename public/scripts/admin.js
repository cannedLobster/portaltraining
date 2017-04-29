
$.get('http://localhost:3000/coupon/', function(response) {
  for (var i in response) {
    var status;
    if(response[i].active) status = 'Active';
    else status = 'Inactive';
    $('#coupon-table')
      .append(createCouponElement(response[i].name, status, response[i]._id, response[i].uses));
  }
});

$('#coupon-form').on('click', function(event) {
  event.preventDefault();
  var e  = document.getElementById('coupon-type');
  var type = e.options[e.selectedIndex].value;
  $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/coupon',
      data: {
          name: $('#coupon-name').val(),
          code: $('#coupon-code').val().toLowerCase(),
          type,
          uses: $('#coupon-use').val(),
          active: true,
          val: type === 'bogo' ? 0 : parseInt($('#coupon-val').val())
      },
      success: function(response) {
          alert('Coupon Created!');
          document.location.href = './adminpage';
      },
      error: function(err) {console.log(err);}
  });
});

$('#coupon-table').on('click', 'tr td button.coupon-remove-btn', function(event) {
  var coupon_id = $(this).attr('data-id');
  console.log("CLICKED");
  $.post('http://localhost:3000/coupon/disable/'+coupon_id, function(response) {
    if(response.success) document.location.href = './adminpage';
    else alert('ERROR');
  });
});
$('#coupon-type').on('change', function(event) {
  if($(this).val() === 'percent') {
    removeValue();
    addValue(0);
  } else if ($(this).val() === 'flat') {
    removeValue();
    addValue(1);
  } else {removeValue();}
});


function createCouponElement(name, status, id, uses) {
  var item_element = `
  <tr>
    <td>
      <p class='couponname'>${name}</p>
      <p class='couponactive'>Status: ${status}</p>
      <p>Uses: ${uses}</p>
    </td>
    <td>
      <button class="coupon-remove-btn" data-id="${id}">Disable</button>
    <td>
  </tr>
  `;
  return item_element;
}
var percent_element = `<label id='label-val' for="coupon-val">Value: </label><input type='number' min='1', max='100' value='1' id='coupon-val'>`
var flat_element = `<label id='label-val' for="coupon-val">Value:</label><input type='number' id='coupon-val' value='10'>`
function addValue(type) {
  // 0 for per 1 for flat
  if (type === 0) {
    $('#coupon-use').after(percent_element);
  } else {
    $('#coupon-use').after(flat_element);
  }
}
function removeValue() {
  $('#label-val').remove();
  $('#coupon-val').remove();
}

/*Inputting "Server" sent cart items*/

var cart_arr = [];
$.get("http://thiman.me:1337/cart/sunny", function(response) {
  for (var i in response) {
    cart_arr.push(response[i]);
    generateCart(response[i]);
  }
  updateCosts();
});
//Update Costs
$(".cart table").on("change", "tr td input.cart-quantity", function(event) {
    var total = parseInt(this.value)
      * retrievePrice(this.parentElement.parentElement.querySelector("tr td p.cart-price").innerHTML);
    this.parentElement.parentElement.querySelector("p.item-total").innerHTML = "$"+total;
    updateCosts();
});
//Update removal
$(".cart table").on("click", "tr td button.cart-remove-btn", function(event) {
    var name = this.parentElement.querySelector("h3.item-name").innerHTML;
    var index = getCartIndex(name);
    cart_arr[index].quantity = 0;
    var item = $(this).parent().parent();
    item.next().remove(); //Remove line
    item.remove();
    updateCosts();
});

// var table_ele = document.querySelector("body div.cart table tbody");
// var eoc = document.querySelector("body div.cart table tr.endofcart"); // End of Cart to add before

// for (var i = 0; i < cart_arr.length; i++) {
//     if (cart_arr[i].quantity != 0) {
//         addLine();
//         var row = addtablerow();
//         var data1 = addClass(row, "td", "");
//         //Add Item name
//         var atag = addClass(data1, "a", "");
//         atag.href = "./index.html";
//         var title = addClass(atag, "h3", "item-name");
//         title.innerHTML = cart_arr[i].name;
//         //Add item price
//         var price = addClass(data1, "p", "cart-price");
//         price.innerHTML = "$" + cart_arr[i].price;
//         //Add remove button
//         var removebtn = addClass(data1, "button", "cart-remove-btn");
//         removebtn.innerHTML = "REMOVE";
//         //New table column
//         var data2 = addClass(row, "td", "");
//         var quantity = addClass(data2, "input", "cart-quantity");
//         quantity.type = "number";
//         quantity.value = cart_arr[i].quantity;
//         quantity.min = 1;
//         quantity.max = 1000;
//         //New table column
//         var data3 = addClass(row, "td", "");
//         //Adding total
//         var tot = addClass(data3, "p", "item-total");
//         tot.innerHTML = "$" + cart_arr[i].price*cart_arr[i].quantity;
//     }
// }

//Helper Functions
function generateCart(item) {
  if (item.quantity != 0)
    $("body div.cart table tr.endofcart").before(createCartElement(item));
}
function createCartElement(item) {
  var total = parseInt(item.price) * parseInt(item.quantity);
  var item_element = `
  <tr>
    <td>
      <a href="./index.html"><h3 class="item-name">${item.name}</h3></a>
      <p class="cart-price">\$${item.price}</p>
        <button class="cart-remove-btn">REMOVE</button>
    </td>
    <td>
      <input type='number' value='${item.quantity}' class="cart-quantity" min="1" max="1000">
    </td>
    <td>
      <p class="item-total">\$${total}</p>
    </td>
  </tr>
  <tr>
    <td colspan="3"><hr></td>
  </tr>`;
  return item_element;
}
function getCartIndex(name) {
  for (var i = 0; i < cart_arr.length; i++) {
    if (cart_arr[i].name == name)
      return i;
  }
  return NaN;
}
function addLine() {
  var row = document.createElement('tr');
  table_ele.insertBefore(row,table_ele.firstChild);
  var data = document.createElement('td');
  data.colSpan = "3";
  row.appendChild(data);
  var line = document.createElement('hr');
  data.appendChild(line);
}
function addtablerow(){
  var row = document.createElement('tr');
  table_ele.insertBefore(row, table_ele.firstChild);
  return row;
}
function addClass(base, elename, classname) {
    var ele = document.createElement(elename);
    ele.className = classname;
    base.appendChild(ele);
    return ele;
}
function retrievePrice(s) {
    var p = s.substring(1, s.length);
    return parseInt(p);
}
function updateCosts() {
  var subtot_amt = 0;
  var salestax = 1;
  var total = 0;
  document.querySelectorAll(".item-total").forEach(
    function(obj) {
      subtot_amt += retrievePrice(obj.innerHTML);
    }
  );
  document.querySelector("#cart-subtotal").innerHTML = "$" + subtot_amt;
  total = subtot_amt + salestax;
  document.querySelector("#cart-total").innerHTML = "$" + total;
}

/*Inputting "Server" sent cart items*/

var item1 = {
    img: './images/plainburger.jpg',
    name: 'Plain burger',
    price: 4,
    id: 0,
    quantity: 3
}
var item2 = {
    img: './images/chickenburger.jpg',
    name: 'Chicken Burger',
    price: 5,
    id: 1,
    quantity: 0
}
var item3 = {
    img: './images/cheeseburger.jpg',
    name: 'Quarter-Pounder With Cheese',
    price: 6,
    id: 2,
    quantity: 4
}
var item4 = {
    img: './images/cheeseburger.jpg',
    name: 'Royal With Cheese',
    price: 7,
    id: 3,
    quantity: 0
}
var item5 = {
    img: './images/drink.jpg',
    name: 'Drink',
    price: 1,
    id: 4,
    quantity: 5
}
var item6 = {
    img: './images/fries.jpg',
    name: 'Fries',
    price: 2,
    id: 5,
    quantity: 5
}
var cart_arr = [item1, item2, item3, item4, item5, item6];

var table_ele = document.querySelector("body div.cart table tbody");
var eoc = document.querySelector("body div.cart table tr.endofcart"); // End of Cart to add before

for (var i = 0; i < cart_arr.length; i++) {
    if (cart_arr[i].quantity != 0) {
        addLine();
        var row = addtablerow();
        var data1 = addClass(row, "td", "");
        //Add Item name
        var atag = addClass(data1, "a", "");
        atag.href = "./index.html";
        var title = addClass(atag, "h3", "item-name");
        title.innerHTML = cart_arr[i].name;
        //Add item price
        var price = addClass(data1, "p", "cart-price");
        price.innerHTML = "$" + cart_arr[i].price;
        //Add remove button
        var removebtn = addClass(data1, "button", "cart-remove-btn");
        removebtn.innerHTML = "REMOVE";
        //New table column
        var data2 = addClass(row, "td", "");
        var quantity = addClass(data2, "input", "cart-quantity");
        quantity.type = "number";
        quantity.value = cart_arr[i].quantity;
        quantity.min = 1;
        quantity.max = 1000;
        //New table column
        var data3 = addClass(row, "td", "");
        //Adding total
        var tot = addClass(data3, "p", "item-total");
        tot.innerHTML = "$" + cart_arr[i].price*cart_arr[i].quantity;
    }
}
updateCosts();

//Helper Functions
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

/*Local cart data*/
var local_cart_arr = [
  { name: "Fries",
    price: 2,
    img: "./images/fries.jpg",
    desc: "Quality fresh potatos served to order! Lightly seasoned with salt.",
    quantity: 3},
  { name: "Drink",
    price: 1,
    img: "./images/drink.jpg",
    desc: "Cool drink of your choice. Best on a hot day!",
    quantity: 3},
  { name: "Plain burger",
    price: 4,
    img: "./images/plainburger.jpg",
    desc: "The plain burger. Simple satisfaction guaranteed.",
    quantity: 2},
  { name: "Chicken Burger",
    price: 5,
    img: "./images/chickenburger.jpg",
    desc: "Made from the free range chickens from Arkansas. Absolutely astounding taste.",
    quantity: 1},
  { name: "Quarter-Pounder With Cheese",
    price: 6,
    img: "./images/cheeseburger.jpg",
    desc: "The most famous cheeseburger made with the best beef and the freshest cheese available just for you.",
    quantity: 0},
  { name: "Royale With Cheese",
    price: 7,
    img: "./images/cheeseburger.jpg",
    desc: "The more \"premium\" french version of the quarter-pounder with cheese.",
    quantity: 1}
];
/*Inputting "Server" sent cart items*/
// clearServerThruAJAX();
var cart_arr = [];
$.get("http://thiman.me:1337/cart/sunny", function(response) {
  for (var i in response) {
    cart_arr.push(response[i]);
  }
  if (cart_arr.length == 0) {
    for (var i = 0; i < local_cart_arr.length; i++) {
      $.post("http://thiman.me:1337/cart/sunny",
      local_cart_arr[i],
    function(data, status) {
      //console.log("Data: " + data + "\nStatus: " + status);
    });
    }
    $.get("http://thiman.me:1337/menu/sunny", function(response) {
      for (var i in response) {
        cart_arr.push(response[i]);
      }
      generateCart(menu_arr);
    });
  } else {
    generateCart(cart_arr);
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


//Helper Functions
function generateCart(arr) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].quantity != 0)
      $("body div.cart table tr.endofcart").before(createCartElement(arr[i]));
  }
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
function clearServerThruAJAX() {
  $.get("http://thiman.me:1337/menu/sunny", function(response) {
    for (var i in response) {
      $.ajax({
        url: "http://thiman.me:1337/menu/sunny/" + response[i]._id,
        type: "DELETE",
        async: false
      });
    }
  });
}
/*Old HTML generator*/
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

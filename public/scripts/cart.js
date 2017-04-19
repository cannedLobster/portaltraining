//Update cart header
var cartBtn = document.querySelector('#cart-btn');
var totalamt = document.querySelector("#total-cost");
var totalCount = 0;
var totalCost = 0;
/*Inputting "Server" sent cart items*/
var cart = {
    items: []
};
var cartItemMap = {};
$.get("http://localhost:3000/cart", function(response) {
    console.log(response);
    totalCount = response.totalQty;
    totalCost = response.totalCost;
    cartBtn.innerHTML = "Cart(" + totalCount + " Items)";
    totalamt.innerHTML = "$" + totalCost;
    // Populate local cart
    cart = response;
    for (var i = 0; i < cart.items.length; i++) {
        cartItemMap[cart.items[i].item._id] = i;
    }
    generateCart(cart.items);
    updateCosts();
});
//Update Costs
$(".cart table").on("change", "tr td input.cart-quantity", function(event) {
    var item_id = this.id.slice(2);
    var index = cartItemMap[item_id];
    cart.items[index].qty = parseInt(this.value);
    var item_total = cart.items[index].qty * cart.items[index].item.price;
    var body = {
        items: cart.items
    };
    var itemtotal_element = this.parentElement.parentElement.querySelector("p.item-total");
    $.post('http://localhost:3000/cart', body, function(response) {
        totalCount = response.totalQty;
        totalCost = response.totalCost;
        cartBtn.innerHTML = "Cart(" + totalCount + " Items)";
        totalamt.innerHTML = "$" + totalCost;
        updateCosts();
        itemtotal_element.innerHTML = "$" + item_total;
    });
});
//Update removal
$(".cart table").on("click", "tr td button.cart-remove-btn", function(event) {
  var item_id = this.id.slice(2);
  var index = cartItemMap[item_id];
  cart.items[index].qty = 0;
  var body = {
      items: cart.items
  };
  $.post('http://localhost:3000/cart', body, function(response) {
      document.location.href = '/cartpage';
  });
});


//Helper Functions
function generateCart(arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].qty != 0)
            $("body div.cart table tr.endofcart").before(createCartElement(arr[i].item, arr[i].qty));
    }
}
function createCartElement(item, qty) {
    var total = parseInt(item.price) * parseInt(qty);
    var item_element = `
  <tr>
    <td>
      <a href="./index.html"><h3 class="item-name">${item.name}</h3></a>
      <p class="cart-price">\$${item.price}</p>
        <button class="cart-remove-btn" id="r-${item._id}">REMOVE</button>
    </td>
    <td>
      <input type='number' id="c-${item._id}" value='${qty}' class="cart-quantity" min="1" max="1000">
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
function updateCosts() {
    var subtot_amt = cart.totalCost;
    var salestax = 1;
    var total = subtot_amt + salestax;
    document.querySelector("#cart-subtotal").innerHTML = "$" + subtot_amt;
    document.querySelector("#cart-total").innerHTML = "$" + total;
}
// function clearServerThruAJAX() {
//   $.get("http://thiman.me:1337/menu/sunny", function(response) {
//     for (var i in response) {
//       $.ajax({
//         url: "http://thiman.me:1337/menu/sunny/" + response[i]._id,
//         type: "DELETE",
//         async: false
//       });
//     }
//   });
// }
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
// function getCartIndex(name) {
//     for (var i = 0; i < cart_arr.length; i++) {
//         if (cart_arr[i].name == name)
//             return i;
//     }
//     return NaN;
// }
//
// function addLine() {
//     var row = document.createElement('tr');
//     table_ele.insertBefore(row, table_ele.firstChild);
//     var data = document.createElement('td');
//     data.colSpan = "3";
//     row.appendChild(data);
//     var line = document.createElement('hr');
//     data.appendChild(line);
// }
//
// function addtablerow() {
//     var row = document.createElement('tr');
//     table_ele.insertBefore(row, table_ele.firstChild);
//     return row;
// }
//
// function addClass(base, elename, classname) {
//     var ele = document.createElement(elename);
//     ele.className = classname;
//     base.appendChild(ele);
//     return ele;
// }
//
// function retrievePrice(s) {
//     var p = s.substring(1, s.length);
//     return parseInt(p);
// }

//Cart Button Increment w/ event delegation
var cartBtn = document.querySelector('#cart-btn');
var totalamt = document.querySelector("#total-cost");
var totalCount = 0;
var totalCost = 0;

var cart = {
  items: []
};
var cartItemMap = {};

$.get("http://localhost:3000/cart", function(response) {
  totalCount = response.totalQty;
  totalCost = response.totalCost;
  cartBtn.innerHTML = "Cart(" + totalCount + " Items)";
  totalamt.innerHTML = "$" + totalCost;
  // Populate local cart
  cart = response;
  for (var i = 0; i < cart.items.length; i++) {
    cartItemMap[cart.items[i].item._id] = i;
  }
});
$("div.menu").on("click", ".item .content button.addtocart-btn", function(event) {
  var menuIndex = $(this).attr('data-menu-index');
  var menuItem = menu_arr[menuIndex];
  if(cartItemMap[menuItem._id] === undefined) {
    cart.items.push({
      item: menuItem,
      qty: 1
    });
    cartItemMap[menuItem._id] = cart.items.length - 1;
  } else {
    var index = cartItemMap[menuItem._id];
    cart.items[index].qty += 1;
  }
  var body = {
    items: cart.items,
  };
  $.ajax({
    url: 'http://localhost:3000/cart',
    type: 'POST',
    data: body,
    success: function(response) {
      totalCount = response.totalQty;
      totalCost = response.totalCost;
      cartBtn.innerHTML = "Cart(" + totalCount + " Items)";
      totalamt.innerHTML = "$" + totalCost;
    }
  });
});

//Modal operation w/ event delegation
$("div.menu").on("click", ".item .content img.item-img", function(event) {
  var menuIndex = $(this).attr('data-menu-index');
  var menuItem = menu_arr[menuIndex];
  $("#menu_modal.modal").css("display", "block");
  $("#modal_title").html(menuItem.name);
  $("#modal_img").attr("src",menuItem.img);
  $("#modal_desc").html(menuItem.desc);
  $("#modal_price").html("Price: " + menuItem.price);
  // $("#menu_modal").attr("display", "visible");
});
$("#menu_modal").on("click", function(event) {
  $("#menu_modal").css("display", "none");
});

/*Posting menu onto server*/

/*Local cart data*/

/*Generating Menu through inputted Array from Server*/
var menu_arr = [];
$.get("http://localhost:3000/menu", function(response) {
  for (var i in response) {
    menu_arr.push(response[i]);
  }
    generateMenu(menu_arr);
});

// clearServerThruAJAX();


/*Helper Functions*/
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
/*Creating HTML from "Server Menu Array"*/
function generateMenu(menu) {
    var menu_ele = document.querySelector("body div.menu");
    for (var i = 0; i < menu.length; i++) {
        var item = addClass(menu_ele, 'div', 'item');
        var content = addClass(item, 'div', 'content');
        //Add Image
        var image = document.createElement('img');
        image.src = menu[i].img;
        image.className = 'item-img';
        image.setAttribute('data-menu-index', i);
        content.appendChild(image);
        //Add name
        var itemname = addClass(content, 'span', 'item-name');
        var name_txt = document.createTextNode(menu[i].name);
        itemname.appendChild(name_txt);
        //Add price
        var price = document.createElement('span');
        price.className = 'item-price';
        var price_txt = document.createTextNode('$' + menu[i].price);
        price.appendChild(price_txt);
        content.appendChild(price);
        //Add button
        var cartbutton = addClass(content, 'button', 'addtocart-btn');
        cartbutton.setAttribute('data-menu-index', i);
        cartbutton.innerHTML = 'Add to Cart'
        content.appendChild(cartbutton);
    }
}

//Cart Button Increment w/ event delegation
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
$("div.menu").on("click", ".item .content button.addtocart-btn", function(event) {
  totalCount++; // Increment quantity
  totalCost += retrievePrice(this.parentElement.querySelector(".item-price").innerHTML);
  cartBtn.innerHTML = "Cart(" + totalCount + " Items)";
  totalamt.innerHTML = "$" + totalCost;
  // var item_name = this.parentElement.querySelector(".item-name").innerHTML;
  var menuID = this.id;
  $.get("http://localhost:3000/cart", function(response) {
    var current_quantity;
    var item_id;
    for (var i in response) {
      if (response[i].menu_id == menuID) {
        // current_quantity = response[i].quantity;
        item_id = response[i]._id;
        break;
      }
    }
    $.ajax({
      url: "http://localhost:3000/cart/" + item_id + "/inc",
      type: "PATCH"
    });
  });
});

//Modal operation w/ event delegation
$("div.menu").on("click", ".item .content img.item-img", function(event) {
  $("#menu_modal.modal").css("display", "block");
  $("#modal_title").html(this.parentElement.querySelector(".item-name").innerHTML);
  $("#modal_img").attr("src",this.parentElement.querySelector(".item-img").getAttribute("src"));
  $("#modal_desc").html(this.parentElement.querySelector(".item-desc").innerHTML);
  $("#modal_price").html("Price: " + this.parentElement.querySelector(".item-price").innerHTML);
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
        cartbutton.id = menu[i].menu_id;
        cartbutton.innerHTML = 'Add to Cart'
        content.appendChild(cartbutton);
        // Note: Can add text via .innerHTML("") or .createTextNode("")
        //Add hidden Description
        var desc = addClass(content, 'p', 'item-desc');
        desc.innerHTML = menu[i].desc;
    }
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

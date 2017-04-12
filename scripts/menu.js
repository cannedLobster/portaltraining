//Cart Button Increment w/ event delegation
var cartBtn = document.querySelector('#cart-btn');
var totalamt = document.querySelector("#total-cost");
var totalCount = 0;
var totalCost = 0;
$("div.menu").on("click", ".item .content button.addtocart-btn", function(event) {
  totalCount++; // Increment quantity
  totalCost += retrievePrice(this.parentElement.querySelector(".item-price").innerHTML);
  cartBtn.innerHTML = "Cart(" + totalCount + " Items)";
  totalamt.innerHTML = "$" + totalCost;
});

//Modal operation w/ event delegation
$("div.menu").on("click", ".item .content img.item-img", function(event) {
  $("#menu_modal.modal").css("display", "block");
  console.log(this.parentElement.querySelector(".item-img").getAttribute("src"));
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
clearServerThruAJAX();
var local_menu_arr = [
  { name: "Fries",
    price: 2,
    img: "./images/fries.jpg",
    desc: "Quality fresh potatos served to order! Lightly seasoned with salt."},
  { name: "Drink",
    price: 1,
    img: "./images/drink.jpg",
    desc: "Cool drink of your choice. Best on a hot day!"},
  { name: "Plain burger",
    price: 4,
    img: "./images/plainburger.jpg",
    desc: "The plain burger. Simple satisfaction guaranteed."},
  { name: "Chicken Burger",
    price: 5,
    img: "./images/chickenburger.jpg",
    desc: "Made from the free range chickens from Arkansas. Absolutely astounding taste."},
  { name: "Quarter-Pounder With Cheese",
    price: 6,
    img: "./images/cheeseburger.jpg",
    desc: "The most famous cheeseburger made with the best beef and the freshest cheese available just for you."},
  { name: "Royale With Cheese",
    price: 7,
    img: "./images/cheeseburger.jpg",
    desc: "The more \"premium\" french version of the quarter-pounder with cheese."}
];
for (var i = 0; i < local_menu_arr.length; i++) {
  $.post("http://thiman.me:1337/menu/sunny",
    local_menu_arr[i],
    function(data, status) {
      //console.log("Data: " + data + "\nStatus: " + status);
    });
}


/*Generating Menu through inputted Array from Server*/
var menu_arr = [];
$.get("http://thiman.me:1337/menu/sunny", function(response) {
    for (var i in response) {
        console.log(response[i]);
        menu_arr.push(response[i]);
    }
    generateMenu(menu_arr);
});
console.log(menu_arr);


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
var menu_ele = document.querySelector("body div.menu");
function generateMenu(menu) {
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
        cartbutton.innerHTML = 'Add to Cart'
        content.appendChild(cartbutton);
        // Note: Can add text via .innerHTML("") or .createTextNode("")
        //Add hidden Description
        var desc = addClass(content, 'p', 'item-desc');
        desc.innerHTML = menu[i].desc;
    }
}
function clearServerThruAJAX() {
  $.get("http://thiman.me:1337/menu/sunny", function(response) {
      for (var i in response) {
        console.log(response[i]._id + "|" + response[i].name);
        $.ajax({
          url: "http://thiman.me:1337/menu/sunny/" + response[i]._id,
          type: "DELETE",
        });
      }
  });
}

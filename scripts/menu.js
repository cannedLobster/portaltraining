/*Generating Menu through inputted Array from Server*/
/*Manually generated input example from server*/
var item1 = {
    img: './images/plainburger.jpg',
    name: 'Plain burger',
    price: 4,
    id: 0
}
var item2 = {
    img: './images/chickenburger.jpg',
    name: 'Chicken Burger',
    price: 5,
    id: 1
}
var item3 = {
    img: './images/cheeseburger.jpg',
    name: 'Quarter-Pounder With Cheese',
    price: 6,
    id: 2
}
var item4 = {
    img: './images/cheeseburger.jpg',
    name: 'Royal With Cheese',
    price: 7,
    id: 3
}
var item5 = {
    img: './images/drink.jpg',
    name: 'Drink',
    price: 1,
    id: 4
}
// Produce staggered result in menu as a test
// var item6 = {
//     img: './images/fries.jpg',
//     name: 'Fries',
//     price: 2,
//     id: 5
// }
var menu_arr = [item1, item2, item3, item4, item5];

var menu_ele = document.querySelector("body div.menu");

/*Creating HTML from "Server Menu Array"*/
for (var i = 0; i < menu_arr.length; i++) {
    var item = addClass(menu_ele, 'div', 'item');
    var content = addClass(item, 'div', 'content');
    //Add Image
    var image = document.createElement('img');
    image.src = menu_arr[i].img;
    image.className = 'item-img';
    content.appendChild(image);
    //Add Description
    var desc = addClass(content, 'p', 'item-desc');
    //Add name
    var itemname = addClass(desc, 'span', 'item-name');
    var name_txt = document.createTextNode(menu_arr[i].name);
    itemname.appendChild(name_txt);
    //Add price
    var price = document.createElement('span');
    price.className = 'item-price';
    var price_txt = document.createTextNode('$' + menu_arr[i].price);
    price.appendChild(price_txt);
    desc.appendChild(price);
    //Add button
    var cartbutton = document.createElement('button');
    cartbutton.className = 'addtocart-btn';
    cartbutton.innerHTML = 'Add to Cart'
    content.appendChild(cartbutton);
    // Note: Can add text via .innerHTML("") or .createTextNode("")
}

//Cart Button Increment
var cartBtn = document.querySelector('#cart-btn');
var totalamt = document.querySelector("#total-cost");
var totalCount = 0;
var totalCost = 0;
document.querySelectorAll(".addtocart-btn").forEach(
    function(obj) {
        obj.addEventListener('click', function(e) {
            totalCount++;
            totalCost += retrievePrice(obj.parentElement.querySelector(".item-price").innerHTML);
            cartBtn.innerHTML = 'Cart(' + totalCount + ' Items)';
            totalamt.innerHTML = '$' + totalCost;
        });
    });

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

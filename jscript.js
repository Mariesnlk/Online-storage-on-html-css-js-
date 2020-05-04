
//console.log('I`m working');
refreshCart();
var modal = document.getElementById('myModal');

var btn = document.getElementById("myBtn");


var span = document.getElementsByClassName("close")[0];


btn.onclick = function() {
    modal.style.display = "block";
}


span.onclick = function() {
    modal.style.display = "none";
}


window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

var d = document,
    itemBox = d.querySelectorAll('.grid_element'), // block of each item
    cartCont = d.getElementById('cart_content'); // block of the cart

// Cross-browser function setting an event handler
function addEvent(elem, type, handler){
	if (!elem) {
        return false;
    }
  if(elem.addEventListener){
    elem.addEventListener(type, handler, false);
  } else {
    elem.attachEvent('on'+type, function(){ handler.call( elem ); });
  }
  return false;
}

// Get data from LocalStorage
function getCartData(){
  return JSON.parse(localStorage.getItem('cart'));
}

// Write data to LocalStorage
function setCartData(o){
  localStorage.setItem('cart', JSON.stringify(o));
  return false;
}

//Add item to yhe cart
function addToCart(e){
  this.disabled = true; 
  var cartData = getCartData() || {}, //get the basket data or create a new object if there is no data yet
      parentBox = this.parentNode.parentNode, // parent element of the Add to Cart button
      itemId = this.getAttribute('data-id'), // ID of item
      itemTitle = parentBox.querySelector('.name_prod').innerHTML, // name of item
      itemPrice = parentBox.querySelector('.price').innerHTML; // price 


if(cartData.hasOwnProperty(itemId)){ //if such a product is already in the basket, then add +1 to its quantity
    cartData[itemId][2] += 1;
  } else { // if the product is not in the basket yet, then add to the object
    cartData[itemId] = [itemTitle, itemPrice, 1];
  }
   if(!setCartData(cartData)){ // Update data in LocalStorage
    this.disabled = false; // unlock the button after updating LS
  }

  refreshCart();
 return false;
}

function refreshCart(operation){
  var cartAmount = document.getElementsByClassName('cart-items')[0];
  var cart = getCartData();
  var amount = 0;
  for(el in cart)
    amount += cart[el][2];
  cartAmount.innerHTML = amount;
  
  refreshTotal();
}

//Refresh the total amount 
function refreshTotal(){
  var total = document.getElementById('cart-total');
  var cart = getCartData();
  var price = 0;
  for(el in cart)
    price += parseInt(cart[el][1]) * cart[el][2];
  total.innerHTML = price;
}


// Set the event handler for each "Add to Cart" button
for(var i = 0; i < itemBox.length; i++){
  addEvent(itemBox[i].querySelector('.add-to-cart'), 'click', addToCart);
}

// Open the basket with the list of added products
function openCart(e){
  var cartData = getCartData(), // pull out all the basket data
      totalItems = '';
  // if something is already in the basket, we begin to generate data for output
  if(cartData !== null){
    cartCont.innerHTML = "";
    for(var items in cartData){
      cartCont.innerHTML += getCartItem(cartData[items][0], parseInt(cartData[items][1]), cartData[items][2], items);
      
    }
    setUpAnounrBtns();
    //cartCont.innerHTML = totalItems;
  } else {
    //inform about empty cart
    cartCont.innerHTML = 'Cart is empty!';
  }
  return false;
}

//create info about the product in the cart
function getCartItem(name, price, amount, id){
  return `<div class="cart-item">
  <h6 class="item__name">${name}</h6>
  <span class="item__price">${price * amount} uah</span>
  <button class="item__btn-pl" data-id="${id}">+</button>
  <span class="item__amount">${amount}</span>
  <button class="item__btn-m" data-id="${id}">-</button>
  </div>
  `
}

//button +/-
function setUpAnounrBtns(){
  var plus = document.getElementsByClassName('item__btn-pl');
  var minus = document.getElementsByClassName('item__btn-m');

  for(var btn in plus){
    let id = plus[btn].getAttribute('data-id');
    plus[btn].addEventListener('click', () => amoutPl(id));
    minus[btn].addEventListener('click', () => amoutM(id));
  }
}

//increase amount of item
function amoutPl(id){
  this.disabled = true; 
  var cartData = getCartData();

  cartData[id][2]++;

  //console.log(cartData);
  if(!setCartData(cartData)){ 
    this.disabled = false; 
  }
  cartData = getCartData();
  refreshCart();
  openCart();

}

//decrease amount of item
function amoutM(id){

  var cartData = getCartData();
  console.log(cartData);
  if(cartData[id][2] > 1) cartData[id][2]--;
  else if(cartData[id][2] == 1){
    delete cartData[id];
  }
  
  if(!setCartData(cartData)){ 
    this.disabled = false; 
  }
  cartData = getCartData();
  refreshCart();
  openCart();
}

//Open cart
addEvent(d.getElementById('myBtn'), 'click', openCart);
//Clear cart
addEvent(d.getElementById('clear_cart'), 'click', function(e){
  localStorage.removeItem('cart');
  cartCont.innerHTML = 'The cart is clear.';
  refreshCart();
});

(function (e) {
    e.matches || (e.matches = e.matchesSelector || function (selector) {
        var matches = document.querySelectorAll(selector),
            i = -1;
        while (matches[++i] && matches[i] !== this) {}
        return !!matches[i];
    });
})(Element.prototype);
import {settings, select} from './settings.js';
import Product from './components/product.js';
import Cart from './components/cart.js';
import AmountWidget from './components/amountWidget.js';
import CartProduct from './components/cartProduct.js';

const app = {
  initMenu: function() {
    const thisApp = this;
      
    for(let productData in thisApp.data.products) {
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },

  initData: function(){
    const thisApp = this;

    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.products;

    fetch(url)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){
        console.log('parsedResonse: ', parsedResponse);
        thisApp.data.products = parsedResponse;

        thisApp.initMenu();
      });

    console.log('thisApp.data', JSON.stringify(thisApp.data));
  },

  initCart: function() {
    const thisApp = this;
    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function(e) {
      app.cart.add(e.detail.product);
    });
  },

  init: function(){
    const thisApp = this;

    thisApp.initData();
    thisApp.initCart();
  },
};

app.init();
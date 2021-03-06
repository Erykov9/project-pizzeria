import {settings, select, classNames} from './settings.js';
import Product from './components/product.js';
import Cart from './components/cart.js';
import Booking from './components/booking.js';
import Home from './components/home.js';


const app = {
  initPages: function() {
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    const idFromHash = window.location.hash.replace('#/', '');

    let pageMatchingHash = thisApp.pages[0].id;

    for(let page of thisApp.pages) {
      if(page.id == idFromHash) {
        pageMatchingHash = page.id;
        break;
      }
    }

    thisApp.activatePage(pageMatchingHash);

    for(let link of thisApp.navLinks) {
      link.addEventListener('click', function(e){
        const clickedElement = this;
        e.preventDefault();

        const id = clickedElement.getAttribute('href').replace('#', '');
        thisApp.activatePage(id);
        window.location.hash = '#/' + id;
      });
    }
  },

  activatePage: function(pageId) {
    const thisApp = this;

    for (let page of thisApp.pages) {
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }

    for (let link of thisApp.navLinks) {
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#' + pageId
      );  
    }
  },

  initMenu: function() {
    const thisApp = this;

    for(let productData in thisApp.data.products) {
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },

  initData: function(){
    const thisApp = this;

    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;

    fetch(url)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){
        thisApp.data.products = parsedResponse;

        thisApp.initMenu();
      });
  },

  initCart: function() {
    const thisApp = this;
    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function(e) {
      app.cart.add(e.detail.product.prepareCartProduct());
      console.log(e.detail.product);
    });
  },

  initBooking: function() {
    const thisApp = this;
    const bookingElem = document.querySelector(select.containerOf.booking);

    thisApp.booking = new Booking(bookingElem);
  },

  initHome:  function()  {
    const thisApp = this;

    thisApp.homePage = document.querySelector(select.containerOf.home);

    thisApp.home = new Home(thisApp.homePage);
  },

  init: function(){
    const thisApp = this;

    thisApp.initData();
    thisApp.initHome();
    thisApp.initCart();
    thisApp.initPages();
    thisApp.initBooking();
  },
};

app.init();
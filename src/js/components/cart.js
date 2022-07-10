import {select, classNames, settings, templates} from '../settings.js';
import utils from '../utils.js';
import CartProduct from './cartProduct.js';

class Cart {
  constructor(element) {
    const thisCart = this;

    thisCart.products = [];
    thisCart.getElements(element);
    thisCart.initActions();
  }

  getElements(element) {
    const thisCart = this;

    thisCart.dom = {
      wrapper: element,
      toggleTrigger: element.querySelector(select.cart.toggleTrigger),
      productList: element.querySelector(select.cart.productList),
      deliveryFee: element.querySelector(select.cart.deliveryFee),
      subtotalPrice: element.querySelector(select.cart.subtotalPrice),
      totalPrice: element.querySelector(select.cart.totalPrice),
      totalPriceWrap: element.querySelector('.cart__order-total .cart__order-price-sum strong'),
      totalNumber: element.querySelector(select.cart.totalNumber),
      form: element.querySelector(select.cart.form),
      address: element.querySelector(select.cart.address),
      phone: element.querySelector(select.cart.phone)
    };
  }

  initActions() {
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function (e) {
      e.preventDefault();
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });

    thisCart.dom.productList.addEventListener('updated', function() {
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function (e) {
      thisCart.remove(e.detail.cartProduct);
    });

    thisCart.dom.form.addEventListener('submit', function(e) {
      e.preventDefault();
      thisCart.sendOrder();
    });
  }

  add(menuProduct) {
    const thisCart = this;

    const generatedHTML = templates.cartProduct(menuProduct);
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    thisCart.dom.productList.appendChild(generatedDOM);

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    thisCart.update();
  }

  update() {
    const thisCart = this;

    let deliveryFee = settings.cart.defaultDeliveryFee;

    let totalNumber = 0;
    let subtotalPrice = 0;
    let totalPrice = 0;

    for(let product of thisCart.products) {
      totalNumber += product.amount;
      subtotalPrice += product.price;
    }

    if(totalNumber == 0) {
      deliveryFee = 0;
    }

    thisCart.totalPrice = deliveryFee + subtotalPrice;
    totalPrice = thisCart.totalPrice;

    thisCart.dom.deliveryFee.innerHTML = deliveryFee;
    thisCart.dom.subtotalPrice.innerHTML = subtotalPrice;
    thisCart.dom.totalPrice.innerHTML = totalPrice;
    thisCart.dom.totalPriceWrap.innerHTML = totalPrice;
  }

  remove(arg) {
    const thisCart = this;

    const cartProduct = thisCart.products;
    const cartProductIndex = cartProduct.indexOf(arg);
    thisCart.products.splice(cartProductIndex, 1);
    arg.dom.wrapper.remove();

    thisCart.update();
  
  }

  sendOrder() {
    const thisCart = this;

    const url = settings.db.url + '/' + settings.db.orders;

    const payload = {
      address: thisCart.dom.address.value,
      phone: thisCart.dom.phone.value,
      totalPrice: thisCart.dom.totalPrice,
      subtotalPrice: thisCart.dom.subtotalPrice,
      totalNumber: thisCart.dom.totalNumber,
      deliveryFee: thisCart.dom.deliveryFee,
      products: []
    };
    console.log(payload);

    for (let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }
    
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

  }
}

export default Cart;
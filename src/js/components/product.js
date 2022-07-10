import {select, classNames, templates} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './amountWidget.js';

class Product {
  constructor(id, data) {
    const thisProduct = this;

    thisProduct.id = id;
    thisProduct.data = data;

    thisProduct.renderInMenu();
    thisProduct.getElements(); 
    thisProduct.innitAcordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
  }

  renderInMenu() {
    const thisProduct = this;

    const generatedHTML = templates.menuProduct(thisProduct.data);
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);
    const menuContainer = document.querySelector(select.containerOf.menu);
    menuContainer.appendChild(thisProduct.element);
  }

  getElements() {
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }

  innitAcordion() {
    const thisProduct = this;

    thisProduct.accordionTrigger.addEventListener('click', function(e) {
      e.preventDefault();
      const active = document.querySelector(select.all.menuProductsActive);
        
      if(active != null && active != thisProduct.element) {
        active.classList.remove('active');
      }
      thisProduct.element.classList.toggle('active');
    });
    
  }

  initOrderForm() {
    const thisProduct = this;

    thisProduct.form.addEventListener('submit', function(e) {
      e.preventDefault();
      thisProduct.processOrder();
    });

    for (let input of thisProduct.formInputs) {
      input.addEventListener('change', function() {
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click',  function(e) {
      e.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
    

  }

  initAmountWidget() {
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener('updated', function() {
      thisProduct.processOrder();
    });
  }

  processOrder() {
    const thisProduct = this;
    const formData = utils.serializeFormToObject(thisProduct.form);

    let price = thisProduct.data.price;

    for (let paramId in thisProduct.data.params) {
      const param = thisProduct.data.params[paramId];
      for (let optionId in param.options) {
        const option = param.options[optionId];
        const pizzaClass = '.' + paramId + '-' + optionId;
        const optionImage  = thisProduct.imageWrapper.querySelector(pizzaClass);
        const variable = formData[paramId] && formData[paramId].includes(optionId);


        if (variable) {
          if(!option.default == true) {
            price = price + option.price;
          }

        } else {
          if(option.default == true) {
            price = price - option.price;
          }
        }

        if(optionImage != null && variable) {
          optionImage.classList.add(classNames.menuProduct.imageVisible);
        } else if (optionImage != null && !variable) {
          optionImage.classList.remove(classNames.menuProduct.imageVisible);
        }
      }
    }
    price *= thisProduct.amountWidget.value;
    thisProduct.priceSingle = price;
    thisProduct.priceElem.innerHTML = price;
  }

  addToCart() {
    const thisProduct = this;

    // app.cart.add(thisProduct.prepareCartProduct());

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });

    thisProduct.element.dispatchEvent(event);
  }

  prepareCartProduct() {
    const thisProduct = this;

    const productSummary = {
      id: thisProduct.id,
      name: thisProduct.data.name,
      amount: thisProduct.amountWidget.value,
      priceSingle: thisProduct.priceSingle / thisProduct.amountWidget.value,
      price: thisProduct.priceSingle,
      params: thisProduct.prepareCartProductParams()
    };
    return(productSummary);
  }

  prepareCartProductParams() {
    const thisProduct = this;
  
    const formData = utils.serializeFormToObject(thisProduct.form);
    const params = {};
  
    for(let paramId in thisProduct.data.params) {
      const param = thisProduct.data.params[paramId];
  
      params[paramId] = {
        label: param.label,
        options: {}
      };

      for(let optionId in param.options) {
        const option = param.options[optionId];
        const variable = formData[paramId] && formData[paramId].includes(optionId);
  
        if(variable) {
          params[paramId].options[optionId] = option.label;
        }
      }
    }
    return(params);
  }
}

export default Product;
import { templates }  from  '../settings.js';

class Home {
  constructor(element) {
    const thisHome = this;

    thisHome.render(element);
    thisHome.initWidgets();
  }

  render(element) {
    const thisHome = this;

    const generatedHTML = templates.homeSite();
    console.log(element);
    thisHome.dom = {};
    thisHome.dom.wrapper = element;
    thisHome.dom.wrapper.innerHTML = generatedHTML;
    thisHome.dom.carousel = document.querySelector('.main-carousel');
    console.log(thisHome.dom.carousel);
  }

  initWidgets() {

    const thisHome = this;

    const elem = thisHome.dom.carousel;
    // eslint-disable-next-line no-unused-vars
    // eslint-disable-next-line no-undef
    thisHome.dom.flickity = new Flickity( elem, {
      cellAlign: 'left',
      contain: true,
    });
  }
}

export default Home;
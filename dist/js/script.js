/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/modules/calcs.js":
/*!*********************************!*\
  !*** ./src/js/modules/calcs.js ***!
  \*********************************/
/***/ ((module) => {

function calcs() {
  //calc

  const result = document.querySelector('.calculating__result span');
  let sex = 'female',
    height,
    weight,
    age,
    ratio = 1.375;
  function calcTotal() {
    if (!sex || !height || !weight || !age || !ratio) {
      //если не заполнены все поля калькулятора
      result.textContent = '____';
      return; //досрочно прерываем функцию
    }
    if (sex === 'femail') {
      result.textContent = Math.round((447.6 + 9.2 * weight + 3.1 * height - 4.3 * age) * ratio);
    } else {
      result.textContent = Math.round((88.36 + 13.4 * weight + 4.8 * height - 5.7 * age) * ratio);
    }
  }
  calcTotal();
  function getStaticInformaition(parentSelector, activeClass) {
    const elements = document.querySelectorAll(`${parentSelector} div`);
    elements.forEach(elem => {
      elem.addEventListener('click', e => {
        if (e.target.getAttribute('data-ratio')) {
          ratio = +e.target.getAttribute('data-ratio');
        } else {
          sex = e.target.getAttribute('id');
        }
        //console.log(ratio, sex);

        elements.forEach(elem => {
          elem.classList.remove(activeClass);
        });
        e.target.classList.add(activeClass);
        calcTotal();
      });
    });
  }
  getStaticInformaition('#gender', 'calculating__choose-item_active');
  getStaticInformaition('.calculating__choose_big', 'calculating__choose-item_active');
  function getDinamicInformation(selector) {
    const input = document.querySelector(selector);
    input.addEventListener('input', () => {
      switch (input.getAttribute('id')) {
        case 'height':
          height = +input.value;
          break;
        case 'weight':
          weight = +input.value;
          break;
        case 'age':
          age = +input.value;
          break;
      }
      calcTotal();
    });
  }
  getDinamicInformation('#height');
  getDinamicInformation('#weight');
  getDinamicInformation('#age');
}
module.exports = calcs;

/***/ }),

/***/ "./src/js/modules/cards.js":
/*!*********************************!*\
  !*** ./src/js/modules/cards.js ***!
  \*********************************/
/***/ ((module) => {

function cards() {
  // Используем классы для создание карточек меню

  class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = price;
      this.classes = classes;
      this.parent = document.querySelector(parentSelector);
      this.transfer = 27;
      this.changeToUAH();
    }
    changeToUAH() {
      this.price = this.price * this.transfer;
    }
    render() {
      const element = document.createElement('div');
      if (this.classes.length === 0) {
        this.classes = "menu__item";
        element.classList.add(this.classes);
      } else {
        this.classes.forEach(className => element.classList.add(className));
      }
      element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
      this.parent.append(element);
    }
  }
  async function getResource(url) {
    let res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }
    return await res.json();
  }
  getResource('http://localhost:3000/menu').then(data => {
    data.forEach(({
      img,
      altimg,
      title,
      descr,
      price
    }) => {
      new MenuCard(img, altimg, title, descr, price, ".menu .container").render();
    });
  });
}
module.exports = cards;

/***/ }),

/***/ "./src/js/modules/forms.js":
/*!*********************************!*\
  !*** ./src/js/modules/forms.js ***!
  \*********************************/
/***/ ((module) => {

function forms() {
  //Forms

  const forms = document.querySelectorAll('form'); //получение всех форм

  const message = {
    loading: 'img/form/spinner.svg',
    success: 'Спасибо! Скоро мы с вами свяжемся.',
    failure: 'Что-то пошло не так...'
  };
  forms.forEach(item => {
    bindPostData(item);
  });

  // функция постит, посылает запрос на сервер, получает ответ и трансормирует его в формат json

  const postData = async (url, data) => {
    const res = await fetch(url, {
      method: 'POST',
      body: data,
      headers: {
        "Content-type": 'application/json'
      }
    });
    return await res.json();
  };

  //функция для постинга данных
  function bindPostData(form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let statusMessage = document.createElement('img');
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
      form.insertAdjacentElement('afterend', statusMessage);

      /*  const request = new XMLHttpRequest();
       request.open('POST', 'server.php');
       request.setRequestHeader('Content-type', 'application/json; charset=utf-8'); */

      const formData = new FormData(form);
      const json = JSON.stringify(Object.fromEntries(formData.entries()));
      postData('http://localhost:3000/requests', json).then(data => {
        console.log(data);
        showThanksModal(message.success);
        statusMessage.remove();
      }).catch(() => {
        showThanksModal(message.failure);
      }).finally(() => {
        form.reset();
      });
    });
  }
  function showThanksModal(message) {
    const prevModalDialog = document.querySelector('.modal__dialog');
    prevModalDialog.classList.add('hide'); // скрыли модальное окно

    openModal();
    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>    
            </div>
        `;
    document.querySelector('.modal').append(thanksModal);
    setTimeout(() => {
      thanksModal.remove();
      prevModalDialog.classList.add('show');
      prevModalDialog.classList.remove('hide');
      closeModal();
    }, 4000);
  }
}
module.exports = forms;

/***/ }),

/***/ "./src/js/modules/modals.js":
/*!**********************************!*\
  !*** ./src/js/modules/modals.js ***!
  \**********************************/
/***/ ((module) => {

function modals() {
  //Modal

  const modalTrigger = document.querySelectorAll('[data-modal]'),
    modal = document.querySelector('.modal'),
    modalCloseBtn = document.querySelector('[data-close]');

  /*  modalTrigger.addEventListener('click', () => {
  modal.classList.add('show');
  modal.classList.remove('hide');
  document.body.style.overflow = 'hidden';  //во время открытого модального окна прокрутка страницы не работает
  });
    modalCloseBtn.addEventListener('click', () => {
  modal.classList.add('hide');
  modal.classList.remove('show');
  document.body.style.overflow = ''; // прокрутка сайта начинает работать снова
  }); */

  // или

  modalTrigger.forEach(btn => {
    btn.addEventListener('click', openModal);
  });
  function openModal() {
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
    clearInterval(modalTimerId); // если клиент уже открывал модальное окно, оно больше не откроется, функция запуска таймера const modalTimerId  строка 175
  }
  function closeModal() {
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
  modalCloseBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // с помощью Escape закрываем модальное окно
  document.addEventListener('keydown', e => {
    if (e.code === 'Escape' && modal.classList.contains('show')) {
      // если нажата кнопка эскейп и открыто модальное окно(клас 'show'), тогда закрываем модальное окно
      closeModal();
    }
  });

  //функционал для запуска модального окна через какое-то время

  const modalTimerId = setTimeout(openModal, 50000); //модальное окно появляется само через 3 секунды времени

  // функционал для запуска модального окна при прокрутке сайта в конец, и после повторной прокрутки оно больше не открывается

  function showModalByScroll() {
    if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
      openModal();
      window.removeEventListener('scroll', showModalByScroll); //удаление повторного открытия модального окна при повторной прокрутке сайта
    }
  }
  window.addEventListener('scroll', showModalByScroll);
}
module.exports = modals;

/***/ }),

/***/ "./src/js/modules/sliders.js":
/*!***********************************!*\
  !*** ./src/js/modules/sliders.js ***!
  \***********************************/
/***/ ((module) => {

function sluders() {
  //Slider

  const slides = document.querySelectorAll('.offer__slide'),
    slider = document.querySelector('.offer__slider'),
    prev = document.querySelector('.offer__slider-prev'),
    next = document.querySelector('.offer__slider-next'),
    total = document.querySelector('#total'),
    current = document.querySelector('#current'),
    slidesWrapper = document.querySelector('.offer__slider-wrapper'),
    slidesField = document.querySelector('.offer__slider-inner'),
    width = window.getComputedStyle(slidesWrapper).width; //получаем ширину - стиль верстки из инлайн стилей   

  let slideIndex = 1;
  let offset = 0;
  if (slides.length < 10) {
    total.textContent = `0${slides.length}`;
    current.textContent = `0${slideIndex}`;
  } else {
    total.textContent = slides.length;
    current.textContent = slideIndex;
  }
  slidesField.style.width = 100 * slides.length + '%';
  slidesField.style.display = 'flex';
  slidesField.style.transition = '0.5s all';
  slidesWrapper.style.overflow = 'hidden';
  slides.forEach(slide => {
    slide.style.width = width;
  });
  slider.style.position = 'relative';
  const indicators = document.createElement('ol'),
    dots = [];
  indicators.classList.add('carousel-indicators');
  /* indicators.style.cssText = `
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 15;
  display: flex;
  justify-content: center;
  margin-right: 15%;
  margin-left: 15%;
  list-style: none;
  `; */

  slider.append(indicators);
  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement('li');
    dot.setAttribute('data-slide-to', i + 1);
    dot.classList.add('dot');
    /*  dot.style.cssText = `
        box-sizing: content-box;
        flex: 0 1 auto;
        width: 30px;
        height: 6px;
        margin-right: 3px;
        margin-left: 3px;
        cursor: pointer;
        background-color: #fff;
        background-clip: padding-box;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        opacity: .5;
        transition: opacity .6s ease;
    `;
    */
    if (i == 0) {
      dot.style.opacity = 1;
    }
    indicators.append(dot);
    dots.push(dot);
  }
  function getZeroSlideIndex() {
    if (slideIndex < 10) {
      current.textContent = `0${slideIndex}`;
    } else {
      current.textContent = slideIndex;
    }
  }
  function changeOpacityDot() {
    dots.forEach(dot => dot.style.opacity = '.5');
    dots[slideIndex - 1].style.opacity = 1;
  }
  function deleteNotDigits(str) {
    return +str.replace(/\D/g, '');
  }
  next.addEventListener('click', () => {
    if (offset == deleteNotDigits(width) * (slides.length - 1)) {
      offset = 0;
    } else {
      offset += deleteNotDigits(width);
    }
    slidesField.style.transform = `translateX(-${offset}px)`;
    if (slideIndex == slides.length) {
      slideIndex = 1;
    } else {
      slideIndex++;
    }
    getZeroSlideIndex();
    changeOpacityDot();
  });
  prev.addEventListener('click', () => {
    if (offset == 0) {
      offset = deleteNotDigits(width) * (slides.length - 1);
    } else {
      offset -= deleteNotDigits(width);
    }
    slidesField.style.transform = `translateX(-${offset}px)`;
    if (slideIndex == 1) {
      slideIndex = slides.length;
    } else {
      slideIndex--;
    }
    getZeroSlideIndex();
    changeOpacityDot();
  });
  dots.forEach(dot => {
    dot.addEventListener('click', e => {
      const slideTo = e.target.getAttribute('data-slide-to');
      slideIndex = slideTo;
      offset = deleteNotDigits(width) * (slideTo - 1);
      slidesField.style.transform = `translateX(-${offset}px)`;
      getZeroSlideIndex();
      changeOpacityDot();
    });
  });

  //1 
  /* showSlides(slideIndex);
    if(slides.length < 10) {
  total.textContent = `0${slides.length}`;
  } else {
  total.textContent = slides.length;
  }
    function showSlides(n) {
  if(n > slides.length) {
      slideIndex = 1;
  }
  if(n < 1) {
      slideIndex = slides.length;
  }
    slides.forEach(item => item.style.display = 'none');
    slides[slideIndex - 1].style.display = 'block';
    if(slides.length && slideIndex < 10) {
      current.textContent = `0${slideIndex}`;
  } else {
      current.textContent = slideIndex;
  }
  }
    function plusSlides (n) {
  showSlides(slideIndex += n);
  }
    prev.addEventListener('click', () => {
  plusSlides(-1);
  })
    next.addEventListener('click', () => {
  plusSlides(+1);
  })
  */
}
module.exports = sluders;

/***/ }),

/***/ "./src/js/modules/tabs.js":
/*!********************************!*\
  !*** ./src/js/modules/tabs.js ***!
  \********************************/
/***/ ((module) => {

function tabs() {
  // Tabs

  const tabs = document.querySelectorAll('.tabheader__item'),
    tabsContent = document.querySelectorAll('.tabcontent'),
    tabsParent = document.querySelector('.tabheader__items');

  //создаем функция для скрытия табов
  function hideTabContent() {
    tabsContent.forEach(item => {
      //делаем невидимый контент
      item.classList.add('hide'); //style.display = 'none'
      item.classList.remove('show', 'fade');
    });
    tabs.forEach(item => {
      item.classList.remove('tabheader__item_active'); // убираем класс активности у табов
    });
  }
  function showTabContent(i = 0) {
    // (i)                    
    tabsContent[i].classList.add('show', 'fade'); //style.display = 'block';   //назначаем первому элементу tabsContent дисплей block
    tabsContent[i].classList.remove('hide');
    tabs[i].classList.add('tabheader__item_active'); //назначаем первому элементу tabs класс активности
  }
  hideTabContent();
  showTabContent(); // (0) -  где, 0 - первый элемент

  //назначаем обработчик события клика
  tabsParent.addEventListener('click', event => {
    //передаем объект события event
    const target = event.target; // для сокращения кода создали переменную

    if (target && target.classList.contains('tabheader__item')) {
      tabs.forEach((item, i) => {
        if (target == item) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });
}
module.exports = tabs;

/***/ }),

/***/ "./src/js/modules/timers.js":
/*!**********************************!*\
  !*** ./src/js/modules/timers.js ***!
  \**********************************/
/***/ ((module) => {

function timers() {
  //Timer

  const deadline = '2024-10-15';

  //функция, которая определяет разницу между deadline и текущем временем
  function getTimeRemaining(endtime) {
    //
    let days, hours, minutes, seconds;
    const t = Date.parse(endtime) - Date.parse(new Date()); //Date.parse -превращает дату в миллисекунды конечная дата - текущая дата

    if (t <= 0) {
      days = 0;
      hours = 0;
      minutes = 0;
      seconds = 0;
    } else {
      days = Math.floor(t / (1000 * 60 * 60 * 24)),
      //получили дни (Math.floor округляет до целого)
      hours = Math.floor(t / (1000 * 60 * 60) % 24),
      //получаем часы - делим на 24 часа в сутки и выводим остаток от деления
      minutes = Math.floor(t / (1000 * 60) % 60),
      // получаем минуты
      seconds = Math.floor(t / 1000 % 60);
    }
    return {
      'total': t,
      'days': days,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds
    };
  }

  // функция - ноль перед цифрой

  function getZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }

  // функция, которая устанавливает часы на страницу

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector),
      days = timer.querySelector('#days'),
      hours = timer.querySelector('#hours'),
      minutes = timer.querySelector('#minutes'),
      seconds = timer.querySelector('#seconds');
    timeInterval = setInterval(updateClock, 1000);
    updateClock();

    // функция обновления часов
    function updateClock() {
      const t = getTimeRemaining(endtime); //расчет времени, которое осталось на эту секунду

      days.innerHTML = getZero(t.days);
      hours.innerHTML = getZero(t.hours);
      minutes.innerHTML = getZero(t.minutes);
      seconds.innerHTML = getZero(t.seconds);
      if (t.total <= 0) {
        clearInterval(timeInterval); /// останавливаем таймер, когда deadline закончился
      }
    }
  }
  setClock('.timer', deadline);
}
module.exports = timers;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**************************!*\
  !*** ./src/js/script.js ***!
  \**************************/
// назначаем глобальный обработчик событий на весь скрипт

window.addEventListener('DOMContentLoaded', () => {
  const tabs = __webpack_require__(/*! ./modules/tabs */ "./src/js/modules/tabs.js"),
    modals = __webpack_require__(/*! ./modules/modals */ "./src/js/modules/modals.js"),
    timers = __webpack_require__(/*! ./modules/timers */ "./src/js/modules/timers.js"),
    calcs = __webpack_require__(/*! ./modules/calcs */ "./src/js/modules/calcs.js"),
    cards = __webpack_require__(/*! ./modules/cards */ "./src/js/modules/cards.js"),
    forms = __webpack_require__(/*! ./modules/forms */ "./src/js/modules/forms.js"),
    sliders = __webpack_require__(/*! ./modules/sliders */ "./src/js/modules/sliders.js");
  tabs();
  modals();
  timers();
  calcs();
  cards();
  forms();
  sliders();
});
})();

/******/ })()
;
//# sourceMappingURL=script.js.map
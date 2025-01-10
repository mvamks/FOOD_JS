// назначаем глобальный обработчик событий на весь скрипт

        import tabs from './modules/tabs';
        import modals from './modules/modals';  
        import timers from './modules/timers';
        import calcs from './modules/calcs';
        import cards from './modules/cards';
        import forms from './modules/forms';
        import sliders from './modules/sliders';
        import {openModal} from './modules/modals';
        


window.addEventListener('DOMContentLoaded',  function() {
    //функционал для запуска модального окна через какое-то время

    const modalTimerId = setTimeout(() => openModal('.modal', modalTimerId), 50000); //модальное окно появляется само через 3 секунды времени
    
    
    tabs('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
    modals('[data-modal]', '.modal',  modalTimerId);
    timers('.timer', '2025-10-15');
    calcs();
    cards();
    forms('form', modalTimerId);
    sliders({
        container: '.offer__slider', 
        slide: '.offer__slide',
        nextArrow: '.offer__slider-next',
        prevArrow: '.offer__slider-prev',
        totalCounter: '#total',
        currentCounter: '#current',
        wrapper: '.offer__slider-wrapper',
        field: '.offer__slider-inner'
    });  
});

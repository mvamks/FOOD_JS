// назначаем глобальный обработчик событий на весь скрипт

window.addEventListener('DOMContentLoaded', () => {

    // Tabs

    const tabs = document.querySelectorAll('.tabheader__item'),    
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');
          

        //создаем функция для скрытия табов
    function hideTabContent() {
        tabsContent.forEach(item => {              //делаем невидимый контент
            item.classList.add('hide');           //style.display = 'none'
            item.classList.remove('show', 'fade'); 
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active'); // убираем класс активности у табов
        });
    }

    function showTabContent(i = 0) {   // (i)                    
        tabsContent[i].classList.add('show', 'fade');     //style.display = 'block';   //назначаем первому элементу tabsContent дисплей block
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active'); //назначаем первому элементу tabs класс активности
    }

    hideTabContent();
    showTabContent(); // (0) -  где, 0 - первый элемент


    //назначаем обработчик события клика
    tabsParent.addEventListener('click', (event) => {  //передаем объект события event
        const target = event.target;  // для сокращения кода создали переменную

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            }); 
        }
    });


    //Timer

    const deadline = '2024-10-15';

  //функция, которая определяет разницу между deadline и текущем временем
    function getTimeRemaining(endtime) {  //
        let days, hours, minutes, seconds;
        const t = Date.parse(endtime) - Date.parse(new Date());    //Date.parse -превращает дату в миллисекунды конечная дата - текущая дата
        
        if (t <= 0) {
            days = 0;
            hours = 0; 
            minutes = 0;
            seconds = 0;
        } else {
        
            days = Math.floor(t / (1000 * 60 * 60 * 24)), //получили дни (Math.floor округляет до целого)
            hours = Math.floor((t / (1000 * 60 * 60) % 24)), //получаем часы - делим на 24 часа в сутки и выводим остаток от деления
            minutes = Math.floor((t / (1000 * 60) % 60)), // получаем минуты
            seconds = Math.floor((t / 1000) % 60);
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

    //Modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal');

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
    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden'; 
        clearInterval(modalTimerId); // если клиент уже открывал модальное окно, оно больше не откроется, функция запуска таймера const modalTimerId  строка 175
    }

    modalTrigger.forEach(btn =>{
        btn.addEventListener('click', openModal );
    });

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = ''; 
    }
    
   

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close' == '')) {
            closeModal();
        }
    });


    // с помощью Escape закрываем модальное окно
    document.addEventListener('keydown', (e) =>{
        if(e.code === 'Escape' && modal.classList.contains('show')) { // если нажата кнопка эскейп и открыто модальное окно(клас 'show'), тогда закрываем модальное окно
            closeModal();
        }
    });

    //функционал для запуска модального окна через какое-то время

    const modalTimerId = setTimeout(openModal, 50000); //модальное окно появляется само через 3 секунды времени

    
    // функционал для запуска модального окна при прокрутке сайта в конец, и после повторной прокрутки оно больше не открывается

    function showModalByScroll() {
        if(window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll); //удаление повторного открытия модального окна при повторной прокрутке сайта
        }
    }
    
    window.addEventListener('scroll', showModalByScroll);

    // используем классы для карточек

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;  //это массив
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        render () {
            const element = document.createElement('div');
            if(this.classes.length === 0) {
                this.classes = 'menu__item';
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

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        '.menu .container'
    ).render();  // создается новый объект, отрабатывает свою функцию и удаляется

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню “Постное”',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        8,
        '.menu .container'
    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        12,
        '.menu .container'
    ).render();


    //Forms

    const forms = document.querySelectorAll('form'); //получение всех форм

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся.',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        postData(item);
    });

    //функция для постинга данных
    function postData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;

            form.insertAdjacentElement('afterend', statusMessage);


           
            const request = new XMLHttpRequest();
            request.open('POST', 'server.php');
            request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            const formData = new FormData(form);

            const object = {};
            formData.forEach(function(value, key){
                object[key] = value;
            });
            const json = JSON.stringify(object);

            request.send(json);

            request.addEventListener('load', () => {
                if (request.status === 200) {
                    console.log(request.response);
                    showThanksModal(message.success) ;
                    form.reset();
                    statusMessage.remove();
                } else {
                    showThanksModal(message.failure);
                }
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

});

function openModal(modalSelector, modalTimerId) {
    const modal = document.querySelector(modalSelector);

    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden'; 
    
    if(modalTimerId) {
        clearInterval(modalTimerId); // если клиент уже открывал модальное окно, оно больше не откроется, функция запуска таймера const modalTimerId  строка 175
        
    }
}

function closeModal(modalSelector) {
    const modal = document.querySelector(modalSelector);

    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = ''; 
}
 
 
function modals(triggerSelector, modalSelector, modalTimerId) {
    //Modal

    const modalTrigger = document.querySelectorAll(triggerSelector),
          modal = document.querySelector(modalSelector);
          //modalCloseBtn = document.querySelector('[data-close]');

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
        btn.addEventListener('click', () => openModal(modalSelector, modalTimerId));
    });

   

    //modalCloseBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == "") {
            closeModal(modalSelector);
        }
    });


    // с помощью Escape закрываем модальное окно
    document.addEventListener('keydown', (e) =>{
        if(e.code === 'Escape' && modal.classList.contains('show')) { // если нажата кнопка эскейп и открыто модальное окно(клас 'show'), тогда закрываем модальное окно
            closeModal(modalSelector);
        }
    });

    
    // функционал для запуска модального окна при прокрутке сайта в конец, и после повторной прокрутки оно больше не открывается

    function showModalByScroll() {
       /*  if(modalTimerId) {
            window.removeEventListener('scroll', showModalByScroll);
            return; 
        } */
        if(window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModal(modalSelector, modalTimerId);
            window.removeEventListener('scroll', showModalByScroll); //удаление повторного открытия модального окна при повторной прокрутке сайта
        }   
    }

    window.addEventListener('scroll', showModalByScroll);

}

export default modals;
export {closeModal};
export {openModal};
 
 
 



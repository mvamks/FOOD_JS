
function tabs(tabsSelector, tabsContentSelector, tabsParentSelector, activeClass) {
    // Tabs

    let tabs = document.querySelectorAll(tabsSelector),    
        tabsContent = document.querySelectorAll(tabsContentSelector),
        tabsParent = document.querySelector(tabsParentSelector);
          
          

        //создаем функция для скрытия табов
    function hideTabContent() {
        tabsContent.forEach(item => {              //делаем невидимый контент
            item.classList.add('hide');           //style.display = 'none'
            item.classList.remove('show', 'fade'); 
        });

        tabs.forEach(item => {
            item.classList.remove(activeClass); // убираем класс активности у табов
        });
    }

    function showTabContent(i = 0) {   // (i)                    
        tabsContent[i].classList.add('show', 'fade');     //style.display = 'block';   //назначаем первому элементу tabsContent дисплей block
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add(activeClass); //назначаем первому элементу tabs класс активности
    }

    hideTabContent();
    showTabContent(); // (0) -  где, 0 - первый элемент


    //назначаем обработчик события клика
    tabsParent.addEventListener('click', function(event) {  //передаем объект события event
        const target = event.target;  // для сокращения кода создали переменную

        if (target && target.classList.contains(tabsSelector.slice(1))) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            }); 
        }
    });
}

export default tabs;

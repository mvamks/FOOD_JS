function timers(id, deadline) {
    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
              days = Math.floor(t / (1000 * 60 * 60 * 24)), //получили дни (Math.floor округляет до целого)
              hours = Math.floor((t / (1000 * 60 * 60) % 24)), //получаем часы - делим на 24 часа в сутки и выводим остаток от деления
              minutes = Math.floor((t / (1000 * 60) % 60)), // получаем минуты
              seconds = Math.floor((t / 1000) % 60);

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
            return '0' + num;
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
        let timeInterval = setInterval(updateClock, 1000);

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

    setClock(id, deadline);
}
     

export default timers;
'use strict';

(function () {
    
    let inputs = document.querySelectorAll('.js-checkbox');
    for (var i = 0; i < inputs.length; i++) {
        let el = inputs[i];
        el.onclick = function () {
            let card = el.nextElementSibling;
            if (el.checked) {
                card.classList.add('cats__card--nohover');
            }
        }
    }

    let cards = document.querySelectorAll('.js-card');
    for (var i = 0; i < cards.length; i++) {
        let el = cards[i];
        el.onmouseleave = function () {
            el.classList.remove('cats__card--nohover');
        };
    }

})(); // ready



'use strict';

// Оживление всплывающего окна формы обратной связи
var contactsLink = document.querySelector('.contacts__button');

var modalContacts = document.querySelector('.modal--contacts');

if (modalContacts) {
  var modalContactsClose = modalContacts.querySelector('.modal__close');

  var contactsForm = modalContacts.querySelector('.contacts-form');
  var userData = {
    name: document.getElementById('contacts-name'),
    email: document.getElementById('contacts-email'),
    message: document.getElementById('contacts-message')
  };

  var isStorageSupport = true;
  var storage = {
    name: '',
    email: ''
  };

  // Проверка, работает ли localStorage
  try {
    storage.name = localStorage.getItem('name');
    storage.email = localStorage.getItem('email');
  } catch (err) {
    isStorageSupport = false;
  }

  // Появление всплывающего окна
  contactsLink.addEventListener('click', function (evt) {
    evt.preventDefault();
    modalShow(modalContacts);

    if (storage.name && storage.email) {
      userData.name.value = storage.name;
      userData.email.value = storage.email;
      userData.message.focus();
    } else {
      userData.name.focus();
    }
  });

  // Закрытие всплывающего окна
  modalContactsClose.addEventListener('click', function (evt) {
    evt.preventDefault();
    modalClose();
  });

  // Сохранеие данных пользователя в localStorage
  contactsForm.addEventListener('submit', function (evt) {
    if (!userData.name.value || !userData.email.value || !userData.message.value) {
      evt.preventDefault();
      modalContacts.classList.remove('modal--error');
      void modalContacts.offsetWidth;
      modalContacts.classList.add('modal--error');

      if (!userData.name.value) {
        userData.name.focus();
      } else if (!userData.email.value) {
        userData.email.focus();
      } else {
        userData.message.focus();
      }
    } else if (isStorageSupport) {
      localStorage.setItem('name', userData.name.value);
      localStorage.setItem('email', userData.email.value);
    }
  });
}

// Закрытие всплывающего окна по нажатию Esc
window.addEventListener('keydown', function (evt) {
  if (evt.keyCode === 27) {
    evt.preventDefault();
    modalClose();
  }
});

// Закрытие всплывающего окна по клику вне окна
var overlay = document.querySelector('.overlay');

overlay.addEventListener('click', function () {
  modalClose();
});

// Оживление слайдера
var sliderDots = document.querySelectorAll('.slider__indicator');
var slides = document.querySelectorAll('.slider__item');

var sliderDotActive = document.querySelector('.slider__indicator--active');
var slideActive = document.querySelector('.slider__item--active');

var addDotClickHandler = function (sliderDot, slide) {
  sliderDot.addEventListener('click', function (evt) {
    evt.preventDefault();
    if (sliderDot !== sliderDotActive) {
      sliderDotActive.classList.remove('slider__indicator--active');
      slideActive.classList.remove('slider__item--active');

      sliderDot.classList.add('slider__indicator--active');
      slide.classList.add('slider__item--active');

      sliderDotActive = sliderDot;
      slideActive = slide;
    }
  });
};

for (var i = 0; i < sliderDots.length; i++) {
  addDotClickHandler(sliderDots[i], slides[i]);
}

// Оживление ползунков фильтра цены
var slider = document.querySelector('.filters-form__slider');

if (slider) {
  var rangeWidth = 200;
  var sliderIndent = 20;
  var thumbHalfWidth = 10;
  var price = {
    min: 0,
    max: 21429
  };

  // Установка тумблерам флага "перетаскиваемый" при нажатии на них кнопки мыши
  var thumbs = slider.querySelectorAll('.filters-form__thumb');
  var isDragging = [false, false];

  thumbs[0].addEventListener('mousedown', function () {
    isDragging[0] = true;
  });
  thumbs[1].addEventListener('mousedown', function () {
    isDragging[1] = true;
  });
  slider.addEventListener('mouseup', function () {
    isDragging = [false, false];
  });

  // Установка начального положения тумблеров в зависимости от значений цены
  var track = slider.querySelector('.filters-form__track');
  var inputs = document.querySelectorAll('.filters-form__price input');

  var rangeRatio = rangeWidth / (price.max - price.min);
  var currentPrice = {
    min: inputs[0].value,
    max: inputs[1].value
  };

  moveLeftThumb(currentPrice.min);
  moveRightThumb(currentPrice.max);

  // Вычисление для перетаскиваемого тумблера нового значения цены и положения на слайдере
  slider.addEventListener('mousemove', function (evt) {
    if (isDragging[0]) {
      currentPrice.min = Math.round(mousePosX(slider, evt) / rangeRatio) + price.min;

      if (currentPrice.min < currentPrice.max && currentPrice.min >= price.min) {
        moveLeftThumb(currentPrice.min);
        inputs[0].value = currentPrice.min;
      }
    }
    if (isDragging[1]) {
      currentPrice.max = Math.round(mousePosX(slider, evt) / rangeRatio) + price.min;

      if (currentPrice.max > currentPrice.min && currentPrice.max <= price.max) {
        moveRightThumb(currentPrice.max);
        inputs[1].value = currentPrice.max;
      }
    }
  });

  // Вычисление нового положения тумблеров при изменении значений в полях ввода
  inputs[0].addEventListener('blur', function () {
    if (inputs[0].value !== currentPrice.min) {
      if (inputs[0].value < price.min) {
        inputs[0].value = price.min;
      } else if (Number(inputs[0].value) >= currentPrice.max) {
        inputs[0].value = currentPrice.max - 1;
      }

      currentPrice.min = inputs[0].value;
      moveLeftThumb(currentPrice.min);
    }
  });
  inputs[1].addEventListener('blur', function () {
    if (inputs[1].value !== currentPrice.max) {
      if (inputs[1].value > price.max) {
        inputs[1].value = price.max;
      } else if (inputs[1].value <= Number(currentPrice.min)) {
        inputs[1].value = Number(currentPrice.min) + 1;
      }

      currentPrice.max = inputs[1].value;
      moveRightThumb(currentPrice.max);
    }
  });
}

// Инициализация интерактивной карты
function initMap() {
  var mapCoordinates = {
    lat: 59.939105,
    lng: 30.321487
  };

  var map = new google.maps.Map(document.querySelector('.contacts__map'), {
    zoom: 17,
    center: mapCoordinates,
    disableDefaultUI: true
  });

  var markerCoordinates = {
    lat: 59.938723,
    lng: 30.323789
  };
  var icon = 'img/map-marker.png';

  var marker = new google.maps.Marker({
    position: markerCoordinates,
    map: map,
    icon: icon
  });
}

// Появление всплывающего окна
function modalShow(elmt) {
  elmt.classList.add('modal--shown');
  overlay.classList.add('overlay--shown');
}

// Закрытие всплывающего окна
function modalClose() {
  var modalShown = document.querySelector('.modal--shown');

  if (modalShown) {
    modalShown.classList.remove('modal--shown');
    overlay.classList.remove('overlay--shown');

    if (modalShown.classList.contains('modal--error')) {
      modalShown.classList.remove('modal--error');
    }
  }
}

// Перемещение тумблеров в зависимости от цены
function moveLeftThumb(minPrice) {
  thumbs[0].style.left = (minPrice - price.min) * rangeRatio + sliderIndent + 'px';
  track.style.left = (minPrice - price.min) * rangeRatio + thumbHalfWidth + 'px';
}

function moveRightThumb(maxPrice) {
  thumbs[1].style.right = (price.max - maxPrice) * rangeRatio + sliderIndent + 'px';
  track.style.right = (price.max - maxPrice) * rangeRatio + thumbHalfWidth + 'px';
}

// Вычисление координаты X курсора относительно полоски слайдера,
// учитывая отступы от краёв контейнера и ширину тумблеров
function mousePosX(elmt, evt) {
  var x = Math.round(evt.clientX - elmt.getBoundingClientRect().left) - (sliderIndent + thumbHalfWidth);

  if (x < 0) {
    return 0;
  }
  if (x > rangeWidth) {
    return rangeWidth;
  }

  return x;
}

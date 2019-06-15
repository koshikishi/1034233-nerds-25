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

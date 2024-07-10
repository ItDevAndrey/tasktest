import Swiper from 'swiper';
import SwiperCore, { Navigation, Pagination } from 'swiper/core';

SwiperCore.use([Navigation, Pagination]);

const infoSliderSwiper = new Swiper('.info-slider-swiper', {
  slidesPerView: 1,
  speed: 600,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  }
})

const infoCategories = document.querySelectorAll('.info-slider-titles h2');

if (infoCategories) {
  infoCategories[0].classList.add('is-active');
  const activeItem = {
    elem: infoCategories[0]
  }

  infoCategories.forEach((item, index) => {
    item.addEventListener('click', () => {
      activeItem.elem.classList.remove('is-active');
      item.classList.add('is-active');
      activeItem.elem = item;

      infoSliderSwiper.slideTo(index);
    })
  });

  infoSliderSwiper.on('slideChange', () => {
    activeItem.elem.classList.remove('is-active');

    infoCategories[infoSliderSwiper.realIndex].classList.add('is-active');
    activeItem.elem = infoCategories[infoSliderSwiper.realIndex];
    console.log(infoCategories[infoSliderSwiper.realIndex]);
  })
}
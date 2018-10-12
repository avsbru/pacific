$(document).ready(function(){              
  $('#slider').nivoSlider({
      effect: 'random', // Задаётся как: 'fold, fade, sliceDown' 
        slices: 15, 
        animSpeed: 1500, 
        pauseTime: 6000, 
        startSlide: 0, // Задаётся начало прокрутки  (0 index)
        directionNav: false, // Вперёд/Назад 
        directionNavHide: true, // Показывать только при наведении
        controlNav: false, // 1,2,3 ...
        controlNavThumbs: false, // Использование картинок для Control Nav
        controlNavThumbsFromRel: false, // Use image rel for thumbs
        controlNavThumbsSearch: '. jpg', // заменить на..
        controlNavThumbsReplace: '_thumb.jpg', //... это ярлык для Image src, 
        keyboardNav: true, // использовать стрелки влево и вправо.
        pauseOnHover: true, // при наведении анимация останавливается.
        manualAdvance: false, // Форсированный ручной переход
        captionOpacity: 0.8 // Прозрачность подписи
  });
  $(document).ready(function() {
   $('#menu').superfish({
      delay:       100,                            // задержка в миллисекунду
      animation:   {opacity:'show',height:'show'},  // fade-in и slide-down анимация
      speed:       'fast',                          // увеличение скорости анимации
      autoArrows:  false,                           // отключает стрелку подменю
      dropShadows: true                            // отключает тень
   });
   
});
});
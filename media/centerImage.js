
$(window).load(function(){ 
  $('.centerImg').each(function(){
    var imgHeight = $(this).attr('height');
    var imgWidth = $(this).attr('width');
      if(imgWidth > imgHeight){var setMargin = (190 - imgHeight)/2;  // 190 - высота обертки на стр. коллекции
        $(this).css('margin-top' , setMargin + 'px' );}
  });
     $('.centerProdImg').each(function(){
          var imgProdHeight = $(this).find('img').attr('height');
          
          var setProdMargin = (370 - imgProdHeight)/2; // 370 - высота обертки на стр. товара
        $(this).css('margin-top' , setProdMargin + 'px' );
  });
    
});

  

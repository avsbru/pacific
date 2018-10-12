$.ajaxSetup({cache: true});

jQuery(function() {
    $("#navShopCat ul").each(function(){
        if($(this).children("li").length == 0) $(this).hide();
    });

    initCart();
    var updateCart = function(response) {
        if( response.items_count > 0){
            $("#cartData").load("/ #cartData");

            $('#emptyBin').hide();
            $('#cartS, #cartWrapme').show();

            $(".parse_total_price").html(InSales.formatMoney(response.total_price, money_with_currency_format));
            $(".parse_total_count").html(response.items_count);
          
            var text = 'Товар&nbsp;добавлен&nbsp;в&nbsp;корзину';
            set_preloaders_message('<div id="add_product_notification">'+text+'</div>');
            window.setTimeout( hide_preloader, 1000);
            $("#cartQuantity").val(1);

        } else {
            $('#emptyBin').show();
              $('#cartS, #cartWrapme').hide();
        }
    }
    ownInitAjaxAddToCartButton('input.add_button', updateCart);
});

function ownInitAjaxAddToCartButton(handle, onAddToCart) {
    jQuery(handle).click(function(e){
        e.preventDefault();
        if (checkQuantityLimit($(this))) addOrderItem($(this).parents("form:first"), onAddToCart);
    });
}

function checkQuantityLimit(buy_button){
  var variant_id = buy_button.parents("form:first").find("#variant-select").val();
  // введённое кол-во товара:
  var current_variant_quantity = parseInt($("#cartQuantity").val());
  // кол-во товара на складе:
  var item_variant_quantity = parseInt($("input[name='item_variant_quantity_"+variant_id+"']").val());
  // уже заказанное кол-во товара:
  var item_ordered_quantity = $("#item_quantity_"+variant_id).attr("id")!=undefined ? parseInt($("#item_quantity_"+variant_id).text()) : 0;
  if ((current_variant_quantity + item_ordered_quantity) > item_variant_quantity ){
    showQuantityWarning();
    return false;
  }
  hideQuantityWarning();
  return true;
}

function showQuantityWarning(){
  $('#quantity-limit-warning').show();
}
function hideQuantityWarning(){
  $('#quantity-limit-warning').hide();
}

function initCart() {
    var cart = new Cart();
    cart.create();
}

function Cart() {
    var that= this;
    this.create = function (data){
    $('#cartContainer').css('top',-15000);
      $('#littleCart').mouseenter(this.show);
      $('#littleCart').mouseleave(function(){that.hide()});
      $('#cartBox').mouseenter(this.show);
      $('#cartBox').mouseleave(function(){that.hide()});
    }

    this.show = function (){
        $('#cartWrap').show(0);
        if($.browser.msie && parseInt($.browser.version)<7){ $("select").css("visibility","hidden"); }
        $('#cartWrap').css('height',$('#cartContainer').outerHeight(true));
        return $('#cartContainer').stopTime("hideCart").stop(true,true).animate({'top':0},300);
    }

    this.hide = function (timeout){
        if(!timeout){
          timeout = 500;
        }
        $('#cartContainer').oneTime(timeout, "hideCart", function() {
          $(this).animate({'top':-1*$(this).outerHeight(true)},300,function(){
            $('#cartWrap').hide(0);
            $('#cartWrap').css('height',0);
            if($.browser.msie && parseInt($.browser.version)<7){ $("select").css("visibility","visible"); }
            });
          $('#cartNotices').remove();
    });
    }
}


//анонимная функция для проверки всех элементов с классом .fixMinMaxwidth
var fixMinMaxwidth=function(el){
   //только для браузеров без поддержки этого свойства
   if (typeof document.body.style.maxHeight !== "undefined" &&
      typeof document.body.style.minHeight !== "undefined") return false;

   //обходим в цикле все элементы
   $(el).each(function(){
      //получаем значение максимальной и минимальной ширины
      var maxWidth = parseInt($(this).css("max-width"));
      var minWidth = parseInt($(this).css("min-width"));

      //Выполняем,если min-/maxwidth установлены
      if (maxWidth>0 && $(this).width()>maxWidth) {
         $(this).width(maxWidth);
      } else if (minWidth>0 && $(this).width()<minWidth) {
         $(this).width(minWidth);
      }
   });
}

//инициация
$(document).ready(function(){
   fixMinMaxwidth(".thumb .prodImg");
   fixMinMaxwidth("#productPhoto a.defaultPhoto img");
});

//запускаем проверку после изменения размера окна
$(window).bind("resize", function(){
   fixMinMaxwidth(".thumb .prodImg");
   fixMinMaxwidth("#productPhoto a.defaultPhoto img");
});


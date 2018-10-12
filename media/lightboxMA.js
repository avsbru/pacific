/**
* jQuery LightBox
* @name Adaptative LightBox
* @author Łukasz Staliś
* @version 2.1
* @date 13.01.2010
* @category jQuery plugin
* @copyright Mediaambassador.pl
* @license *
* @description wersja poprawiona o wady v1.0 poprzez:
					done- optymalizację wydajnościową popupu poprzez jednokrotne dodawanie do htmlu elementu popupu i tylko pokazyanie i ukrywani go
*					done- możliwość dodawania wiecej niż jednego popupu na stronie
*					done- możliwość animacji dowolnej przed i po kluczowymi akcjami
*					done- zabezpieczenie na wypadek popupu większego niż szerokość strony
*					done- wprowadzenie akcji init(domyślnej)/show/hide/next/prev/goto
*					done- poprawienie pozycjonowania kontentu po zmiane jego wielkosci i zmianie wiekkości okna
					done- dodanie lightboxa zdjęciowego....lightbox gotowy ale wymaga testów przy wdrorzeniowych

			konfuguracja popupu:
				mode:'custom','default',
				autoShow:false,true
				close:'.lbCloseBtn',
				elements:'',
				fitToScreen:true,
				content:'<h2>lightboxMa popup v2.0</h2><p>The object which trigger initialization process and his cilck event shows popup window <strong>must have id attribute</strong>.</p><p>Also You can use: $(obj).lightboxMa("show") to show popup window and $(obj).lightboxMa("hide") to hide popup window</p><ul><li><dl><dt>mode: "custom", "default"</dt><dd>Custom option shows user definied content and default shows picture lightbox</dd></dl></li><li><dl><dt>elements: ".lightbox" (default)</dt><dd>CSS path to the elements which need to show in lightbox window.</dd></dl></li><li><dl><dt>autoShow: true, false</dt><dd>True option shows automaticly popup after initialization</dd></dl></li><li><dl><dt>close: "#lbCloseBtn"(default)</dt><dd>Reference to the button which will be used to close popup window</dd></dl></li><li><dl><dt>content: "Your content"</dt><dd>User definied content</dd></dl></li><li><dl><dt>beforeInit(ref,callback), afterInit(ref,callback), beforeShow(ref,callback), afterShow(ref), beforeHide(ref,callback), afterHide(ref)</dt><dd>Functions running on scecified time. "ref" is JQuery object which initialized lightbox. "callback" is a function which must be run on the end of animation/operation with parameter "ref".</dd></dl></li></ul><a class="lbCloseBtn" href="#">zamknij</a>',
				beforeInit:function(ref,callback){ callback(ref); },
				afterInit:function(ref,callback){ callback(ref); },
				beforeShow:function(ref,callback){ callback(ref); },
				afterShow:function(ref){},
				beforeHide:function(ref,callback){ callback(ref); },
				afterHide:function(ref){}
			dodatkowo możliwość dostepu do tych tablic w funkcjach eventowych za pomocą obiektów:

				var set=obj.data('set');
				var pSet=obj.data('pSet');	gdzie set zawiera konfigurację popupu a
						pSet={
							lock:false,
							refer:'lbMa'+'_'+obj.attr('id'),
							pictures:[],
							current:0
						}

*/

$.fn.extend({
	lightboxMa: function(type,data){
		var obj=$(this);
		function gotofn(obj,vars){
			var set=obj.data('set');
			var pSet=obj.data('pSet');
			pSet.lock=true;
			$('#'+pSet.refer+' .lbDefaultContent .lbPrevBtn').hide();
			$('#'+pSet.refer+' .lbDefaultContent .lbNextBtn').hide();
			$('#'+pSet.refer+' .lbDefaultContent .lbCloseBtn').hide();
			$('#'+pSet.refer+' .lbDefault').empty();
			$('#'+pSet.refer+' .lbDefaultContent').css({width:'100px',height:'100px'});
			var img= new Image();
			img.onload=function(){
				var lbW=$('#'+pSet.refer+' .lbDefaultContent').outerWidth(true);
				var lbH=$('#'+pSet.refer+' .lbDefaultContent').outerHeight(true);
				var t=$('#'+pSet.refer+' .lbMoving').css('top');
				var l=$('#'+pSet.refer+' .lbMoving').css('left');
				var wOffset=$('#'+pSet.refer+' .lbMoving').outerWidth(true)-lbW;
				var hOffset=$('#'+pSet.refer+' .lbMoving').outerHeight(true)-lbH;
				var trueW=wOffset+img.width;
				var trueH=hOffset+img.height;

				if(set.fitToScreen==false){
					//zabezpieczenie na wypadek końca strony
					var widthD=$(document).width();
					if($.browser.msie && parseInt($.browser.version)<7 )widthD=$(window).width();
					var heightD=$(document).height();

					var toTop=parseInt(t)-(img.height-lbH)/2;
					var toLeft=parseInt(l)-(img.width-lbW)/2;

					if((toTop+trueH)>heightD)toTop=heightD-trueH;
					if((toLeft+trueW)>widthD)toLeft=widthD-trueW;

					if(toTop<0)toTop=0;
					if(toLeft<0)toLeft=0;

					$('#'+pSet.refer+' .lbDefault').removeClass('loading');

					$('#'+pSet.refer+' .lbMoving').animate({top:toTop,left:toLeft},600);
					$('#'+pSet.refer+' .lbDefaultContent').animate({width:img.width,height:img.height},600,function(){

						$('#'+pSet.refer+' .lbDefault img').css({width:img.width,height:img.height}).show();

						if(trueW>widthD||trueH>heightD)obj.lightboxMa('resize');
						if(vars!=0)$('#'+pSet.refer+' .lbDefaultContent .lbPrevBtn').show();
						if(vars<(pSet.pictures.length-1))$('#'+pSet.refer+' .lbDefaultContent .lbNextBtn').show();
						$('#'+pSet.refer+' .lbDefaultContent .lbCloseBtn').show();
						pSet.lock=false;
					});

				} else {
						var wWindow=$(window).width();
						var hWindow=$(window).height();
						var itemW=wWindow>trueW?img.width:(wWindow-wOffset);
						var itemH=hWindow>trueH?img.height:(hWindow-hOffset);
						if(itemW<set.minWidth)itemW=set.minWidth;
						if(itemH<set.minHeight)itemH=set.minHeight;

						if((itemW/img.width)*img.height>itemH){
							itemW=(itemH/img.height)*img.width;
						} else {
							itemH=(itemW/img.width)*img.height;
						};
						$('#'+pSet.refer+' .lbDefault').removeClass('loading');
						$('#'+pSet.refer+' .lbMoving').animate({top:parseInt(t)-(itemH-lbH)/2,left:parseInt(l)-(itemW-lbW)/2},600);

						$('#'+pSet.refer+' .lbDefaultContent').animate({width:itemW,height:itemH},600,function(){

							$('#'+pSet.refer+' .lbDefault img').css({width:itemW,height:itemH}).show();
							if(vars!=0)$('#'+pSet.refer+' .lbDefaultContent .lbPrevBtn').show();
							if(vars<(pSet.pictures.length-1))$('#'+pSet.refer+' .lbDefaultContent .lbNextBtn').show();
							$('#'+pSet.refer+' .lbDefaultContent .lbCloseBtn').show();
							pSet.lock=false;
						});
				};
			};
			obj.lightboxMa('show');
			$('#'+pSet.refer+' .lbDefault').addClass('loading');
			img.src=pSet.pictures[vars].max;
			$('<img src="'+pSet.pictures[vars].max+'" alt="'+pSet.pictures[vars].minTitle+'">').appendTo('#'+pSet.refer+' .lbDefault').hide(0);
			$('<div class="lbDefaultTitle">'+pSet.pictures[vars].minTitle+'</div>').appendTo('#'+pSet.refer+' .lbDefault');
			$('#'+pSet.refer+' .lbDefaultTitle').css({bottom:-1*$('#'+pSet.refer+' .lbDefaultTitle').outerHeight(true)});
			pSet.current=vars;
		};
		function nextfn(obj,vars){
			var set=obj.data('set');
			var pSet=obj.data('pSet');
			if(pSet.lock)return;
			if(pSet.current<(pSet.pictures.length-1))obj.lightboxMa('goto',(pSet.current+1));
		};
		function prevfn(obj,vars){
			var set=obj.data('set');
			var pSet=obj.data('pSet');
			if(pSet.lock)return;
			if(pSet.current>0)obj.lightboxMa('goto',(pSet.current-1));

		};
		function showfn(obj,vars){
			var set=obj.data('set');
			var pSet=obj.data('pSet');
			function showCallback(obj){
				var set=obj.data('set');
				var pSet=obj.data('pSet');
				$('#'+pSet.refer).css('visibility','visible');
				set.afterShow(obj);
			};
			obj.lightboxMa('resize');
			set.beforeShow(obj,showCallback);
		};
		function hidefn(obj,vars){
			var set=obj.data('set');
			function showCallback(obj){
				var set=obj.data('set');
				var pSet=obj.data('pSet');
				$('#'+pSet.refer).css('visibility','hidden');
				set.afterHide(obj);
				$('#'+pSet.refer+' .lbBg, #'+pSet.refer+' .lbBgMoving').height(0).width(0);
			};
			set.beforeHide(obj,showCallback);
		};
		function resizefn(obj){

			var set=obj.data('set');
			var pSet=obj.data('pSet');
			var ref=pSet.refer;



			var width=$('#'+ref+' .lbMoving').outerWidth(true);
			var height=$('#'+ref+' .lbMoving').outerHeight(true);
			var widthD=$(document).width();
			if($.browser.msie && parseInt($.browser.version)<7) widthD=$(window).width();


			var heightD=$(document).height();
			$('#'+ref+' .lbBg, #'+ref+' .lbBgMoving').css({'height':height>heightD?height:heightD, 'width':width>widthD?width:widthD});


			var left=($(window).width()-width)/2+$(document).scrollLeft();
			var top=($(window).height()-height)/2+$(document).scrollTop();
			if(left<0)left=0;
			if(top<0)top=0;

			if((left+width)>$(document).width())left=$(document).width()-width;
			if((top+height)>$(document).height())top=$(document).height()-height;


			if(set.mode=='custom'&& $('#'+ref).css('visibility')=='visible'){
				$('#'+ref+' .lbMoving').stop();
				$('#'+ref+' .lbMoving').animate({'left':left,'top':top},300);
			} else $('#'+ref+' .lbMoving').css({'left':left,'top':top});

			return false;
		};

		function initfn(obj,vars){
			var set={
				mode:'default',
				extendShow:false,
				autoShow:false,
				close:'.lbCloseBtn',
				elements:'.lightbox',
				fitToScreen:true,
				minWidth:200,
				minHeight:200,
				content:'<h2>lightboxMa popup v2.0</h2><p>The object which trigger initialization process and his cilck event shows popup window <strong>must have id attribute</strong>.</p><p>Also You can use: $(obj).lightboxMa("show") to show popup window and $(obj).lightboxMa("hide") to hide popup window</p><ul><li><dl><dt>mode: "custom", "default"</dt><dd>Custom option shows user definied content and default shows picture lightbox</dd></dl></li><li><dl><dt>elements: ".lightbox" (default)</dt><dd>CSS path to the elements which need to show in lightbox window.</dd></dl></li><li><dl><dt>autoShow: true, false</dt><dd>True option shows automaticly popup after initialization</dd></dl></li><li><dl><dt>close: "#lbCloseBtn"(default)</dt><dd>Reference to the button which will be used to close popup window</dd></dl></li><li><dl><dt>content: "Your content"</dt><dd>User definied content</dd></dl></li><li><dl><dt>beforeInit(ref,callback), afterInit(ref,callback), beforeShow(ref,callback), afterShow(ref), beforeHide(ref,callback), afterHide(ref)</dt><dd>Functions running on scecified time. "ref" is JQuery object which initialized lightbox. "callback" is a function which must be run on the end of animation/operation with parameter "ref".</dd></dl></li></ul><a class="lbCloseBtn" href="#">zamknij</a>',
				beforeInit:function(ref,callback){ callback(ref); },
				afterInit:function(ref,callback){ callback(ref); },
				beforeShow:function(ref,callback){ callback(ref); },
				afterShow:function(ref){},
				beforeHide:function(ref,callback){ callback(ref); },
				afterHide:function(ref){}
			};
			set=jQuery.extend(set,vars);
			var pSet={
				lock:false,
				refer:   set.mode=='default'?'lbMaDefault':'lbMa'+'_'+obj.attr('id'),
				pictures:[],
				current:0
			};

			function initCallback(obj){
				var set=obj.data('set');
				var pSet=obj.data('pSet');
				//setup logic
				$('<div id="'+pSet.refer+'"><div class="lbBg">&nbsp;</div><div class="lbBgMoving"><div class="lbMoving"><div class="lbMovingTop"><div class="left"><div class="right"><div class="center">&nbsp;</div></div></div></div><div class="lbMovingContent"><div class="left"><div class="right"><div class="lbContent"></div></div></div></div><div class="lbMovingBottom"><div class="left"><div class="right"><div class="center">&nbsp;</div></div></div></div></div></div></div>').appendTo('body').css('visibility','hidden');


				if(set.mode=='default'){
					pSet.pictures= new Array();
					if($(set.elements).length==0){
						obj.each(function(i){
						pSet.pictures.push({max:$(this).attr("href"),maxTitle:$(this).attr("title"),min:$(this).children('img').attr("src"),minTitle:$(this).children('img').attr("alt")});

						$(this).click(function(){
							obj.lightboxMa('goto',i);
							return false;
							});
						});

					} else {

						$(set.elements).each(function(i){
							pSet.pictures.push({max:$(this).attr("href"),maxTitle:$(this).attr("title"),min:$(this).children('img').attr("src"),minTitle:$(this).children('img').attr("alt")});
							if(set.extendShow==true){
								$(this).click(function(){
									pSet.current=i;
									return false;
								});
							} else {
								$(this).click(function(){
									obj.lightboxMa('goto',i);
									return false;
								});

							};

						});

					};
					$('#'+pSet.refer+' .lbContent').replaceWith('<div class="lbDefaultContent"><a href="#" class="lbPrevBtn">poprzednie</a><a href="#" class="lbNextBtn">następne</a><div class="lbDefault"><div class="lbDefaultTitle">tytuł</div></div><a href="#" class="lbCloseBtn">zamknij</a></div>');
					$('#'+pSet.refer+' .lbDefaultContent .lbPrevBtn').click(function(){
						obj.lightboxMa('prev');
						return false;
					});
					$('#'+pSet.refer+' .lbDefaultContent .lbNextBtn').click(function(){
						obj.lightboxMa('next');
						return false;
					});
				} else {
					$('#'+pSet.refer+' .lbContent').append(set.content);
				};

				if(set.mode=='default'&&set.extendShow==true){
					obj.click(function(){
						obj.lightboxMa('goto',pSet.current);
						return false;
					});
				} else {
					obj.click(function(){
						obj.lightboxMa('show');
						return false;
					});
				};

				$('#'+pSet.refer+' .lbDefault').hover(function(){
					if($('#'+pSet.refer+' .lbDefaultTitle').text()!='')$('#'+pSet.refer+' .lbDefaultTitle').stop().animate({bottom:0},400);
				},function(){
					$('#'+pSet.refer+' .lbDefaultTitle').stop().animate({bottom:-1*$('#'+pSet.refer+' .lbDefaultTitle').outerHeight(true)},400);
				});
				if(set.mode=='default'){
					$('#'+pSet.refer+' '+set.close+', #'+pSet.refer+' .lbBgMoving').click(function(){obj.lightboxMa('hide'); return false;});
				} else {
					$('#'+pSet.refer+' '+set.close).click(function(){obj.lightboxMa('hide'); return false;});
				};
				obj.lightboxMa('resize');
				obj.data('set',set);
				obj.data('pSet',pSet);
				function afterInitCallback(obj){
					var set=obj.data('set');
					if(set.autoShow)obj.lightboxMa('show');
				};
				$('#'+pSet.refer+' .lbBg, #'+pSet.refer+' .lbBgMoving').height(0).width(0);
				set.afterInit(obj,afterInitCallback);

			}

			obj.data('set',set);
			obj.data('pSet',pSet);
			set.beforeInit(obj,initCallback);
		};
		if(obj.length==0)return;
		switch(type){
			case 'goto':gotofn(obj,data);break;
			case 'next':nextfn(obj,data);break;
			case 'prev':prevfn(obj,data);break;
			case 'show':showfn(obj,data);break;
			case 'hide':hidefn(obj,data);break;
			case 'resize':resizefn(obj);break;
			default :initfn(obj,type);break;
		};

		$(window).resize(function(){
			resizefn(obj);
		});

		return false;
	}
});


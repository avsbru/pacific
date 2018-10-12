/**
/** zoommerMa to funkcja pozwalająca na powiększanie zdjęć w zadany sposób
/** @version 1.0
/** @autor Łukasz Staliś
/** @date 16-11-2009
/** @company MediaAmbassador
/** @rights All rights reserved
/**
/** need template like this:
/**
			<a class="" (or) id="" href="to big image" > //must have no style
				<img src="to normal image">
			</a>
**/


jQuery.fn.extend({
	zoommerMa:function(set){
		var obj=$(this);
		var settings={
			position:"right", //left,right,top, bottom
			width:400,
			height:400,
			offsetTop:0,
			offsetLeft:0,
			loadingTxt:'Загружается...',
			afterInit:function(obj){},
			beforeShow:function(obj){},
			afterShow:function(obj){},
			beforeHide:function(obj){},
			afterHide:function(obj){}
		};
		var settingsPrivate={
			active:false,
			zoomHref:'',
			zoommingImg:'',
			scale:1,
			maxWidth:0,
			maxHeight:0,
			width:0,
			height:0,
			lock:0,
			minWidth:0,
			minHeight:0
		};
		settings=jQuery.extend(settings,set);
		obj.click(function(){
			return false;
		});

		function refresh(e){
			settingsPrivate.lock++;
			if(settingsPrivate.lock%5==1)return;
			var off=obj.offset();
			var fromTop=(off.top-e.pageY)/settingsPrivate.scale+settings.height/2;
			var fromLeft=(off.left-e.pageX)/settingsPrivate.scale+settings.width/2;
			var boxTop=(e.pageY-off.top)-settingsPrivate.minHeight/2;
			var boxLeft=(e.pageX-off.left)-settingsPrivate.minWidth/2;
			if(boxTop<0){
				fromTop=0;
				boxTop=0;

			} else if((boxTop+settingsPrivate.minHeight)>=settingsPrivate.height){
				boxTop=settingsPrivate.height-settingsPrivate.minHeight;
				fromTop=-$('.zoommerMa img').height()+settings.height;
			};
			if(boxLeft<0){
				fromLeft=0;
				boxLeft=0;
			} else if((boxLeft+settingsPrivate.minWidth)>=settingsPrivate.width){
				fromLeft=-$('.zoommerMa img').width()+settings.width;
				boxLeft=settingsPrivate.width-settingsPrivate.minWidth;
			};


			$('.zoommerMaBox img').css({top:-parseInt(boxTop),left:-parseInt(boxLeft)});
			$('.zoommerMaBox').css({display:'block',top:parseInt(boxTop),left:parseInt(boxLeft)});
			$('.zoommerMa img').css({top:parseInt(fromTop),left:parseInt(fromLeft)});
		};
		function show(){
			settings.beforeShow();
			$('.zoommerMa').css('display','block');
			$(obj.children('img')).css('opacity',0.4);
			obj.bind('mousemove',refresh);
			settings.afterShow();
		};
		function hide(){
			settings.beforeHide();
				$('.zoommerMa').css('display','none');
				$('.zoommerMaBox').css('display','none');
				obj.unbind('mousemove',refresh);
				$(obj.children('img')).css('opacity',1);
			settings.afterHide();
		};
		function preload(todo){
			switch(todo){
				case 'show':{
					$('.zoommerLoading').css('display','block');
				};break;
				case 'hide':{
					$('.zoommerLoading').css('display','none');
				};break;
			};
		};
		function load(){
			if($(obj.children('img')).width()==0)return;
			var img=new Image();
			img.onload=function(){
				settingsPrivate.zoomHref=obj.attr('href');
				settingsPrivate.scale=$(obj.children('img')).width()/this.width;
				settingsPrivate.width=$(obj.children('img')).width();
				settingsPrivate.height=$(obj.children('img')).height();
				settingsPrivate.maxHeight=this.height;
				settingsPrivate.maxWidth=this.width;
				settingsPrivate.minWidth=$(obj.children('img')).width()*settings.width/this.width;
				settingsPrivate.minHeight=$(obj.children('img')).height()*settings.height/this.height;
				settingsPrivate.lock=0;
				$(".jqzoom").width($(obj.children('img')).width());
				$('.zoommerMa img').attr('src',obj.attr('href'));
				$('.zoommerMaBox img').attr('src',$(obj.children('img')).attr('src'));
				if(settings.position=='bottom'||settings.position=='left'){
					var off=obj.offset();
					var topper=off.top+settings.offsetTop;
					var lefter=off.left+settings.offsetLeft;
					switch(settings.position){
						case 'top':topper-=settings.height;break;
						case 'bottom':topper+=$(obj.children('img')).height();break;
						case 'left':lefter-=settings.width;break;
						case 'right':lefter+=$(obj.children('img')).width();break;
					};
					$('.zoommerMa').css({
						top:topper,
						left:lefter,
						width: settings.width,
						height:settings.height
					});
				};
				$('.zoommerMa').css('display','none');
				$('.zoommerMaBox').css({
					display:'none',
					width:settingsPrivate.minWidth,
					height:settingsPrivate.minHeight
				});
				$('.zoommerMaBox img').css({
					width:$(obj.children('img')).width(),
					height:$(obj.children('img')).height()
				});
				preload('hide');
				if(settingsPrivate.active==true)show();
			};
			preload('show');
			img.src=obj.attr('href');

		};

		$(this).hover(
			function(e){
				if(settingsPrivate.active==true)return;
				settingsPrivate.active=true;
				if(settingsPrivate.zoommingImg!=$(obj.children('img')).attr('src')){
					var img= new Image();
					img.onload=function(){
						var off=obj.offset();
						var topper=off.top+settings.offsetTop;
						var lefter=off.left+settings.offsetLeft;
						switch(settings.position){
							case 'top':topper-=settings.height;break;
							case 'bottom':topper+=$(obj.children('img')).height();break;
							case 'left':lefter-=settings.width;break;
							case 'right':lefter+=$(obj.children('img')).width();break;
						};
						$('.zoommerMa').css({display:'none',top:topper,left:lefter,width:settings.width,height:settings.height});
						if(obj.attr('href')!=settingsPrivate.zoomHref)load(); else show();
					};
					img.src=$(obj.children('img')).attr('src');

				} else {
					if(obj.attr('href')!=settingsPrivate.zoomHref)load(); else show();
				};
			},function(){
				if(settingsPrivate.active==false)return;
				settingsPrivate.active=false;
				hide();
			}
		);
		var off=obj.offset();
		var topper=off.top+settings.offsetTop;
		var lefter=off.left+settings.offsetLeft;
		switch(settings.position){
			case 'top':topper-=settings.height;break;
			case 'bottom':topper+=$(obj.children('img')).height();break;
			case 'left':lefter-=settings.width;break;
			case 'right':lefter+=$(obj.children('img')).width();break;
		};
		$('body').append('<div class="zoommerMa"><img src="'+obj.attr('href')+'" ></div>');
		$(obj).append('<div class="zoommerMaBox"><img src="'+$(obj.children('img')).attr('src')+'"></div>');
		$('<p class="zoommerLoading">'+settings.loadingTxt+'</p>').appendTo(obj);
		$('.zoommerLoading').css({display:'none',opacity:0.6});
		$('.zoommerMaBox').css({display:'none',zIndex:200});
		$('.zoommerMa').css({display:'none',top:topper,left:lefter,width:settings.width,height:settings.height});
		obj.data('settings',settings);
		obj.data('settingsPrivate',settingsPrivate);
		settings.afterInit();
	}

});


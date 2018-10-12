/** 
/** ScrollerMa to funkcja pozwalająca na przewijanie zdjęć w zadany sposób
/**	@version 2.0
/** @autor Łukasz Staliś
/**	@date 19-01-2009
/**	@company MediaAmbassador
/**	@rights All rights reserved
/**	
/**	need template like this:
/**			
			<div id="your id where scroller must be add" class="clearfix">
				<item style="flaot:left;"></item>
				<item style="flaot:left;"></item>
				<item style="flaot:left;"></item>
			</div>
**/


jQuery.fn.extend({
	scrollerMa:function(settings,data){
		var obj=this;
		function goto(obj,pos){
			
			var set=$(obj).data('set');
			var pSet=$(obj).data('pSet');
			if(pSet.lock)return;
			
			function gotoCallback(obj,pos){
				var set=$(obj).data('set');
				var pSet=$(obj).data('pSet');
				
				$(set.prev).hide();
				$(set.next).hide();
				
				function makeMove(obj,a,b){
					
					$('#'+pSet.id+'MovingArea').animate({left:a,top:b},set.duration,function(){
						
						if(set.buttonsStillVisible){
							$(set.prev).show();
							$(set.next).show();				
						} else {
							if(pos>0)$(set.prev).fadeIn(set.duration/pSet.mnoznik);
							if(pos+pSet.mnoznik<pSet.length)$(set.next).fadeIn(set.duration/pSet.mnoznik);
						};							
						set.onAfter(obj);
						
					});
					
				};
				
				switch(set.mode){
					case 'horizontal':makeMove(obj,-1*(Math.floor(pos/set.itemsPerStep)*pSet.width)+set.offset,0);break;
					case 'vertical':makeMove(obj,0,-1*(Math.floor(pos/set.itemsPerStep)*pSet.height)+set.offset);break;
					case 'custom':{};break;
				};
				
				
				
				
				pSet.current=pos;
				pSet.lock=false;
			};
			set.onBefore(obj,gotoCallback,pos);
		};
		function next(obj){
			var set=$(obj).data('set');
			var pSet=$(obj).data('pSet');
			
			var pos=pSet.current+pSet.mnoznik;
			if((set.lastFull)&&(pos+pSet.mnoznik>pSet.length))pos=pSet.length-pSet.mnoznik;
			
			obj.scrollerMa('goto',pos);
		};
		function prev(obj){
			var set=$(obj).data('set');
			var pSet=$(obj).data('pSet');
			
			var pos=pSet.current-pSet.mnoznik;
			if(pos<0)pos=0;
		
			obj.scrollerMa('goto',pos);
		};
		
		function init(obj,data){
			
			var set={
				mode:"horizontal", //change,vertical,horizontal
				navType:"button",//button, slider
				steps:5,
				duration:500, //in milisecond
				itemsPerStep:1,
				lastFull:false,
				offset:0,
				items:'li',
				next:'',
				prev:'',
				scroll:'',
				buttonsStillVisible:false,
				afterInit:function(obj){},
				onBefore:function(obj,callback,pos){callback(obj,pos);},
				onAfter:function(obj){}
			};
			
			set=jQuery.extend(set,settings);
			
			var pSet={
				id:$(obj).attr("id"),
				mnoznik:set.steps*set.itemsPerStep,
				length:0,
				width:0,
				height:0,
				current:0,
				lock:false
			};
			
			var contentHtml='<div id="'+pSet.id+'Wraper"><div id="'+pSet.id+'MovingArea">'+$(obj).html()+'</div></div>';
			switch(set.navType){
				case 'button':{
						if(set.prev==''){
							set.prev='#'+pSet.id+'Prev';
							contentHtml='<a href="#" id="'+pSet.id+'Prev">Предыдущий</a>'+contentHtml;
						};
						if(set.next==''){
							set.next='#'+pSet.id+'Next';
							contentHtml=contentHtml+'<a href="#" id="'+pSet.id+'Next">Следующий</a>';
						};
						$(obj).empty().append(contentHtml);
						$(set.next).click(function(){
							obj.scrollerMa('next');
							return false;
						});
						$(set.prev).click(function(){
							obj.scrollerMa('prev');
							return false;
						});						
				};break;
				case 'slider':{
						if(set.scroll=='')contentHtml=contentHtml+'<div id="'+pSet.id+'Slider">Тут должен быть слайдер</div>';
						$(obj).empty().append(contentHtml);
				};break;
			};
			
			$(obj).css({position:'relative'});
						
			$('#'+pSet.id+'Wraper').css({position:'relative',overflow:'hidden'});
			$('#'+pSet.id+'MovingArea').css({top:0,left:0,position:'absolute'});
			$('#'+pSet.id+' '+set.items).css({float:'left',margin:0});
			
			pSet.length=$('#'+pSet.id+' '+set.items).length;
			if(!set.buttonsStillVisible)$(set.prev).hide();
			if((!set.buttonsStillVisible)&&pSet.mnoznik>=pSet.length)$(set.next).hide();//?? nie testowane
			pSet.width=$('#'+pSet.id+' '+set.items).outerWidth(true);
			pSet.height=$('#'+pSet.id+' '+set.items).outerHeight(true);
				
			var wd=0;
			var hd=0;
			
			
			switch(set.mode){
				case 'horizontal':{
					wd=pSet.width*pSet.length/set.itemsPerStep+pSet.length;
					hd=pSet.height*set.itemsPerStep+set.itemsPerStep;
					$('#'+pSet.id+'MovingArea').css({'top':0,'left':set.offset,'width':wd,'height':hd});
				};break;
				case 'vertical':{
					wd=pSet.width*set.itemsPerStep+set.itemsPerStep;
					hd=pSet.height*pSet.length/set.itemsPerStep+pSet.length;
					$('#'+pSet.id+'MovingArea').css({'left':0,'top':set.offset,'width':wd,'height':hd});
				};break;
				case 'custom':{
							
				};break;
			
			};
			
			$(obj).data('set',set);
			$(obj).data('pSet',pSet);
			set.afterInit(obj);		
		};		
		
		
		
		switch(settings){
			case 'goto':goto(obj,data);break;
			case 'next':next(obj);break;
			case 'prev':prev(obj);break;
			default: init(obj,settings);break;
		}
		
	}
});
$(function(){
	function makepoker(){
		var poker=[ ];  //声明一个数组
		var colors=['h','s','c','d'];  // [红桃,黑桃,方片,梅花]
		var biao={}
		while(poker.length!=52){   //
			var n=Math.ceil(Math.random()*13)   //ceil向上取整1~13的随机数
			var c=colors[Math.floor(Math.random()*4)]   //随机从colors中去取一个花色
			var v={   
				color:c,
				number:n
			}
			if(!biao[c+n]){
				biao[c+n]=true;
				poker.push(v)
				
			}
		}
		return poker
	}
	var poker=makepoker();
	function setpoker(poker){
		var didt={
			1:'A',2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,10:'T',11:'J',12:'Q',13:'K'
		}
		//上边的28张牌
		var index=0;
		for (var i=0,poke; i<7; i++){
			for (var j=0; j<i+1; j++) {
				poke=poker[index]
				// console.log(poke)
				index+=1;
				$('<div>')
				.attr('data-number',poke.number)
				.attr('id',i+'_'+j)
				.addClass('pai')
				.css('background-image','url(./image/'+didt[poke.number]+poke.color+'.png)')
				.appendTo('.scene')
				.delay(index*20)
				.animate({
					top:i*40,
					left:(6-i)*65+j*130+50,
					opacity:1
				})
				
			};
		}
		//下边的24张牌
		for (;index<poker.length; index++) {
			var v=poker[index]
			  $('<div>')
				.attr('data-number',v.number)
				.addClass('pai left') //给左侧的加了一个left类
				.css('background-image','url(./image/'+didt[v.number]+v.color+'.png)')
				.appendTo('.scene')
				.delay(index*20)
				.animate({
					top:420,
					left:200,
					opacity:1
				})
		};	
	}
	setpoker(poker)
	//点击向右移的按钮
	$('.scene .move-right').on('click',(function(){
		var zIndex=1;
		return function(){
		if($('.left').length==0){
			return;
		}
		$('.left').last()    //把有.left这个类名的最后一张
		.css('zIndex',zIndex++)  //设置层级  
		.animate({left:650})   //移到距离左边650px
		// .css({top:'+=20'})
		.queue(function(){  //入队
			$(this).removeClass('left').addClass('right').dequeue() //移到右边后去掉left这个类名加上right这个类名  .dequeue出队
		})
	}
	})())
	//点击向左移的按钮
	var number=0;
	$('.scene .move-left').on('click',(function(){
		return function(){
			number+=1;
			if(!$('.left').length){  //左边没牌
				if(number>3){
				return;
				}
				$('.right').each(function(i){
					//输出1.arguments 2.this的指向  3.jquery中函数的this大部分情况指向集合中的一个(dom)元素
				$(this)
					.css('zIndex',0)
					.delay(i*50)  //i是下标
					.animate({left:200})
					// .css({top:'-=20'})
					.queue(function(){
						$(this)
						.removeClass('right')
						.addClass('left')
						.dequeue()
				})
				})
			}
		}
	})())
	function getnumber(el){  //getnumber 拿到点击的那张牌 把它身上自定义属性data-number的值拿到  转换为整型 返回 
		return parseInt($(el).attr('data-number'))
	}
	function isCanClick(el){   //id上保留的是4_5 第四排的第五张排
		var x=parseInt($(el).attr('id').split('_')[0]);  //拿到id这个属性的值  以_来拆分 去里边下标为0的值 转换为整型
		var y=parseInt($(el).attr('id').split('_')[1]);
		if($('#'+(x+1)+'_'+y).length||$('#'+(x+1)+'_'+(y+1)).length){ //id为4_5的, 
			//如果有5_5或者有5_6的话他就是被压住的
			return false;
		}else{
			return true;
		}
	}
	//事件委派
	var prev=null;  
	var defen=0;
	$('.scene').on('click','.pai',function(){  
		if($(this).attr('id')&&!isCanClick(this)){ //如果被压住直接返回
			return;
		}
		// $(this).css('border','10px solid red')
		// console.log(getnumber(this))
		if(getnumber(this)===13){//如果是13直接返回
			$(this).animate({
				top:0,
				left:700
			}).queue(function(){
				$(this).detach().dequeue()//detach()
			})
			$('.defen .text').text(defen+=10)

			return;
		}
		if(prev){   //第一次的时候prev是null 是假走else   //第二次判断的时候prev为真走下边
			// console.log(prev)

			if(getnumber(prev)+getnumber(this)===13){  //如果前一次的数值和当前的数值相加==13
				prev.add(this).animate({
					top:0,
					left:700
				}).queue(function(){
				$(this).detach().dequeue()
			})
			$('.defen .text').text(defen+=10)

			}else{
				if(getnumber(prev)==getnumber(this)){
					return;
				}
				$(this)
				.animate({top:'-=20'})
				.animate({top:'+=20'})
				prev.delay(400).animate({top:'+=20'})
				// prev.add(this).css('border','none')
			}
			prev=null; 
		}
		else{
		prev=$(this)  //保存下当前这个对象
		prev.animate({
			top:'-=20'
		})
	// console.log(prev)
		}
	})
	//开始按钮
	var t=0
	$('.start,.restart').on('click',function(){

		$('.text').text(defen=0)
		$('.pai').remove();
		$('.move-left').css({opacity:1})
		$('.move-right').css({opacity:1})
		setpoker(poker)
		clearInterval(t)
		var min=3;
		var mm='0'+min
		var djs=59;
		$('.daojishi .text').text(mm+':'+djs)
			t=setInterval(move,1000)
			function move(){
			var dd=djs<=9?'0'+djs:djs
			if(djs==0){
				min-=1;
			    mm='0'+min
				djs=59;	
				if(min<=0){
					min=0
					dd=0
				}
			}
			djs-=1;
			var time=$('.daojishi .text').text(mm+':'+dd)

		}
		clearInterval(t)
		 t=setInterval(move,1000)
	})
	//结束按钮
	$('.end').on('click',function(){
		// $('.end').toggleClass('fangda')
		$('.text').text(defen=0)
		$('.move-left').css({opacity:0})
		$('.move-right').css({opacity:0})
		$('.pai').hide(1000,function(){
			$('.pai').remove()
		});
		clearInterval(t)
		
	})
	$(document).on('mousedown',false)//阻止浏览器默认动作
	///介绍按钮
	$('.jieshao').on('click',function(){
		$('.jieshao').toggleClass('fangda')
		$('.guize').toggleClass('active')
	})
})
//header
{
	let $more = $("#header .more");
	$more.click(function() {
		$(this).find(".hide-more").toggle()
	});
}
//banner
{
	let $banner = $("#banner"),
		$part = $("#banner .part"),
		$tab = $("#banner .b-tab li"),
		length = $tab.length,
		index = 0,
		timer = null;

	$tab.eq(0).addClass("active");
	$part.eq(0).show();
	//点击
	$tab.click(function(){
		if ($(this).index()  !== index) {
			change(function(){
				index = $(this).index();
			}.bind(this));
		}
		
	});
	//自动轮播
	auto();
	$banner.hover(function(){
		clearInterval(timer);
	},auto)
	function auto(){
		timer = setInterval(function(){
			change(function(){
				index++;
				index %= length;
			});
		},3000)
	};
	function change(fn){
		$part.eq(index).fadeOut(500);
		$tab.eq(index).removeClass("active");
		fn && fn();
		$part.eq(index).fadeIn(500);
		$tab.eq(index).addClass("active");
	}
}
//classic
(function(){
	var $ul = $("#classic .c-main ul"),   		 //整个轮播盒子
		$li = $ul.children(),             		 //每张图
		$btn = $("#classic .btn div"),    		 //左右按钮
		width = $ul.children().eq(0).width(),    //获取整个ul的宽度
		length = $li.length,                     //获取li的个数
		midIndex = Math.floor(length/2),         //获取最中间的下标
		clickTimer = 0,                          //点击时间
		sumWidth = 0,                            //总宽度
		timer;                                   //定时器的名字
	changeName();
	setTimeout(function(){
		sumWidth = 0;    
		$li.each(function(){
			sumWidth += $(this).width();
		})
		$ul.css("marginLeft", -sumWidth/2 + "px").css("opacity" , 1);
	},300);

	//窗口改变的值
	$(window).resize(function(){
		clearTimeout(timer);
		timer = setTimeout(function(){
			width = $ul.children().eq(0).width();
			sumWidth = 0;    
			$li.each(function(){
				sumWidth += $(this).width();
			});
			$ul.animate({"marginLeft": -sumWidth/2 + "px"},300);
		},300)
	});
	//左右点击事件
	$btn.click(function(){
		if (new Date() - clickTimer > 350) {
			if ($(this).index()) {
				midIndex++;
				midIndex %= length;
				$ul.stop().animate({
					"marginLeft": -sumWidth/2 - width + "px"
				},300,function(){
					$(this).css("marginLeft", -sumWidth/2 + "px").append($(this).children().first());
				})
			}else {
				midIndex--;
				if(midIndex<0)midIndex=length-1;
				$ul.stop().animate({
					"marginLeft": -sumWidth/2 + width + "px"
				},300,function(){
					$(this).css("marginLeft", -sumWidth/2 + "px").prepend($(this).children().last());
				})
			}
			changeName();
			clickTimer = new Date();
		}
	});
	//初始值
	 function changeName() {
        var a = midIndex,
            b = midIndex + 1,
            c = midIndex - 1;
        if(b>=length)b=0;
        if(c<0)c=length-1;
        $li.removeClass('mid slide');
        $li.eq(a).addClass('mid');
        $li.eq(b).addClass('slide');
        $li.eq(c).addClass('slide');
    }
}())







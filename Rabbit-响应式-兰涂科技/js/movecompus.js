(function () {
    var $content = $('#content');
    var $part1 = $('#part1');
    $(window).resize(part1H);
    part1H();
    function part1H(){
        var winH = $(window).height();
        $part1.height(winH - parseFloat($content.css('margin')));
    }

})();
//part3点击
(function(){
	var $thirdLi =$("#part3 .p3-wrap .third ul li"),      //获取所有third下面的li
		$secondLi = $("#part3 .p3-wrap .second ul li"),   //获取所有second下面的li
		index = 0,  									  //获取下标
		length = $thirdLi.length,                 	      //获取长度
		timer;                                            //定时器名字
	$secondLi.eq(0).show();

	//thirdLi点击事件
	$thirdLi.click(function(){
		clearInterval(timer)
		index = $(this).index();
		$(this).addClass("active").siblings().removeClass("active");
		$secondLi.eq(index).show().siblings().hide();
		auto();
	})
	//自动轮播
	auto();
	function auto(){
		timer = setInterval(function(){
			index++;
			index %= length;
			$thirdLi.eq(index).addClass("active").siblings().removeClass("active");
			$secondLi.eq(index).show().siblings().hide();
		},3000)
	}
})();
//btn点击事件 
(function(){
 	var $part = $("#content .part");
 	$part.find(".btn").click(function(){
 		var index = $(this).parents(".part").index(".part");
 		var scrollTop = $part.eq(index+1).offset().top - ($(window).height() - $part.eq(index+1).height()+71)/2;
 		$("body,html").animate({
 			scrollTop : scrollTop
 		},800)
 	});
})();
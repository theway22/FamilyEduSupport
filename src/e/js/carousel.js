import  $ from  "jquery";
$.extend($.fn,{

	fullCaroursel:function(){
		let $this=$(this);
		let  rollLength=$(".carousel .car-big-picture img").size();
		$this.totalLength=rollLength;

		let rgb_arr = new Array("rgb(198, 198, 198)","rgb(238, 238, 238)","rgb(224, 232, 219)","rgb(33, 27, 123)","rgb(46, 167, 220)","rgb(0, 0, 0)");

		//setInterval(this.showPicture,5000);

		this.switchFocus=function(){
			$this.css("background-color","rgb(198, 198, 198)");//第一张图的背景
			var showimageindex = $this.find(".car-big-picture img:visible").index();

			showimageindex=(++showimageindex)%$this.totalLength;
			//先隐藏所有小图边框
			showPicture(showimageindex);
		}
		//点击左箭头
		$this.find(".car_c_inpt1").click(function(){

			console.log("点击做箭头");
			var showindex = $this.data("showindex");	//当前选中的图片eq编号
			if(showindex <= 0){
				var showindex = rollLength-1;
			}else{
				var showindex = showindex-1;
			}


		});
		//点击右箭头
		$this.find(".car_c_inpt2").click(function(){
			var showindex = $this.data("showindex");	//当前选中的图片eq编号
			showindex=++showindex%rollLength;
			showPicture(showindex);
		});
		//鼠标滑过小图
		$this.find(".car_c_smallpic img").mouseover(function(){
			var showindex =$(".car_c_smallpic img").index($(this));

			showPicture(showindex);
		});
		//鼠标事件轮播方法
		let showPicture=function(showindex){

			$this.find(".car-big-picture img").hide();	//先隐藏所有主图
			$this.find(".car_c_smallpic img").css("border","");
			$this.find(".car-big-picture img").eq(showindex).show();	//主图
			$this.css("background-color",rgb_arr[showindex]);	//主图背景
			$this.data("showindex",showindex);	//给div一个name值,代表当前自动轮到到哪张图,鼠标轮播时会用到这个值
			$this.find(".car_c_smallpic img").eq(showindex).css("border","solid 2px Darkorange");	//小图边框
			$this.find(".car_c_title p").hide().eq(showindex).show();//标题

		};

		this.switchFocus();
	}

});

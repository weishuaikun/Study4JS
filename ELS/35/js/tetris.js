window.$ = function(selector) {
	return document.querySelectorAll(selector);
}
//使用对象直接量创建tetris对象
var tetris = {
	RN : 20,
	CN : 10,
	CELL_SIZE : 26,
	IMGS : {
		O : 'img/O.png',
		I : 'img/I.png',
		T : 'img/T.png'
	},
	OFFSET_X : 15,
	OFFSET_Y : 15,
	shape : null,
	pg : null,
	//添加timer interval 属性
	timer : null,
	interval : 1000,
	//添加score、lines、level属性
	score : 0,
	lines : 10,
	level : 1,
	//添加游戏开始的方法
	start : function() {
		this.pg = $('.playground')[0];
		this.shape = this.randomShape();
		//调用softDrop方法
		this.softDrop();
		//添加定时下落方法
		this.timer = setInterval(function(){
			tetris.softDrop();
		},this.interval);
	},
	//创建绘制O型图像的方法
	paintShape : function() {
		//创建文档碎片
		var frag = document.createDocumentFragment();
		for (var i = 0; i < 4; i++) {
			var c = this.shape.cells[i];
			var x = c.col * this.CELL_SIZE + this.OFFSET_X;
			var y = c.row * this.CELL_SIZE + this.OFFSET_Y;
			var img = new Image();
			img.src = c.img;
			img.style.left = x + 'px';
			img.style.top = y + 'px';
			//将生成的方块添加到文档碎片中
			frag.appendChild(img);
		}
		//将文档碎片添加到场景中
		this.pg.appendChild(frag);
	},
	//添加随机生成不同小方块的方法
	randomShape : function(){
		switch(parseInt(Math.random()*3)){
			case 0: return new O();
			case 1: return new I();
			case 2: return new T();
		}
	},
	//添加softDrop方法
	softDrop : function(){
		this.paint();
		this.shape.softDrop();
	},
	//添加paint方法
	paint : function(){
		this.pg.innerHTML = this.pg.innerHTML.replace(/<img(.*?)>/g,"");
		this.paintShape();
		this.paintScore();
	},
	//添加paintScore方法
	paintScore : function(){
		$(".playground span")[0].innerHTML = this.score;
		$(".playground span")[1].innerHTML = this.lines;
		$(".playground span")[2].innerHTML = this.level;
	}
}

//调用开始方法
window.onload = function() {
	tetris.start();
}
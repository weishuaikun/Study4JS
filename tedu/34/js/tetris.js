window.$ = function(selector) {
	return document.querySelectorAll(selector);
}
//使用对象直接量创建tetris对象
var tetris = {
	timer:null,
	interval:3000,
	
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
	//记录游戏的得分、消除的行数、游戏难度
	score:0,
	lines:10,
	level:1,
	//填充游戏的得分
	paintScore:function(){
		//通过组合标签选择器拿到span标签数组
		var spans = $(".playground span");
		//通过下标取出对应的span标签并设置span标签包裹的内容
		spans[0].innerHTML = this.score;
		spans[1].innerHTML = this.lines;
		spans[2].innerHTML = this.level;
		
	},
	
	//添加游戏开始的方法
	start : function() {
		this.pg = $('.playground')[0];
		this.shape = new T();
		//this.paintShape();
		this.softDrop();
		//启动定时器
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
	//添加实现方块下落的方法
	softDrop:function(){
		//绘制俄罗斯方块
		this.paint();
		//调用俄罗斯方块对象的下落方法
		this.shape.softDrop();
	},
	//在画俄罗斯方块前清空游戏区域
	paint:function(){
		//<img></img>
		//<img id="id"></img>
		//<img/>
		//清空游戏区域
		//var reg = /(<img(.*?)>)/g;
		var reg = /(<img(.*?)>)+/;
		this.pg.innerHTML = this.pg.innerHTML.replace(reg,"");
		//画俄罗斯方块
		this.paintShape();
		//写分数
		this.paintScore();
	}
	
	
	
}

//调用开始方法
window.onload = function() {
	tetris.start();
}
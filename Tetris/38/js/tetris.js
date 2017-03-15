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
	wall : null,
	nextShape : null,
	//添加状态属性
	state : 0,
	STATE_RUNNING : 0,
	STATE_PAUSE : 1,
	STATE_OVER : 2,
	//添加图片属性
	IMG_OVER : "img/game-over.png",
	IMG_PAUSE : "img/pause.png",
	//添加游戏开始的方法
	start : function() {
		this.pg = $('.playground')[0];
		//使用二维数组创建背景墙
		this.wall = [];
		for(var i = 0; i < this.RN; i++){
			this.wall[i] = new Array(this.CN);
		}
		this.shape = this.randomShape();
		//随机产生下一个图形
		this.nextShape = this.randomShape();
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
		//调用canDrop方法
		if(this.canDrop()){
			this.shape.softDrop();
		}else{
			this.landIntoWall();
			//this.shape = this.nextShape;
			//this.nextShape = this.randomShape();
			//调用isGameover方法，改变游戏状态
			if(this.isGameOver()){
				this.state = this.STATE_OVER;
				//停止并清空定时器
				clearInterval(this.timer);
				this.timer = null;
				this.paint();
			}else{
				//游戏继续进行要做的事儿
				this.shape = this.nextShape;
				this.nextShape = this.randomShape();
			}
		}
		
	},
	//添加paint方法
	paint : function(){
		this.pg.innerHTML = this.pg.innerHTML.replace(/<img(.*?)>/g,"");
		//调用绘制背景墙的方法
		this.paintWall();
		this.paintShape();
		//调用绘制预告图形的方法
		this.paintNextShape();
		this.paintScore();
		//调用paintState方法
		this.paintState();
	},
	//添加paintScore方法
	paintScore : function(){
		$(".playground span")[0].innerHTML = this.score;
		$(".playground span")[1].innerHTML = this.lines;
		$(".playground span")[2].innerHTML = this.level;
	},
	//绘制背景墙
	paintWall : function(){
		for(var row = 0; row < this.RN; row++){
			for(var col = 0; col < this.CN; col++){
				var cell = this.wall[row][col];
				var x = col * this.CELL_SIZE + this.OFFSET_X;
				var y = row * this.CELL_SIZE + this.OFFSET_Y;
				if(cell){
					var img = new Image();
					img.src = cell.img;
					img.style.left = x + 'px';
					img.style.top = y + 'px';
					this.pg.appendChild(img);
				}
			}
		}
	},
	//着陆到背景墙上
	landIntoWall : function(){
		var cells = this.shape.cells;
		for(var i = 0; i < cells.length; i++){
			var cell = cells[i];
			this.wall[cell.row][cell.col] = cell;
		}
	},
	//判断是否能下落
	canDrop : function(){
		var cells = this.shape.cells;
		for(var i = 0; i < cells.length; i++){
			var cell = cells[i];
			if(cell.row == (this.RN - 1)){
			 	return false;
			}
		}
		for(var i = 0; i < cells.length; i++){
			var cell = cells[i];
			if(this.wall[cell.row+1][cell.col] != null){
				return false;
			}
		}
		return true;
	},
	//添加绘制预告图形的方法
	paintNextShape : function(){
		var cells = this.nextShape.cells;
		var frag = document.createDocumentFragment();
		for(var i = 0; i < cells.length; i++){
			var c = cells[i];
			var row = c.row + 1;
			var col = c.col + 11;
			var x = col * this.CELL_SIZE;
			var y = row * this.CELL_SIZE;
			var img = new Image();
			img.src = c.img;
			img.style.left = x + 'px';
			img.style.top = y + 'px';
			frag.appendChild(img);
		}
		this.pg.appendChild(frag);
	},
	//添加paintState方法
	paintState : function(){
		var img = new Image();
		switch(this.state){
			case this.STATE_OVER :
				img.src = this.IMG_OVER;
				break;
		}
		this.pg.appendChild(img);
	},
	//添加isGameOver方法
	isGameOver : function(){
		var cells = this.nextShape.cells;
		for(var i = 0; i < cells.length; i++){
			var cell = cells[i];
			if(this.wall[cell.row][cell.col] != null){
				return true;
			}
		}
		return false;
	},
	//添加方法判断方块是否出界
	outOfBounds :function(){
		var cells = this.shape.cells;
		for(var i = 0; i < cells.length; i++){
			if(cells[i].row<0 || cells[i].row >= this.RN ||
			   cells[i].col<0 || cells[i].col >= this.CN){
				return true;
			}
		}
		return false;
	},
	//添加方法判断目标格内是否存在方块
	concide : function(){
		var cells = this.shape.cells;
		for(var i = 0; i < cells.length; i++){
			if(this.wall[cells[i].row][cells[i].col]){
				return true;
			}
		}
		return false;
	},
	//图形对象右移
	moveRight : function(){
		this.shape.moveRight();
		if(this.outOfBounds() || this.concide()){
			this.shape.moveLeft();
		}
	},
	//图形对象左移
	moveLeft : function(){
		this.shape.moveLeft();
		if(this.outOfBounds() || this.concide()){
			this.shape.moveRight();
		}
	},
	//添加keydown方法实现按键控制
	keydown : function(e){
		switch(e.keyCode){
			case 37 : this.moveLeft();
			break;
			case 39 : this.moveRight();
			break;
			case 40 : this.softDrop();
		}
	}
}

//调用开始方法
window.onload = function() {
	tetris.start();
	//调用keydown方法
	document.onkeydown = function(e){
		tetris.keydown(e);
	}
}








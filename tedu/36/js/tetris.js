window.$ = function(selector) {
	return document.querySelectorAll(selector);
}
//使用对象直接量创建tetris对象
var tetris = {
	STATE_RUNNING : 0,
	STATE_PAUSE : 1,
	STATE_OVER : 2,
	//当前游戏状态
	state : this.STATE_RUNNING,
	//加载暂停和游戏结束需要的图片
	IMG_OVER : "img/game-over.png",
	IMG_PAUSE : "img/pause.png",

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
	interval : 100,
	//添加score、lines、level属性
	score : 0,
	lines : 10,
	level : 1,
	wall : null,
	//存储下一个将要生成的方块
	nextShape : null,
	//添加游戏开始的方法
	start : function() {
		this.pg = $('.playground')[0];
		//使用二维数组创建背景墙
		this.wall = [];
		for (var i = 0; i < this.RN; i++) {
			this.wall[i] = new Array(this.CN);
		}
		this.shape = this.randomShape();
		//初始化nextShape的值
		this.nextShape = this.randomShape();

		//调用softDrop方法
		this.softDrop();
		//添加定时下落方法
		this.timer = setInterval(function() {
			tetris.softDrop();
		}, this.interval);
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
	randomShape : function() {
		switch(parseInt(Math.random()*3)) {
			case 0:
				return new O();
			case 1:
				return new I();
			case 2:
				return new T();
		}
	},
	//添加softDrop方法
	softDrop : function() {
		this.paint();
		//调用canDrop方法
		if (this.canDrop()) {
			this.shape.softDrop();
		} else {
			this.landIntoWall();
			if (this.isGameOver()) {
				//修改游戏状态
				this.state = this.STATE_OVER;
				//清空定时器
				clearInterval(this.timer);
				this.timer = null;
				//画最后一帧
				this.paint();
			} else {
				//预告的方块成为正在下落的方块
				this.shape = this.nextShape;
				//生成下一个将要出现的方块
				this.nextShape = this.randomShape();
			}
		}

	},
	//添加paint方法
	paint : function() {
		this.pg.innerHTML = this.pg.innerHTML.replace(/<img(.*?)>/g, "");
		//调用绘制背景墙的方法
		this.paintWall();
		this.paintShape();

		//绘制预告图形
		this.paintNextShape();
		this.paintScore();
		//绘制游戏状态
		this.paintState();
	},
	//添加paintScore方法
	paintScore : function() {
		$(".playground span")[0].innerHTML = this.score;
		$(".playground span")[1].innerHTML = this.lines;
		$(".playground span")[2].innerHTML = this.level;
	},
	//绘制背景墙
	paintWall : function() {
		for (var row = 0; row < this.RN; row++) {
			for (var col = 0; col < this.CN; col++) {
				var cell = this.wall[row][col];
				var x = col * this.CELL_SIZE + this.OFFSET_X;
				var y = row * this.CELL_SIZE + this.OFFSET_Y;
				if (cell) {
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
	landIntoWall : function() {
		var cells = this.shape.cells;
		for (var i = 0; i < cells.length; i++) {
			var cell = cells[i];
			this.wall[cell.row][cell.col] = cell;
		}
	},
	//判断是否能下落
	canDrop : function() {
		var cells = this.shape.cells;
		for (var i = 0; i < cells.length; i++) {
			var cell = cells[i];
			if (cell.row == (this.RN - 1)) {
				return false;
			}
		}
		for (var i = 0; i < cells.length; i++) {
			var cell = cells[i];
			if (this.wall[cell.row+1][cell.col] != null) {
				return false;
			}
		}
		return true;
	},
	paintNextShape : function() {
		var cells = this.nextShape.cells;
		//创建文档碎片
		var fragment = document.createDocumentFragment();
		for (var i = 0; i < cells.length; i++) {
			var c = cells[i];
			//重新计算坐标
			var row = c.row + 1;
			var col = c.col + 11;
			var x = col * this.CELL_SIZE;
			var y = row * this.CELL_SIZE;
			//根据js对象生成HTML标签
			var img = new Image();
			//加载图片
			img.src = c.img;
			//设置位置
			img.style.left = x + "px";
			img.style.top = y + "px";
			//将img标签追加到碎片里
			fragment.appendChild(img);
		}
		//将存储着预告图形的碎片追加到游戏区域
		this.pg.appendChild(fragment);
	},
	//绘制当前状态的方法
	paintState : function() {
		var img = new Image();
		//根据当前所处状态加载不同的图片
		switch(this.state) {
			case this.STATE_OVER:
				img.src = this.IMG_OVER;
				break;
		}
		//将图片追加到游戏区域
		this.pg.appendChild(img);
	},
	//判断游戏是否结束
	isGameOver : function() {
		var cells = this.nextShape.cells;
		for (var i = 0; i < cells.length; i++) {
			var c = cells[i];
			if (this.wall[c.row][c.col] != null) {
				return true;
			}
		}
		return false;
	}
}

//调用开始方法
window.onload = function() {
	tetris.start();
}
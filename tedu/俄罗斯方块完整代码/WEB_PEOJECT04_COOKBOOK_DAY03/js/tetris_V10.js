window.$=function(selector){
	return document.querySelectorAll(selector);
}
var tetris={
	RN:20,//行数
	CN:10,//列数
	CELL_SIZE:26,//单元格高宽

	pg:null, //背景元素
	IMG_OVER:'img/game-over.png',
    IMG_PAUSE:'img/pause.png',
	IMGS:{
		"O":'img/O.png',
		"I":'img/I.png',
		"T":'img/T.png',
		"J":'img/J.png',
		"L":'img/L.png',
		"S":'img/S.png',
		"Z":'img/Z.png'
	},
	//左侧和上侧背景边框的偏移量
	OFFSET_X:15,
	OFFSET_Y:15,

	shape:null,//当前图形对象
	nextShape:null,//下一个图形对象

	timer:null,
	interval:500,//每次下落的时间间隔

    score:0,//得分
	lines:0,//消除的行数
	level:1,//级别
	
	wall:null,//定义方块墙：记录所有可能的格子

	state:0,
	STATE_RUNNING:0,
	STATE_PAUSE:1,
	STATE_OVER:2,
	
	/*v08*/
	//分数（消除行数不同，分数不同）：
	//0行、1行、2行、3行、4行
    scores:[0,10,50,80,200],

	start:function(){
		/*V09*/
		//重新开始时的初始化
		this.state=this.STATE_RUNNING;
		this.cells=[];
		this.score=0;//得分
		this.lines=0;//消除的行数
		this.level=1;

		this.pg=$('.playground')[0];
		//初始化方块墙中所有方块
		this.wall=[];	
		for(var i=0; i<this.RN; i++){
			this.wall[i]=new Array(this.CN);
		}

		this.shape=this.randomShape();
		this.nextShape=this.randomShape();
		this.softDrop();
		this.timer=setInterval(function(){
			tetris.softDrop();
		},this.interval);
	},
	/*专门绘制当前图形的方法*/
	paintShape:function(){//依次遍历并绘制当前图形中的每个格
		var frag=document.createDocumentFragment();
		for(var i=0;i<4;i++){
			var c=this.shape.cells[i];
			var x=c.col*this.CELL_SIZE+this.OFFSET_X;
			var y=c.row*this.CELL_SIZE+this.OFFSET_Y;
			var img=new Image();
			img.src=c.img;
			img.style.left=x+'px';
			img.style.top=y+'px';
			frag.appendChild(img);
		}
		this.pg.appendChild(frag);
	},
	randomShape:function(){
		switch(parseInt(Math.random()*7)){
			case 0: return new O();
			case 1: return new I();
			case 2: return new Z();
			case 3: return new J();
			case 4: return new T();
			case 5: return new S();
			case 6: return new L();
		}
	},
	softDrop:function(){
		if(this.state==this.STATE_RUNNING){
		this.paint();
		if(this.canDrop()){
			this.shape.softDrop();
		}else{
			this.landIntoWall();
			
			/*v08*/
			//消行判断，并记分
            var lines=this.destroyLines();//0~4
			this.lines+=lines;
			this.score+=this.scores[lines];

			if(this.isGameOver()){
				this.gameOver();
			}else{
				this.shape=this.nextShape;
				this.nextShape=this.randomShape();
			}
		}
		}
	},
	gameOver:function(){
		this.state = this.STATE_OVER;
		clearInterval(this.timer);
		this.timer=null;
		this.paint();
	},
	paintScore:function(){
		$(".playground span")[0].innerHTML=this.score;
		$(".playground span")[1].innerHTML=this.lines;
		$(".playground span")[2].innerHTML=this.level;
	},
	paint:function(){
		//每次仅删除结尾最新的4个，换新的。
		this.pg.innerHTML=
			this.pg.innerHTML.replace(/<img(.*?)>/g,"");
		this.paintWall();
		this.paintShape();
		this.paintNextShape();
		this.paintScore();
		this.paintState();
	},
	paintWall:function(){
		//绘制背景墙
        for(var row=0; row<this.RN; row++){
			for(var col=0; col<this.CN; col++){
				var cell = this.wall[row][col];
				var x = col * this.CELL_SIZE+this.OFFSET_X;
				var y = row * this.CELL_SIZE+this.OFFSET_Y;
				if(cell){
					var img = new Image();
					img.src = cell.img;
					img.style.left = x+'px';
					img.style.top = y+'px';
					this.pg.appendChild(img);
				}
			}
		}
	},
	paintNextShape:function(){
		var cells = this.nextShape.cells;
		var frag=document.createDocumentFragment();
		for(var i=0; i<cells.length; i++){
			var c = cells[i];
			var row = c.row + 1;
			var col = c.col + 11;
			var x = col * this.CELL_SIZE;
			var y = row * this.CELL_SIZE;
			var img = new Image();
			img.src = c.img;
			img.style.left = x+'px';
			img.style.top = y+'px';
			frag.appendChild(img);
		}	
		this.pg.appendChild(frag);
	},
	canDrop:function() {
		var cells = this.shape.cells;
		for (var i = 0; i < cells.length; i++) {
			var cell = cells[i];
			if(cell.row==(this.RN-1)){
				return false;
			}
		}
		for (var i = 0; i < cells.length; i++) {
			var cell = cells[i];
			if(this.wall[cell.row+1][cell.col]!=null){
				return false;
			}
		}
		return true;
	},
	landIntoWall:function() {
		var cells = this.shape.cells;
		for (var i = 0; i < cells.length; i++) {
			var cell = cells[i];
			this.wall[cell.row][cell.col] = cell;
		}
	},
	paintState:function(){
		var img=new Image();
		switch (this.state){
		    case this.STATE_OVER:
			    img.src=this.IMG_OVER;
			    break;
			case this.STATE_PAUSE:
				img.src=this.IMG_PAUSE;
				break;
		}
		this.pg.appendChild(img);
	},
	isGameOver:function() {
		var cells = this.nextShape.cells;
		for (var i = 0; i < cells.length; i++) {
			var cell = cells[i];
			if(this.wall[cell.row][cell.col]!=null){
				return true;
			}
		}
		return false;
	},
	/** 检查正在下落的方块是否出界了**/
	outOfBounds:function() {
		var cells=this.shape.cells;
		for(var i=0; i<cells.length; i++){
			if(cells[i].row<0||cells[i].row>=this.RN
				||
				cells[i].col<0||cells[i].col>=this.CN){
				return true;
			}
		}
		return false;
	},
    /**判定目标格内是否已经存在方块**/
	concide:function() {
		var cells=this.shape.cells;
		for(var i=0; i<cells.length; i++){
			if(this.wall[cells[i].row][cells[i].col]){
				return true;
			}
		}
		return false;
	},
	/**实现右移动流程控制 */
	moveRight:function(){
		if(this.state==this.STATE_RUNNING){
		this.shape.moveRight();
		if(this.outOfBounds()||this.concide()){
			this.shape.moveLeft();
		}
		}
	},
    /**实现左移动流程控制 */
	moveLeft:function(){
		if(this.state==this.STATE_RUNNING){
		this.shape.moveLeft();
		if(this.outOfBounds()||this.concide()){
			this.shape.moveRight();
		}
		}
	},
	keydown:function(e){//键盘按下时触发
		var key=e.which||e.keyCode||e.charCode;
		switch(key){
			case 37:this.moveLeft(); break;		//左
			case 39:this.moveRight(); break;	//右
			case 40:this.softDrop(); break;	    //下
			/*V09*/
			case 38:this.rotateR();break;//上 向右旋转
			case 90:this.rotateL();break;//Z 向左旋转
			
			case 80:this.pause();break; //P 暂停
			case 67:this.myContinue();break; //C 继续

			case 81:this.gameOver();break; //Q 结束游戏
			case 83:
				if(this.state==this.STATE_OVER){
					this.start(); //S开始游戏
				}break;
		}
	},
	/*V09*/
	/** 旋转流程控制*/
	rotateR:function(){
		if(this.state==this.STATE_RUNNING){
		this.shape.rotateR();
		if(this.outOfBounds() || this.concide()){
			this.shape.rotateL();
		}
		}
	},
	rotateL:function(){
		if(this.state==this.STATE_RUNNING){
		this.shape.rotateL();
		if(this.outOfBounds() || this.concide()){
			this.shape.rotateR();
		}
		}
	},
	pause:function(){
		if(this.state==this.STATE_RUNNING){
			clearInterval(this.timer);
			this.timer=null;
			this.state=this.STATE_PAUSE;
			this.paint();
		}
	},
	myContinue:function(){
		if(this.state==this.STATE_PAUSE){
			this.state=this.STATE_RUNNING;
			this.timer=setInterval(function(){
				tetris.softDrop();
			},this.interval);
		}
	},
	//消行
    destroyLines:function() {
		for(var row=0,lines=0; row<this.RN; row++){
			if(this.fullCells(row)){
				this.deleteRow(row);
				lines++;
			}
		}
		return lines;
	},
	//删除行
	deleteRow:function(row){
		for(var i=row; i>=1; i--){
			for(var j=0; j<this.CN; j++){
				this.wall[i][j]=this.wall[i-1][j];
			}
		}
		for(var j=0; j<this.CN; j++){
			this.wall[0][j] = null;
		}
	},
    //判断满格
	fullCells:function(row) {
		var line = this.wall[row];
		for (var i = 0; i < line.length; i++) {
			var cell = line[i];
			if(cell==null){
				return false;
			}
		}
		return true;
	}
}

window.onload=function(){
	tetris.start();
	document.onkeydown=function(){
		var e=window.event||arguments[0];
		tetris.keydown(e);
	}
}
//创建一个方块的构造方法
function Cell(row, col, img) {
	this.row = row;
	this.col = col;
	this.img = img;
	//添加下落方法的限制条件
	if (!Cell.prototype.softDrop) {
		//在原型对象中添加下落方法
		Cell.prototype.softDrop = function() {
			this.row++;
		}
	}
	//添加单元格右移动的方法
	if(!Cell.prototype.moveRight){
		Cell.prototype.moveRight = function(){
			this.col++;
		}
	}
	//添加单元格左移动的方法
	if(!Cell.prototype.moveLeft){
		Cell.prototype.moveLeft = function(){
			this.col--;
		}
	}
}

//创建Shape构造方法，使每个cell下落
function Shape(){
	if(!Shape.prototype.hasOwnProperty("softDrop")){
		Shape.prototype.softDrop = function(){
			for(var i = 0; i < 4; i++){
				this.cells[i].softDrop();
			}
		}
	}
	//整个图形右移
	if(!Shape.prototype.moveRight){
		Shape.prototype.moveRight = function(){
			for(var i = 0; i < this.cells.length; i++){
				this.cells[i].moveRight();
			}
		}
	}
	//整个图形左移
	if(!Shape.prototype.moveLeft){
		Shape.prototype.moveLeft = function(){
			for(var i = 0; i < this.cells.length; i++){
				this.cells[i].moveLeft();
			}
		}
	}
}

//创建O型方块的构造方法
function O() {
	//让O型方块继承下落方法
	Object.setPrototypeOf(O.prototype, new Shape());
	var img = tetris.IMGS.O;
	this.cells = [new Cell(0, 4, img), new Cell(0, 5, img), new Cell(1, 4, img), new Cell(1, 5, img)];
}

//创建I型方块的构造方法
function I() {
	Object.setPrototypeOf(I.prototype, new Shape());
	var img = tetris.IMGS.I;
	this.cells = [new Cell(0, 3, img), new Cell(0, 4, img), new Cell(0, 5, img), new Cell(0, 6, img)];
}

//创建T型方块的构造方法
function T() {
	Object.setPrototypeOf(T.prototype, new Shape());
	var img = tetris.IMGS.T;
	this.cells = [new Cell(0, 3, img), new Cell(0, 4, img), new Cell(0, 5, img), new Cell(1, 4, img)];
}
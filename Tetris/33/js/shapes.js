/**
 * @author Administrator
 */

//创建一个方块的构造方法
function Cell(row, col, img) {
	this.row = row;
	this.col = col;
	this.img = img;
	if (!Cell.prototype.softDrop) {
		Cell.prototype.softDrop = function() {
			this.row++;
		}
	}

}

function Shape() {
	if (!Shape.prototype.hasOwnProperty("softDrop")) {
		Shape.prototype.softDrop = function() {
			for (var i = 0; i < 4; i++) {
				this.cells[i].softDrop();
			}
		}
	}
}

//创建O型方块的构造方法
function O() {
	Object.setPrototypeOf(O.prototype,new Shape());

	var img = tetris.IMGS.O;
	this.cells = [new Cell(0, 4, img), new Cell(0, 5, img), new Cell(1, 4, img), new Cell(1, 5, img)];
}

//创建I型方块的构造方法
function I() {
	Object.setPrototypeOf(I.prototype,new Shape());

	var img = tetris.IMGS.I;
	this.cells = [new Cell(0, 3, img), new Cell(0, 4, img), new Cell(0, 5, img), new Cell(0, 6, img)];
}

//创建T型方块的构造方法
function T() {
	Object.setPrototypeOf(T.prototype,new Shape());

	var img = tetris.IMGS.T;
	this.cells = [new Cell(0, 3, img), new Cell(0, 4, img), new Cell(0, 5, img), new Cell(1, 4, img)];
}
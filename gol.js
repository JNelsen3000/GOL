const ALIVE_CLASS = 'alive';
const DEATH_MARK = 'death-mark';
const LIFE_MARK = 'life-mark';
const size = 300;

const styleText = `.${ALIVE_CLASS}{ background-color: black; } .cell { width: 3px; height: 3px; } .cell-row {display:flex;} .show-lines .cell { border: 1px solid grey; } button { width: 100px; }`;

var cellRows = []
var updateInterval;

function updateCells(){
	setMarks();
	applyMarks();
}
function setMarks(){
	cellRows.forEach(row => {
		row.forEach(cell => {
			if (cell.isAlive){
				const cellSurvives = livingCellSurvives(cell);
				if (!cellSurvives){
					cell.markForDeath();
					cell.isAlive = false;
				}
			} else {
				const isBorn = cellIsBorn(cell);
				if (isBorn){
					cell.markForLife();
					cell.isAlive = true;
				}
			}
		})
	})
}
function applyMarks(){
	var markedForDeath = document.querySelectorAll(`.${DEATH_MARK}`);
	for(var i = 0; i < markedForDeath.length; i ++){
		const item = markedForDeath[i];
		item.classList.remove(DEATH_MARK,ALIVE_CLASS);
	}
	var markedForLife = document.querySelectorAll(`.${LIFE_MARK}`);
	for(var i = 0; i < markedForLife.length; i ++){
		var item = markedForLife[i];
		item.classList.remove(LIFE_MARK);
		item.classList.add(ALIVE_CLASS);
	}
}

class Cell{
	constructor(x,y){
		this.x = x;
		this.y = y;
		this.id = `${x}-${y}`;
		this.isAlive = false;
	}
	markForDeath(){
		getDiv(this).classList.add(DEATH_MARK)
	}
	markForLife(){
		getDiv(this).classList.add(LIFE_MARK)
	}
	get livingNeighbors(){
		var result = 0;
		const isTopEdge = this.y == 0;
		const isLeftEdge = this.x == 0;
		const isBottomEdge = this.y == size - 1;
		const isRightEdge = this.x == size - 1;
		if (!isTopEdge){
			if (!isLeftEdge){
				// check northWest
				var isAlive = cellIsAlive(`${this.x - 1}-${this.y - 1}`);
				if (isAlive){ result ++; }
			}
			// check north
			var northAlive = cellIsAlive(`${this.x}-${this.y - 1}`);
			if (northAlive){ result ++; }
			if (!isRightEdge){
				// check northEast
				var isAlive = cellIsAlive(`${this.x + 1}-${this.y - 1}`);
				if (isAlive){ result ++; }
			}
		}
		if (!isLeftEdge){
			// check west
			var isAlive = cellIsAlive(`${this.x - 1}-${this.y}`);
			if (isAlive){ result ++; }
		}
		if (!isRightEdge){
			// check east
			var isAlive = cellIsAlive(`${this.x + 1}-${this.y}`);
			if (isAlive){ result ++; }
		}
		if (!isBottomEdge){
			if (!isLeftEdge){
				// check southWest
				var isAlive = cellIsAlive(`${this.x - 1}-${this.y + 1}`);
				if (isAlive){ result ++; }
			}
			// check south
			var southAlive = cellIsAlive(`${this.x}-${this.y + 1}`)
			if (southAlive){ result ++; }
			if (!isRightEdge){
				// check southEast
				var isAlive = cellIsAlive(`${this.x + 1}-${this.y + 1}`);
				if (isAlive){ result ++; }
			}
		}
		return result;
	}
}

function getDiv(cell){
	return document.getElementById(`${cell.x}-${cell.y}`);
}

function cellIsAlive(id){
	return document.getElementById(id).classList.contains(ALIVE_CLASS);
}

function livingCellSurvives(cell){
	const neighbors = cell.livingNeighbors;
	switch (neighbors){
		case 0:
		case 1:
			return false;
		case 2:
		case 3:
			return true;
		default:
			return false;
	}
}

function cellIsBorn(cell){
	const neighbors = cell.livingNeighbors;
	return neighbors == 3;
}

function start(){
	document.getElementById('reset-button').removeAttribute('disabled');
	document.getElementById('start-button').setAttribute('disabled', true);
	document.getElementById('seed-button').setAttribute('disabled', true);
	document.getElementById('base-div').classList.remove('show-lines')
	updateInterval = setInterval(updateCells, 300);
}
function initialize(){
	generateGrid();
	addStyle();
	cellRows.forEach(row => {
		row.forEach(cell => {
			var item = getDiv(cell)
			item.addEventListener('click', ()=>{
				if (item.classList.contains(ALIVE_CLASS)) {
					item.classList.remove(ALIVE_CLASS);
					cell.isAlive = false;
				} else {
					item.classList.add(ALIVE_CLASS);
					cell.isAlive = true;
				}
			})
		})
	})
	document.getElementById('base-div').classList.add('show-lines')
}
function setRandomSeed(){
	cellRows.forEach(row => {
		row.forEach(cell => {
			if (getRandomNum(5) < 2) { cell.markForLife(); cell.isAlive = true; }
		})
	})
	applyMarks();
	document.getElementById('seed-button').setAttribute('disabled', true);
}
function addStyle(){
	var styleDiv = document.createElement('style');
	styleDiv.innerText = styleText;
	document.body.append(styleDiv);
}
function getRandomNum(num){ return Math.floor(Math.random() * num) + 1; }

function generateGrid(){
	var baseDiv = document.createElement('div');
	baseDiv.style.cssText += 'position:absolute;top:0;left:0;min-width:800px;min-height:800px;background-color:white;border:2px solid gray;display:flex;flex-direction:column;z-index:100;';
	baseDiv.id = 'base-div';
	for (var i = 0; i < size; i++){
		var row = document.createElement('div');
		var cellRow = [];
		row.classList.add('cell-row');
		for (var j = 0; j < size; j++){
			var cell = document.createElement('div');
			cell.id = j + '-' + i;
			cell.classList = 'cell';
			row.append(cell);
			cellRow.push(new Cell(i,j));
		}
		baseDiv.append(row);
		cellRows.push(cellRow);
	}
	var startButton = document.createElement('button');
	startButton.addEventListener('click', start);
	startButton.innerText = 'Start';
	startButton.id = 'start-button';
	var seedButton = document.createElement('button');
	seedButton.addEventListener('click', setRandomSeed);
	seedButton.innerText = 'Seed';
	seedButton.id = 'seed-button';
	var resetButton = document.createElement('button');
	resetButton.addEventListener('click', reset);
	resetButton.innerText = 'Reset';
	resetButton.id = 'reset-button';
	resetButton.setAttribute('disabled', true);
	baseDiv.append(startButton, resetButton, seedButton);
	document.body.append(baseDiv);
}
function reset(){
	clearInterval(updateInterval);
	cellRows.forEach(row => { row.forEach(cell => { cell.isAlive = false; cell.markForDeath(); } ) })
	applyMarks();
	document.getElementById('base-div').classList.add('show-lines')
	document.getElementById('start-button').removeAttribute('disabled');
	document.getElementById('seed-button').removeAttribute('disabled');
	document.getElementById('reset-button').setAttribute('disabled', true);
}
initialize();

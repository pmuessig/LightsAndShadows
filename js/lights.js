var gridSize = 10;

function Lights(){
	console.log('hello world');
	var that = this;

	this.gridContainer = document.querySelector(".grid-container");
	this.grid = new Grid(gridSize);

	function clickHandler(){
		var cd = this.cellData;
		if(cd.isStone){
			return;
		}
		console.log(this, cd);
		this.classList.toggle("active");

		cd.isActive = this.classList.contains("active");

		that.grid.eachCell(function(x, y, cell){
			cell.isLit = false;
		});

		refreshLit();
		updatePips();
		rerender();
	}

	for(i = 0; i < gridSize; i++){
		var row = document.createElement("div");
		row.className = 'grid-row';
		this.gridContainer.appendChild(row);
		for(j = 0; j < gridSize; j++){
			var cell = document.createElement("div");
			cell.className = 'grid-cell';
			row.appendChild(cell);

			var cellData = {
				x:j,
				y:i,
				$el:cell
			};

			cell.cellData = cellData;
			cell.addEventListener('click', clickHandler);
			that.grid.insertTile(cellData);
		}
	}

	function tryLight(cell){
		if(cell.isStone){
			return false;
		}

		cell.isLit = true;
		return true;
	}

	function refreshLit(){
		that.grid.eachCell(function(x, y, cell){
			if(cell.isActive){
				for(i = x; i >= 0; i--){
					if(!tryLight(that.grid.cells[i][y])){
						break;
					}
				}

				for(i = x; i < gridSize; i++){
					if(!tryLight(that.grid.cells[i][y])){
						break;
					}
				}

				for(i = y; i >= 0; i--){
					if(!tryLight(that.grid.cells[x][i])){
						break;
					}
				}

				for(i = y; i < gridSize; i++){
					if(!tryLight(that.grid.cells[x][i])){
						break;
					}
				}
			}
		});
	}

	function updatePips(){
		that.grid.eachCell(function(x, y, cell){
			if(cell.isStone && cell.targetVal >= 0){
				cell.value = getNeighborLitCount(cell);

				if(cell.value > cell.targetVal){
					cell.$el.classList.add('invalid');
					for(i = 0; i< 10; i++){
						cell.$el.classList.remove('valid-'+i);
					}
				} else {
					cell.$el.classList.remove('invalid');

					for(i = 0; i< 10; i++){
						cell.$el.classList.remove('valid-'+i);
					}
					cell.$el.classList.add('valid-'+cell.value);
				}


				console.log(cell.value);
			}
		});
	}

	function getNeighborLitCount(cell){
		var indices = [
			{x: cell.x - 1, y: cell.y - 1},
			{x: cell.x, y: cell.y - 1},
			{x: cell.x + 1, y: cell.y - 1},
			{x: cell.x - 1, y: cell.y},
			{x: cell.x + 1, y: cell.y},
			{x: cell.x - 1, y: cell.y + 1},
			{x: cell.x, y: cell.y + 1},
			{x: cell.x + 1, y: cell.y + 1}
		];

		var count = 0;

		indices.forEach(function(index){
			if(index.x < 0 || index.y < 0 || index.x >= gridSize || index.y >= gridSize){
				return;
			}
			var neighborCell = that.grid.cells[index.x][index.y];
			if(neighborCell.isLit || neighborCell.isActive){
				count++;
			}
		});

		return count;
	}

	function rerender(){
		that.grid.eachCell(function(x, y, cell){
			if(cell.isLit){
				cell.$el.classList.add('lit');
			} else {
				cell.$el.classList.remove('lit');
			}
		});
	}

	function setStone(x,y,tv){
		var cell = that.grid.cells[x][y];
		cell.isStone = true;
		cell.targetVal = tv;
		cell.$el.classList.add('stone');
		if(tv >= 0){
			cell.$el.classList.add('stone-'+tv);
			for(i = 0; i < tv; i++){
				var pip = document.createElement("div");
				pip.className = 'pip';
				cell.$el.appendChild(pip);
			}
		}
	}

	//set our scene
	setStone(1,1,4);
	setStone(4,1);
	setStone(8,1,2);

	setStone(2,2);
	setStone(8,2);

	setStone(4,3);
	setStone(5,3,3);
	
	setStone(4,6,3);
	setStone(5,6);

	setStone(1,7,4);
	setStone(7,7,0);

	setStone(1,8,3);
	setStone(5,8,1);
	setStone(8,8);
		

	console.log(this.grid);
}

var Vector = {
	_x: 1,
	_y: 0,

	create: function(x, y) {
		let obj = Object.create(this);
		obj.setX(x);
		obj.setY(y);
		return obj;
	},

	setX: function(value) {
		this._x = value;
	},

	getX: function() {
		return this._x;
	},

	setY: function(value) {
		this._y = value;
	},

	getY: function() {
		return this._y;
	},

	setAngle: function(angle) {
		let length = this.getLength();
		this._x = Math.cos(angle) * length;
		this._y = Math.sin(angle) * length;
	},

	getAngle: function() {
		return Math.atan2(this._y, this._x);
	},

	setLength: function(length) {
		let angle = this.getAngle();
		this._x = Math.cos(angle) * length;
		this._y = Math.sin(angle) * length;
	},

	getLength: function() {
		return Math.sqrt(this._x * this._x + this._y * this._y);
	},

	add: function(v2) {
		return Vector.create(this._x + v2.getX(), this._y + v2.getY());
	},

	subtract: function(v2) {
		return Vector.create(this._x - v2.getX(), this._y - v2.getY());
	},

	multiply: function(val) {
		return Vector.create(this._x * val, this._y * val);
	},

	divide: function(val) {
		return Vector.create(this._x / val, this._y / val);
	},

	addTo: function(v2) {
		this._x += v2.getX();
		this._y += v2.getY();
	},

	subtractFrom: function(v2) {
		this._x -= v2.getX();
		this._y -= v2.getY();
	},

	multiplyBy: function(val) {
		this._x *= val;
		this._y *= val;
	},

	divideBy: function(val) {
		this._x /= val;
		this._y /= val;
	}
};



var Robot = {
	position: null,
	direction: null,

	create: function(x, y, direction) {
		let obj = Object.create(this);
		obj.position = Vector.create(x, y);
		obj.direction = direction;
		return obj;
	},

	face: function(direction) {
			this.direction = direction;
	},

	move: function() {
		if(this.direction === "NORTH"){
			this.position.setY(this.position.getY() - 1);
		} else if(this.direction === "EAST"){
			this.position.setX(this.position.getX() + 1);
		} else if(this.direction === "SOUTH"){
			this.position.setY(this.position.getY() + 1);
		} else if(this.direction === "WEST"){
			this.position.setX(this.position.getX() - 1);
		}
	},

	
};


const EMPTY = 0;
const OBSTACLE = 1;
const PATH = 2;
const ROBOT = 3;
const GOAL = 4;

var Grid = {
	x_size: null,
	y_size: null,
	data: null,

	create: function(x,y) {
		let obj = Object.create(this);
		obj.x_size = x;
		obj.y_size = y;
		let data = [];
		for (let i = 0; i < x; i++){
			data[i] = [];
			for (let j = 0; j < y; j++){
				data[i][j] = 0;
			}
		}
		obj.data = data
		return obj;
	},

	getVal: function(x,y) {
		return this.data[x][y];
	},

	setVal: function(x,y,val) {
		this.data[x][y] = val;
	}
};

simulation = function(instructions) {

	const canvas = document.getElementById('canvas');
    const width = canvas.width = document.getElementById("simulation-space").offsetWidth
    const height = canvas.height = document.getElementById('simulation').offsetHeight-document.getElementsByClassName("bar")[1].offsetHeight
    const ctx = canvas.getContext('2d');
  
	const grid_x_size = 10;
	const grid_y_size = 10;
	const grid_cell_width = Math.floor(width/grid_x_size);
	const grid_cell_height = Math.floor(height/grid_y_size);

	const empty_color = 'white';
	const obstacle_color = 'black';
	const path_color = 'pink'
	const robot_color = 'red'
	const goal_color = 'green'

    // let centX = width * 0.5;
    // let centY = height * 0.5;
    
    // let p = Robot.create(centX, centY, 5, 0);
    
    // p.width = 40;
    // p.length = 40;
    // p.radius = Math.sqrt(Math.pow(p.width, 2) + Math.pow(p.length, 2)) / 2;
    
    // p.bounce = -0.9;

	let valid_directions = ["NORTH","SOUTH","EAST","WEST"]

	let robot = Robot.create(0,4,"EAST");

	let grid = Grid.create(grid_x_size,grid_y_size);

	grid.setVal(0,0,OBSTACLE);
	grid.setVal(1,0,OBSTACLE);
	grid.setVal(1,1,OBSTACLE);
	grid.setVal(1,2,OBSTACLE);
	grid.setVal(0,6,OBSTACLE);
	grid.setVal(1,6,OBSTACLE);
	grid.setVal(2,6,OBSTACLE);

	grid.setVal(9,9,GOAL);
	// grid.setVal(0,3,PATH);
	grid.setVal(robot.position.getX(),robot.position.getY(),ROBOT);


  	// console.log("help");
	// let instructions = ["START","FORWARD","NORTH","FORWARD","EAST","FORWARD","FORWARD","END"]

	let instruction = instructions[0]
	let index = 0
	let startTime = performance.now()

    renderStep();
	
	function renderStep(){
		
		// render();
		if(instruction !== "END" && index < instructions.length-1){
			if(Math.floor((performance.now() - startTime) / 750) > index){

				if(instruction === "FORWARD") {
					let test_robot = Robot.create(robot.position.getX(),robot.position.getY(),robot.direction);
					test_robot.move();
					let x = test_robot.position.getX();
					let y = test_robot.position.getY();
					if((x < grid_x_size) && (x >= 0) && (y < grid_y_size) && (y >= 0) && (grid.getVal(x,y) !== OBSTACLE)){
						grid.setVal(robot.position.getX(),robot.position.getY(),PATH);
						grid.setVal(x,y,ROBOT);
						robot.move();
					}
				} else if(valid_directions.includes(instruction)){
					robot.face(instruction);
				}

				
				index += 1;
				instruction = instructions[index];
				console.log("next instruction" + index + ": " + instructions[i])
			}
			// render
			ctx.fillStyle = empty_color
			ctx.fillRect(0, 0, width, height);
			for (let i = 0; i < grid_x_size; i++){
				for (let j = 0; j < grid_y_size; j++){
					let cell = grid.getVal(i,j);
					if (cell === OBSTACLE){
						ctx.fillStyle = obstacle_color;
						ctx.fillRect(i*grid_cell_width,j*grid_cell_height,grid_cell_width,grid_cell_height);
					} else if (cell === PATH){
						ctx.fillStyle = path_color;
						ctx.fillRect(i*grid_cell_width,j*grid_cell_height,grid_cell_width,grid_cell_height);
					} else if (cell === ROBOT){
						ctx.fillStyle = robot_color;
						ctx.fillRect(i*grid_cell_width,j*grid_cell_height,grid_cell_width,grid_cell_height);
						ctx.fillStyle = path_color;
						ctx.beginPath();
						if(robot.direction === "NORTH"){
							ctx.moveTo(i*grid_cell_width + grid_cell_width/2,j*grid_cell_height);
							ctx.lineTo(i*grid_cell_width + grid_cell_width,j*grid_cell_height + grid_cell_height/2);
							ctx.lineTo(i*grid_cell_width,j*grid_cell_height + grid_cell_height/2);
						} else if(robot.direction === "SOUTH"){
							ctx.moveTo(i*grid_cell_width + grid_cell_width/2,j*grid_cell_height + grid_cell_height);
							ctx.lineTo(i*grid_cell_width + grid_cell_width,j*grid_cell_height + grid_cell_height/2);
							ctx.lineTo(i*grid_cell_width,j*grid_cell_height + grid_cell_height/2);
						} else if(robot.direction === "EAST"){
							ctx.moveTo(i*grid_cell_width + grid_cell_width,j*grid_cell_height + grid_cell_height/2);
							ctx.lineTo(i*grid_cell_width + grid_cell_width/2,j*grid_cell_height + grid_cell_height);
							ctx.lineTo(i*grid_cell_width + grid_cell_width/2,j*grid_cell_height);
						} else if(robot.direction === "WEST"){
							ctx.moveTo(i*grid_cell_width,j*grid_cell_height + grid_cell_height/2);
							ctx.lineTo(i*grid_cell_width + grid_cell_width/2,j*grid_cell_height + grid_cell_height);
							ctx.lineTo(i*grid_cell_width + grid_cell_width/2,j*grid_cell_height);
						}
						ctx.fill();
					}else if (cell === GOAL){
						ctx.fillStyle = goal_color;
						ctx.fillRect(i*grid_cell_width,j*grid_cell_height,grid_cell_width,grid_cell_height);
					}
				}
			}
			requestAnimationFrame(renderStep)
		}
	}

  
  };
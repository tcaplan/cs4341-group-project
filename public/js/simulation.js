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
	velocity: null,

	create: function(x, y, speed, direction) {
		let obj = Object.create(this);
		obj.position = Vector.create(x, y);
		obj.velocity = Vector.create(0, 0);
		obj.velocity.setLength(speed);
		obj.velocity.setAngle(direction);
		return obj;
	},

	update: function() {
		this.position.addTo(this.velocity);
	}
};

simulation = function() {

    const canvas = document.getElementById('canvas');
    const width = canvas.width = document.getElementById("simulation-space").offsetWidth
    const height = canvas.height = document.getElementById('simulation').offsetHeight-document.getElementsByClassName("bar")[1].offsetHeight
    const ctx = canvas.getContext('2d');
  
    let centX = width * 0.5;
    let centY = height * 0.5;
    
    let p = Robot.create(centX, centY, 5, 0);
    
    p.width = 40;
    p.length = 40;
    p.radius = Math.sqrt(Math.pow(p.width, 2) + Math.pow(p.length, 2)) / 2
    
    p.bounce = -0.9;
  
    render();
  
    function render() {
        ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = 'white';
        p.update();
        // ctx.fillRect(p.position.getX(), p.position.getY(), p.width, p.length)
        ctx.beginPath();
        ctx.arc(p.position.getX(), p.position.getY(), p.radius, 0, Math.PI*2); 
        ctx.fill();

          if (p.position.getX() + p.radius > width) {
              p.position.setX(width - p.radius);
              p.velocity.setX(p.velocity.getX() * p.bounce);
          }
          if (p.position.getX() - p.radius < 0) {
              p.position.setX(p.radius);
              p.velocity.setX(p.velocity.getX() * p.bounce);
          }
          if (p.position.getY() + p.radius > height) {
              p.position.setY(height - p.radius);
              p.velocity.setY(p.velocity.getY() * p.bounce);
          }
          if (p.position.getY() - p.radius < 0) {
              p.position.setY(p.radius);
              p.velocity.setY(p.velocity.getY() * p.bounce);
          }
  
      requestAnimationFrame(render);
    }
  
  };
var canvas = document.getElementById('background-particles');
var context = canvas.getContext('2d');

w = canvas.width = window.innerWidth;
h = canvas.height = window.innerHeight;

context.scale(innerWidth / w, innerHeight / h);

particles = [];
particleGraph = new Map;
properties = {
    bgColor             : 'rgba(38, 0, 27 ,1)',
    particleColor       : 'rgba(199, 1, 39, 1)',
    particleRadius      : 2,
    particleCount       : 180,
    particleMaxVelocity : 0.5,
    lineLength          : 150,
};

document.querySelector('.background').appendChild(canvas);

window.onresize = function(){
    w = canvas.width = innerWidth,
    h = canvas.height = innerHeight;        
};

class Particle{
    constructor(){
        this.resurrection();
    }

    resurrection() {
        this.x = Math.random()*w;
        this.y = Math.random()*h;
        this.velocityX = Math.random()*(properties.particleMaxVelocity*2)-properties.particleMaxVelocity;
        this.velocityY = Math.random()*(properties.particleMaxVelocity*2)-properties.particleMaxVelocity;
        this.isDead = true; 
        this.neighborsCount = 0;
    }

    position() {
        this.x + this.velocityX > w && this.velocityX > 0 || this.x + this.velocityX < 0 && this.velocityX < 0? this.velocityX*=-1 : this.velocityX;
        this.y + this.velocityY > h && this.velocityY > 0 || this.y + this.velocityY < 0 && this.velocityY < 0? this.velocityY*=-1 : this.velocityY;
        this.x += this.velocityX;
        this.y += this.velocityY;
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, properties.particleRadius, 0, Math.PI*2);
        context.closePath();
        context.fillStyle = properties.particleColor;
        context.fill();
    }

    calculateNeighbors() {
        if (this.neighborsCount < 3) {
            this.resurrection();
        } else {
            this.neighborsCount = 0;
            this.isDead = false;
        }
    }
}

class Edge {
    constructor(point1, point2){
        this.point1 = point1;
        this.point2 = point2;
        this.length = 0;    
    }

    calculateDistance() {
        this.length = Math.sqrt(Math.pow(this.point1.x - this.point2.x, 2) + Math.pow(this.point1.y - this.point2.y, 2));
    }
}

function drawLine(x1, y1, x2, y2, opacity) {
    context.lineWidth = '0.5';
    context.strokeStyle = 'rgba(255, 40, 40, '+opacity+')';
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.closePath();
    context.stroke();
}

function drawParticles() {
    for (var i in particles) {
        if (particles[i].isDead) continue;
        particles[i].draw();
    }
}


function drawLines() {
    particleGraph.forEach((value, key, map) => {
        point1 = value.point1;
        point2 = value.point2;
        if (point1.isDead || point2.isDead) return;
        if (value.length < properties.lineLength) {
            opacity = 1-value.length/properties.lineLength;
            drawLine(point1.x, point1.y, point2.x, point2.y, opacity);
        }
    });
}

function calculateDestinations() {
    particleGraph.forEach((value, key, map) => {
        value.calculateDistance();
        if(value.length <= properties.lineLength) {
            value.point1.neighborsCount++;
            value.point2.neighborsCount++;
        }
    });
}

function updateParticles() {
    for (var i in particles) {
        particles[i].position();
        particles[i].calculateNeighbors();
    }
}

function drawBackground(){
    context.fillStyle = properties.bgColor;
    context.fillRect(0, 0, w, h);
}

function canvas_loop() {
    

    drawBackground();
    updateParticles();
    calculateDestinations();
    drawParticles();
    drawLines();
    requestAnimationFrame(canvas_loop);
}

function canvas_init() {
    for(var i = 0 ; i < properties.particleCount ; i++){
        particles.push(new Particle);
    }

    for(var i in particles) {
        for(var j in particles) {
            if (i === j ) continue;
            point1 = particles[i];
            point2 = particles[j];
            key = 0;
            if (i < j) {
                key = (i << 10) + j;
            } else {
                key = (j << 10) + i;
            }
            particleGraph.set(key, new Edge(point1, point2));
        }
    }
}

canvas_init();
canvas_loop();
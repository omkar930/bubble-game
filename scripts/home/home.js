var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');
var mouse  = {
    x: undefined,
    y: undefined
}

var maxRadius = 40;
var minRadius = 4;

window.addEventListener('mousemove',
function(event){
    mouse.x = event.x;
    mouse.y = event.y;
})

var colScheme = [
    "#264653",
    "#2A9D8F",
    "#E9C46A",
    "#F4A261",
    "#E76F51"
]

function Circle(x,y,dx,dy,radius,color){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
    this.minRadius = radius;

    this.draw = function(){
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        c.fillStyle = this.color;
        c.fill();
    }
    this.update = function(){
        if(this.x > innerWidth-this.radius || this.x < this.radius){
            this.dx = -this.dx;
        }
        if(this.y > innerHeight-this.radius || this.y<this.radius){
            this.dy = -this.dy;
        }
        this.x+=this.dx;
        this.y+=this.dy;
        //interactivity
        if(mouse.x-this.x < 50 && mouse.x-this.x>-50
            && mouse.y-this.y < 50 && mouse.y-this.y>-50) {
                if(this.radius<maxRadius){
                    this.radius+=1;
                }
                
        }else if(this.radius > this.minRadius){
            this.radius--;
        }
        this.draw();
    }
}

var circleArray = [];

for(var i = 0;i<150;i++){
    var radius = Math.random() * 8 + 8;
    var color = colScheme[Math.floor(Math.random()*5)];
    var x = Math.random() * (innerWidth - radius*2) + radius;
    var y = Math.random() * (innerHeight- radius*2) + radius;
    var dx = (Math.random() - 0.5) * 4;
    var dy = (Math.random() - 0.5)* 4;
    
    circleArray.push(new Circle(x,y,dx,dy,radius,color));
}
console.log(circleArray);

function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0,0,innerWidth,innerHeight);
    for(var i = 0;i<circleArray.length;i++){
        circleArray[i].update();
    }
}
animate();



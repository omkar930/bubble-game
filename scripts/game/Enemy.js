export default function Enemy(x,y,radius,color,velocity){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;

    this.draw = function(){
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
   
        
        c.fillStyle = color;
        c.strokeStyle='black';
        c.lineWidth = 2;
        c.fill();
        c.stroke()
        
        
    }
    this.update = function(){
        this.draw();
        this.x  = this.x + this.velocity.x;
        this.y  = this.y + this.velocity.y;
    }
}

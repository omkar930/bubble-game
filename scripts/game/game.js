


const canvas = document.querySelector('canvas');
console.log("omkar");
const c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var points = 0;

//...........................................

function Player(x,y,radius,color){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;

    this.draw = function(){
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        c.fillStyle = this.color;
        c.fill();
    }
    
}

//................................................

function Projectile(x,y,radius,color,velocity){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;

    this.draw = function(){
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        c.fillStyle = this.color;
        c.fill();
    }
    this.update = function(){
        this.draw();
        this.x  = this.x + this.velocity.x;
        this.y  = this.y + this.velocity.y;
    }
}

//........................................................

function Enemy(x,y,radius,color,velocity){
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

//....................................................

function Particle(x,y,radius,color,velocity){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;

    this.draw = function(){
        this.radius -= 0.2;
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        c.fillStyle = color;
        c.fill();

        
    }
    this.update = function(){
        this.draw();
        this.x  = this.x + this.velocity.x;
        this.y  = this.y + this.velocity.y;
    }
}

//...................................................

const player = new Player(canvas.width/2,canvas.height/2,10,"black");
const projectiles = [];
const ememies = [];
const particles = [];
var colScheme = [
    "#264653",
    "#2A9D8F",
    "#E9C46A",
    "#F4A261",
    "#E76F51"
]

function spawnEnemies(){
    setInterval(()=>{
        const radius = Math.random()*(30-4)+4;
        let x;
        let y;
        if(Math.random() < 0.5){
            x = (Math.random() < 0.5) ? 0-radius*2 : canvas.width+radius*2;
            y = Math.random()*canvas.height+radius*2;
        }else{
            x = Math.random()*canvas.width+radius*2;
            y = (Math.random() < 0.5) ? 0-radius*2 : canvas.height+radius*2;
        }
        
        
       // const color = `hsl(${Math.random()*360},50%,50%)`;
        const color = colScheme[Math.floor(Math.random()*5)]
        const angle = Math.atan2(canvas.height/2 - y,canvas.width/2-x);
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)    }
        ememies.push(new Enemy(x,y,radius,color,velocity));
    },1000);
}

let animationId;
function animate(){
    animationId = requestAnimationFrame(animate);
    
    c.clearRect(0,0,canvas.width,canvas.height);
    document.getElementById('overlay').innerText=points;
    player.draw();
    particles.forEach((item,index)=>{
        if(item.radius < 1){
            particles.splice(index,1);
        }
        item.update();
    })
    projectiles.forEach((projectile,pIndex)=>{
        projectile.update();
        if(projectile.x + projectile.radius < 0 ||
            projectile.x-projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height){
            setTimeout(()=>{
                projectiles.splice(pIndex,1);
                },0)
        }
    });
    ememies.forEach((enemy,eIndex)=>{
        enemy.update();

        const dist = Math.hypot(player.x - enemy.x,player.y - enemy.y);
        if(dist - enemy.radius - player.radius < 1){
            let final = {pts : points};
            localStorage.setItem("score010",JSON.stringify(final));
            cancelAnimationFrame(animationId);
            window.location.href="../pages/end.html";
            
        }
        projectiles.forEach((projectile,pIndex) =>{
            const dist = Math.hypot(projectile.x - enemy.x,projectile.y - enemy.y);
            if(dist - enemy.radius - projectile.radius < 1){
                for(let i = 0;i<6;i++){
                    particles.push(new Particle(projectile.x,projectile.y,6,enemy.color,{
                        x: Math.random() - 0.5,
                        y: Math.random()-0.5
                    }))
                }
                if(enemy.radius > 20){
                    enemy.radius -= 10;
                    
                    setTimeout(()=>{
                        projectiles.splice(pIndex,1);
                        points+=10;
                    },0)
                }else{
                    
                    setTimeout(()=>{
                        ememies.splice(eIndex,1);
                        projectiles.splice(pIndex,1);
                        points+=10;
                    },0)
                }
            }
        })
    })
    
}

window.addEventListener('click',(event)=>{
    console.log(projectiles);
    const angle = Math.atan2(event.clientY - canvas.height/2,event.clientX - canvas.width/2);
    const velocity = {
        x: Math.cos(angle)*5,
        y: Math.sin(angle)*5    
    }
    points-=2;
    projectiles.push(new Projectile(canvas.width/2,canvas.height/2,3,"black",velocity ))
})

animate();
spawnEnemies();

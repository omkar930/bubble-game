// Select the canvas element and get its 2D rendering context
const canvas = document.querySelector('canvas');
console.log("omkar");
const c = canvas.getContext('2d');

// Set the canvas size to match the window dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Initialize a variable to track points
var points = 0;

//...........................................

// Define a constructor for the player character
function Player(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;

    // Method to draw the player character
    this.draw = function () {
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }
}

//................................................

// Define a constructor for projectiles
function Projectile(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;

    // Method to draw a projectile
    this.draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }

    // Method to update the position of the projectile
    this.update = function () {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

//........................................................

// Define a constructor for enemies
function Enemy(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;

    // Method to draw an enemy
    this.draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = color;
        c.strokeStyle = 'black';
        c.lineWidth = 2;
        c.fill();
        c.stroke();
    }

    // Method to update the position of the enemy
    this.update = function () {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

//....................................................

// Define a constructor for particles
function Particle(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;

    // Method to draw a particle
    this.draw = function () {
        this.radius -= 0.2;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = color;
        c.fill();
    }

    // Method to update the position of the particle
    this.update = function () {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

//...................................................

// Create an instance of the player character
const player = new Player(canvas.width / 2, canvas.height / 2, 10, "black");

// Create arrays to hold projectiles, enemies, and particles
const projectiles = [];
const enemies = [];
const particles = [];

// Define an array of colors for enemies
var colScheme = [
    "#264653",
    "#2A9D8F",
    "#E9C46A",
    "#F4A261",
    "#E76F51"
]

// Function to continuously spawn enemies
function spawnEnemies() {
    setInterval(() => {
        const radius = Math.random() * (30 - 4) + 4;
        let x;
        let y;
        if (Math.random() < 0.5) {
            x = (Math.random() < 0.5) ? 0 - radius * 2 : canvas.width + radius * 2;
            y = Math.random() * canvas.height + radius * 2;
        } else {
            x = Math.random() * canvas.width + radius * 2;
            y = (Math.random() < 0.5) ? 0 - radius * 2 : canvas.height + radius * 2;
        }

        // Choose a random color for the enemy
        const color = colScheme[Math.floor(Math.random() * 5)]

        // Calculate the angle and velocity for the enemy
        const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }

        // Create a new enemy and add it to the enemies array
        enemies.push(new Enemy(x, y, radius, color, velocity));
    }, 1000);
}

// Variable to store the animation frame ID
let animationId;

// Animation loop function
function animate() {
    animationId = requestAnimationFrame(animate);

    // Clear the entire canvas
    c.clearRect(0, 0, canvas.width, canvas.height);

    //set score
    document.getElementById('overlay').innerText=points;

    // Update and draw the player character
    player.draw();

    // Update and draw the particles
    particles.forEach((item, index) => {
        if (item.radius < 1) {
            particles.splice(index, 1);
        }
        item.update();
    });

    // Update and draw the projectiles
    projectiles.forEach((projectile, pIndex) => {
        projectile.update();

        // Remove projectiles that go out of the canvas
        if (projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {
                projectiles.splice(pIndex, 1);
            }, 0)
        }
    });

    // Update and draw the enemies
    enemies.forEach((enemy, eIndex) => {
        enemy.update();

        // Check for collision with the player character
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if (dist - enemy.radius - player.radius < 1) {
            // Game over logic
            let final = { pts: points };
            localStorage.setItem("score010", JSON.stringify(final));
            cancelAnimationFrame(animationId);
            window.location.href = "../pages/end.html";
        }

        // Check for collision with projectiles
        projectiles.forEach((projectile, pIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            if (dist - enemy.radius - projectile.radius < 1) {
                // Create particles for the explosion
                for (let i = 0; i < 6; i++) {
                    particles.push(new Particle(projectile.x, projectile.y, 6, enemy.color, {
                        x: Math.random() - 0.5,
                        y: Math.random() - 0.5
                    }))
                }

                // Reduce the enemy's radius and remove the projectile
                if (enemy.radius > 20) {
                    enemy.radius -= 10;
                    setTimeout(() => {
                        projectiles.splice(pIndex, 1);
                        points += 10;
                    }, 0)
                } else {
                    // Remove the enemy and the projectile
                    setTimeout(() => {
                        enemies.splice(eIndex, 1);
                        projectiles.splice(pIndex, 1);
                        points += 10;
                    }, 0)
                }
            }
        })
    })
}

// Add a click event listener to allow the player to shoot projectiles
window.addEventListener('click', (event) => {
    // Calculate the angle and velocity for the projectile
    const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2);
    const velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
    }

    // Subtract points when firing a projectile
    points -= 2;

    // Create a new projectile and add it to the projectiles array
    projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, 3, "black", velocity))
})

// Start the game animation loop and enemy spawning
animate();
spawnEnemies();


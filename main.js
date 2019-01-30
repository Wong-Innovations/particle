// Canvas Pre-reqs
var canvas = document.getElementById("myCanvas");
var startButton = document.getElementById("start");
var ctx = canvas.getContext("2d");

// Displayed info
var score = 0;
var highscore;
var enemies = [];

// Private variables
const ballRadius = 15;
const playerColor = "#006400";
const enemyColor = "#FF1493";
var playerX, playerY = 0;
var start; // Time object (see setup function)

// Class definitions
class Enemy {
    constructor(xpos, ypos, dx, dy) {
        this.xpos = xpos;
        this.ypos = ypos;
        this.dx = dx;
        this.dy = dy;
        this.color = enemyColor;
    }
}

class Render {
    static particle(xpos, ypos, color) {
        ctx.beginPath();
        ctx.arc(xpos, ypos, ballRadius, 0, Math.PI*2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }
    static score() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Score: "+score, 8, 20);
    }
    static instructions() {
        ctx.font = "24px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("How to play:", 98, 120);
        ctx.font = "18px Arial";
        ctx.fillText("1. Click 'Start'", 100, 150);
        ctx.fillText("2. Place cursor over canvas", 100, 170);
        ctx.fillText("3. Wait for the game to begin...", 100, 190);
        ctx.fillText("4. Avoid colliding with anti-particles", 100, 210);
    }
}

class Player {
    static position(e) {
        if ((e.pageX <= 480 - ballRadius) && (e.pageY <= 320 - ballRadius) && (e.pageX >= ballRadius) && (e.pageY >= ballRadius)){
            playerX = e.pageX;
            playerY = e.pageY;
        }
    }
}

function checkWallCollision(xpos, ypos){
    if ((ypos > 320 - ballRadius) || (ypos < ballRadius)){
        return 2;
    }
    if ((xpos > 480 - ballRadius) || (xpos < ballRadius)){
        return 1;
    }
    return 0;
}

function checkPlayerCollision(xpos, ypos){
    if (Math.pow(playerX - xpos, 2) + Math.pow(playerY - ypos, 2) <= Math.pow(2*ballRadius, 2)){
        return true;
    }
    return false;
}

function randomNum(min, max){
    return Math.random() * (max - min) + min;
}
function randBool(){
    let num = Math.round(Math.random());
    if (num){
        return 2 * num;
    }else{
        return num - 2;
    }
}

function setup(){
    start = new Date();
    enemies.push(new Enemy(randomNum(ballRadius, 480 - ballRadius), randomNum(ballRadius, 320 - ballRadius), randBool(), randBool()));
    draw();
}

// Main function to be called by page
function draw(){
    // Preprocessing
    canvas.style.cursor = "none";
    let now = new Date();
    if ((now - start) >= 5000){
        enemies.push(new Enemy(randomNum(ballRadius, 480 - ballRadius), randomNum(ballRadius, 320 - ballRadius), randBool(), randBool()));
        start = now;
    }
    score++;

    // Rendering Stage
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    Render.particle(playerX, playerY, playerColor);
    for (i in enemies) {
        enemies[i].xpos = enemies[i].xpos + enemies[i].dx;
        enemies[i].ypos = enemies[i].ypos + enemies[i].dy;
        Render.particle(enemies[i].xpos, enemies[i].ypos, enemyColor);
    }
    Render.score();

    // Postprocessing
    for (i in enemies) {
        switch (checkWallCollision(enemies[i].xpos, enemies[i].ypos)){
            case 1:
                enemies[i].dx = -enemies[i].dx;
                enemies[i].dy = -enemies[i].dy;
            case 2:
                enemies[i].dy = -enemies[i].dy;
        }
        if (checkPlayerCollision(enemies[i].xpos, enemies[i].ypos)){
            canvas.style.cursor = "default";
            canvas.style.opacity = 0.8;
            startButton.style.opacity = 0.6;
            startButton.style.cursor = "not-allowed";
            startButton.disabled = true;
            return false;
        }
    }
    requestAnimationFrame(draw);
}
Render.instructions();
Render.score();
document.addEventListener('mousemove', Player.position);
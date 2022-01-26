/*canvas*/

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;

/*puntuacion*/
var score = 0;

/*Vidas */
var lives = 3;

function vidas() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "green";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

/*botones */

var rightPressed = false;
var leftPressed = false;

/* Inicio de la Paleta*/

var paddleHeight = 10;
var paddleWidth = 150;
var paddleX = (canvas.width-paddleWidth)/2;

/* creacion de la paleta*/
function Paleta() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "green";
    
    ctx.fill();
    ctx.closePath();
}

/* Inicio de los Ladrillos*/

var brickRowCount = 5;
var brickColumnCount = 11;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;


/*Array de ladrillos para amontonarlos*/ 
var bricks = [];
for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}


/*Creamos los ladrillos para que se vean en pantalla*/
function ladrillos() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "orange";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

/*Esto detecta las colisiones entre la pelota y los ladrillos*/
function deteccioncolision() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                        alert("Ganaste!");
                        document.location.href="../index.html";
                    }
                }
            }
        }
    }
}

/*Contador de puntos*/ 
function puntuacion() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "green";
    ctx.fillText("Score: "+score, 8, 20);
}

/*Fin de los ladrillos*/

/*Creacion de la pelota*/ 
function pelota() {

    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}
/*Radio de la pelota*/
var ballRadius = 15;

/*dibujo del lienzo en movimiento*/
function dibujo() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pelota();
    Paleta();
    ladrillos();
    deteccioncolision();
    puntuacion();
    vidas();

    /*Rebotar de izquierda a derecha*/
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    
    /*Rebotar de arriba y abajo*/

    /*con esto solo rebotaria en el techo y no en el suelo*/
    if(y + dy < ballRadius) {
        dy = -dy;
        
    /*Hacemos que la paleta sea solido para que golpee*/
    } else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            /*En caso de tocar suelo salta el game over*/ 
            lives--;
    if(!lives) {
        alert("GAME OVER");
        document.location.href="../index.html";
}
else {
    x = canvas.width/2;
    y = canvas.height-30;
    dx = 2;
    dy = -2;
    paddleX = (canvas.width-paddleWidth)/2;
}
        }
    }

    /*movimiento derecha de la paleta */
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        /*velocidad a la que irá hacia la derecha */
        paddleX += 4;
    }

    /*movimiento izquierda de la paleta */
    else if(leftPressed && paddleX > 0) {
        /*velocidad a la que irá hacia la izquierda */
        paddleX -= 4;
    }

    /*longitud */
    x += dx;
    y += dy;
    
}



/*bindeo de botones */

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

/*raton*/ 
document.addEventListener("mousemove", mouseMoveHandler, false);


function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

/*Funcionamiento del juego + la velocidad a la que irá*/
setInterval(dibujo, 5);
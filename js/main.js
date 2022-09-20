//creating dom elemnts
const outerGrid = document.querySelector('.outer-grid');

const scoreDisplay = document.querySelector('#score');

//Global variables and constants
const blockWidth = 10;
const blockHeight = 4;
const ballDiameter =4;
const outerGridWidth = 52;
const outerGridHeight = 80;
let ballXDirection = 1;
let ballYDirection = 1;
let intervalId;
let score =0;


const userStart = [18,1]
let PaddleCrntPosition = userStart;

const ballStart =[23,5];
let ballCurrentPosition = ballStart;


class Block{
    constructor(xAxis,yAxis){
        this.bottomLeft = [xAxis, yAxis]
        this.bottomRight = [xAxis+blockWidth, yAxis]
        this.topLeft = [xAxis, yAxis+blockHeight]
        this.topRight = [xAxis +blockWidth, yAxis+blockHeight]
    }
}    

// xAxis - positionx+width; yAxis -postionY +height;
const blocks = [
    new Block(0,75),
    new Block(10,75),
    new Block(20,75),
    new Block(30,75),
    new Block(40,75),
    new Block(0,70),
    new Block(10,70),
    new Block(20,70),
    new Block(30,70),
    new Block(40,70),
    new Block(0,65),
    new Block(10,65),
    new Block(20,65),
    new Block(30,65),
    new Block(40,65),

]
function createBlock(){
    for(let i=0;i<blocks.length;i++){
        const block = document.createElement('div');
        block.classList.add('block');
        block.style.left = blocks[i].bottomLeft[0] +'vw';
        block.style.bottom = blocks[i].bottomLeft[1] +'vh';
        outerGrid.appendChild(block);

    }
    
}
createBlock();


// create Paddle

const paddle = document.createElement('div')
paddle.classList.add('paddle');
drawPaddle()
outerGrid.appendChild(paddle)
  

function drawPaddle(){
    paddle.style.left = PaddleCrntPosition[0]+'vw';
    paddle.style.bottom = PaddleCrntPosition[1]+'vh';  
}


document.addEventListener('keydown',movePaddle)
function movePaddle(e) {
    switch (e.key) {
      case 'ArrowLeft':
        if(PaddleCrntPosition[0] > 0){
            PaddleCrntPosition[0] -= 2;
            console.log(PaddleCrntPosition[0] > 0)
            drawPaddle();   
        }
        break;
      case 'ArrowRight':
        if(PaddleCrntPosition[0] < 48 - blockWidth){
            PaddleCrntPosition[0] += 2;
            console.log(PaddleCrntPosition[0] > 0)
            drawPaddle();   
        }
        break;

    }
}


//create ball

const ball = document.createElement('div');
ball.classList.add('ball');
drawBall();
outerGrid.appendChild(ball);

function drawBall(){
    ball.style.left = ballCurrentPosition[0]+'vw';
    ball.style.bottom = ballCurrentPosition[1] +'vh';
}

function moveBall(){
    ballCurrentPosition[0] += ballXDirection;
    ballCurrentPosition[1] += ballYDirection;
    drawBall();
    checkForCollisions();
}

intervalId = setInterval(moveBall,80);


//collisions check

function checkForCollisions(){

    //check block collision
    for(let i=0;i<blocks.length;i++){
        if
        (
          (ballCurrentPosition[0] > blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0]) &&
          ((ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[i].topLeft[1]) 
        ){
            let allBlocks = [...document.querySelectorAll('.block')];
            allBlocks[i].classList.remove('block');
            blocks.splice(i,1);
            changeBallDirection()
            score++
            scoreDisplay.innerHTML = score;
            if (blocks.length === 0) {
                scoreDisplay.innerHTML = 'You Win!'
                clearInterval(timerId)
                document.removeEventListener('keydown', movePaddle)
            }

        }

    }

    // paddle collision
    if
    (
    (ballCurrentPosition[0] > PaddleCrntPosition[0] && ballCurrentPosition[0] < PaddleCrntPosition[0] + blockWidth) &&
    (ballCurrentPosition[1] > PaddleCrntPosition[1] && ballCurrentPosition[1] < PaddleCrntPosition[1] + blockHeight ) 
    ){
         changeBallDirection();
    }

    if((ballCurrentPosition[0] >= outerGridWidth - ballDiameter) ||
    (ballCurrentPosition[1] >= outerGridHeight - ballDiameter) || 
    (ballCurrentPosition[0] <= 0)) {
        changeBallDirection();
    }
    if(ballCurrentPosition[1] <=0){
        clearInterval(intervalId);
        console.log("Game Over")
        scoreDisplay.innerHTML = "you lose";
        document.removeEventListener('keydown',movePaddle)
    }
}


 

function changeBallDirection(){
    if(ballXDirection === 1 && ballYDirection === 1){
        ballXDirection = -1
        return
    }
    if(ballXDirection === -1 && ballYDirection === 1){
        ballYDirection = -1;
        return
    }
    if(ballXDirection === -1 && ballYDirection === -1){
        ballXDirection = 1;
        return
    }
    if(ballXDirection === 1 && ballYDirection === -1){
        ballYDirection = 1;
        return
    }
}
//creating dom elemnts
const outerGrid = document.querySelector(".outer-grid");

const scoreDisplay = document.querySelector("#score");

const livesDisplay = document.getElementById("lives");

//To display end game status win/lose
function displayWinStatus() {
  const statusElm = document.createElement("div");
  statusElm.setAttribute("id", "status");
  

  const winImage = document.createElement("img");
  winImage.setAttribute("id", "win-img");
  winImage.setAttribute("src", "./images/win-image.jpg");
  statusElm.appendChild(winImage);

  //parent Element
  const parentElm = document.querySelector("body");

  parentElm.appendChild(statusElm);
}

//Global variables and constants
const blockWidth = 10;
const blockHeight = 4;
const ballDiameter = 4;
const outerGridWidth = 52;
const outerGridHeight = 78;
const rewardWidth = 20;
const rewardHeight = 20;
let rewardIntervalId = 0;
let ballXDirection = 1;
let ballYDirection = 1;
let intervalId;
let score = 0;
let lives = 2;
let blockHitCount = 2;
let reward = 0;

const userStart = [18, 1];
let PaddleCrntPosition = userStart;

const ballStart = [23, 5];
let ballCurrentPosition = ballStart;

scoreDisplay.innerHTML = "🏆Score: " + score;

livesDisplay.innerHTML = "💖Lives: " + lives;

//create rows of blocks with reference to axis
class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topLeft = [xAxis, yAxis + blockHeight];
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
  }
}

// Blocks instance  and creation
const blocks = [
  new Block(0, 75),
  new Block(10, 75),
  new Block(20, 75),
  new Block(30, 75),
  new Block(40, 75),
  new Block(0, 70),
  new Block(10, 70),
  new Block(20, 70),
  new Block(30, 70),
  new Block(40, 70),
  new Block(0, 65),
  new Block(10, 65),
  new Block(20, 65),
  new Block(30, 65),
  new Block(40, 65),
];

function createBlock() {
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.style.left = blocks[i].bottomLeft[0] + "vw";
    block.style.bottom = blocks[i].bottomLeft[1] + "vh";
    if (blocks[i].bottomLeft[1] === 65) {
      block.style.backgroundColor = "deepskyblue";
    }
    if (blocks[i].bottomLeft[1] === 70) {
      block.style.backgroundColor = "turquoise";
    }
    if (blocks[i].bottomLeft[1] === 75) {
      block.style.backgroundColor = "mediumblue";
    }
    outerGrid.appendChild(block);
  }
}
createBlock();

// create Paddle
const paddle = document.createElement("div");
paddle.classList.add("paddle");
drawPaddle();
outerGrid.appendChild(paddle);

function drawPaddle() {
  paddle.style.left = PaddleCrntPosition[0] + "vw";
  paddle.style.bottom = PaddleCrntPosition[1] + "vh";
}

//Event Listners to the padddle
document.addEventListener("keydown", movePaddle);
function movePaddle(e) {
  switch (e.key) {
    case "ArrowLeft":
      if (PaddleCrntPosition[0] > 0) {
        PaddleCrntPosition[0] -= 2;
        drawPaddle();
      }
      break;
    case "ArrowRight":
      if (PaddleCrntPosition[0] < 48 - blockWidth) {
        PaddleCrntPosition[0] += 2;
        drawPaddle();
      }
      break;
  }
}

//create ball
const ball = document.createElement("div");
ball.classList.add("ball");
drawBall();
outerGrid.appendChild(ball);

function drawBall() {
  ball.style.left = ballCurrentPosition[0] + "vw";
  ball.style.bottom = ballCurrentPosition[1] + "vh";
}

//Move the ball
function moveBall() {
  ballCurrentPosition[0] += ballXDirection;
  ballCurrentPosition[1] += ballYDirection;
  drawBall();
  checkForCollisions();
}

//time intervall to move the ball
intervalId = setInterval(moveBall, 60);


//Check for the collisions
function checkForCollisions() {
  //Blocks collision
  for (let i = 0; i < blocks.length; i++) {
    if (
      ballCurrentPosition[0] > blocks[i].bottomLeft[0] &&
      ballCurrentPosition[0] < blocks[i].bottomRight[0] &&
      ballCurrentPosition[1] + ballDiameter > blocks[i].bottomLeft[1] &&
      ballCurrentPosition[1] < blocks[i].topLeft[1]
    ) {
      let allBlocks = [...document.querySelectorAll(".block")];

      if (blocks[i].bottomLeft[1] === 75) {
        allBlocks[i].style.backgroundColor = "crimson";
        score++;
        changeBallDirection();
        blockHitCount--;
        scoreDisplay.innerHTML = "🏆Score:" + score;
        if (blockHitCount === 0) {
          blockHitCount = 2;
          allBlocks[i].classList.remove("block");
          if (blocks[i].bottomLeft[0] === 0 || blocks[i].bottomLeft[0] === 40) {
            reward = new Rewards(
              blocks[i].bottomLeft[0] + 2,
              blocks[i].bottomLeft[1]
            );
            rewardIntervalId = setInterval(function () {
              reward.moveDown();
            }, 100);
          }

          blocks.splice(i, 1);
          changeBallDirection();
          score += 2;

          scoreDisplay.innerHTML = "🏆Score:" + score;
        }
      } else {
        allBlocks[i].classList.remove("block");
        blocks.splice(i, 1);
        changeBallDirection();
        score++;
        blockHitCount = 2;
        scoreDisplay.innerHTML = "🏆Score:" + score;
      }
      if (blocks.length === 0) {
        clearInterval(intervalId);
        document.removeEventListener("keydown", movePaddle);
        displayWinStatus();
      }
    }
  }

  // Ball-paddle collision
  if (
    ballCurrentPosition[0] > PaddleCrntPosition[0] &&
    ballCurrentPosition[0] < PaddleCrntPosition[0] + blockWidth &&
    ballCurrentPosition[1] > PaddleCrntPosition[1] &&
    ballCurrentPosition[1] < PaddleCrntPosition[1] + blockHeight
  ) {
    changeBallDirection();
  }

  if (
    ballCurrentPosition[0] >= outerGridWidth - ballDiameter ||
    ballCurrentPosition[1] >= outerGridHeight - ballDiameter ||
    ballCurrentPosition[0] <= 0
  ) {
    changeBallDirection();
  }

  //reward -paddle collision
  if (reward.positionY === PaddleCrntPosition[1] + blockHeight) {
    removerewardIfOutside();
    score += 10;
    scoreDisplay.innerHTML = "🏆Score:" + score;
  }

  if (ballCurrentPosition[1] < 0) {
    if (lives > 0) {
      lives -= 1;
      PaddleCrntPosition[0] = 18;
      PaddleCrntPosition[1] = 1;
      drawPaddle();
      ballCurrentPosition[0] = 23;
      ballCurrentPosition[1] = 5;
      drawBall();
      livesDisplay.innerHTML = "💖Lives: " + lives;
      if (lives === 0) {
        livesDisplay.innerHTML = " 💔Lives: " + lives;
      }
    } else {
      clearInterval(intervalId);
      location.href = "./end.html";
      document.removeEventListener("keydown", movePaddle);
    }
  }
}

//To change Ball Direction when collides
function changeBallDirection() {
  if (ballXDirection === 1 && ballYDirection === 1) {
    ballXDirection = -1;
    return;
  }
  if (ballXDirection === -1 && ballYDirection === 1) {
    ballYDirection = -1;
    return;
  }
  if (ballXDirection === -1 && ballYDirection === -1) {
    ballXDirection = 1;
    return;
  }
  if (ballXDirection === 1 && ballYDirection === -1) {
    ballYDirection = 1;
    return;
  }
}

//To create Reward
class Rewards {
  constructor(positionX, positionY) {
    this.width = 20;
    this.height = 20;
    this.positionX = positionX;
    this.positionY = positionY;
    this.domElement = null;
    this.createDomElement();
  }

  //Creating a div and append it in dom
  createDomElement() {
    this.domElement = document.createElement("div");
    this.domElement.className = "reward";
    this.domElement.style.bottom = this.positionY + "vh";
    this.domElement.style.left = this.positionX + "vw";
    outerGrid.appendChild(this.domElement);
  }
  //To move the reward
  moveDown() {
    this.positionY -= 1;
    this.domElement.style.bottom = this.positionY + "vh";
    removerewardIfOutside();
  }
}

//To remove reward if moves outer the grid
function removerewardIfOutside() {
  if (reward.positionY < 4 || reward.positionY <= 0) {
    reward.domElement.remove();
    clearInterval(rewardIntervalId);
  }
}

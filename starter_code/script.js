//Vamo a reusars codigo
const images = {
  bg: './images/bg.png',
  flappy: './images/flappy.png',
  logo: './images/logo.png',
  bottomPipe: './images/obstacle_bottom.png',
  topPipe: '/images/obstacle_top.png'
}
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let interval;
let frames = 0;
const obstacles = [];

class Board {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.width = canvas.width;
    this.height = canvas.height;
    this.img = new Image();
    this.img.src = images.bg;
    this.img.onload = () => {
      this.draw();
    };
  }
  draw() {
    // decrementamos x para que vaya haciendo el efecto de movimiento
    this.x--;
    // preguntamos si la primer imagen ya esta fuera del canvas
    if (this.x < -canvas.width) this.x = 0;
    // dibujamos la imagen normal
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    // dibujamos la otra imagen, despues de la primer imagen, para que ocupe el espacio en blanco, cuando la primer imagen esta fuera
    ctx.drawImage(this.img, this.x + canvas.width, this.y, this.width, this.height);
  }
}

class Faby {
  constructor() {
    this.x = 30;
    this.y = 150;
    this.width = 50;
    this.height = 50;
    this.img = new Image();
    this.img.src = images.flappy;
    this.img.onload = () => {
      this.draw();
    };
  }
  draw() {
    this.y++;
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
  fly() {
    if (this.y >= 0) {
      this.y -= 40;
    }
  }
  gravity() {
    if (this.y < canvas.height - 50) {
      this.y += 2;
    }
  }
  isTouching(obstacle) {
    return (
      this.x < obstacle.x + obstacle.width &&
      this.x + this.width > obstacle.x &&
      this.y < obstacle.y + obstacle.height &&
      this.y + this.height > obstacle.y
    )
  }
}

class Obstacle {
  constructor(y, height, type) {
    this.x = canvas.width + 50;
    this.y = y;
    this.height = height;
    this.width = 50;
    this.imgTop = new Image();
    this.imgTop.src = images.topPipe;
    this.imgBot = new Image();
    this.imgBot.src = images.bottomPipe;
    this.type = type;
  }
  draw() {
    this.x -= 5;
    if (this.type) {
      ctx.drawImage(this.imgTop, this.x, this.y, this.width, this.height);
    } else {
      ctx.drawImage(this.imgBot, this.x, this.y, this.width, this.height);
    }
  }
}

const board = new Board();
const faby = new Faby();
const pipe = new Obstacle();


function generatePipes() {
  const max = canvas.height - 100;
  const min = 50;
  const ventanita = 100;
  const randomHeight = Math.floor(Math.random() * (max - min));
  if (frames % 50 === 0) {
    obstacles.push(new Obstacle(0, randomHeight, true));
    obstacles.push(
      new Obstacle(randomHeight + ventanita, canvas.height - randomHeight - ventanita, false)
    );
  }
}

function drawPipes() {
  generatePipes();
  obstacles.forEach((pipe) => pipe.draw());
}



function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}



function checkCollition() {
  obstacles.forEach((pipe) => {
    if (faby.isTouching(pipe)) {
      gameOver();
    }
    if (faby.y >= canvas.height - faby.height) {
      gameOver();
    }
  });
}

function gameOver() {
  clearInterval(interval);
  ctx.font = '30px Courier';
  ctx.fillText('Game over', canvas.width / 2, canvas.height / 2);

}



function start() {
  // si ya se habia ejecutado el juego, no lo dejes entrar despues
  if (interval) return;
  interval = setInterval(update, 1000 / 60);
}

function restart() {
  interval = false;
  faby.x = 30;
  faby.y = 70;
  start();
}

function update() {
  frames++;
  clearCanvas();
  board.draw();
  faby.draw();
  faby.gravity();
  drawPipes();
  checkCollition();
}



document.onkeydown = (e) => {
  switch (e.keyCode) {
    case 38:
      faby.fly();
      break;

    case 13:
      start();
      break;

    default:
      break;
  }
}
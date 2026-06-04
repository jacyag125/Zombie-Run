var W = 600;
var H = 600;
var state = "start";
var timeLeft = 20;
var characterX, characterY;
var characterW = 100;
var characterH = 80;
var characterSpeed = 3;
var characterImage;
var zombies = [];
var zombieCount = 5;
var startBg, gameBg, winBg, loseBg;
function preload() {
  characterImage = loadImage("character.png");
  startBg = loadImage("startbg.png");
  gameBg  = loadImage("gamebg.png");
  winBg   = loadImage("winbg.png");
  loseBg  = loadImage("losebg.png");
}

function setup() {
  createCanvas(W, H);
  textFont("courier new");
}

function draw() {
  if (state === "start") {
    startScreen();
  } else if (state === "game") {
    gameScreen();
  } else if (state === "win") {
    winScreen();
  } else if (state === "lose") {
    loseScreen();
  }
}

function startScreen() {
  image(startBg, 0, 0, W, H);
  fill(200, 0, 0);
  textAlign(CENTER);
  textSize(95);
  textStyle(BOLD);
  text("ZOMBIE RUN", W / 2, 120);
  textStyle(NORMAL);
  strokeWeight(2);
  stroke(250);
  fill(100, 150, 55);
  rect(70, 175, 460, 160);
  fill(100);
  textSize(25);
  textStyle(BOLD);
  text("INSTRUCTIONS:", W / 2, 210);
  textStyle(NORMAL);
  textSize(20);
  text("Survive by not touching the zombies!", W / 2, 250);
  text("(Use your arrow keys to move)", W / 2, 275);
  text("Avoid the zombies at all costs!", W / 2, 300);
  drawButton(W / 2 - 100, 400, 200, 60, "BEGIN!");
}

function gameScreen() {
  image(gameBg, 0, 0, W, H);
  moveCharacter();
  updateZombies();
  showTimer();
}

function winScreen() {
  image(winBg, 0, 0, W, H);
  textAlign(CENTER);
  textSize(40);
  fill(0);
  text("YOU WIN!", W / 2, 200);
  drawButton(W / 2 - 100, 320, 200, 60, "PLAY AGAIN");
}

function loseScreen() {
  image(loseBg, 0, 0, W, H);
  noStroke();
  fill(150);
  rect(150, 175, 300, 400);
  ellipse(300, 175, 300, 300);
  textAlign(CENTER);
  textSize(40);
  fill(0);
  text("YOU LOSE :(", W / 2, 225);
  text("R.I.P", W / 2, 500);
  drawButton(W / 2 - 100, 320, 200, 60, "TRY AGAIN");
}

function drawButton(x, y, w, h, label) {
  fill(0);
  noStroke();
  rect(x, y, w, h);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(18);
  text(label, x + w / 2, y + h / 2);
}

function buttonWasClicked(x, y, w, h) {
  return mouseX > x && mouseX < x + w &&
         mouseY > y && mouseY < y + h;
}

function mousePressed() {
  if (state === "start") {
    if (buttonWasClicked(W / 2 - 100, 400, 200, 60)) {
      state = "game";
      resetGame();
    }
  } else if (state === "win" || state === "lose") {
    if (buttonWasClicked(W / 2 - 100, 320, 200, 60)) {
      state = "start";
    }
  }
}

function moveCharacter() {
  if (keyIsDown(LEFT_ARROW))  characterX -= characterSpeed;
  if (keyIsDown(RIGHT_ARROW)) characterX += characterSpeed;
  if (keyIsDown(UP_ARROW))    characterY -= characterSpeed;
  if (keyIsDown(DOWN_ARROW))  characterY += characterSpeed;
  image(characterImage, characterX, characterY, characterW, characterH);
}

function makeZombies(difficulty) {
  for (var i = 0; i < zombieCount; i++) {
    var zombieSpeed;
    if (difficulty === "hard") {
      zombieSpeed = random(2.5, 4.5);
    } else {
      zombieSpeed = random(1, 3);
    }
    var zombie = {
      x:     random(W, W + 200),
      y:     random(0, H),
      speed: zombieSpeed,
      size:  60,
      img:   loadImage("zombie.png")
    };
    zombies.push(zombie);
  }
}

function updateZombies() {
  for (var j = 0; j < zombies.length; j++) {
    var z = zombies[j];
    z.x = z.x - z.speed;
    if (checkCollision(z)) {
      endGame(false);
      return;
    }
    if (z.x < -z.size) {
      z.x = random(W, W + 200);
      z.y = random(0, H);
      z.speed = z.speed + 0.5;
    }
    image(z.img, z.x, z.y, z.size, z.size);
  }
}

function checkCollision(z) {
  var xOverlap = characterX < z.x + z.size && z.x < characterX + characterW;
  var yOverlap = characterY < z.y + z.size && z.y < characterY + characterH;
  return xOverlap && yOverlap;
}

function showTimer() {
  textAlign(CENTER);
  fill(255);
  textSize(18);
  text("TIME: " + timeLeft, W / 2, 30);
  if (frameCount % 60 === 0 && timeLeft > 0) {
    timeLeft--;
  }
  if (timeLeft === 0) {
    endGame(true);
  }
}

function resetGame() {
  zombies = [];
  characterX = 50;
  characterY = H / 2;
  timeLeft = 20;
  makeZombies("easy");
}

function endGame(playerWon) {
  if (playerWon) {
    state = "win";
  } else {
    state = "lose";
  }
}
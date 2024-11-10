// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/cXgA1d_E-jY

// P5 exported functions (eslint flags)
/* exported preload, setup, draw, keyPressed */

// Exported sprites (eslint flags)
/* exported birdSprite, pipeBodySprite, pipePeakSprite */

var parallax = 0.8;
var score = 0;
var maxScore = 0;
var birdSprite;
var pipeBodySprite;
var pipePeakSprite;
var bgImg;
var bgX;
var gameoverFrame = 0;
var isOver = false;

let numBirds = 0;
let counter = 0;

var touched = false;
var prevTouched = touched;

const POP_TOTAL = 500;

// UI elements
let speedSlider;
let speedSpan;
let highScoreSpan;
let allTimeHighScoreSpan;

// High score
let highScore = 0;

let birds = [];
let savedBirds = [];
let pipes = [];

function preload() {
  pipeBodySprite = loadImage("graphics/pipe_body.png");
  pipePeakSprite = loadImage("graphics/pipe_tip.png");
  birdSprite = loadImage("graphics/icon.png");
  bgImg = loadImage("graphics/background.png");
}

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("canvascontainer");

  // Access the interface elements
  speedSlider = select("#speedSlider");
  speedSpan = select("#speed");
  highScoreSpan = select("#hs");
  allTimeHighScoreSpan = select("#ahs");
  // runBestButton = select("#best");
  // runBestButton.mousePressed(toggleState);

  for (let i = 0; i < POP_TOTAL; ++i) {
    birds[i] = new Bird();
  }
  reset();
}

function draw() {
  let cycles = speedSlider.value();
  speedSpan.html(cycles);

  for (let n = 0; n < cycles; n++) {
    if (counter % 50 == 0) {
      pipes.push(new Pipe());
    }
    counter++;

    for (var i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();

      for (let j = birds.length - 1; j >= 0; j--) {
        if (pipes[i].hits(birds[j])) {
          savedBirds.push(birds.splice(j, 1)[0]);
        }
      }

      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }

    for (let i = birds.length - 1; i >= 0; i--) {
      if (birds[i].offScreen()) {
        savedBirds.push(birds.splice(i, 1)[0]);
      }
    }

    for (let bird of birds) {
      bird.think(pipes);
      bird.update();
    }

    if (birds.length == 0) {
      counter = 0;
      nextGeneration();
      pipes = [];
    }
  }
  background(0);

  // Draw our background image, then move it at the same speed as the pipes
  image(bgImg, bgX, 0, bgImg.width, height);
  bgX -= 10 * parallax;

  // this handles the "infinite loop" by checking if the right
  // edge of the image would be on the screen, if it is draw a
  // second copy of the image right next to it
  // once the second image gets to the 0 point, we can reset bgX to
  // 0 and go back to drawing just one image.
  if (bgX <= -bgImg.width + width) {
    image(bgImg, bgX + bgImg.width, 0, bgImg.width, height);
    if (bgX <= -bgImg.width) {
      bgX = 0;
    }
  }

  let tempHighScore = 0;

  // Which is the best bird?
  let tempBestBird = null;
  for (let i = 0; i < birds.length; i++) {
    let s = birds[i].score;
    if (s > tempHighScore) {
      tempHighScore = s;
      tempBestBird = birds[i];
    }
  }

  // Is it the all time high scorer?
  if (tempHighScore > highScore) {
    highScore = tempHighScore;
    bestBird = tempBestBird;
  }
  // Update DOM Elements
  highScoreSpan.html(tempHighScore);
  allTimeHighScoreSpan.html(highScore);

  for (let bird of birds) {
    bird.show();
  }
  for (let pipe of pipes) {
    pipe.show();
  }

  numBirds = birds.length;
}

function showScores() {
  textSize(32);
  text("score: " + score, 1, 32);
  text("record: " + maxScore, 1, 64);
  text("current birds: " + numBirds, 1, 96);
}

function gameover() {
  //   textSize(64);
  //   textAlign(CENTER, CENTER);
  //   text("GAMEOVER", width / 2, height / 2);
  //   textAlign(LEFT, BASELINE);
  //   maxScore = max(score, maxScore);
  //   isOver = true;
  //   noLoop();
}

function reset() {
  isOver = false;
  score = 0;
  bgX = 0;
  // pipes = [];
  // bird = new Bird();
  // pipes.push(new Pipe());
  gameoverFrame = frameCount - 1;
  loop();
}

// function keyPressed() {
//   if (key === " ") {
//     bird.up();
//     if (isOver) reset(); //you can just call reset() in Machinelearning if you die, because you cant simulate keyPress with code.
//   }
// }

function touchStarted() {
  if (isOver) reset();
}

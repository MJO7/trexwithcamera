var trex, trex_running, trex_collided, score;
var ground, invisibleGround, groundImage, trexDied;

var cloud, cloudsGroup, cloudImage, gameOverImg, restart;
var obstaclesGroup,
  obstacle1,
  obstacle2,
  obstacle3,
  obstacle4,
  obstacle5,
  obstacle6;
var gameState = "PLAY";
var gameOver,
  restart,
  dieSound,
  checkpointSound,
  jumpSound,
  background1,
  background1Img;

function preload() {
  trex_running = loadImage("CHARIZARD1.png");
  trex_collided = loadAnimation("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameOverImg = loadImage("unnamed.png");
  restartImg = loadImage("restart.png");
  trexDied = loadAnimation("fainted.png");
  dieSound = loadSound("die.mp3");
  checkpointSound = loadSound("checkPoint (1).mp3");
  jumpSound = loadSound("jump.mp3");
  background1Img = loadImage("milky way.jpg");
}

function setup() {
  createCanvas(600, 200);

  trex = createSprite(50, 150, 20, 10);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.07;
  //trex.debug = true;
  trex.setCollider("rectangle", 0, 0, 600, 250);

  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  invisibleGround = createSprite(200, 160, 400, 10);
  invisibleGround.visible = false;
  //background1 = createSprite(300, 100, 600, 200);
  // background1.addImage("background1Img", background1Img);
  //background1.scale = 0.5;
  gameOver = createSprite(300, 100, 10, 10);
  gameOver.addImage("gameOverImg", gameOverImg);
  gameOver.visible = false;
  gameOver.scale = 0.35;
  restart = createSprite(300, 150, 10, 10);
  restart.addImage("restartImg", restartImg);
  restart.visible = false;
  restart.scale = 0.35;
  console.log("Hello" + 5);

  score = 0;
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
}

function draw() {
  camera.position.x = 300;
  camera.position.y = trex.y;

  background("transparent");
  fill("red");
  text("score : " + Math.round(score), 500, 30);
  trex.collide(invisibleGround);
  if (gameState === "PLAY") {
    score = score + 0.5;

    // ground.velocityX = -(score / 100 + 6)
    if (keyWentDown("space") && trex.y >= 100) {
      trex.velocityY = -13;
      jumpSound.play();
    }

    trex.velocityY = trex.velocityY + 0.8;

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    //spawn the clouds
    spawnClouds();

    //spawn obstacles on the ground
    spawnObstacles();
    if (obstaclesGroup.isTouching(trex)) {
      gameState = "OVER";
      dieSound.play();
    }
  } else if (gameState === "OVER") {
    ground.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    gameOver.visible = true;
    restart.visible = true;
    trex.velocityY = 0;
  }
  if (mousePressedOver(restart)) {
    gameState = "PLAY";
    score = 0;
    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();
    trex.changeAnimation("running", trex_running);
    gameOver.visible = false;
    restart.visible = false;
    gameOver.depth = 50;
  }
  if (score % 100 === 0 && score > 0) {
    checkpointSound.play();
  }

  drawSprites();
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(800, 165, 10, 40);
    obstacle.velocityX = -(score / 100 + 6);

    // //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }

    //assign scale and lifetime to the obstacle
    obstacle.scale = 0.5;
    obstacle.lifetime = 135;
    obstaclesGroup.add(obstacle);
    // console.log(obstaclesGroup.length);
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(600, 100, 40, 10);
    cloud.y = Math.round(random(10, 60));
    cloud.addImage(cloudImage);
    cloud.scale = 1;
    cloud.velocityX = -(score / 100 + 3);
    trex.depth = cloud.depth + 1;
    cloud.lifetime = 200;
    cloudsGroup.add(cloud);
  }
}

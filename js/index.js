const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composites = Matter.Composites,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Constraint = Matter.Constraint,
    Events = Matter.Events,
    Body = Matter.Body,
    Bodies = Matter.Bodies;

const engine = Engine.create(),
    world = engine.world;
engine.enableSleeping = true;
const runner = Runner.create();
world.gravity.scale = 0.002;
const canvasWidth = window.innerWidth,
      canvasHeight = window.innerHeight;

let mX = canvasWidth / 2,
    mY=0,
    targetColor=0,
    balls = [],
    score = 0;
    isPC = true;
    isStop = true;

const ballLens = [200,240,280];
const labels = ["NOTLABELED","RED","GREEN","BLUE"]

// create renderer
const render = Render.create({
    element: document.getElementById("container"),
    engine: engine,
    options: {
        width: canvasWidth,
        height: canvasHeight,
        background: 'rgb(149, 226, 227)',
        wireframes: false,
        showAngleIndicator: true
    }
});

Events.on(engine,"collisionStart",(e)=>{
  console.log(e.pairs);
  e.pairs.forEach((pair) => {
    console.log(pair);
    CheckBallColor(pair.bodyA.label);
    CheckBallColor(pair.bodyB.label);
  });
});

function CheckBallColor(str){
  if(str==labels[targetColor]){
    CountUp();
  }else if(labels.includes(str)){
    GameOver();
  }else{
    console.log("is not ball object");
  }
}

function CountUp(){
  score++;
  console.log({score})
}

function GameOver(){
  score=0;
  PopUp("GameOver");
  OpenMenu();
}

function PopUp(mes){
  console.log(mes);
}

function make_pend(l,color="rgb(44, 76, 164)",label="Circle"){
  var ball = Bodies.circle(400, 100+l, 15, {
    density: 0.04,
    frictionAir: 0,
    label: label,
    render: {
      lineWidth: 1,
      lineStyle: "rgb(172, 172, 172)",
      fillStyle: color
    }
  });

  balls.push(ball);

  World.add(world, ball);
  World.add(world, Constraint.create({
      bodyA: ball2,
      bodyB: ball
  }));
}

const ball2 = Bodies.circle(canvasWidth / 2, 100, 10, {
  density: 4*1e5,
  frictionAir: 0,
  label: "hinge",
  render: {
    lineWidth: 1,
    fillStyle: "rgb(38, 34, 38)"
  }
});

const ground0 = Bodies.rectangle(0, 160, 2 * canvasWidth, 10,  { isStatic: true });
    ground1 = Bodies.rectangle(0, 0, 10, 320, { isStatic: true }),
    ground2 = Bodies.rectangle(canvasWidth, 0, 10, 320, { isStatic: true });

function StartGame(target){
  HideMenu();

  World.add(world, ball2);
  World.add(world, ground0);
  World.add(world, ground1);
  World.add(world, ground2);
  make_pend(200,"#e26363","RED");
  make_pend(240,"#63e265","GREEN");
  make_pend(280,"#6371e2","BLUE");

  targetColor = target;

  Runner.run(runner, engine);

  // マウスによる操作
  if(isPC){
    setInterval("MoveByMouse()",20);
  }
}


function RestartGame(target){
  HideMenu();

  targetColor = target;
  Body.setVelocity(ball2,{x:0,y:0});
  Body.setPosition(ball2,{x:canvasWidth / 2,y:100});
  balls.forEach((ball,i) => {
    Body.setVelocity(ball,{x:0,y:0});
    Body.setPosition(ball,{x:canvasWidth / 2,y:100 + ballLens[i]});
  });
}

function SetColor(target){
  if ( targetColor == 0 ){
    StartGame(target);
  } else {
    RestartGame(target);
  }
  mX=canvasWidth/2;
}

Render.run(render);
// StartGame(1);

const mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: true
          }
        }
    });

function walk(dx){
  if(!isStop){
    Body.setPosition(ball2,{
      x:ball2.position.x + dx,
      y:ball2.position.y
    })
  }
}

// マウスによる操作
window.onload=function(){
  document.body.addEventListener("mousemove", function(e){
    console.log(1);
    mX = e.pageX;
    mY = e.pageY;
  });
}

function MoveByMouse(){
  if(mX<canvasWidth*0.45){
    walk(-2);
  }else if(mX>canvasWidth*0.55){
    walk(2);
  }
}


window.addEventListener("deviceorientation", function(e){
  if(e.gamma>10){
    walk(2);
  }else if(e.gamma<-10){
    walk(-2);
  }
}, false);



function HideMenu(){
  document.getElementById("menu").classList.toggle("inactive");
  document.getElementById("menu_icon").classList.toggle("inactive");
  RestartObjects();
}

function OpenMenu(){
  document.getElementById("menu").classList.toggle("inactive");
  document.getElementById("menu_icon").classList.toggle("inactive");
  SleepObjects();
}

let v_list = [0,0,0,0,0,0];


function SleepObjects(){
  engine.timing.timeScale = 0;
  balls.forEach((item, i) => {
    v_list[2*i] = item.velocity.x;
    v_list[2*i + 1] = item.velocity.y;
    Body.setVelocity(item,{x:0,y:0});
  });
  isStop=!isStop;
}

function RestartObjects(){
  engine.timing.timeScale = 1;
  balls.forEach((item, i) => {
    Body.setVelocity(item,{x:v_list[2*i],y:v_list[2*i+1]});
  });
  isStop=!isStop;
}

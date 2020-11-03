const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composites = Matter.Composites,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Constraint = Matter.Constraint,
    Body = Matter.Body,
    Bodies = Matter.Bodies;

const engine = Engine.create(),
    world = engine.world;
const runner = Runner.create();
world.gravity.scale = 0.002;

let mX=400,
    mY=0,
    targetColor=0,
    balls = [];

const ballLens = [200,240,280];

// create renderer
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: 800,
        height: 600,
        background: 'rgb(149, 226, 227)',
        wireframes: false,
        showAngleIndicator: true
    }
});

function make_pend(l,color="rgb(44, 76, 164)"){
  var ball = Bodies.circle(400, 100+l, 15, {
    density: 0.04,
    frictionAir: 0,
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

const ball2 = Bodies.circle(400, 140, 10, {
  density: 4*1e5,
  frictionAir: 0,
  render: {
    lineWidth: 1,
    fillStyle: "rgb(38, 34, 38)"
  }
});

const ground0 = Bodies.rectangle(0, 160, 1800, 10, { isStatic: true });
    ground1 = Bodies.rectangle(0, 0, 10,320, { isStatic: true }),
    ground2 = Bodies.rectangle(800, 0, 10,320, { isStatic: true });


function StartGame(target){
  World.add(world, ball2);
  World.add(world, ground0);
  World.add(world, ground1);
  World.add(world, ground2);
  make_pend(200,"rgb(226, 99, 99)");
  make_pend(240,"rgb(99, 226, 101)");
  make_pend(280,"rgb(99, 113, 226)");

  targetColor = target;

  Runner.run(runner, engine);
  setInterval("MoveByMouse()",20);
}

function RestartGame(target){
  console.log(balls);
  targetColor = target;
  Body.setPosition(ball2,{x:400,y:140});
  balls.forEach((ball,i) => {
    Body.setPosition(ball,{x:400,y:100 + ballLens[i]});
    Body.setVelocity(ball,{x:0,y:0});
  });
}

function SetColor(target){
  if ( targetColor == 0 ){
    StartGame(target);
  } else {
    RestartGame(target);
  }
  mX=400;
}

Render.run(render);
// StartGame(1);

const mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false
          }
        }
    });

function walk(dx){
  Body.setPosition(ball2,{
    x:ball2.position.x + dx,
    y:ball2.position.y
  })
}

window.onload=function(){
  document.body.addEventListener("mousemove", function(e){

    mX = e.pageX;
    mY = e.pageY;

    document.getElementById("txtX").value = mX;
    // document.getElementById("txtY").value = mY;
  });
}

window.addEventListener("deviceorientation", function(e){
  console.log(e.gamma);
  document.getElementById("txtY").value = e.gamma;
}, false);

function MoveByMouse(){
  if(mX<350){
    walk(-2);
  }else if(mX>450){
    walk(2);
  }
}

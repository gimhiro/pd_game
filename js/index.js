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

world.gravity.scale = 0.002;

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
  World.add(world, ball);
  World.add(world, Constraint.create({
      bodyA: ball2,
      bodyB: ball
  }));
}

const ball2 = Bodies.circle(400, 100, 10, {
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

World.add(world, ball2);
World.add(world, ground0);
World.add(world, ground1);
World.add(world, ground2);
make_pend(200,"rgb(226, 99, 99)");
make_pend(240,"rgb(99, 226, 101)");
make_pend(280,"rgb(99, 113, 226)");

Render.run(render);

var runner = Runner.create();
Runner.run(runner, engine);

// add mouse control
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false
          }
        }
    });

function push(a){
  Body.applyForce(ball2,ball2.position,{x:a * 1e6,y:0});
  setTimeout(()=>{Body.setVelocity(ball2,{x:0,y:0})},100);
}

function walk(a){
  Body.setPosition(ball2,{x:ball2.position.x+a,y:ball2.position.y})
}

let mX=400,
    mY=0;
window.onload=function(){
  document.body.addEventListener("mousemove", function(e){

    mX = e.pageX;  //X座標
    mY = e.pageY;  //Y座標

    document.getElementById("txtX").value = mX;
    document.getElementById("txtY").value = mY;
  });
}

document.addEventListener('keydown', (event) => {
  const keyName = event.key;

  if(keyName=="l"){
    walk(2);
  }
  if(keyName=="k"){
    walk(-2);
  }

  if (event.ctrlKey) {
      console.log(`keydown:Ctrl + ${keyName}`);
    } else if (event.shiftKey) {
      console.log(`keydown:Shift + ${keyName}`);
    } else {
      console.log(`keydown:${keyName}`);
    }
});

function MoveByMouse(){
  console.log(mX);
  if(mX<350){
    walk(-2);
  }else if(mX>450){
    walk(2);
  }
}

setInterval("MoveByMouse()",20);
